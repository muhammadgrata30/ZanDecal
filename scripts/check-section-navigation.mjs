import assert from 'node:assert/strict';
import {navigateToSection} from '../lib/section-navigation.ts';
const calls=[],events=[],hashes=[],frames=[];
let absoluteTop=1650,layoutShift=0,curtain=false,headerHeight=76;
globalThis.requestAnimationFrame=fn=>frames.push(fn);
globalThis.window={scrollY:1200,scrollTo:options=>{calls.push(options);window.scrollY=options.top;},dispatchEvent:event=>{events.push(event);return true;}};
const pair={dataset:{curtainActive:'true'},parentElement:null,classList:{contains:()=>false},getBoundingClientRect:()=>({top:absoluteTop-40+layoutShift-window.scrollY})};
const outgoing={classList:{contains:name=>name==='section-curtain-outgoing'},parentElement:pair,getBoundingClientRect:()=>({top:Math.max(pair.getBoundingClientRect().top,-1200)})};
const section={dataset:{},get parentElement(){return curtain?outgoing:null;},getBoundingClientRect:()=>({top:curtain?outgoing.getBoundingClientRect().top+40:absoluteTop+layoutShift-window.scrollY})};
globalThis.document={getElementById:()=>section,documentElement:{classList:{contains:()=>false}},querySelector:()=>({getBoundingClientRect:()=>({height:headerHeight})})};
globalThis.location={href:'http://localhost:3000/',hash:''};
globalThis.history={state:{},pushState:(_state,_title,url)=>hashes.push(url.hash)};
const flush=()=>{while(frames.length)frames.shift()();};
navigateToSection('galeri');frames.shift()();assert.equal(calls.at(-1).top,1562);
layoutShift=24;flush();assert.equal(window.scrollY,1586);assert.equal(section.getBoundingClientRect().top,88);
absoluteTop=700;layoutShift=0;section.dataset.navAlign='viewport';
for(const id of ['3d-studio','material']){
 for(const from of [0,4800]){
  window.scrollY=from;navigateToSection(id);flush();
  assert.equal(window.scrollY,700,`${id} lands on its surface from either direction`);
  assert.equal(section.getBoundingClientRect().top,0,'No previous section remains above the target');
 }
}
// A material panel held by a curtain must be measured at its document origin.
curtain=true;absoluteTop=3540;window.scrollY=9000;
navigateToSection('material');flush();assert.equal(window.scrollY,3540);assert.equal(section.getBoundingClientRect().top,0);
curtain=false;absoluteTop=700;headerHeight=64;navigateToSection('3d-studio');flush();assert.equal(window.scrollY,700,'Mobile header does not add a second inset');
delete section.dataset.navAlign;navigateToSection('galeri');flush();assert.equal(window.scrollY,624,'Other sections retain the responsive header inset');
navigateToSection('beranda');flush();assert.equal(window.scrollY,0);
const count=calls.length;window.dispatchEvent=()=>false;navigateToSection('material');flush();assert.equal(calls.length,count);
assert(events.every(event=>event.type==='zan-scroll-to'&&event.cancelable));
console.log('PASS: viewport-aligned Material/3D Studio in both directions, sticky curtain origin, responsive ordinary anchors, layout correction and Lenis handoff.');
