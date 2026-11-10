"use client";
import {useEffect,type RefObject} from "react";
/** Native scroll without competing pin spacers or layout refreshes. */
export function useStudioMotion(root:RefObject<HTMLElement|null>,onEntrance:()=>void,onProgress:(progress:number)=>void){
 useEffect(()=>{
  const section=root.current;if(!section)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  let frame=0,visible=false,entered=false,last=-1,smoothed=0,previous=0;
  const update=(now=performance.now())=>{
   frame=0;
   const top=(section.parentElement ?? section).getBoundingClientRect().top;
   const target=reduced.matches?1:Math.max(0,Math.min(1,(-top-innerHeight*.16)/(innerHeight*1.15)));
   const dt=previous?Math.min((now-previous)/1000,.05):1/60;previous=now;
   smoothed=reduced.matches?target:smoothed+(target-smoothed)*(1-Math.exp(-dt/0.18));
   if(Math.abs(target-smoothed)<.0005)smoothed=target;
   const progress=smoothed;
   if(progress>0&&!entered){entered=true;onEntrance();}
   if(progress!==last){last=progress;onProgress(progress);}
   if(visible&&progress!==target)frame=requestAnimationFrame(update);
  };
  const schedule=()=>{if(visible&&!frame)frame=requestAnimationFrame(update);};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)schedule();},{rootMargin:"200px"});
  observer.observe(section);window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);reduced.addEventListener("change",schedule);update();
  return()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);reduced.removeEventListener("change",schedule);};
 },[root,onEntrance,onProgress]);
}
