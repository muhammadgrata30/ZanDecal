"use client";
import {useEffect,type RefObject} from "react";

/** GSAP content arrivals accompany the native section cover transition. */
export function useStudioMotion(root:RefObject<HTMLElement|null>,onEntrance:()=>void){
 useEffect(()=>{
  const element=root.current;if(!element)return;
  const section:HTMLElement=element;
  let cancelled=false,started=false;
  let cleanup:undefined|(()=>void);
  let fallbackObserver:IntersectionObserver|undefined;
  const enter=()=>{if(!cancelled&&!started){started=true;onEntrance();}};
  const observeEntrance=()=>{
   fallbackObserver=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){enter();fallbackObserver?.disconnect();}},{threshold:.15});
   fallbackObserver.observe(section);
  };
  async function mount(){
   const [{gsap},{ScrollTrigger}]=await Promise.all([import("gsap"),import("gsap/ScrollTrigger")]);
   if(cancelled)return;
   gsap.registerPlugin(ScrollTrigger);
   const mm=gsap.matchMedia(section);
   cleanup=()=>mm.revert();
   mm.add({motion:"(prefers-reduced-motion: no-preference)",reduced:"(prefers-reduced-motion: reduce)"},context=>{
    if(context.conditions?.reduced){observeEntrance();return()=>fallbackObserver?.disconnect();}
    const preview=section.querySelector(".motor-preview");
    ScrollTrigger.create({trigger:preview,start:"top 88%",once:true,onEnter:enter,onRefresh:self=>{if(self.progress>0)enter();}});
    gsap.from(section.querySelectorAll(".motor-studio-heading h2"),{y:28,opacity:0,duration:.8,ease:"power3.out",scrollTrigger:{trigger:section,start:"top 90%",once:true}});
    gsap.from(section.querySelectorAll(".motor-settings > *"),{y:18,opacity:0,duration:.65,stagger:.06,ease:"power2.out",scrollTrigger:{trigger:section.querySelector(".motor-settings"),start:"top 92%",once:true}});
   });
   await document.fonts.ready;
   if(!cancelled)ScrollTrigger.refresh();
  }
  void mount().catch(()=>{cleanup?.();if(!cancelled)observeEntrance();});
  return()=>{cancelled=true;fallbackObserver?.disconnect();cleanup?.();};
 },[root,onEntrance]);
}
