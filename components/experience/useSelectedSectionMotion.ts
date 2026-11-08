"use client";
import {useEffect,type RefObject} from "react";

/** Scoped GSAP timelines; reduced motion keeps all content visible. */
export function useSelectedSectionMotion(root:RefObject<HTMLElement|null>,kind:"commission"|"footer"){
 useEffect(()=>{
  let cancelled=false;
  let cleanup:undefined|(()=>void);
  async function mount(){
   const [{gsap},{ScrollTrigger}]=await Promise.all([import("gsap"),import("gsap/ScrollTrigger")]);
   if(cancelled||!root.current)return;
   gsap.registerPlugin(ScrollTrigger);
   const mm=gsap.matchMedia(root.current);
   mm.add("(prefers-reduced-motion: no-preference)",()=>{
    const section=root.current!;
    if(kind==="commission"){
     gsap.from(section.querySelectorAll(".selected-motion-word"),{yPercent:110,stagger:.12,ease:"power3.out",scrollTrigger:{trigger:section,start:"top 88%",end:"top 30%",scrub:1}});
     gsap.fromTo(".manifesto-image",{scale:1.2,yPercent:5},{scale:1.02,yPercent:-7,ease:"none",scrollTrigger:{trigger:section,endTrigger:section.querySelector(".manifesto-lead"),start:"top bottom",end:"bottom top",scrub:1}});
     gsap.from(".manifesto-image-wrap",{clipPath:"inset(0 100% 0 0)",ease:"power2.out",scrollTrigger:{trigger:section,start:"top 85%",end:"top 25%",scrub:1}});
     gsap.from(".manifesto-form fieldset",{y:25,stagger:.08,duration:.65,ease:"power2.out",scrollTrigger:{trigger:".manifesto-form",start:"top 88%",toggleActions:"play none none none"}});
    }else{
     section.querySelectorAll<HTMLElement>(".footer-motion-text").forEach(group=>{
      gsap.from(group.querySelectorAll(".footer-char"),{yPercent:105,autoAlpha:0,rotation:3,duration:.65,stagger:{amount:.28},ease:"power3.out",scrollTrigger:{trigger:group,start:"top 94%",toggleActions:"play none none reverse"}});
     });
     gsap.from(".cutclose-wordmark span",{yPercent:80,rotate:-3,stagger:.04,duration:1,ease:"power3.out",scrollTrigger:{trigger:".cutclose-wordmark",start:"top 98%",toggleActions:"play none none reverse"}});
     gsap.fromTo(".cutclose-path",{strokeDashoffset:1},{strokeDashoffset:0,scrollTrigger:{trigger:section,start:"top 90%",end:"top 5%",scrub:1}});
    }
   });
   let frame=0;
   const refresh=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(!cancelled)ScrollTrigger.refresh();});};
   root.current.addEventListener("load",refresh,true);
   const element=root.current;
   cleanup=()=>{cancelAnimationFrame(frame);element.removeEventListener("load",refresh,true);mm.revert();};
   await document.fonts.ready;
   if(!cancelled)refresh();
  }
  void mount().catch(error=>{console.warn(`Could not initialize ${kind} motion`,error);});
  return()=>{cancelled=true;cleanup?.();};
 },[root,kind]);
}
