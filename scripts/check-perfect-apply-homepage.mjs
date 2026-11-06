import assert from 'node:assert/strict';

const origin=process.env.PERFECT_APPLY_ORIGIN||'http://127.0.0.1:3000';
const response=await fetch(origin+'/',{signal:AbortSignal.timeout(45000)});
const html=await response.text();
assert.equal(response.status,200);
for(const value of ['class="perfect-apply"','CUT TO STAND OUT.','data-typography="11"','id="material"','id="konsultasi"','aria-label="Tema gelap"'])assert(html.includes(value),`Missing homepage content: ${value}`);
assert(!html.includes('split-image-hero'),'Previous hero is absent on the homepage');
const styles=[...html.matchAll(/<link[^>]+href="([^"]+\.css[^\"]*)"[^>]*>/g)].map(match=>match[1].replaceAll('&amp;','&'));
const results=await Promise.all(styles.map(async resource=>{const result=await fetch(new URL(resource,origin));assert.equal(result.status,200);return result.text();}));
const css=results.join('\n');
assert(css.includes('.perfect-apply')&&/font-weight:\s*800/.test(css),'Integrated hero and bold headline CSS are served');
assert(css.includes('zan-cut-lustre')&&css.includes('zan-slice-top'),'Selected cinematic headline animation is served');
assert(css.includes('.motor-workspace')&&/\.motor-canvas\s*\{[^}]*height:\s*560px/.test(css),'Interactive Studio stylesheet and nonzero canvas height are served');
console.log(JSON.stringify({route:'/',status:response.status,nativeHero:true,oldHeroRemoved:true,sections:'interactive studio + material + consultation',studioStyles:'loaded; canvas height 560px',themeControls:true,headlineWeight:800,stylesheets:styles.length,visualQA:'No connected browser; appearance and actual device FPS unverified.'},null,2));
