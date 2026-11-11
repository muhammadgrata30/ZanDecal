'use strict';
(() => {
 const gsap=window.gsap,ScrollTrigger=window.ScrollTrigger;
 if(!gsap||!ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let scrollContext=null,refreshFrame=0,enterHeading=false,currentScreen=null,navigating=false,pendingNavigation=null,slideTimeline=null;
 const curtain=document.createElement('div');curtain.className='archive-curtain';curtain.setAttribute('aria-hidden','true');
 const label=document.createElement('span');label.textContent='ZAN / THE CHARACTER ARCHIVE';curtain.append(label);document.body.append(curtain);
 gsap.set(curtain,{yPercent:100});
 function clearScroll(){scrollContext?.revert();scrollContext=null;}
 function refresh(heading=false){
  enterHeading=enterHeading||heading;
  cancelAnimationFrame(refreshFrame);
  refreshFrame=requestAnimationFrame(()=>{
   const intro=enterHeading;enterHeading=false;clearScroll();
   if(preference.matches)return;
   const section=[...document.querySelectorAll('.screen')].find(node=>!node.hidden);if(!section)return;
   scrollContext=gsap.context(()=>{
    if(intro){
     const copy=section.querySelectorAll('.section-heading .eyebrow,.section-heading h1,.section-heading>p,.admin-heading');
     gsap.fromTo(copy,{autoAlpha:0,y:32},{autoAlpha:1,y:0,duration:.85,stagger:.09,ease:'power3.out',clearProps:'opacity,visibility,transform'});
    }
    section.querySelectorAll('.project').forEach((card,index)=>{
     gsap.fromTo(card,{autoAlpha:0,y:48},{autoAlpha:1,y:0,duration:.9,delay:index%2*.09,ease:'power3.out',clearProps:'opacity,visibility,transform',scrollTrigger:{trigger:card,start:'top 94%',once:true}});
     const photo=card.querySelector('.project-visual>img');
     if(photo&&matchMedia('(min-width: 768px)').matches){
      gsap.fromTo(photo,{yPercent:-4,scale:1.1},{yPercent:4,scale:1.1,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:.6}});
     }
    });
    const ending=section.querySelector('.home-gallery-link,.gallery-bottom');
    if(ending)gsap.fromTo(ending,{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.7,ease:'power2.out',clearProps:'opacity,visibility,transform',scrollTrigger:{trigger:ending,start:'top 96%',once:true}});
   },section);
   ScrollTrigger.refresh();
  });
 }
 function navigate(next,commit){
  if(navigating){pendingNavigation={next,commit};return;}
  if(!currentScreen||next===currentScreen||preference.matches){currentScreen=next;commit();return;}
  navigating=true;curtain.classList.add('active');label.textContent=next==='gallery'?'ZAN / MASUK KE ARSIP':next==='admin'?'ZAN / STUDIO WORKSPACE':'ZAN / SELECTED CHARACTERS';
  gsap.timeline({onComplete(){
   navigating=false;curtain.classList.remove('active');
   if(pendingNavigation){const pending=pendingNavigation;pendingNavigation=null;navigate(pending.next,pending.commit);}
  }}).fromTo(curtain,{yPercent:100},{yPercent:0,duration:.42,ease:'power3.inOut'})
   .call(()=>{clearScroll();currentScreen=next;commit();})
   .to(curtain,{yPercent:-100,duration:.55,ease:'power3.inOut'},'+=.08');
 }
 function openDetail(dialog){
  if(preference.matches)return;
  gsap.fromTo(dialog,{autoAlpha:0,y:30,scale:.975},{autoAlpha:1,y:0,scale:1,duration:.55,ease:'power3.out',clearProps:'opacity,visibility,transform'});
 }
 function slide(viewer,frame,badge,direction,done){
  if(!direction){slideTimeline?.kill();slideTimeline=null;frame.classList.add('is-current');viewer.replaceChildren(frame,badge);done();return;}
  const previous=viewer.querySelector('.media-frame.is-current');
  viewer.querySelectorAll('.stage-badge').forEach(node=>node.remove());
  frame.classList.add('is-current');previous?.classList.remove('is-current');viewer.append(frame,badge);
  if(!previous||!direction||preference.matches){previous?.remove();done();return;}
  slideTimeline=gsap.timeline({onComplete(){slideTimeline=null;previous.remove();gsap.set(frame,{clearProps:'transform'});done();}})
   .fromTo(frame,{xPercent:100*direction},{xPercent:0,duration:.65,ease:'power3.inOut'},0)
   .to(previous,{xPercent:-100*direction,duration:.65,ease:'power3.inOut'},0);
 }
 preference.addEventListener('change',()=>refresh());
 window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
 document.fonts?.ready.then(()=>ScrollTrigger.refresh());
 document.addEventListener('load',event=>{if(event.target instanceof HTMLImageElement)ScrollTrigger.refresh();},true);
 window.ArchiveMotion={refresh,navigate,openDetail,slide};
})();
