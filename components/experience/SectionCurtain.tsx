"use client";
import {useLayoutEffect,useRef,type ReactNode,type CSSProperties} from "react";
import "./section-curtain.css";

/** Native cover transition: the incoming section scrolls over the outgoing one. */
export function SectionCurtain({previous,next,variant}:{previous:ReactNode;next:ReactNode;variant:"material"|"studio"|"footer"}){
 const root=useRef<HTMLDivElement>(null);
 const outgoing=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const pair=root.current,previous=outgoing.current;if(!pair||!previous)return;
  const motion=matchMedia("(prefers-reduced-motion: reduce)");
  let frame=0;
  const measure=()=>{
   frame=0;
   // Tall sections scroll fully before their last viewport is held in place.
   const top=Math.min(0,window.innerHeight-previous.offsetHeight);
   pair.style.setProperty("--curtain-top",`${top}px`);
   pair.dataset.curtainActive=String(!motion.matches);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure);};
  const resize=new ResizeObserver(schedule);resize.observe(previous);
  window.addEventListener("resize",schedule);motion.addEventListener("change",measure);
  measure();
  return()=>{resize.disconnect();cancelAnimationFrame(frame);window.removeEventListener("resize",schedule);motion.removeEventListener("change",measure);};
 },[]);
 return <div ref={root} className={`section-curtain section-curtain-${variant}`} style={{"--curtain-top":"0px"} as CSSProperties}>
  <div ref={outgoing} className="section-curtain-outgoing">{previous}</div>
  <div className="section-curtain-incoming">{next}</div>
 </div>;
}
