import * as THREE from 'three';
export const clamp=THREE.MathUtils.clamp,lerp=THREE.MathUtils.lerp;
export function ease(t){t=clamp(t,0,1);return t*t*t*(t*(t*6-15)+10);}
export const INTRO_END=6.6;
export const PASS_INTERVAL=7,PASS_DURATION=5.2;
export function autoPassTime(heroAge){if(heroAge<PASS_INTERVAL)return null;const phase=(heroAge-PASS_INTERVAL)%PASS_INTERVAL;return phase<PASS_DURATION?phase:null;}
export function passCameraPullback(passTime){return passTime===null?1:1+.34*ease(passTime/.65)*(1-ease((passTime-4.1)/1.1));}
export function heroScale(aspect,mobile){return mobile?Math.min(aspect/.65,1)*1.03:1.28*Math.min(aspect/1.6,1);}
export function direction(t,mobile=false,aspect=16/9){
 const open=ease((t-3.25)/3.35),press=ease((t-.75)/.7),sweep=ease((t-1.3)/2.8);
 const framing=mobile?1:Math.min(aspect/1.6,1);
 return {open,press,sweep,toolX:lerp(-3.15,3.1,sweep),cameraZ:lerp(mobile?7.3:4.35,mobile?17.8:12.8,open),cameraX:lerp(-.75,0,open),cameraY:lerp(.48,0,open),x:lerp(0,mobile?0:1.6*framing,open),y:lerp(0,mobile?-1.65:.72*framing,open),rx:lerp(-.1,.075,open),ry:lerp(.12,-.3,open),rz:lerp(-.17,-.085,open),reveal:ease((t-3.55)/2.4)};
}
function rounded(w,h,r){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;}
export function filmPoint(u,v,sweep,out,wrinkleAmount=1,curlLift=1){
 const y=(.5-v)*3.65,corner=clamp((Math.abs(v-.5)-.44)/.06,0,1),half=2.72-.17*(1-Math.sqrt(Math.max(0,1-corner*corner))),x=(u-.5)*half*2;
 const toolX=lerp(-3.15,3.1,sweep),loose=ease((x-toolX+.12)/.58);
 const wave=(Math.sin(u*22+v*3.2)*.15+Math.sin(v*18-u*5)*.07+Math.sin(u*9-v*8)*.07)*loose;
 const ridge=Math.exp(-Math.pow((x-toolX)/.25,2))*.2*(1-sweep);
 const curl=ease((u-.91)/.09)*ease((v-.75)/.25)*.27*curlLift;
 return out.set(x,y,(wave+ridge)*wrinkleAmount+curl);
}
export function createApply(low=false,cinematic=false){
 const root=new THREE.Group(),parts=[],scratch=new THREE.Vector3();
 const filmMaterial=new THREE.MeshStandardMaterial({color:0x398eaf,roughness:.2,metalness:.32,envMapIntensity:1.15,side:THREE.FrontSide});
 const black=new THREE.MeshStandardMaterial({color:0x1b1b26,roughness:.78}),aluminium=new THREE.MeshStandardMaterial({color:0xa4a4b2,metalness:.9,roughness:.27}),housing=new THREE.MeshStandardMaterial({color:0x64597c,metalness:.22,roughness:.35});
 function add(g,m,parent=root){const mesh=new THREE.Mesh(g,m);mesh.frustumCulled=false;parent.add(mesh);parts.push(mesh);return mesh;}
 function solid(w,h,depth,r,m,parent=root){const g=new THREE.ExtrudeGeometry(rounded(w,h,r),{depth,steps:1,bevelEnabled:true,bevelSegments:low?1:3,bevelSize:.025,bevelThickness:.025,curveSegments:low?3:6});const a=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<a.count;i++)uv.setXY(i,a.getX(i)/w+.5,a.getY(i)/h+.5);return add(g,m,parent);}
 const nu=low?32:48,nv=low?22:32,positions=[],uv=[],indices=[];
 for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){const u=i/nu,v=j/nv;filmPoint(u,v,0,scratch,1,cinematic?1.7:1);positions.push(...scratch.toArray());uv.push(u,1-v);if(i<nu&&j<nv){const k=i*(nv+1)+j;indices.push(k,k+1,k+nv+1,k+1,k+nv+2,k+nv+1);}}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3).setUsage(THREE.DynamicDrawUsage));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
 const sheet=add(geometry,filmMaterial);sheet.name='vinyl-surface';
 const printMaterial=new THREE.MeshStandardMaterial({color:0x242129,roughness:.55,metalness:0,transparent:true,opacity:0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,side:THREE.FrontSide});
 const print=add(geometry,printMaterial);print.position.z=.004;print.name='zan-print';
 const reverse=new THREE.MeshStandardMaterial({color:0xddd5e2,roughness:.7,metalness:.12,side:THREE.BackSide});add(geometry,reverse).position.z=-.012;
 const liner=solid(5.48,3.69,.028,.18,new THREE.MeshStandardMaterial({color:0x45374f,roughness:.6,metalness:.18}));liner.position.z=-.36;
 const tool=new THREE.Group();root.add(tool);tool.name='felt-squeegee';
 const body=solid(.92,2.82,.16,.13,housing,tool);body.position.x=.11;
 const inset=solid(.65,2.32,.055,.085,new THREE.MeshStandardMaterial({color:0x40394e,roughness:.45,metalness:.25}),tool);inset.position.set(.16,0,.19);
 const felt=solid(.14,2.87,.09,.045,black,tool);felt.position.set(-.42,0,.01);felt.name='tool-felt';
 const seam=add(new THREE.BoxGeometry(.018,2.7,.018),aluminium,tool);seam.position.set(-.31,0,.18);
 const gripGeometry=new THREE.BoxGeometry(.38,.026,.027),ribs=new THREE.InstancedMesh(gripGeometry,aluminium,5),dummy=new THREE.Object3D();for(let i=0;i<5;i++){dummy.position.set(.17,(i-2)*.18,.27);dummy.updateMatrix();ribs.setMatrixAt(i,dummy.matrix);}tool.add(ribs);
 const screwGeometry=new THREE.CylinderGeometry(.045,.045,.025,low?8:14),screws=new THREE.InstancedMesh(screwGeometry,aluminium,2);for(let i=0;i<2;i++){dummy.position.set(.17,(i===0?-1:1)*1,.26);dummy.rotation.x=Math.PI/2;dummy.updateMatrix();screws.setMatrixAt(i,dummy.matrix);}tool.add(screws);
 const badge=add(new THREE.PlaneGeometry(.4,.19),new THREE.MeshBasicMaterial({color:0xded1ef}),tool);badge.position.set(.16,.73,.258);
 const contact=add(new THREE.PlaneGeometry(.14,2.85),new THREE.MeshBasicMaterial({color:0x140f1b,transparent:true,opacity:.15,depthWrite:false}),tool);contact.position.set(-.47,0,-.028);
 const glint=add(new THREE.PlaneGeometry(.012,2.79),new THREE.MeshBasicMaterial({color:0xe4d6ff,transparent:true,opacity:.2,depthWrite:false}),tool);glint.position.set(-.49,0,.1);
 const shadowGeometry=new THREE.PlaneGeometry(6.8,5.7),shadowMaterial=new THREE.MeshBasicMaterial({color:0x08050d,transparent:true,opacity:.14,depthWrite:false});const shadow=add(shadowGeometry,shadowMaterial);shadow.position.set(.15,-.2,-.6);shadow.name='soft-shadow';
 let lastSweep=-1,lastWrinkles=-1;
 function update(sweep,idle=0,quiet=false,parkOverride,press=1,wrinkleAmount=1){
  if(sweep!==lastSweep||wrinkleAmount!==lastWrinkles){const a=geometry.attributes.position;for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){filmPoint(i/nu,j/nv,sweep,scratch,wrinkleAmount,cinematic?1.7:1);a.setXYZ(i*(nv+1)+j,scratch.x,scratch.y,scratch.z);}a.needsUpdate=true;geometry.computeVertexNormals();lastSweep=sweep;lastWrinkles=wrinkleAmount;}
  const x=lerp(-3.15,3.1,sweep),park=parkOverride??ease((sweep-.97)/.03),pressure=Math.sin(sweep*Math.PI);
  tool.position.set(lerp(x+.41,1.95,park),lerp(.05,-2.02,park),lerp(.08,.36,park)+(1-press)*.65);tool.rotation.set(pressure*.075-(1-press)*.2,lerp(-.13,.04,park),lerp(-.025,-1.06,park));
  if(!quiet){const life=ease(idle/1.4),approach=Math.pow(Math.max(0,Math.sin(idle*Math.PI/7)),4)*life;tool.position.y+=(Math.sin(idle*.75)*.02+approach*.13)*life;tool.position.x-=approach*.08;tool.rotation.y+=Math.sin(idle*.45)*.025*life;tool.rotation.z+=approach*.035;}
  contact.material.opacity=.19*(1-park);glint.material.opacity=.24+Math.sin(idle*.9)*.12;
 }
 update(0);let triangles=0,drawParts=0;root.traverse(o=>{if(o.isMesh){triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);drawParts++;}});
 return {root,sheet,tool,liner,filmMaterial,printMaterial,housing,badge,shadow,shadowMaterial,update,geometry,triangles,drawParts};
}
