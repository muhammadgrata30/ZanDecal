import assert from 'node:assert/strict';
import {heroQuality,heroPixelRatio} from '../components/experience/perfect-apply/quality.js';
const low=heroQuality({cores:2,memory:2,mobile:true});
assert.equal(low.tier,'low');assert.equal(low.hdri,false);assert.equal(low.shadows,false);assert.equal(low.fps,30);
assert.equal(heroQuality({cores:16,memory:16,saveData:true}).tier,'low');
const phone=heroQuality({cores:8,memory:8,mobile:true});
assert.equal(phone.tier,'medium');assert.equal(phone.shadows,false);assert.equal(phone.lean,true);
const high=heroQuality({cores:12,memory:16});assert.equal(high.shadows,true);assert.equal(high.hdri,true);
for(const quality of [low,phone,high])for(const [w,h] of [[390,1080],[1440,1220],[2560,1660]]){
 const ratio=heroPixelRatio(w,h,3,quality);
 assert(ratio>=.65&&ratio<=quality.maxRatio);
 assert(w*h*ratio*ratio<=Math.max(quality.pixels,w*h*.65*.65)+1);
}
console.log('PASS: low/medium/high quality, data saver, mobile shadows and render-resolution budgets.');
