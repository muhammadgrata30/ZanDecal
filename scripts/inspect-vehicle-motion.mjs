import fs from 'node:fs/promises';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
globalThis.self = globalThis;
globalThis.createImageBitmap = async () => ({ width: 1, height: 1, close() {} });
for (const file of ['2024_ducati_streetfighter_v4_s.glb', 'byd-seal.glb']) {
  const bytes = await fs.readFile(new URL('../public/models/' + file, import.meta.url));
  const {scene} = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
  scene.updateMatrixWorld(true);
  const size = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
  console.log(file, 'size', size.toArray());
  scene.traverse(node => {
    if (/SM_Tire_|SM_Disk_|SM_Fork_|^tyre$|^disk$|^inner_rim$|blk_B_Rim|alpha_rim/i.test(node.name)) {
      const box = new THREE.Box3().setFromObject(node);
      console.log(node.name, 'center', box.getCenter(new THREE.Vector3()).toArray(), 'size', box.getSize(new THREE.Vector3()).toArray());
    }
  });
}
