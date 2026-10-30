"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { SplitImageHero } from "./SplitImageHero";
import { DrivingExperience } from "./DrivingExperience";
import { clamp01, heroStudioSequencePose } from "./journeyMath";

export interface StudioSequence {
  progress:{current:number};
  subscribe:(listener:()=>void)=>()=>void;
}
function subscribeMotion(callback:()=>void){const q=matchMedia("(prefers-reduced-motion: reduce)");q.addEventListener("change",callback);return()=>q.removeEventListener("change",callback);}
const readMotion=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;

export function HeroStudioSequence(){
  const root=useRef<HTMLDivElement>(null);
  const pin=useRef<HTMLDivElement>(null);
  const anchor=useRef<HTMLDivElement>(null);
  const progress=useRef(0);
  const studioProgress=useRef(0);
  const visibleRef=useRef(false);
  const [studioVisible,setStudioVisible]=useState(false);
  const reduced=useSyncExternalStore(subscribeMotion,readMotion,()=>false);
  const sequence=useMemo(()=>{
    const listeners=new Set<()=>void>();
    return {progress:studioProgress,subscribe:(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};},notify:()=>listeners.forEach(listener=>listener())};
  },[]);
  useEffect(()=>{
    const element=root.current,stage=pin.current;
    if(!element||!stage)return;
    let frame=0,last=0;
    const notify=()=>sequence.notify();
    const measure=()=>{
      const distance=Math.max(1,element.offsetHeight-stage.offsetHeight);
      const top=element.getBoundingClientRect().top;
      if(anchor.current)anchor.current.style.top=reduced?`${element.querySelector<HTMLElement>(".sequence-hero-layer")?.offsetHeight||0}px`:`${distance*.97}px`;
      return clamp01(-top/distance);
    };
    const write=()=>{
      const pose=heroStudioSequencePose(progress.current);
      element.style.setProperty("--sequence-door",String(reduced?0:pose.door));
      studioProgress.current=reduced?1:pose.studioProgress;notify();
      if(visibleRef.current!==pose.studioVisible){visibleRef.current=pose.studioVisible;setStudioVisible(pose.studioVisible);}
    };
    const tick=(time:number)=>{
      frame=0;const target=measure();const dt=Math.min((time-(last||time-16))/1000,.05);last=time;
      progress.current+=(target-progress.current)*(1-Math.exp(-dt*12));
      if(Math.abs(target-progress.current)<.0001)progress.current=target;
      write();if(progress.current!==target)frame=requestAnimationFrame(tick);
    };
    const schedule=()=>{if(!frame){last=0;frame=requestAnimationFrame(tick);}};
    const resize=new ResizeObserver(schedule);resize.observe(element);resize.observe(stage);
    addEventListener("scroll",schedule,{passive:true});addEventListener("resize",schedule);
    progress.current=measure();write();
    return()=>{resize.disconnect();cancelAnimationFrame(frame);removeEventListener("scroll",schedule);removeEventListener("resize",schedule);};
  },[sequence,reduced]);
  return <div ref={root} id="beranda" className={`hero-studio-sequence${reduced?" is-reduced":""}`} data-pane={studioVisible?"studio":"hero"}>
    <div ref={anchor} id="3d-studio" className="sequence-studio-anchor" aria-hidden="true"/>
    <div ref={pin} className="hero-studio-pin">
      <div className="sequence-hero-layer" aria-hidden={!reduced&&studioVisible} inert={!reduced&&studioVisible}><SplitImageHero embedded suspended={studioVisible&&!reduced}/></div>
      <div className="sequence-studio-layer" aria-hidden={!reduced&&!studioVisible} inert={!reduced&&!studioVisible}><DrivingExperience studioOnly sequence={sequence}/></div>
      <div className="sequence-garage-door" aria-hidden="true"><span>AUTOMOTIVE WRAP & CUSTOM DECAL</span><strong>ZAN DECAL</strong><span>WELCOME TO THE STUDIO</span></div>
    </div>
  </div>;
}
