import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile(new URL('../lib/studio-input.ts',import.meta.url),'utf8');
const exports={};
new Function('exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exports);
const element=new EventTarget();element.style={touchAction:'none'};
const controls={enabled:true,enableZoom:true};
const cleanup=exports.bindStudioWheel(element,controls);
let cameraZooms=0,pageScrolls=0;
// Mirror the installed OrbitControls -> Lenis listener sequence.
element.addEventListener('wheel',event=>{if(controls.enabled&&controls.enableZoom){cameraZooms++;event.preventDefault();}});
element.addEventListener('wheel',event=>{if(!event.ctrlKey&&!event.lenisStopPropagation){pageScrolls++;event.preventDefault();}});
async function wheel(deltaY,modifiers={}){
 const event=new Event('wheel',{cancelable:true,bubbles:true});
 Object.assign(event,{deltaY,ctrlKey:false,metaKey:false,...modifiers});
 element.dispatchEvent(event);await new Promise(resolve=>setTimeout(resolve,0));
 assert.equal(controls.enableZoom,true,'Pinch support restored after dispatch');
 return event;
}
assert.equal(element.style.touchAction,'pan-y');
for(const delta of [120,120,-120,-120,120,-120])await wheel(delta);
assert.equal(pageScrolls,6,'All ordinary wheel events reach the page in both directions');
assert.equal(cameraZooms,0,'Ordinary scrolling never zooms the vehicle');
await wheel(-100,{ctrlKey:true});await wheel(100,{metaKey:true});
assert.equal(cameraZooms,2);assert.equal(pageScrolls,6,'Zoom gestures do not move the page');
controls.enabled=false;
await wheel(120);
assert.equal(pageScrolls,7,'Page scrolling remains available with inactive 3D controls');
cleanup();assert.equal(element.style.touchAction,'none');assert.equal(controls.enableZoom,true);
console.log('PASS: bidirectional page wheels, isolated Ctrl/Meta zoom, restored pinch, inactive controls and cleanup.');
