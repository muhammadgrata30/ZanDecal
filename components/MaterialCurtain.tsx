"use client";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./MaterialCurtain.module.css";

export function MaterialCurtain({children}:{children:ReactNode}){
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const element=root.current;if(!element)return;
    const motion=matchMedia("(prefers-reduced-motion:reduce)");
    let frame=0,visible=false;
    const update=()=>{frame=0;const top=element.getBoundingClientRect().top;const progress=motion.matches?1:Math.max(0,Math.min(1,-top/(window.innerHeight*.65)));element.style.setProperty("--curtain-open",String(progress));};
    const schedule=()=>{if(visible&&!frame)frame=requestAnimationFrame(update);};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)schedule();},{rootMargin:"100px"});
    observer.observe(element);update();window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",schedule);motion.addEventListener("change",update);
    return()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener("scroll",schedule);window.removeEventListener("resize",schedule);motion.removeEventListener("change",update);};
  },[]);
  return <div ref={root} className={styles.curtain}>
    <div className={styles.panel} aria-hidden="true"><span>03 / MATERIAL EXPLORER</span><strong>WARNA.<br/><em>Jadi karakter.</em></strong><div><span>ZAN DECAL / SURFACE STUDIES</span><span>SCROLL TO REVEAL ↓</span></div></div>
    {children}
  </div>;
}
