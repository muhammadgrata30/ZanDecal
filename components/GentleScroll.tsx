"use client";
import { useEffect } from "react";
import { advanceScroll, wheelTarget } from "../lib/scroll-easing";

/** Ease desktop wheel input only; touch, pinch, keyboard and nested scrollers remain native. */
export function GentleScroll(){
  useEffect(()=>{
    const fine=matchMedia("(pointer:fine)");
    const reduced=matchMedia("(prefers-reduced-motion:reduce)");
    let frame=0,target=window.scrollY,last=0,previousPosition=-1,stalls=0;
    const stop=()=>{cancelAnimationFrame(frame);frame=0;last=0;previousPosition=-1;stalls=0;target=window.scrollY;};
    const tick=(time:number)=>{
      frame=0;
      const elapsed=(time-(last||time-16))/1000;last=time;
      const current=window.scrollY;
      stalls=current===previousPosition?stalls+1:0;previousPosition=current;
      if(stalls>=3){stop();return;}
      if(Math.abs(current-target)<1.5){window.scrollTo({top:target,behavior:"instant"});last=0;previousPosition=-1;stalls=0;return;}
      window.scrollTo({top:advanceScroll(current,target,elapsed),behavior:"instant"});
      frame=requestAnimationFrame(tick);
    };
    const wheel=(event:WheelEvent)=>{
      if(event.ctrlKey||event.metaKey){stop();return;}
      if(!fine.matches||reduced.matches||!event.cancelable||event.defaultPrevented||!event.deltaY||Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
      const element=event.target;
      if(element instanceof Element&&element.closest('input,textarea,select,[contenteditable="true"],dialog,[data-native-scroll],[data-material-scroll],.motor-palette'))return;
      if(!frame)target=window.scrollY;
      const maximum=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
      const next=wheelTarget(target,event.deltaY,event.deltaMode,window.innerHeight,maximum);
      if(next===target&&!frame)return;
      target=next;event.preventDefault();
      if(!frame){last=0;previousPosition=-1;stalls=0;frame=requestAnimationFrame(tick);}
    };
    const visibility=()=>{if(document.hidden)stop();};
    window.addEventListener("wheel",wheel,{passive:false,capture:true});
    window.addEventListener("pointerdown",stop,{passive:true});window.addEventListener("keydown",stop);window.addEventListener("resize",stop);
    document.addEventListener("visibilitychange",visibility);reduced.addEventListener("change",stop);
    return()=>{stop();window.removeEventListener("wheel",wheel,true);window.removeEventListener("pointerdown",stop);window.removeEventListener("keydown",stop);window.removeEventListener("resize",stop);document.removeEventListener("visibilitychange",visibility);reduced.removeEventListener("change",stop);};
  },[]);
  return null;
}
