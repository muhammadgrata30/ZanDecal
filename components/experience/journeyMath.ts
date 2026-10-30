export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export function phase(value: number, start: number, end: number) {
  const t = clamp01((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}
export function journeyPose(progress: number) {
  const departure = phase(progress, .02, .35);
  const transfer = phase(progress, .35, .53);
  const arrival = phase(progress, .53, .91);
  const shutter = phase(progress, .19, .34) * (1 - phase(progress, .49, .61));
  // Travel along +X, the models' normalized forward axis. Transfer bays only
  // while the garage shutter is closed; the arrival is a separate straight drive.
  const x = progress < .35 ? 1.1 + departure * 14
    : progress < .53 ? 15.1 - transfer * 27.1 : -12 + arrival * 13.1;
  return {
    travel: departure + arrival,
    x, z: 0, yaw: 0,
    distance: departure * 14 + arrival * 13.1,
    studio: phase(progress, .4, .88),
    room: phase(progress, .4, .49),
    shutter,
    heroOpacity: 1 - phase(progress, .08, .27),
  };
}

/** Ordinary wheel scrolling navigates the page; trackpad pinch emits ctrl+wheel. */
export function pinchScale(deltaY: number) {
  return Math.exp(Math.max(-100, Math.min(100, deltaY)) * .008);
}

/** A dedicated pinned studio entrance, after the image-based homepage hero. */
export function studioEntrancePose(progress: number) {
  const p = clamp01(progress);
  const arrival = phase(p, .3, .83);
  return {
    x: -12 + arrival * 13.1,
    distance: arrival * 13.1,
    shutter: phase(p, 0, .16) * (1 - phase(p, .23, .48)),
    controls: phase(p, .76, .94),
    journey: .53 + arrival * .47,
  };
}

export function heroStudioSequencePose(progress:number){
  return {door:phase(progress,.16,.32)*(1-phase(progress,.42,.62)),
    studioVisible:progress>=.37,studioProgress:phase(progress,.30,.89)};
}
