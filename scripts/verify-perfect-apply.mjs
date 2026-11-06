import assert from 'node:assert/strict';
import fs from 'node:fs';
import postcss from 'postcss';
import * as THREE from 'three';
import {mountPerfectApply} from '../components/experience/perfect-apply/runtime.js';
import {createApply,direction,heroScale,ease,INTRO_END,PASS_INTERVAL,autoPassTime,passCameraPullback} from '../components/experience/perfect-apply/model.js';
import {THEMES,THEME_KEY,persistTheme,readTheme,pixelRatio} from '../components/experience/perfect-apply/theme.js';

assert.equal(typeof mountPerfectApply,'function','Native renderer can be imported without browser globals');
const main=fs.readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
assert(main.includes('<PerfectApplyHero typography="11"/>')&&main.includes('apply-home'));
assert(!main.includes('<HeroStudioSequence'));
const component=fs.readFileSync(new URL('../components/experience/PerfectApplyHero.tsx',import.meta.url),'utf8');
assert(!component.includes('<iframe'));
const navbar=fs.readFileSync(new URL('../components/RacingNavbar.tsx',import.meta.url),'utf8');
assert(component.includes('useTheme()')&&navbar.includes('setTheme("dark")'));
assert(component.includes('href="#konsultasi"')&&component.includes('mounted?.dispose()'));
const css=postcss.parse(fs.readFileSync(new URL('../components/experience/perfect-apply/perfect-apply.css',import.meta.url),'utf8'));
let checkedSelectors=0,boldHeadline=false;
css.walkRules(rule=>{
 if(rule.parent.type==='atrule'&&/keyframes$/.test(rule.parent.name))return;
 for(const selector of rule.selectors){assert(/^(\.perfect-apply|\.apply-home|html\.dark \.(perfect-apply|apply-home))/.test(selector),`Unscoped hero selector: ${selector}`);checkedSelectors++;}
 if(rule.selector==='.perfect-apply h1'&&rule.nodes.some(n=>n.prop==='font-weight'&&n.value==='800'))boldHeadline=true;
});
assert(boldHeadline,'The native headline uses weight 800');
const cutCss=postcss.parse(fs.readFileSync(new URL('../components/experience/perfect-apply/cut-frequency.css',import.meta.url),'utf8'));
assert(cutCss.nodes.some(rule=>rule.type==='rule'&&rule.selector.includes(':not(.settled) .hero-type')&&rule.nodes.some(n=>n.prop==='visibility'&&n.value==='hidden')),'Cut headline stays hidden until intro completes, including replay');
const runtime=fs.readFileSync(new URL('../components/experience/perfect-apply/runtime.js',import.meta.url),'utf8');
assert(!runtime.includes("document.querySelector")&&!runtime.includes('localStorage'),'Mounted renderer is scoped and uses shared app theme');
assert(runtime.includes('abort.abort()')&&runtime.includes('environmentTarget?.dispose()')&&runtime.includes('renderer?.forceContextLoss()'));
assert(runtime.includes('IntersectionObserver')&&runtime.includes('!visible'));
assert.equal([...runtime.matchAll(/\.addEventListener\(/g)].length,1,'Only the abortable registration helper directly attaches events');
assert(!runtime.includes('prototypes/'));
assert.equal(THEMES.dark.film,0x8fd3f4);assert(new THREE.Color(THEMES.light.film).getHSL({}).h>.45);
assert(runtime.includes("logo.src='/brand/zan-wordmark-v3.png'")&&runtime.includes('ctx.drawImage(logo'));
const stored=new Map(),storage={getItem:key=>stored.get(key)??null,setItem:(key,value)=>stored.set(key,value)};
assert.equal(readTheme(storage),'light');persistTheme(storage,'dark');assert.equal(stored.get(THEME_KEY),'dark');assert.equal(readTheme(storage),'dark');
assert.equal(PASS_INTERVAL,7);for(let cycle=1;cycle<=12;cycle++){assert.equal(autoPassTime(cycle*7),0);assert.equal(autoPassTime(cycle*7+5.3),null);}
const geometry=[];
// The taller canvas must still cover the first viewport during the full-screen intro.
const introModel=createApply(true),introRig=new THREE.Group();introRig.add(introModel.root);
for(const [width,viewportHeight,height] of [[360,760,1080],[390,844,1084],[768,1024,1264],[1024,760,1000],[1440,900,1120],[1920,1080,1300]]){
 const mobile=width<1000,p=direction(0,mobile,width/height),camera=new THREE.PerspectiveCamera(34,width/height,.1,80);
 camera.setViewOffset(width,viewportHeight,0,0,width,height);camera.position.set(p.cameraX,p.cameraY,p.cameraZ);camera.lookAt(0,0,0);camera.updateMatrixWorld();
 const frustum=2*Math.tan(THREE.MathUtils.degToRad(17))*(mobile?7.3:4.35);
 introRig.scale.setScalar(Math.max(frustum*(width/viewportHeight)/5,frustum/3.25)*1.2);introRig.rotation.set(p.rx,p.ry,p.rz);introRig.updateMatrixWorld(true);
 const bounds=new THREE.Box2(),point=new THREE.Vector3(),vertices=introModel.sheet.geometry.attributes.position;
 for(let i=0;i<vertices.count;i++){point.fromBufferAttribute(vertices,i).applyMatrix4(introModel.sheet.matrixWorld).project(camera);bounds.expandByPoint(new THREE.Vector2(point.x,point.y));}
 assert(bounds.min.x<-1&&bounds.max.x>1&&bounds.max.y>1&&bounds.min.y<1-2*viewportHeight/height,`Full-screen intro coverage at ${width}px`);
 const before=direction(INTRO_END-.001,mobile,width/height),after=direction(INTRO_END,mobile,width/height);
 assert(Math.abs(before.x-after.x)+Math.abs(before.y-after.y)+Math.abs(before.cameraZ-after.cameraZ)<.001,'The intro approaches its final hero position continuously');
}
for(const low of [true,false]){
 const model=createApply(low),rig=new THREE.Group();rig.add(model.root);assert(model.filmMaterial.isMeshStandardMaterial&&!model.filmMaterial.isMeshPhysicalMaterial);assert(model.geometry.attributes.position.count<1700);
 for(let i=0;i<=400;i++){const t=i/60,p=direction(t);model.update(p.sweep,0,true,ease((t-4.15)/1.25),p.press);assert(model.geometry.attributes.position.array.every(Number.isFinite));}
 model.update(1,0,true,1);const widths=[];
 for(const [width,height] of [[360,1080],[390,1084],[768,1264],[1024,1000],[1440,1120],[1920,1300]]){
  const mobile=width<1000,p=direction(INTRO_END,mobile,width/height),camera=new THREE.PerspectiveCamera(34,width/height,.1,80);camera.position.set(p.cameraX,p.cameraY,p.cameraZ);camera.lookAt(0,0,0);camera.updateMatrixWorld();rig.position.set(p.x,p.y,0);rig.rotation.set(p.rx,p.ry,p.rz);rig.scale.setScalar(heroScale(camera.aspect,mobile));rig.updateMatrixWorld(true);
  const bounds=new THREE.Box2(),point=new THREE.Vector3();model.root.traverse(o=>{if(!o.isMesh||o.name==='soft-shadow')return;const vertices=o.geometry.attributes.position;for(let i=0;i<vertices.count;i++){point.fromBufferAttribute(vertices,i).applyMatrix4(o.matrixWorld).project(camera);bounds.expandByPoint(new THREE.Vector2(point.x,point.y));}});
  assert(bounds.min.x>-1&&bounds.max.x<1&&bounds.min.y>-1&&bounds.max.y<1,`Complete decal and squeegee must stay inside extended hero: ${width}`);
  const origin=model.tool.position.clone(),rotation=model.tool.quaternion.clone();
  for(let step=0;step<=52;step++){
   const time=step/10;
   model.update(ease((time-.85)/3),0,true,ease((time-3.95)/1.05),ease((time-.35)/.5),ease(time/.6));
   const blend=ease(time/.8),destination=model.tool.position.clone(),destinationRotation=model.tool.quaternion.clone();
   model.tool.position.copy(origin).lerp(destination,blend);model.tool.position.z+=Math.sin(blend*Math.PI)*.8;model.tool.quaternion.copy(rotation).slerp(destinationRotation,blend);
   camera.position.z=p.cameraZ*passCameraPullback(time);camera.lookAt(0,0,0);camera.updateMatrixWorld();rig.updateMatrixWorld(true);
   model.tool.traverse(o=>{if(!o.isMesh)return;const vertices=o.geometry.attributes.position;for(let i=0;i<vertices.count;i++){point.fromBufferAttribute(vertices,i).applyMatrix4(o.matrixWorld).project(camera);assert(Math.abs(point.x)<1&&Math.abs(point.y)<1,`Squeegee crop during pass at ${width}px / ${time}s`);}});
  }
  model.update(1,0,true,1);widths.push(width);
 }
 geometry.push({quality:low?'lean':'coated',triangles:model.triangles,widths});
}
assert.equal(pixelRatio(390,844,3),1.5);
console.log(JSON.stringify({nativeHero:true,headlineWeight:800,scopedSelectors:checkedSelectors,automaticPass:'7 seconds / 12 cycles',sharedTheme:'light/dark + persistence',resourceCleanup:'abort, observers, textures, renderer',geometry,visualVerification:'No connected browser; screenshot and device FPS unavailable.'},null,2));
