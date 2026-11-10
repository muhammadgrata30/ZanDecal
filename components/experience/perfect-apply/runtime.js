import * as THREE from 'three';
import {createHeroEnvironment} from './environment.js';
import {createApply,direction,ease,INTRO_END,PASS_INTERVAL,PASS_DURATION,autoPassTime,heroScale,passCameraPullback} from './model.js';
import {INTRO_FILM,THEMES,normalizeTheme} from './theme.js';
import {applyCinematicCoating} from './cinematic-coating.js';
import {drawSurfaceArt} from './surface-art.js';
import {applyRealisticMaterials} from './realistic-materials.js';
import {heroQuality,heroPixelRatio} from './quality.js';

export function mountPerfectApply(stage,initialTheme='light') {
const canvas=stage.querySelector('#apply-canvas'),body=stage;
const cinematic=stage.dataset.heroCinematic==='true';
const realistic=stage.dataset.realistic==='true';
const compactHero=stage.classList.contains('he-original-apply');
let coatingFront=null;
let artworkCanvas=null,artworkMap=null,artworkDirty=true;
const abort=new AbortController();let disposed=false,visible=true;
function listen(target,event,callback,options={}){target?.addEventListener(event,callback,{...options,signal:abort.signal});}



let environmentTarget=null,resizeObserver=null,visibilityObserver=null;
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
let reduced=motionQuery.matches,mobile=innerWidth<1000;
const low=(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4||Boolean(navigator.connection?.saveData);
const quality=heroQuality({cores:navigator.hardwareConcurrency||8,memory:navigator.deviceMemory||8,saveData:Boolean(navigator.connection?.saveData),mobile});
stage.dataset.quality=quality.tier;
body.classList.toggle('low-power',low);
let renderer,scene,camera,rig,model,ready=false,raf=0,start=0,previous=0,frames=0,hiddenAt=0;
let lastRendered=0,adaptiveRatio=Infinity,adaptiveFps=quality.fps;
let idleTimer=0;
let paused=false,pauseAt=0,pauseDuration=0,skipped=reduced||stage.dataset.skipRequested==='true',skipAt=0,typed=false,settled=false,opening=false,slowFrames=0;
let selectedFinish='gloss',passStarted=null,passPausedTime=0,passPauseAt=0,lastChapter='',passOrigin=null,passRotation=null,lastHeroAge=0,autoAnchor=0,lastAutoCycle=-1;
let theme=normalizeTheme(initialTheme);
const pointer=new THREE.Vector2(),follow=new THREE.Vector2(),zero=new THREE.Vector2(),white=new THREE.Color(0xffffff),targetColor=new THREE.Color(THEMES[theme].film),currentThemeColor=targetColor.clone();
const targetHousing=new THREE.Color(THEMES[theme].housing),targetLiner=new THREE.Color(THEMES[theme].liner),rimTint=new THREE.Color(),fillTint=new THREE.Color();
const targetInk=new THREE.Color(THEMES[theme].ink),currentInk=targetInk.clone(),introFilm=new THREE.Color(INTRO_FILM);
let targetRoughness=realistic?.24:.14,targetMetalness=realistic?0:.42;
const motionButton=stage.querySelector('#motion'),motionState=stage.querySelector('#motion-state');
let detailCut=null,detailFinish=null,detailHeadline=null;
const detailPoint=new THREE.Vector3();
const cinematicKeyTarget=new THREE.Vector3();
function updateDetailPreview(sweep){
 if(stage.dataset.heroDetails!=='true')return;
 detailCut??=stage.querySelector('.detail-cut');detailFinish??=stage.querySelector('.detail-finish');detailHeadline??=stage.querySelector('.line-two');
 const width=stage.clientWidth,height=stage.clientHeight;
 const place=(element,x,y)=>{if(!element)return;detailPoint.set(x,y,.1).applyMatrix4(rig.matrixWorld).project(camera);const left=THREE.MathUtils.clamp((detailPoint.x+1)*width/2+12,12,width-235),top=(1-detailPoint.y)*height/2-35;element.style.transform=`translate3d(${left.toFixed(1)}px,${top.toFixed(1)}px,0)`;};
 place(detailCut,-1.8,1.4);place(detailFinish,1.65,-.9);detailHeadline?.style.setProperty('--detail-sweep',sweep.toFixed(3));
}
function schedule(){clearTimeout(idleTimer);idleTimer=0;if(!disposed&&visible&&ready&&renderer&&!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
function elapsedAt(now=performance.now()){return Math.max(0,((paused?pauseAt:now)-start-pauseDuration)/1000);}
function skipIntro(){skipAt=ready?elapsedAt():0;skipped=true;schedule();}
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
 body.classList.toggle('paused',paused||reduced);motionButton?.setAttribute('aria-pressed',String(!paused&&!reduced));motionButton?.setAttribute('aria-label',paused?'Lanjutkan gerakan hero':'Jeda gerakan hero');if(motionState)motionState.textContent=paused||reduced?'off':'on';schedule();
}
if(motionButton)listen(motionButton,'click',()=>setPaused(!paused));
function finish(name){selectedFinish=name;targetRoughness={gloss:.14,satin:.42,matte:.8}[name];targetMetalness={gloss:.42,satin:.24,matte:.07}[name];stage.querySelectorAll('[data-finish]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.finish===name)));schedule();}
stage.querySelectorAll('[data-finish]').forEach(b=>listen(b,'click',()=>finish(b.dataset.finish)));
listen(stage,'pointermove',event=>{const rect=stage.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,(event.clientY-rect.top)/rect.height*2-1);schedule();},{passive:true});listen(stage,'pointerleave',()=>{pointer.set(0,0);schedule();});
function replayIntro(){
 if(paused)setPaused(false);skipped=reduced;skipAt=0;typed=false;settled=false;opening=false;passStarted=null;autoAnchor=0;lastAutoCycle=-1;lastHeroAge=0;start=performance.now();previous=start;pauseDuration=0;pauseAt=0;lastChapter='';
 body.classList.add('resetting');body.classList.remove('opening','type-visible','settled','started');requestAnimationFrame(()=>{body.classList.remove('resetting');body.classList.add('started');schedule();});
}
listen(stage.querySelector('#replay-intro'),'click',replayIntro);
listen(stage,'zan-replay-intro',replayIntro);
listen(stage.querySelector('#skip'),'click',skipIntro);
listen(stage.querySelector('#replay-sweep'),'click',()=>{
 if(!settled){skipIntro();return;}
 if(paused)setPaused(false);passOrigin=model.tool.position.clone();passRotation=model.tool.quaternion.clone();passStarted=performance.now();passPausedTime=0;passPauseAt=0;autoAnchor=lastHeroAge;lastAutoCycle=-1;stage.querySelector('#surface-state').textContent='Watch the surface change.';schedule();
});
listen(motionQuery,'change',()=>{reduced=motionQuery.matches;if(reduced){skipAt=elapsedAt();skipped=true;}body.classList.toggle('paused',paused||reduced);if(motionState)motionState.textContent=paused||reduced?'off':'on';motionButton?.setAttribute('aria-pressed',String(!paused&&!reduced));schedule();});
function fallback(){body.classList.add('opening','type-visible','settled','paused');stage.querySelector('#fallback').hidden=false;stage.querySelector('#skip').hidden=true;stage.querySelector('#surface-state').textContent='Your surface. Your character.';}
function texture(width,height,draw){const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;draw(canvas.getContext('2d'),width,height);const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;return map;}
function decorate(logo){
 const printScale=quality.textureScale;
 const print=texture(1024*printScale,768*printScale,(ctx)=>{
  ctx.scale(printScale,printScale);ctx.drawImage(logo,122,254,780,260);
 });print.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),low?8:16);model.printMaterial.map=print;model.printMaterial.opacity=0;model.printMaterial.needsUpdate=true;
 if(Number(stage.dataset.artwork)>0){artworkCanvas=print.image;artworkMap=print;drawSurfaceArt(artworkCanvas.getContext('2d'),artworkCanvas.width,artworkCanvas.height,Number(stage.dataset.artwork),0);artworkMap.needsUpdate=true;}
 const badge=texture(256,96,(ctx,w,h)=>{ctx.fillStyle='#8fd3f4';ctx.fillRect(0,0,w,h);ctx.drawImage(logo,20,12,216,72);});model.badge.material.map=badge;model.badge.material.color.set(0xffffff);model.badge.material.needsUpdate=true;
 const shadow=texture(128,128,(ctx,w,h)=>{const g=ctx.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(.48,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);});model.shadowMaterial.map=shadow;model.shadowMaterial.needsUpdate=true;
 if(!low&&!realistic){const pixels=new Uint8Array(128*128);let seed=67;for(let i=0;i<pixels.length;i++){seed=(seed*1664525+1013904223)>>>0;pixels[i]=122+(seed%12);}const bump=new THREE.DataTexture(pixels,128,128,THREE.RedFormat);bump.wrapS=bump.wrapT=THREE.RepeatWrapping;bump.repeat.set(9,7);bump.minFilter=bump.magFilter=THREE.LinearFilter;bump.needsUpdate=true;model.filmMaterial.bumpMap=bump;model.filmMaterial.bumpScale=.0015;model.filmMaterial.needsUpdate=true;}
}
listen(stage,'zan-artwork-change',()=>{artworkDirty=true;schedule();});
listen(stage,'zan-motion-toggle',()=>setPaused(!paused));
async function initialize(){try{
 const logo=new Image();logo.src='/brand/zan-wordmark-v3.png';const logoReady=logo.decode();
 renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!quality.lean,powerPreference:quality.lean?'low-power':'high-performance'});renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=THEMES[theme].exposure;
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(34,1,.1,80);camera.position.set(0,0,14.2);camera.lookAt(0,0,0);
 environmentTarget=createHeroEnvironment(renderer,low);scene.environment=environmentTarget?.texture??null;
 scene.add(new THREE.HemisphereLight(0xffffff,0x67636b,environmentTarget?(realistic?.35:cinematic?.8:1.7):1.7));
 const key=new THREE.DirectionalLight(0xffffff,3.1);key.position.set(1,5,6);scene.add(key);
 if(cinematic)key.position.set(-4.5,1.2,4.5);
 const rim=new THREE.DirectionalLight(0xffffff,2.4);rim.position.set(-5,1,3);scene.add(rim);const cyan=new THREE.DirectionalLight(0xffffff,1.8);cyan.position.set(4,-1,3);scene.add(cyan);
 model=createApply(quality.lean,cinematic);
 if(realistic){
  coatingFront=applyRealisticMaterials(model,quality.lean);
  renderer.shadowMap.enabled=quality.shadows;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  key.castShadow=quality.shadows;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-6;key.shadow.camera.right=6;key.shadow.camera.top=6;key.shadow.camera.bottom=-6;key.shadow.camera.near=.1;key.shadow.camera.far=24;key.shadow.normalBias=.018;key.shadow.bias=-.0002;key.shadow.radius=3;
  key.intensity=2.1;rim.intensity=.9;cyan.intensity=.55;scene.environmentIntensity=.75;
  model.shadowMaterial.opacity=.09;stage.dataset.lighting='studio-fallback';
 }else if(cinematic)coatingFront=applyCinematicCoating(model.filmMaterial);
 rig=new THREE.Group();rig.add(model.root);scene.add(rig);
 // If the environment shader failed, HDRI uses the same convolution shader.
 // Keep the direct-lighting path instead of repeating the failing GPU bake.
 if(realistic&&quality.hdri&&environmentTarget){
  let hdr=null,hdriGenerator=null;
  try{
   const {HDRLoader}=await import('three/examples/jsm/loaders/HDRLoader.js');
   hdr=await new HDRLoader().loadAsync('/environments/studio_small_05_1k.hdr');
   if(disposed){hdr.dispose();return;}
   hdr.mapping=THREE.EquirectangularReflectionMapping;
   hdriGenerator=new THREE.PMREMGenerator(renderer);
   const studio=hdriGenerator.fromEquirectangular(hdr);
   environmentTarget?.dispose();environmentTarget=studio;scene.environment=studio.texture;
   scene.environmentRotation.set(0,.65,0);stage.dataset.lighting='polyhaven-studio-small-05';
  }catch(error){console.warn('Studio HDRI unavailable; using the local studio light rig.',error);}
  finally{hdr?.dispose();hdriGenerator?.dispose();}
 }
 // On phones use the leaner surface, while desktop keeps the coating shader.
 const renderSize=new THREE.Vector2();
 function resize(){
  if(disposed||!renderer)return;mobile=innerWidth<1000;
  const w=stage.clientWidth,h=stage.clientHeight;if(w<=0||h<=0)return;
  const ratio=Math.min(adaptiveRatio,heroPixelRatio(w,h,devicePixelRatio,quality));
  renderer.getSize(renderSize);
  // Reassigning an unchanged drawing buffer erases its last rendered frame.
  // The intro lock/visibility handoff may notify ResizeObserver without resizing.
  if(renderSize.x===w&&renderSize.y===h&&renderer.getPixelRatio()===ratio)return;
  camera.aspect=w/h;camera.updateProjectionMatrix();
  if(renderer.getPixelRatio()!==ratio)renderer.setPixelRatio(ratio);
  renderer.setSize(w,h,false);stage.dataset.pixelRatio=String(ratio);schedule();
 }
 resize();resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);
 await logoReady;if(disposed)return;decorate(logo);
 await renderer.compileAsync(scene,camera);if(disposed)return;
 start=performance.now();previous=start;ready=true;hiddenAt=(document.hidden||!visible)?start:0;body.classList.add('started');body.classList.toggle('paused',reduced);if(motionState)motionState.textContent=reduced?'off':'on';motionButton?.setAttribute('aria-pressed',String(!reduced));schedule();
 listen(canvas,'webglcontextlost',e=>{e.preventDefault();if(raf)cancelAnimationFrame(raf);raf=0;renderer=null;fallback();});
 // Store light handles on the scene only; no global state or external assets.
 scene.userData.lights={key,rim,cyan};
}catch(error){if(!disposed){ready=false;cancelAnimationFrame(raf);raf=0;console.error('Perfect Apply:',error);fallback();}}}

function frame(now){
 raf=0;if(disposed||!visible||!renderer||document.hidden)return;
 if(now-lastRendered<1000/adaptiveFps-1){schedule();return;}
 lastRendered=now;
 const elapsed=elapsedAt(now),t=skipped?INTRO_END+Math.max(0,elapsed-skipAt):elapsed;
 const dt=Math.min((now-previous)/1000,.06);previous=now;
 const width=stage.clientWidth,height=stage.clientHeight,viewportHeight=Math.min(innerHeight,height),finalAspect=width/height;
 const quiet=paused||reduced,idle=Math.max(0,t-INTRO_END),p=direction(Math.min(t,INTRO_END),mobile,finalAspect),damping=1-Math.exp(-7*dt);
 // Artwork is a static printed sticker. Only redraw when switching designs.
 if(artworkMap&&artworkDirty){drawSurfaceArt(artworkCanvas.getContext('2d'),artworkCanvas.width,artworkCanvas.height,Number(stage.dataset.artwork));artworkMap.needsUpdate=true;artworkDirty=false;}
 // Render to one stable canvas. Extend the camera's view below the first viewport
 // during intro, then interpolate directly into the final hero framing.
 if(p.open<1){camera.setViewOffset(width,THREE.MathUtils.lerp(viewportHeight,height,p.open),0,0,width,height);}
 else if(camera.view?.enabled){camera.clearViewOffset();camera.aspect=finalAspect;camera.updateProjectionMatrix();}
 follow.lerp(quiet?zero:pointer,damping);currentThemeColor.lerp(targetColor,1-Math.exp(-5*dt));currentInk.lerp(targetInk,1-Math.exp(-5*dt));
 const themeBlend=ease(idle/1.2);model.filmMaterial.color.copy(introFilm).lerp(currentThemeColor,themeBlend);
 model.printMaterial.opacity=cinematic?ease((idle-.25)/1.1):ease(idle/.8);
 model.printMaterial.color.copy(white);
 model.housing.color.lerp(targetHousing,1-Math.exp(-5*dt));model.liner.material.color.lerp(targetLiner,1-Math.exp(-5*dt));renderer.toneMappingExposure=THREE.MathUtils.lerp(renderer.toneMappingExposure,THEMES[theme].exposure,1-Math.exp(-5*dt));
 model.filmMaterial.roughness=THREE.MathUtils.lerp(model.filmMaterial.roughness,targetRoughness,1-Math.exp(-5*dt));model.filmMaterial.metalness=THREE.MathUtils.lerp(model.filmMaterial.metalness,targetMetalness,1-Math.exp(-5*dt));if('clearcoat'in model.filmMaterial)model.filmMaterial.clearcoat=selectedFinish==='gloss'?1:selectedFinish==='satin'?.45:.08;
 lastHeroAge=idle;let sweep=p.sweep,park=ease((t-4.15)/1.25),press=p.press,returnProgress=1,wrinkles=1,passTime=null;
 if(passStarted!==null){const passNow=paused?passPauseAt:now;passTime=reduced?5.4:Math.max(0,(passNow-passStarted-passPausedTime)/1000);if(passTime>=PASS_DURATION){passStarted=null;passTime=null;stage.querySelector('#surface-state').textContent='A single, considered pass.';}}
 else if(!reduced&&t>=INTRO_END){passTime=autoPassTime(idle-autoAnchor);if(passTime!==null){const cycle=Math.floor((idle-autoAnchor-PASS_INTERVAL)/PASS_INTERVAL);if(cycle!==lastAutoCycle){lastAutoCycle=cycle;passOrigin=model.tool.position.clone();passRotation=model.tool.quaternion.clone();}}}
 if(passTime!==null){returnProgress=ease(passTime/.8);sweep=ease((passTime-.85)/3);park=ease((passTime-3.95)/1.05);press=ease((passTime-.35)/.5);wrinkles=ease(passTime/.6);}
 model.update(sweep,idle,quiet||realistic||quality.lean,park,press,wrinkles);
 if(coatingFront)coatingFront.value=THREE.MathUtils.lerp(1.08,THREE.MathUtils.lerp(-.08,1.08,sweep),wrinkles);
 if(returnProgress<1&&passOrigin){const destination=model.tool.position.clone(),rotation=model.tool.quaternion.clone();model.tool.position.copy(passOrigin).lerp(destination,returnProgress);model.tool.position.z+=Math.sin(returnProgress*Math.PI)*.8;model.tool.quaternion.copy(passRotation).slerp(rotation,returnProgress);}
 const introFrustum=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*(mobile?7.3:4.35);
 const openingFit=Math.max(introFrustum*(width/viewportHeight)/5,introFrustum/3.25)*1.2;
 const finalScale=heroScale(finalAspect,mobile)*(compactHero?(mobile?.84:.69):1);
 const fit=THREE.MathUtils.lerp(openingFit,finalScale,p.open);
 const resting=quiet||realistic||quality.lean;
 const breathing=resting?0:Math.sin(idle*.55)*.025*ease(idle/1.4),turn=resting?0:Math.sin(idle*.27)*.016*ease(idle/1.4);
 const layoutX=compactHero&&!mobile?1.2*p.open:0;
 const layoutY=compactHero?(mobile?-.05:-.3)*p.open:0;
 rig.position.set(p.x+layoutX,p.y+layoutY+breathing,0);rig.rotation.set(p.rx+(quiet?0:follow.y*.04*p.open),p.ry+turn+(quiet?0:follow.x*.095*p.open),p.rz);rig.scale.setScalar(fit);
 camera.position.set(p.cameraX,p.cameraY,p.cameraZ*passCameraPullback(passTime));camera.lookAt(0,0,0);
 const {key,rim,cyan}=scene.userData.lights;rimTint.set(THEMES[theme].rim);fillTint.set(THEMES[theme].fill);rim.color.copy(white).lerp(rimTint,themeBlend);cyan.color.copy(white).lerp(fillTint,themeBlend);
 if(cinematic){const working=t<4.15||passTime!==null;cinematicKeyTarget.set(working?THREE.MathUtils.lerp(-4.5,4.5,sweep):3.5,working?1.2:4,4.5);key.position.lerp(cinematicKeyTarget,1-Math.exp(-5*dt));key.intensity=THREE.MathUtils.lerp(key.intensity,working?3.8:3.1,1-Math.exp(-5*dt));rim.position.set(-4,2.5,3);rim.intensity=2.6;}
 else if(realistic){key.position.set(-3.5,4.5,6);key.intensity=2.1;rim.intensity=.9;cyan.intensity=.55;}
 else if(!quiet){const sheen=Math.pow(Math.max(0,Math.sin(idle*Math.PI/5)),10);key.position.x=1+sheen*2.3;rim.intensity=2.4+sheen*.1;}
 if(t>3.25&&!opening){opening=true;body.classList.add('opening');}
 if(t>4.1&&!typed){typed=true;body.classList.add('type-visible');}
 const revealHero=t>=INTRO_END&&!settled;
 if(revealHero){settled=true;stage.querySelector('#surface-state').textContent='A single, considered pass.';}
 const chapter=t<1.2?'01 / THE SURFACE':t<4.15?'02 / THE PERFECT PASS':t<INTRO_END?'03 / YOUR SIGNATURE':'03 / PERFECTLY PERSONAL';if(chapter!==lastChapter){stage.querySelector('#chapter').textContent=chapter;lastChapter=chapter;}
 stage.querySelector('#timeline-fill').style.width=`${Math.min(100,t/INTRO_END*100)}%`;stage.style.setProperty('--px',quiet?'0':follow.x.toFixed(3));stage.style.setProperty('--py',quiet?'0':follow.y.toFixed(3));
 renderer.render(scene,camera);
 // Reveal the hero and release its scroll lock only after its first frame exists.
 if(revealHero)body.classList.add('settled');
 if(settled)updateDetailPreview(passTime===null?0:sweep);frames++;stage.dataset.phase=settled?'hero':t>3.25?'entrance':'intro';stage.dataset.frames=String(frames);stage.dataset.finish=selectedFinish;stage.dataset.pass=passTime===null?'rest':'applying';
 if(frames>20&&dt>1/adaptiveFps*1.4)slowFrames++;if(frames%90===0){const ratio=renderer.getPixelRatio();if(slowFrames>30){adaptiveRatio=Math.max(.65,ratio*.85);renderer.setPixelRatio(adaptiveRatio);stage.dataset.pixelRatio=String(adaptiveRatio);if(renderer.shadowMap.enabled){renderer.shadowMap.enabled=false;scene.userData.lights.key.castShadow=false;}if(adaptiveRatio<=.8)adaptiveFps=30;stage.dataset.adaptiveFps=String(adaptiveFps);}slowFrames=0;}
 const colorDelta=(a,b)=>Math.abs(a.r-b.r)+Math.abs(a.g-b.g)+Math.abs(a.b-b.b);
 const changes=follow.distanceToSquared(quiet?zero:pointer)>1e-7||colorDelta(currentThemeColor,targetColor)>.001||colorDelta(currentInk,targetInk)>.001||colorDelta(model.housing.color,targetHousing)>.001||colorDelta(model.liner.material.color,targetLiner)>.001||Math.abs(renderer.toneMappingExposure-THEMES[theme].exposure)>.001||Math.abs(model.filmMaterial.roughness-targetRoughness)>.001||Math.abs(model.filmMaterial.metalness-targetMetalness)>.001;
 if(!quiet||changes){
  if((realistic||quality.lean)&&settled&&idle>1.5&&passTime===null&&!changes){
   const nextPass=PASS_INTERVAL-((idle-autoAnchor)%PASS_INTERVAL);
   idleTimer=setTimeout(schedule,Math.max(16,nextPass*1000));
  }else schedule();
 }
}

function syncVisibility(){
 const now=performance.now(),suspended=document.hidden||!visible;
 body.classList.toggle('offscreen',!visible);
 if(suspended){if(!hiddenAt)hiddenAt=now;if(raf)cancelAnimationFrame(raf);raf=0;clearTimeout(idleTimer);idleTimer=0;}
 else{if(hiddenAt){const duration=now-hiddenAt;pauseDuration+=duration;if(passStarted!==null)passPausedTime+=duration;if(paused){pauseAt+=duration;if(passPauseAt)passPauseAt+=duration;}}hiddenAt=0;previous=now;schedule();}
}
listen(document,'visibilitychange',syncVisibility);
visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncVisibility();},{threshold:.01});visibilityObserver.observe(stage);
void initialize();
function dispose(){
 if(disposed)return;disposed=true;abort.abort();cancelAnimationFrame(raf);clearTimeout(idleTimer);resizeObserver?.disconnect();visibilityObserver?.disconnect();
 const geometry=new Set(),materials=new Set(),textures=new Set();
 scene?.traverse(object=>{if(object.geometry)geometry.add(object.geometry);const values=Array.isArray(object.material)?object.material:[object.material];for(const material of values){if(!material)continue;materials.add(material);for(const value of Object.values(material))if(value?.isTexture)textures.add(value);}});
 for(const value of textures)value.dispose();for(const value of materials)value.dispose();for(const value of geometry)value.dispose();environmentTarget?.dispose();renderer?.dispose();renderer?.forceContextLoss();renderer=null;
 body.classList.remove('started','opening','type-visible','settled','paused','offscreen','resetting','low-power');
}
return {setTheme:applyTheme,dispose};
}
