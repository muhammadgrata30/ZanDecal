import assert from 'node:assert/strict';
import {acquireIntroScrollLock} from '../components/experience/perfect-apply/intro-scroll-lock.js';
function style(){const values=new Map();return {getPropertyValue:n=>values.get(n)?.[0]||'',getPropertyPriority:n=>values.get(n)?.[1]||'',setProperty:(n,v,p='')=>values.set(n,[v,p]),removeProperty:n=>values.delete(n)};}
const classes=new Set(),listeners=new Map(),events=[],scrolls=[];
const doc={documentElement:{style:style(),classList:{add:n=>classes.add(n),remove:n=>classes.delete(n)}},body:{style:style()},defaultView:{scrollX:0,scrollY:40,Event,scrollTo:options=>scrolls.push(options)},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:(name,fn)=>{if(listeners.get(name)===fn)listeners.delete(name);},dispatchEvent:e=>events.push(e.type)};
doc.body.style.setProperty('position','relative');doc.documentElement.style.setProperty('overflow','clip','important');
const stage={ownerDocument:doc},release=acquireIntroScrollLock(stage),releaseOther=acquireIntroScrollLock(stage);
assert(classes.has('zan-intro-locked'));assert.equal(doc.body.style.getPropertyValue('position'),'fixed');assert.equal(doc.body.style.getPropertyValue('top'),'-40px');
let prevented=0;const event={cancelable:true,preventDefault:()=>prevented++};
listeners.get('wheel')(event);listeners.get('touchmove')({...event,touches:[{}]});listeners.get('keydown')({...event,key:'PageDown'});assert.equal(prevented,3);
listeners.get('wheel')({...event,ctrlKey:true});listeners.get('touchmove')({...event,touches:[{},{}]});listeners.get('keydown')({...event,key:' ',target:{closest:()=>true}});assert.equal(prevented,3);
release();assert(classes.has('zan-intro-locked'));releaseOther();assert(!classes.has('zan-intro-locked'));assert.equal(listeners.size,0);
assert.equal(doc.body.style.getPropertyValue('position'),'relative');assert.equal(doc.documentElement.style.getPropertyValue('overflow'),'clip');assert.equal(doc.documentElement.style.getPropertyPriority('overflow'),'important');assert.equal(scrolls.at(-1).top,40);
releaseOther();assert.equal(scrolls.length,1);assert.deepEqual(events,['zan-intro-lock-change','zan-intro-lock-change']);
console.log('PASS: wheel/touch/keyboard lock, pinch/skip-button allowance, shared ownership, style restoration and idempotent cleanup.');
