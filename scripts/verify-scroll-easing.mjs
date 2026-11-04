import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import ts from "typescript";
const source=await readFile(new URL("../lib/scroll-easing.ts",import.meta.url),"utf8");
const exports={};
new Function("exports",ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(exports);
const {wheelTarget,advanceScroll}=exports;
assert.equal(wheelTarget(100,-1000,0,800,2000),0);
assert.equal(wheelTarget(1980,500,0,800,2000),2000);
assert.ok(wheelTarget(0,100,0,800,2000)<100);
assert.ok(wheelTarget(0,3,1,800,2000)>wheelTarget(0,3,0,800,2000));
function simulate(dt){
  let value=0;
  for(let time=0;time<1-.00001;time+=dt){const next=advanceScroll(value,1000,dt);assert.ok(next>=value&&next<=1000);value=next;}
  return value;
}
assert.ok(Math.abs(simulate(1/60)-simulate(1/30))<.001);
assert.ok(1000-simulate(1/60)<1);
console.log("PASS: scroll bounds, reduced wheel distance, normalized line input, monotonic movement and equal 30/60 Hz timing.");
