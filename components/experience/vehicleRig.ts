import * as THREE from "three";
import { isVehiclePaint, type StudioVehicle } from "../vehiclePaint";

export interface WheelRig { pivot: THREE.Group; radius: number; front: boolean }

/** Split combined car wheel meshes into four independent wheel assemblies. */
function splitWheels(geometry: THREE.BufferGeometry) {
  const buckets = new Map<string, number[]>();
  const position = geometry.getAttribute("position");
  const index = geometry.index;
  const count = index?.count ?? position.count;
  for (let offset = 0; offset < count; offset += 3) {
    const ids = [0, 1, 2].map(corner => index ? index.getX(offset + corner) : offset + corner);
    const x = ids.reduce((sum, id) => sum + position.getX(id), 0);
    const z = ids.reduce((sum, id) => sum + position.getZ(id), 0);
    const key = `${x >= 0 ? "f" : "r"}${z >= 0 ? "l" : "r"}`;
    const bucket = buckets.get(key) ?? [];
    bucket.push(...ids);
    buckets.set(key, bucket);
  }
  return [...buckets].map(([key, ids]) => {
    const part = new THREE.BufferGeometry();
    for (const [name, attribute] of Object.entries(geometry.attributes)) {
      const data = new Float32Array(ids.length * attribute.itemSize);
      ids.forEach((id, i) => {
        for (let c = 0; c < attribute.itemSize; c++) data[i * attribute.itemSize + c] = attribute.getComponent(id, c);
      });
      part.setAttribute(name, new THREE.BufferAttribute(data, attribute.itemSize));
    }
    part.computeBoundingBox();
    part.computeBoundingSphere();
    return { key, geometry: part };
  });
}

export function buildVehicleRig(source: THREE.Object3D, vehicle: StudioVehicle, neutralPaint: THREE.Texture) {
  source.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(source);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = 4.3 / Math.max(size.x, size.z);
  const normalize = new THREE.Matrix4().makeRotationY(vehicle === "car" ? Math.PI / 2 : 0)
    .multiply(new THREE.Matrix4().makeScale(scale, scale, scale))
    .multiply(new THREE.Matrix4().makeTranslation(-center.x, -bounds.min.y, -center.z));
  const root = new THREE.Group();
  const materials = new Map<THREE.Material, THREE.Material>();
  const textures = new Map<THREE.Texture, THREE.Texture>();
  const paint = new Set<THREE.MeshStandardMaterial>();
  const geometries: THREE.BufferGeometry[] = [];
  const buckets = new Map<string, { meshes: THREE.Mesh[]; tireBounds: THREE.Box3 }>();
  const materialCopy = (original: THREE.Material, meshName: string) => {
    let copy = materials.get(original);
    if (copy) return copy;
    copy = original.clone();
    materials.set(original, copy);
    if (isVehiclePaint(vehicle, meshName, original.name) && copy instanceof THREE.MeshStandardMaterial) {
      paint.add(copy);
      if (vehicle === "ducati" && copy.map) {
        let map = textures.get(copy.map);
        if (!map) {
          const originalMap = copy.map;
          map = originalMap.clone();
          map.source = new THREE.TextureSource(neutralPaint.image);
          map.needsUpdate = true;
          textures.set(originalMap, map);
        }
        copy.map = map;
      }
    }
    return copy;
  };
  source.traverse(node => {
    if (!(node instanceof THREE.Mesh)) return;
    const geometry = node.geometry.clone();
    geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(normalize, node.matrixWorld));
    const material = Array.isArray(node.material) ? node.material.map(mat => materialCopy(mat, node.name)) : materialCopy(node.material, node.name);
    let ancestor = node.parent;
    let wheelName = node.name;
    while (ancestor && ancestor !== source) { wheelName += ` ${ancestor.name}`; ancestor = ancestor.parent; }
    const rolling = vehicle === "car"
      ? /rim|tyre|tire|\bdisk\b/i.test(wheelName) && !/caliper/i.test(wheelName)
      : /SM_(Tire|Disk)_[FR]_/i.test(wheelName);
    if (!rolling) { geometries.push(geometry); root.add(new THREE.Mesh(geometry, material)); return; }
    const parts = vehicle === "car" ? splitWheels(geometry) : [{ key: /SM_(Tire|Disk)_F_/i.test(wheelName) ? "f" : "r", geometry }];
    if (vehicle === "car") geometry.dispose();
    for (const part of parts) {
      geometries.push(part.geometry);
      const mesh = new THREE.Mesh(part.geometry, material);
      const bucket = buckets.get(part.key) ?? { meshes: [], tireBounds: new THREE.Box3() };
      bucket.meshes.push(mesh);
      if (/tyre|tire/i.test(wheelName)) bucket.tireBounds.union(new THREE.Box3().setFromBufferAttribute(part.geometry.getAttribute("position") as THREE.BufferAttribute));
      buckets.set(part.key, bucket);
    }
  });
  const wheels: WheelRig[] = [];
  for (const [key, bucket] of buckets) {
    const pivot = new THREE.Group();
    if (bucket.tireBounds.isEmpty()) bucket.meshes.forEach(mesh => bucket.tireBounds.union(new THREE.Box3().setFromObject(mesh)));
    const point = bucket.tireBounds.getCenter(new THREE.Vector3());
    const dimensions = bucket.tireBounds.getSize(new THREE.Vector3());
    pivot.position.copy(point);
    bucket.meshes.forEach(mesh => { mesh.geometry.translate(-point.x, -point.y, -point.z); pivot.add(mesh); });
    root.add(pivot);
    wheels.push({ pivot, radius: dimensions.y / 2, front: key.startsWith("f") });
  }
  return {
    root, wheels, paint, size: size.multiplyScalar(scale),
    dispose() { geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); textures.forEach(item => item.dispose()); },
  };
}
