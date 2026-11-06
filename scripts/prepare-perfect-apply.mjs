import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

const workspace=path.resolve(import.meta.dirname,'..');
const source=path.join(workspace,'prototypes/intro-lab/dist');
const target=path.join(workspace,'components/experience/perfect-apply');
fs.mkdirSync(target,{recursive:true});
for(const [from,to] of [['apply-model.js','model.js'],['apply-theme.js','theme.js']])fs.copyFileSync(path.join(source,from),path.join(target,to));

const sheet=postcss.parse(fs.readFileSync(path.join(source,'apply-clean.css'),'utf8'));
sheet.walkAtRules('font-face',rule=>rule.remove());
sheet.walkRules(rule=>{
 if(rule.parent.type==='atrule'&&/keyframes$/.test(rule.parent.name))return;
 rule.selectors=rule.selectors.map(selector=>{
  if(selector===':root')return '.perfect-apply';
  if(selector.startsWith(':root[data-theme=dark]'))return '.perfect-apply[data-theme=dark]';
  if(selector.startsWith('.apply-stage'))return selector.replace('.apply-stage','.perfect-apply');
  if(/\.(started|opening|type-visible|settled|paused|resetting)/.test(selector))return selector.replace(/^\.(started|opening|type-visible|settled|paused|resetting)/,'.perfect-apply.$1');
  if(selector==='html'||selector==='body')return '.perfect-apply';
  return `.perfect-apply ${selector}`;
 });
});
sheet.walkDecls(declaration=>{
 declaration.value=declaration.value.replace(/\bGeistMono\b/g,'var(--font-geist-mono)').replace(/\bGeist\b/g,'var(--font-geist-sans)').replace(/\bInstrument\b/g,'var(--font-editorial)').replace(/\bletter-wave\b/g,'apply-letter-wave').replace(/\bletter-rest\b/g,'apply-letter-rest');
});
sheet.walkAtRules('keyframes',rule=>{rule.params=rule.params.replace('letter-wave','apply-letter-wave').replace('letter-rest','apply-letter-rest');});
fs.writeFileSync(path.join(target,'perfect-apply.css'),sheet.toString()+`
/* Main-page integration: the site navigation supplies the wordmark. */
.perfect-apply{font-family:var(--font-geist-sans),Arial,sans-serif;scroll-margin-top:0!important}
html.dark .perfect-apply{color-scheme:dark;--bg:#17141d;--ink:#f0eaf4;--muted:#a296ae;--accent:#c4afd5;--line:#d2bddf1e;--panel:#251e2d;--button:#d6c4e3;--button-ink:#302639;--wash:#3e3048;--intro:#ecdcf32b;--cinema:#100d16}
.perfect-apply .apply-header{top:99px;justify-content:flex-end}
.perfect-apply .intro-kicker{top:164px}
.perfect-apply .hero-type{top:34%;width:32%;max-width:450px}
.perfect-apply h1{font-family:var(--font-geist-sans),Arial,sans-serif;font-weight:800;font-size:clamp(36px,3.3vw,54px);line-height:1.04;letter-spacing:-.065em}
.perfect-apply .line-two{font-family:var(--font-geist-sans),Arial,sans-serif;font-weight:800;font-style:normal;font-size:1.04em;line-height:1.04;letter-spacing:-.065em}
.perfect-apply .hero-cta{display:inline-flex;text-decoration:none;min-height:44px;font-weight:600}
.perfect-apply .hero-support p{font-size:12px}
.perfect-apply .apply-footer a{display:inline-flex;align-items:center;min-height:32px;padding:8px 0;font-size:8px;color:var(--muted)}
.perfect-apply.offscreen *{animation-play-state:paused!important}
.apply-home>.atelier-nav{mix-blend-mode:normal;background:#f5f3efed;color:#302e32;border-bottom:1px solid #42344814}
html.dark .apply-home>.atelier-nav{background:#17141ded;color:#f0eaf4;border-color:#d2bddf16}
.apply-home>.atelier-nav .atelier-wordmark{font-weight:500;letter-spacing:-.05em}
.apply-home>.atelier-nav .atelier-wordmark strong{font-weight:850}
.apply-home>.atelier-nav .atelier-nav-links{font-size:11px;letter-spacing:.025em}
.perfect-apply #fallback a{text-decoration:underline;text-underline-offset:4px}
@media(max-width:999px){.perfect-apply .apply-header{top:89px}.perfect-apply .intro-kicker{top:145px}.perfect-apply .hero-type{top:24%;width:86%;max-width:350px}.perfect-apply h1{font-size:clamp(30px,7.6vw,39px);line-height:1.08;font-weight:800}.perfect-apply .line-two{font-size:1.04em;line-height:1.08;font-weight:800}.perfect-apply .hero-support p{font-size:10px}.perfect-apply .hero-cta{font-size:10px}}
`);

let runtime=fs.readFileSync(path.join(source,'apply.js'),'utf8');
runtime=runtime.replace("'./vendor/environments/RoomEnvironment.js'","'three/examples/jsm/environments/RoomEnvironment.js'").replace("'./apply-model.js'","'./model.js'").replace("'./apply-theme.js'","'./theme.js'");
runtime=runtime.replace('THEME_KEY,THEMES,normalizeTheme,persistTheme,pixelRatio','THEMES,normalizeTheme,pixelRatio');
runtime=runtime.replace(/const stage=document[\s\S]*?const motionQuery=/,`export function mountPerfectApply(stage,initialTheme='light') {
const canvas=stage.querySelector('#apply-canvas'),body=stage;
const abort=new AbortController();let disposed=false,visible=true;
function listen(target,event,callback,options={}){target.addEventListener(event,callback,{...options,signal:abort.signal});}
const fonts=getComputedStyle(stage);
const fontFamily=fonts.getPropertyValue('--font-geist-sans').trim()||'Arial';
const monoFamily=fonts.getPropertyValue('--font-geist-mono').trim()||'monospace';
let environmentTarget=null,resizeObserver=null,visibilityObserver=null;
const motionQuery=`);
runtime=runtime.replace(/document\.querySelectorAll\('\.title-word'\)[\s\S]*?\}\);\n/,'');
runtime=runtime.replace(/const panel=[\s\S]*?let renderer/,'let renderer');
runtime=runtime.replace('normalizeTheme(document.documentElement.dataset.theme)','normalizeTheme(initialTheme)');
runtime=runtime.replace("function schedule(){if(ready&&renderer&&!raf&&!document.hidden)","function schedule(){if(!disposed&&visible&&ready&&renderer&&!raf&&!document.hidden)");
runtime=runtime.replace('theme=normalizeTheme(value);document.documentElement.dataset.theme=theme;','theme=normalizeTheme(value);stage.dataset.theme=theme;');
runtime=runtime.replace(/ document\.querySelector\('meta\[name="theme-color"\]'\)\.content=THEMES\[theme\]\.background;\n/,'');
runtime=runtime.replace(/ if\(save\)\{try\{persistTheme[\s\S]*?\}\}\n/,'');
runtime=runtime.replace(/document\.querySelectorAll\('\[data-theme-choice\]'\)\.forEach\(button=>button\.addEventListener[\s\S]*?applyTheme\(theme,false\);/,"applyTheme(theme,false);");
runtime=runtime.replace(/document\.querySelector\('#make-yours'\)\.addEventListener[^\n]*\n/,'');
runtime=runtime.replaceAll('document.querySelectorAll','stage.querySelectorAll').replaceAll('document.querySelector','stage.querySelector');
runtime=runtime.replace('function texture(width,height,draw){','function texture(width,height,draw){');
runtime=runtime.replace('const printScale=2;','const printScale=2;');
runtime=runtime.replaceAll("ctx.font='650 252px Geist, Arial'",'ctx.font=`800 252px ${fontFamily}, Arial`').replaceAll("ctx.font='650 49px Geist, Arial'",'ctx.font=`800 49px ${fontFamily}, Arial`');
runtime=runtime.replace("try{\n renderer=new THREE.WebGLRenderer", "async function initialize(){try{\n renderer=new THREE.WebGLRenderer");
runtime=runtime.replace("scene.environment=pmrem.fromScene(room,.012,.1,100,{size:low?128:256}).texture;","environmentTarget=pmrem.fromScene(room,.012,.1,100,{size:low?128:256});scene.environment=environmentTarget.texture;");
runtime=runtime.replace("resize();addEventListener('resize',resize);","resize();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);");
runtime=runtime.replace(/await Promise\.all\(\[document\.fonts\.load[\s\S]*?\]\)\.catch\(\(\)=>\{\}\);decorate\(\);/,"await Promise.all([document.fonts.load(`800 18px ${fontFamily}`),document.fonts.load(`400 12px ${monoFamily}`)]).catch(()=>{});if(disposed)return;decorate();");
runtime=runtime.replace(/renderer\.compile\(scene,camera\);stage\.querySelector\('#render-info'\)\.textContent=[^\n]*;/,'renderer.compile(scene,camera);');
runtime=runtime.replace(/ document\.addEventListener\('visibilitychange',[^\n]*\n/,'');
runtime=runtime.replace("}catch(error){console.error(error);renderer=null;fallback();}","}catch(error){if(!disposed){console.error('Perfect Apply:',error);fallback();}}}");
runtime=runtime.replace('if(!renderer||document.hidden)return;','if(disposed||!visible||!renderer||document.hidden)return;');
// Every registered event belongs to this mounted hero and is removed together.
runtime=runtime.replace(/([\w.]+)\.addEventListener\(/g,'listen($1,');
runtime=runtime.replace(/stage\.querySelector\(([^)]+)\)\.addEventListener\(/g,'listen(stage.querySelector($1),');
// Do not rewrite the actual registration helper itself.
runtime=runtime.replace('function listen(target,event,callback,options={}){listen(target,event,callback,{...options,signal:abort.signal});}','function listen(target,event,callback,options={}){target.addEventListener(event,callback,{...options,signal:abort.signal});}');
runtime=runtime.replace('function applyTheme(value,save=true)','function applyTheme(value)').replace('applyTheme(theme,false)','applyTheme(theme)');
runtime=runtime.replace(" const physical='clearcoat' in model.filmMaterial;\n",'');
runtime=runtime.replace('start=performance.now();previous=start;ready=true;','start=performance.now();previous=start;ready=true;hiddenAt=(document.hidden||!visible)?start:0;');
runtime=runtime.replace("if(!disposed){console.error('Perfect Apply:',error);fallback();}","if(!disposed){ready=false;cancelAnimationFrame(raf);raf=0;console.error('Perfect Apply:',error);fallback();}");
runtime+=`
function syncVisibility(){
 const now=performance.now(),suspended=document.hidden||!visible;
 body.classList.toggle('offscreen',!visible);
 if(suspended){if(!hiddenAt)hiddenAt=now;if(raf)cancelAnimationFrame(raf);raf=0;}
 else{if(hiddenAt){const duration=now-hiddenAt;pauseDuration+=duration;if(passStarted!==null)passPausedTime+=duration;if(paused){pauseAt+=duration;if(passPauseAt)passPauseAt+=duration;}}hiddenAt=0;previous=now;schedule();}
}
listen(document,'visibilitychange',syncVisibility);
visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncVisibility();},{threshold:.01});visibilityObserver.observe(stage);
void initialize();
function dispose(){
 if(disposed)return;disposed=true;abort.abort();cancelAnimationFrame(raf);resizeObserver?.disconnect();visibilityObserver?.disconnect();
 const geometry=new Set(),materials=new Set(),textures=new Set();
 scene?.traverse(object=>{if(object.geometry)geometry.add(object.geometry);const values=Array.isArray(object.material)?object.material:[object.material];for(const material of values){if(!material)continue;materials.add(material);for(const value of Object.values(material))if(value?.isTexture)textures.add(value);}});
 for(const value of textures)value.dispose();for(const value of materials)value.dispose();for(const value of geometry)value.dispose();environmentTarget?.dispose();renderer?.dispose();renderer?.forceContextLoss();renderer=null;
 body.classList.remove('started','opening','type-visible','settled','paused','offscreen','resetting','low-power');
}
return {setTheme:applyTheme,dispose};
}
`;
fs.writeFileSync(path.join(target,'runtime.js'),runtime);
console.log('Prepared native Perfect Apply model, scoped styles and mounted renderer.');
