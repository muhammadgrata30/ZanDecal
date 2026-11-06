export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export function motionEase(value: number) { const t = clamp01(value); return t * t * (3 - 2 * t); }
export function materialRollShape(progress: number, fullRoll = false) {
  const p = clamp01(progress);
  return fullRoll
    ? { open: .035 + p * .965, wave: Math.sin(p * Math.PI) * .5 + p * .08 }
    : { open: .5 + p * .5, wave: .12 + Math.sin(p * Math.PI) * .8 };
}
// A reversible large movement with a readable hold at either end.
export function materialPhase(time: number) {
  const cycle = ((time % 18) + 18) % 18;
  return cycle < 9 ? motionEase((cycle - 1) / 7) : 1 - motionEase((cycle - 10) / 7);
}
export function materialTimeAtProgress(progress: number) {
  const target = clamp01(progress);
  let low = 0, high = 1;
  for (let i = 0; i < 24; i++) {
    const middle = (low + high) / 2;
    if (motionEase(middle) < target) low = middle; else high = middle;
  }
  return 1 + (low + high) / 2 * 7;
}
// A continuous strip, flat on the left and coiled around a cylinder on the right.
export function vinylPoint(u: number, v: number, open: number, wave: number, time: number) {
  const length = 8, radius = .72, flat = clamp01(open) * length;
  const distance = u * length, arc = Math.max(0, distance - flat) / radius;
  const coilRadius = radius + arc * .012;
  return [
    Math.min(distance, flat) - flat / 2 + Math.sin(arc) * coilRadius,
    // PlaneGeometry indexes rows from top to bottom. Preserve its front-facing winding.
    (.5 - v) * 3.8,
    radius - Math.cos(arc) * coilRadius + Math.sin(u * 5 + time) * Math.sin(v * Math.PI) * wave,
  ] as const;
}

// Write into existing GPU buffers: no per-vertex arrays or triangle-normal rebuild.
export function updateVinylBuffers(positions: Float32Array, normals: Float32Array, columns: number, rows: number, open: number, wave: number, time: number) {
  const length = 8, radius = .72, flat = clamp01(open) * length;
  for (let column = 0; column <= columns; column++) {
    const u = column / columns, distance = u * length;
    const arc = Math.max(0, distance - flat) / radius, coil = radius + arc * .012;
    const sinArc = Math.sin(arc), cosArc = Math.cos(arc);
    const sinWave = Math.sin(u * 5 + time), cosWave = Math.cos(u * 5 + time);
    const dx = distance > flat ? (cosArc * coil + sinArc * .012) * length / radius : length;
    const dz = distance > flat ? (sinArc * coil - cosArc * .012) * length / radius : 0;
    const x = Math.min(distance, flat) - flat / 2 + sinArc * coil;
    for (let row = 0; row <= rows; row++) {
      const v = row / rows, offset = (row * (columns + 1) + column) * 3;
      const sinV = Math.sin(v * Math.PI);
      positions[offset] = x;
      positions[offset + 1] = (.5 - v) * 3.8;
      positions[offset + 2] = radius - cosArc * coil + sinWave * sinV * wave;
      const duZ = dz + cosWave * 5 * sinV * wave;
      const dvZ = sinWave * Math.PI * Math.cos(v * Math.PI) * wave;
      const nx = -3.8 * duZ, ny = dx * dvZ, nz = 3.8 * dx;
      const inverseLength = 1 / Math.max(.000001, Math.hypot(nx, ny, nz));
      normals[offset] = nx * inverseLength;
      normals[offset + 1] = ny * inverseLength;
      normals[offset + 2] = nz * inverseLength;
    }
  }
}

// An illustrative hood panel: a tapered perimeter, a shallow crown and a center crease.
// Morph the existing film buffers in place; no vehicle model or second Canvas is needed.
export function applyHoodWrap(positions: Float32Array, normals: Float32Array, columns: number, rows: number, progress: number, clearance = .035) {
  const amount = motionEase(progress);
  for (let row = 0; row <= rows; row++) {
    const v = row / rows, width = 6.4 * (.82 + .18 * v);
    for (let col = 0; col <= columns; col++) {
      const u = col / columns, center = 2 * u - 1, offset = (row * (columns + 1) + col) * 3;
      const x = (u - .5) * width, y = (.5 - v) * 3.8;
      const z = .38 * (1 - center * center) + .18 * Math.sin(v * Math.PI) + clearance;
      positions[offset] += (x - positions[offset]) * amount;
      positions[offset + 1] += (y - positions[offset + 1]) * amount;
      positions[offset + 2] += (z - positions[offset + 2]) * amount;
      const duZ = -1.52 * center, dvZ = .18 * Math.PI * Math.cos(v * Math.PI), dvX = (u - .5) * 1.152;
      const nx = -3.8 * duZ, ny = width * dvZ - dvX * duZ, nz = 3.8 * width;
      const inverse = 1 / Math.hypot(nx, ny, nz);
      let ax = normals[offset] + (nx * inverse - normals[offset]) * amount;
      let ay = normals[offset + 1] + (ny * inverse - normals[offset + 1]) * amount;
      let az = normals[offset + 2] + (nz * inverse - normals[offset + 2]) * amount;
      const normalize = 1 / Math.max(.000001, Math.hypot(ax, ay, az));
      ax *= normalize; ay *= normalize; az *= normalize;
      normals[offset] = ax; normals[offset + 1] = ay; normals[offset + 2] = az;
    }
  }
}
