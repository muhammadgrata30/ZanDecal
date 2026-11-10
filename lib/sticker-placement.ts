import * as T from 'three';
import {DecalGeometry} from 'three/examples/jsm/geometries/DecalGeometry.js';
import type {Panel} from './studio-panels';
import type {Sticker} from '../components/experience/design';

// All geometry in vehicleRig is already baked into vehicle-local coordinates.
// Never use animated parent world matrices to raycast or build a decal.
export function stickerTargets(root:T.Group,paint:Set<T.MeshStandardMaterial>,panel:Panel,surfaceMesh?:string){
 const targets:T.Mesh[]=[];
 root.updateWorldMatrix(true,true);
 const inverseRoot=root.matrixWorld.clone().invert();
 root.traverse(object=>{
  if(!(object instanceof T.Mesh)||object.userData.studioDecal)return;
  const materials=Array.isArray(object.material)?object.material:[object.material];
  const body=materials.some(m=>paint.has(m));
  const roof=panel.id==='roof'&&/roof_gls/i.test(object.name);
  const fender=panel.id==='front-fender'&&materials.some(m=>m.name==='MAT_Details_MAT.873');
  if(surfaceMesh?object.name!==surfaceMesh:!body&&!roof&&!fender)return;
  const nested=object.parent!==root;
  const geometry=nested?object.geometry.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(inverseRoot,object.matrixWorld)):object.geometry;
  const local=new T.Mesh(geometry,object.material);local.name=object.name;local.userData.ownedGeometry=nested;local.updateMatrixWorld(true);targets.push(local);
 });
 return targets;
}
export function panelSurface(targets:T.Mesh[],panel:Panel,sticker:Pick<Sticker,'x'|'y'>={x:50,y:50}){
 const outward=new T.Vector3();outward[panel.axis]=panel.sign;
 const tangent=panel.axis==='x'?new T.Vector3(0,0,-panel.sign):new T.Vector3(panel.axis==='z'?panel.sign:1,0,0);
 const up=panel.axis==='y'?new T.Vector3(0,0,-1):new T.Vector3(0,1,0);
 const aim=new T.Vector3(...panel.point).addScaledVector(tangent,(sticker.x-50)/50*panel.width*.32).addScaledVector(up,(sticker.y-50)/50*panel.height*.32);
 const offsets:[[number,number],...Array<[number,number]>]=[[0,0]];
 for(let ring=1;ring<=4;ring++)for(let i=0;i<12;i++){const a=i*Math.PI/6;offsets.push([Math.cos(a)*panel.radius*ring/4,Math.sin(a)*panel.radius*ring/4]);}
 for(const [u,v] of offsets){
  const origin=aim.clone().addScaledVector(tangent,u).addScaledVector(up,v).addScaledVector(outward,6);
  const hits=new T.Raycaster(origin,outward.clone().negate()).intersectObjects(targets,false);
  const hit=hits.find(h=>h.face&&h.face.normal.dot(outward)>.18);
  if(hit&&hit.face){const normal=hit.face.normal.clone().normalize();const z=normal;const x=tangent.clone().addScaledVector(z,-tangent.dot(z)).normalize();const y=new T.Vector3().crossVectors(z,x).normalize();return {point:hit.point,normal,orientation:new T.Euler().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z)),mesh:hit.object as T.Mesh};}
 }
 return null;
}
export function stickerGeometry(targets:T.Mesh[],panel:Panel,sticker:Sticker){
 const surface=sticker.point&&sticker.normal?customSurface(sticker,panel):panelSurface(targets,panel,sticker);if(!surface)return null;
 const q=new T.Quaternion().setFromEuler(surface.orientation).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),sticker.rotation*Math.PI/180));
 const orientation=new T.Euler().setFromQuaternion(q),scale=sticker.size/100;
 const depth=Math.min(.35,Math.max(.12,panel.width*.35));
 const geometries=targets.map(mesh=>new DecalGeometry(mesh,surface.point,orientation,new T.Vector3(panel.width*scale,panel.height*scale,depth))).filter(g=>{if(g.getAttribute('position').count)return true;g.dispose();return false;});
 return {geometries,surface};
}
function customSurface(s:Sticker,panel:Panel){
 const normal=new T.Vector3(...s.normal!).normalize();
 const up=Math.abs(normal.y)>.85?new T.Vector3(0,0,-1):new T.Vector3(0,1,0);
 const x=new T.Vector3().crossVectors(up,normal).normalize(),y=new T.Vector3().crossVectors(normal,x).normalize();
 const point=new T.Vector3(...s.point!).addScaledVector(x,(s.x-50)/50*panel.width*.32).addScaledVector(y,(s.y-50)/50*panel.height*.32);
 return {point,normal,orientation:new T.Euler().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,normal))};
}
