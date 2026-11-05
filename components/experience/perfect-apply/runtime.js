import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {createApply,direction,ease,INTRO_END,PASS_INTERVAL,PASS_DURATION,autoPassTime,heroScale} from './model.js';
import {THEMES,normalizeTheme,pixelRatio} from './theme.js';

export function mountPerfectApply(stage,initialTheme='light') {
const canvas=stage.querySelector('#apply-canvas'),body=stage;
const abort=new AbortController();let disposed=false,visible=true;
function listen(target,event,callback,options={}){target.addEventListener(event,callback,{...options,signal:abort.signal});}
const fonts=getComputedStyle(stage);
const fontFamily=fonts.getPropertyValue('--font-geist-sans').trim()||'Arial';
const monoFamily=fonts.getPropertyValue('--font-geist-mono').trim()||'monospace';
let environmentTarget=null,resizeObserver=null,visibilityObserver=null;
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
let reduced=motionQuery.matches,mobile=innerWidth<1000;
const low=(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4||Boolean(navigator.connection?.saveData);
body.classList.toggle('low-power',low);
let renderer,scene,camera,rig,model,ready=false,raf=0,start=0,previous=0,lastDraw=0,frames=0,hiddenAt=0;
let paused=false,pauseAt=0,pauseDuration=0,skipped=reduced,skipAt=0,typed=false,settled=false,opening=false,slowMode=false,slowFrames=0;
let selectedFinish='gloss',passStarted=null,passPausedTime=0,passPauseAt=0,lastChapter='',passOrigin=null,passRotation=null,lastHeroAge=0,autoAnchor=0,lastAutoCycle=-1;
let theme=normalizeTheme(initialTheme);
const pointer=new THREE.Vector2(),follow=new THREE.Vector2(),zero=new THREE.Vector2(),white=new THREE.Color(0xffffff),targetColor=new THREE.Color(THEMES[theme].film),currentThemeColor=targetColor.clone();
const targetHousing=new THREE.Color(THEMES[theme].housing),targetLiner=new THREE.Color(THEMES[theme].liner),rimTint=new THREE.Color(),fillTint=new THREE.Color();
const targetInk=new THREE.Color(THEMES[theme].ink),currentInk=targetInk.clone(),introInk=new THREE.Color(0x242129);
let targetRoughness=.14,targetMetalness=.42;
const motionButton=stage.querySelector('#motion'),motionState=stage.querySelector('#motion-state');
function schedule(){if(!disposed&&visible&&ready&&renderer&&!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
function elapsedAt(now=performance.now()){return Math.max(0,((paused?pauseAt:now)-start-pauseDuration)/1000);}
function skipIntro(){skipAt=elapsedAt();skipped=true;schedule();}
function applyTheme(value){
 theme=normalizeTheme(value);stage.dataset.theme=theme;
 stage.querySelectorAll('[data-theme-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.themeChoice===theme)));
 stage.querySelector('#theme-status').textContent=`Tema ${theme}`;
 targetColor.set(THEMES[theme].film);targetInk.set(THEMES[theme].ink);targetHousing.set(THEMES[theme].housing);targetLiner.set(THEMES[theme].liner);
 schedule();
}
applyTheme(theme);
function setPaused(value){
 if(paused===value)return;const now=performance.now();paused=value;
 if(value){pauseAt=now;if(passStarted!==null)passPauseAt=now;}else{pauseDuration+=now-pauseAt;if(passPauseAt)passPausedTime+=now-passPauseAt;passPauseAt=0;}
 body.classList.toggle('paused',paused||reduced);motionButton.setAttribute('aria-pressed',String(!paused&&!reduced));motionButton.setAttribute('aria-label',paused?'Lanjutkan gerakan hero':'Jeda gerakan hero');motionState.textContent=paused||reduced?'off':'on';schedule();
}
listen(motionButton,'click',()=>setPaused(!paused));
function finish(name){selectedFinish=name;targetRoughness={gloss:.14,satin:.42,matte:.8}[name];targetMetalness={gloss:.42,satin:.24,matte:.07}[name];stage.querySelectorAll('[data-finish]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.finish===name)));schedule();}
stage.querySelectorAll('[data-finish]').forEach(b=>listen(b,'click',()=>finish(b.dataset.finish)));
listen(stage,'pointermove',event=>{const rect=stage.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,(event.clientY-rect.top)/rect.height*2-1);schedule();},{passive:true});listen(stage,'pointerleave',()=>{pointer.set(0,0);schedule();});
function replayIntro(){
 if(paused)setPaused(false);skipped=reduced;skipAt=0;typed=false;settled=false;opening=false;passStarted=null;autoAnchor=0;lastAutoCycle=-1;lastHeroAge=0;start=performance.now();previous=start;pauseDuration=0;pauseAt=0;lastChapter='';
 body.classList.add('resetting');body.classList.remove('opening','type-visible','settled','started');requestAnimationFrame(()=>{body.classList.remove('resetting');body.classList.add('started');schedule();});
}
listen(stage.querySelector('#replay-intro'),'click',replayIntro);
listen(stage.querySelector('#skip'),'click',skipIntro);
listen(stage.querySelector('#replay-sweep'),'click',()=>{
 if(!settled){skipIntro();return;}
 if(paused)setPaused(false);passOrigin=model.tool.position.clone();passRotation=model.tool.quaternion.clone();passStarted=performance.now();passPausedTime=0;passPauseAt=0;autoAnchor=lastHeroAge;lastAutoCycle=-1;stage.querySelector('#surface-state').textContent='Watch the surface change.';schedule();
});
listen(motionQuery,'change',()=>{reduced=motionQuery.matches;if(reduced){skipAt=elapsedAt();skipped=true;}body.classList.toggle('paused',paused||reduced);motionState.textContent=paused||reduced?'off':'on';motionButton.setAttribute('aria-pressed',String(!paused&&!reduced));schedule();});
function fallback(){body.classList.add('opening','type-visible','settled','paused');stage.querySelector('#fallback').hidden=false;stage.querySelector('#skip').hidden=true;stage.querySelector('#surface-state').textContent='Your surface. Your character.';}
function texture(width,height,draw){const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;draw(canvas.getContext('2d'),width,height);const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;return map;}
function decorate(){
 const printScale=2;
 const print=texture(1024*printScale,768*printScale,(ctx)=>{
  ctx.scale(printScale,printScale);ctx.fillStyle='#ffffff';ctx.font=`800 252px ${fontFamily}, Arial`;ctx.letterSpacing='-15px';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('ZAN',512,389);
 });print.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),low?8:16);model.printMaterial.map=print;model.printMaterial.opacity=1;model.printMaterial.needsUpdate=true;
 const badge=texture(256,96,(ctx,w,h)=>{ctx.fillStyle='#bdb2d2';ctx.fillRect(0,0,w,h);ctx.fillStyle='#362b45';ctx.font=`800 49px ${fontFamily}, Arial`;ctx.textAlign='center';ctx.fillText('ZAN',w/2,66);});model.badge.material.map=badge;model.badge.material.color.set(0xffffff);model.badge.material.needsUpdate=true;
 const shadow=texture(128,128,(ctx,w,h)=>{const g=ctx.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(.48,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);});model.shadowMaterial.map=shadow;model.shadowMaterial.needsUpdate=true;
 if(!low){const pixels=new Uint8Array(128*128);let seed=67;for(let i=0;i<pixels.length;i++){seed=(seed*1664525+1013904223)>>>0;pixels[i]=122+(seed%12);}const bump=new THREE.DataTexture(pixels,128,128,THREE.RedFormat);bump.wrapS=bump.wrapT=THREE.RepeatWrapping;bump.repeat.set(9,7);bump.minFilter=bump.magFilter=THREE.LinearFilter;bump.needsUpdate=true;model.filmMaterial.bumpMap=bump;model.filmMaterial.bumpScale=.0015;model.filmMaterial.needsUpdate=true;}
}
async function initialize(){try{
 renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=THEMES[theme].exposure;
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(34,1,.1,80);camera.position.set(0,0,14.2);camera.lookAt(0,0,0);
 const room=new RoomEnvironment(),stripGeometry=new THREE.BoxGeometry(),strips=[];
 for(const [x,y,z,w,h,d,color,intensity] of [[-4,7,5,.25,7,2,0xf3f1f5,9],[5,4,3,.2,5,.7,0xf8fafc,12],[0,8,-4,7,.1,2,0xffffff,12]]){const material=new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity)}),strip=new THREE.Mesh(stripGeometry,material);strip.position.set(x,y,z);strip.scale.set(w,h,d);room.add(strip);strips.push(material);}
 const pmrem=new THREE.PMREMGenerator(renderer);environmentTarget=pmrem.fromScene(room,.012,.1,100,{size:low?128:256});scene.environment=environmentTarget.texture;room.dispose();stripGeometry.dispose();strips.forEach(m=>m.dispose());pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0x67636b,1.7));
 const key=new THREE.DirectionalLight(0xffffff,3.1);key.position.set(1,5,6);scene.add(key);
 const rim=new THREE.DirectionalLight(0xffffff,2.4);rim.position.set(-5,1,3);scene.add(rim);const cyan=new THREE.DirectionalLight(0xffffff,1.8);cyan.position.set(4,-1,3);scene.add(cyan);
 model=createApply(low||mobile);rig=new THREE.Group();rig.add(model.root);scene.add(rig);
 // On phones use the leaner surface, while desktop keeps the coating shader.
 function resize(){mobile=innerWidth<1000;const w=stage.clientWidth,h=stage.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();const ratio=pixelRatio(w,h,devicePixelRatio,low);renderer.setPixelRatio(ratio);renderer.setSize(w,h,false);stage.dataset.pixelRatio=String(ratio);schedule();}
 resize();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);
 await Promise.all([document.fonts.load(`800 18px ${fontFamily}`),document.fonts.load(`400 12px ${monoFamily}`)]).catch(()=>{});if(disposed)return;decorate();
 renderer.compile(scene,camera);
 start=performance.now();previous=start;ready=true;hiddenAt=(document.hidden||!visible)?start:0;body.classList.add('started');body.classList.toggle('paused',reduced);motionState.textContent=reduced?'off':'on';motionButton.setAttribute('aria-pressed',String(!reduced));schedule();
 listen(canvas,'webglcontextlost',e=>{e.preventDefault();if(raf)cancelAnimationFrame(raf);raf=0;renderer=null;fallback();});
 // Store light handles on the scene only; no global state or external assets.
 scene.userData.lights={key,rim,cyan};
}catch(error){if(!disposed){ready=false;cancelAnimationFrame(raf);raf=0;console.error('Perfect Apply:',error);fallback();}}}

function frame(now){
 raf=0;if(disposed||!visible||!renderer||document.hidden)return;
 const elapsed=elapsedAt(now),t=skipped?INTRO_END+Math.max(0,elapsed-skipAt):elapsed;
 if((low||slowMode)&&t>INTRO_END&&!paused&&!reduced&&now-lastDraw<32){schedule();return;}
 const dt=Math.min((now-previous)/1000,.06);previous=now;lastDraw=now;
 const quiet=paused||reduced,idle=Math.max(0,t-INTRO_END),p=direction(Math.min(t,INTRO_END),mobile),damping=1-Math.exp(-7*dt);
 follow.lerp(quiet?zero:pointer,damping);currentThemeColor.lerp(targetColor,1-Math.exp(-5*dt));currentInk.lerp(targetInk,1-Math.exp(-5*dt));
 const themeBlend=ease((t-3.15)/2.35);model.filmMaterial.color.copy(white).lerp(currentThemeColor,themeBlend);
 model.printMaterial.color.copy(introInk).lerp(currentInk,themeBlend);
 model.housing.color.lerp(targetHousing,1-Math.exp(-5*dt));model.liner.material.color.lerp(targetLiner,1-Math.exp(-5*dt));renderer.toneMappingExposure=THREE.MathUtils.lerp(renderer.toneMappingExposure,THEMES[theme].exposure,1-Math.exp(-5*dt));
 model.filmMaterial.roughness=THREE.MathUtils.lerp(model.filmMaterial.roughness,targetRoughness,1-Math.exp(-5*dt));model.filmMaterial.metalness=THREE.MathUtils.lerp(model.filmMaterial.metalness,targetMetalness,1-Math.exp(-5*dt));if('clearcoat'in model.filmMaterial)model.filmMaterial.clearcoat=selectedFinish==='gloss'?1:selectedFinish==='satin'?.45:.08;
 lastHeroAge=idle;let sweep=p.sweep,park=ease((t-4.15)/1.25),press=p.press,returnProgress=1,wrinkles=1,passTime=null;
 if(passStarted!==null){const passNow=paused?passPauseAt:now;passTime=reduced?5.4:Math.max(0,(passNow-passStarted-passPausedTime)/1000);if(passTime>=PASS_DURATION){passStarted=null;passTime=null;stage.querySelector('#surface-state').textContent='A single, considered pass.';}}
 else if(!reduced&&t>=INTRO_END){passTime=autoPassTime(idle-autoAnchor);if(passTime!==null){const cycle=Math.floor((idle-autoAnchor-PASS_INTERVAL)/PASS_INTERVAL);if(cycle!==lastAutoCycle){lastAutoCycle=cycle;passOrigin=model.tool.position.clone();passRotation=model.tool.quaternion.clone();}}}
 if(passTime!==null){returnProgress=ease(passTime/.8);sweep=ease((passTime-.85)/3);park=ease((passTime-3.95)/1.05);press=ease((passTime-.35)/.5);wrinkles=ease(passTime/.6);}
 model.update(sweep,idle,quiet,park,press,wrinkles);
 if(returnProgress<1&&passOrigin){const destination=model.tool.position.clone(),rotation=model.tool.quaternion.clone();model.tool.position.copy(passOrigin).lerp(destination,returnProgress);model.tool.position.z+=Math.sin(returnProgress*Math.PI)*.8;model.tool.quaternion.copy(passRotation).slerp(rotation,returnProgress);}
 const fit=heroScale(camera.aspect,mobile);
 const breathing=quiet?0:Math.sin(idle*.55)*.025*ease(idle/1.4),turn=quiet?0:Math.sin(idle*.27)*.016*ease(idle/1.4);
 rig.position.set(p.x,p.y+breathing,0);rig.rotation.set(p.rx+(quiet?0:follow.y*.04*p.open),p.ry+turn+(quiet?0:follow.x*.095*p.open),p.rz);rig.scale.setScalar(fit);
 camera.position.set(p.cameraX,p.cameraY,p.cameraZ);camera.lookAt(0,0,0);
 const {key,rim,cyan}=scene.userData.lights;rimTint.set(THEMES[theme].rim);fillTint.set(THEMES[theme].fill);rim.color.copy(white).lerp(rimTint,themeBlend);cyan.color.copy(white).lerp(fillTint,themeBlend);
 if(!quiet){const sheen=Math.pow(Math.max(0,Math.sin(idle*Math.PI/5)),10);key.position.x=1+sheen*2.3;rim.intensity=2.4+sheen*.1;}
 if(t>3.25&&!opening){opening=true;body.classList.add('opening');}
 if(t>4.1&&!typed){typed=true;body.classList.add('type-visible');}
 if(t>=INTRO_END&&!settled){settled=true;body.classList.add('settled');stage.querySelector('#surface-state').textContent='A single, considered pass.';}
 const chapter=t<1.2?'01 / THE SURFACE':t<4.15?'02 / THE PERFECT PASS':t<INTRO_END?'03 / YOUR SIGNATURE':'03 / PERFECTLY PERSONAL';if(chapter!==lastChapter){stage.querySelector('#chapter').textContent=chapter;lastChapter=chapter;}
 stage.querySelector('#timeline-fill').style.width=`${Math.min(100,t/INTRO_END*100)}%`;stage.style.setProperty('--px',quiet?'0':follow.x.toFixed(3));stage.style.setProperty('--py',quiet?'0':follow.y.toFixed(3));
 renderer.render(scene,camera);frames++;stage.dataset.phase=settled?'hero':t>3.25?'entrance':'intro';stage.dataset.frames=String(frames);stage.dataset.finish=selectedFinish;stage.dataset.pass=passTime===null?'rest':'applying';
 if(t<INTRO_END&&frames>20&&dt>.028)slowFrames++;if(slowFrames>40&&!slowMode){slowMode=true;body.classList.add('low-power');}
 const colorDelta=(a,b)=>Math.abs(a.r-b.r)+Math.abs(a.g-b.g)+Math.abs(a.b-b.b);
 const changes=follow.distanceToSquared(quiet?zero:pointer)>1e-7||colorDelta(currentThemeColor,targetColor)>.001||colorDelta(currentInk,targetInk)>.001||colorDelta(model.housing.color,targetHousing)>.001||colorDelta(model.liner.material.color,targetLiner)>.001||Math.abs(renderer.toneMappingExposure-THEMES[theme].exposure)>.001||Math.abs(model.filmMaterial.roughness-targetRoughness)>.001||Math.abs(model.filmMaterial.metalness-targetMetalness)>.001;
 if(!quiet||changes)schedule();
}

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
