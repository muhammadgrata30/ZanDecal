"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Moon, Pause, Play, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";
import { splitHeroFrame, splitHeroOpacity } from "./splitHeroTiming";

const vehicles = [
  {src:"/images/split-hero-ducati.webp",name:"Ducati Streetfighter V4 S",alt:"Ducati Streetfighter tampak depan, panel kiri lavender dan kanan putih"},
  {src:"/images/split-hero-byd.webp",name:"BYD Seal",alt:"BYD Seal tampak depan, panel kiri lavender dan kanan putih"},
];
function subscribeMotion(callback:()=>void){const q=matchMedia("(prefers-reduced-motion: reduce)");q.addEventListener("change",callback);return()=>q.removeEventListener("change",callback);}
const readMotion=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
function subscribeHeroTheme(callback:()=>void){window.addEventListener("zan-theme-change",callback);window.addEventListener("storage",callback);return()=>{window.removeEventListener("zan-theme-change",callback);window.removeEventListener("storage",callback);};}
const readHeroTheme=()=>{const value=localStorage.getItem("zan-decal-theme");return value==="light"||value==="dark"?value:"split";};
const serverHeroTheme=()=>"split" as const;

export function SplitImageHero({suspended=false,embedded=false}:{suspended?:boolean;embedded?:boolean}={}){
  const root=useRef<HTMLElement>(null);
  const layers=useRef<(HTMLDivElement|null)[]>([]);
  const elapsed=useRef(0);
  const [paused,setPaused]=useState(false);
  const [loaded,setLoaded]=useState(0);
  const loadedSources=useRef(new Set<string>());
  const selectedTheme=useSyncExternalStore(subscribeHeroTheme,readHeroTheme,serverHeroTheme);
  const {setTheme}=useTheme();
  const reduced=useSyncExternalStore(subscribeMotion,readMotion,()=>false);
  useEffect(()=>{
    if(loaded<6)return;
    let raf=0,previous=0,visible=true;
    const draw=()=>{
      const pose=splitHeroFrame(elapsed.current);
      layers.current.forEach((layer,index)=>{
        if(!layer)return;
        const incoming=index===pose.next;
        // Fade through the background, keeping both photographs on their centerline.
        // Outgoing and incoming silhouettes never overlap or slide sideways.
        layer.style.opacity=String(splitHeroOpacity(pose.progress,incoming));
        layer.style.transform="none";
        layer.style.zIndex=incoming?"2":"1";
        layer.setAttribute("aria-hidden",String(index!==(pose.progress<.5?pose.current:pose.next)));
      });
      if(root.current)root.current.dataset.vehicle=String(pose.progress<.5?pose.current:pose.next);
    };
    const tick=(time:number)=>{
      raf=0;
      if(previous)elapsed.current+=time-previous;
      previous=time;draw();
      if(visible&&!document.hidden&&!paused&&!reduced&&!suspended)raf=requestAnimationFrame(tick);
    };
    const schedule=()=>{previous=0;if(!raf&&visible&&!document.hidden&&!paused&&!reduced&&!suspended)raf=requestAnimationFrame(tick);};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0;}else schedule();});
    if(root.current)observer.observe(root.current);
    const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else schedule();};
    document.addEventListener("visibilitychange",visibility);draw();schedule();
    return()=>{observer.disconnect();cancelAnimationFrame(raf);document.removeEventListener("visibilitychange",visibility);};
  },[loaded,paused,reduced,suspended]);
  const onLoad=(src:string)=>{if(!loadedSources.current.has(src)){loadedSources.current.add(src);setLoaded(loadedSources.current.size);}};
  return <section ref={root} id={embedded?undefined:"beranda"} className="split-image-hero" data-theme-choice={selectedTheme} data-vehicle="0" aria-labelledby="split-hero-title" style={{"--split-offset":selectedTheme==="light"?"0%":selectedTheme==="dark"?"100%":"50%"} as CSSProperties}>
    <div className="split-surface split-surface-dark" aria-hidden="true"/>
    <div className="split-surface split-surface-light" aria-hidden="true"/>
    <div className="split-theme-switch" role="group" aria-label="Pilih tema website">
      <button type="button" aria-label="Tema terang, sapu ke kiri" aria-pressed={selectedTheme==="light"} onClick={()=>setTheme("light")}><Sun size={15}/><span>Light</span></button>
      <button type="button" aria-label="Tema gelap, sapu ke kanan" aria-pressed={selectedTheme==="dark"} onClick={()=>setTheme("dark")}><Moon size={15}/><span>Dark</span></button>
    </div>
    <h1 id="split-hero-title" className="split-hero-title"><span>SATU<br/>BENTUK.</span><span>BANYAK<br/>KARAKTER.</span></h1>
    <div className="split-vehicle-stage" aria-label="Kendaraan dengan karakter warna berbeda">
      {vehicles.map((vehicle,index)=>{
        const prefix=index===0?"ducati":"byd";
        return <div key={vehicle.src} ref={node=>{layers.current[index]=node;}} className={`split-vehicle-layer split-vehicle-${index===0?"motor":"car"}`} aria-hidden={index!==0} style={{opacity:index===0?1:0}}>
          <Image src={vehicle.src} alt={`${vehicle.name}, warna mengikuti pilihan tema`} fill sizes="(max-width: 760px) 94vw, 60vw" priority unoptimized onLoad={()=>onLoad(vehicle.src)}/>
          {(["light","dark"] as const).map(mode=>{const src=`/images/split-hero-${prefix}-${mode}.webp`;return <Image key={src} src={src} alt="" aria-hidden="true" className={`split-photo-theme split-photo-${mode}`} fill sizes="(max-width: 760px) 94vw, 60vw" priority unoptimized onLoad={()=>onLoad(src)}/>;})}
        </div>;
      })}
    </div>
    <div className="split-hero-footer"><p><span>01</span><i/>Kamu tentukan identitasnya.<br className="split-mobile-break"/> Kami kerjakan detailnya.</p><a href="#3d-studio">Temukan warnamu <ArrowUpRight size={18}/></a><span className="split-studio-caption">3D STUDIO</span></div>
    <div className="split-hero-meta"><span><span className="split-name-motor">DUCATI STREETFIGHTER V4 S</span><span className="split-name-car">BYD SEAL</span></span><div><button type="button" aria-label={paused?"Putar pergantian kendaraan":"Jeda pergantian kendaraan"} aria-pressed={!paused} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={12}/>:<Pause size={12}/>}<span>{paused?"Putar":"Jeda"}</span></button><a href="#3d-studio" aria-label="Lanjut ke studio"><ArrowDown size={14}/></a></div></div>
  </section>;
}
