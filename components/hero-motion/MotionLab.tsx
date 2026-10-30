"use client";

import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Pause, Play, RotateCcw, X } from "lucide-react";
import { useTheme } from "../ThemeContext";
import { ThemeToggle } from "../ThemeToggle";
import { DECAL_COLORS } from "../DecalVisualizer3D";
import { clamp01 } from "../experience/journeyMath";
import { heroMotion } from "./motionMath";

const Scene = dynamic(() => import("./MotionScene"), {ssr:false});
function subscribe(callback: () => void) { const query=matchMedia("(prefers-reduced-motion: reduce)");query.addEventListener("change",callback);return()=>query.removeEventListener("change",callback); }
const readMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed ? <div className="hm-error">Preview 3D gagal dimuat. <button type="button" onClick={()=>location.reload()}>Coba muat ulang</button></div> : this.props.children;}
}

export function MotionLab({option}:{option:1|3}) {
  const {theme}=useTheme();
  const root=useRef<HTMLDivElement>(null);
  const scroll=useRef(0);
  const pointer=useRef({x:0,y:0});
  const original=useRef<HTMLDialogElement>(null);
  const [paused,setPaused]=useState(false);
  const [replay,setReplay]=useState(0);
  const [ready,setReady]=useState(false);
  const [active,setActive]=useState(true);
  const [color,setColor]=useState(DECAL_COLORS[1]);
  const reduced=useSyncExternalStore(subscribe,readMotion,()=>false);
  const onReady=useCallback(()=>setReady(true),[]);
  useEffect(()=>{
    const element=root.current;
    if(!element)return;
    const heroCopy=element.querySelector<HTMLElement>(".hm-copy");
    const detailCopy=element.querySelector<HTMLElement>(".hm-scroll-copy");
    let frame=0,visible=true,last=0;
    const tick=(time:number)=>{
      frame=0;
      const rect=element.getBoundingClientRect();
      const target=reduced?0:clamp01(-rect.top/Math.max(1,element.offsetHeight-innerHeight));
      const dt=Math.min((time-(last||time-16))/1000,.05);last=time;
      scroll.current+=(target-scroll.current)*(1-Math.exp(-dt*11));
      if(Math.abs(target-scroll.current)<.0001)scroll.current=target;
      const pose=heroMotion(option,3,scroll.current);
      element.dataset.phase=scroll.current>.48?"detail":"hero";
      if(heroCopy)heroCopy.inert=pose.copy<.05;
      if(detailCopy)detailCopy.inert=pose.reveal<.05;
      element.style.setProperty("--hm-copy",String(pose.copy));
      element.style.setProperty("--hm-progress",String(scroll.current));
      element.style.setProperty("--hm-reveal",String(pose.reveal));
      element.style.setProperty("--hm-shift",`${-scroll.current*65}px`);
      if(visible&&scroll.current!==target)frame=requestAnimationFrame(tick);
    };
    const schedule=()=>{if(!frame&&visible){last=0;frame=requestAnimationFrame(tick);}};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;setActive(visible&&!document.hidden);if(visible)schedule();});
    observer.observe(element);
    const visibility=()=>{setActive(visible&&!document.hidden);if(!document.hidden)schedule();};
    addEventListener("scroll",schedule,{passive:true});addEventListener("resize",schedule);document.addEventListener("visibilitychange",visibility);schedule();
    return()=>{observer.disconnect();cancelAnimationFrame(frame);removeEventListener("scroll",schedule);removeEventListener("resize",schedule);document.removeEventListener("visibilitychange",visibility);};
  },[option,reduced]);
  const restart=()=>{setReplay(value=>value+1);window.scrollTo({top:0,behavior:reduced?"instant":"smooth"});};
  return <main className={`hm-lab hm-option-${option}${paused?" hm-paused":""}`}>
    <div className="hm-toolbar"><Link prefetch={false} href="/design-preview/hero-v5.html">Semua mockup</Link><div><Link prefetch={false} href="/hero-motion?option=1" aria-current={option===1?"page":undefined}>01 / Concrete Dawn</Link><Link prefetch={false} href="/hero-motion?option=3" aria-current={option===3?"page":undefined}>03 / Precision Index</Link></div><button type="button" onClick={()=>original.current?.showModal()}>Lihat mockup asli</button></div>
    <div ref={root} className="hm-runway" data-active={active} onPointerMove={event=>{pointer.current={x:event.clientX/innerWidth*2-1,y:event.clientY/innerHeight*2-1};}} onPointerLeave={()=>{pointer.current={x:0,y:0};}}>
      <div className="hm-pin">
        <header className="hm-nav"><Link prefetch={false} className="hm-brand" href="/">ZAN DECAL</Link><nav aria-label="Navigasi preview"><Link prefetch={false} href="/#3d-studio">Studio</Link><Link prefetch={false} href="/#galeri">Karya</Link><Link prefetch={false} href="/#konsultasi">Konsultasi</Link><ThemeToggle/></nav></header>
        <div className="hm-canvas"><SceneBoundary><Scene option={option} scroll={scroll} pointer={pointer} color={color.hex} dark={theme==="dark"} paused={paused} reduced={reduced} active={active} replay={replay} onReady={onReady}/></SceneBoundary></div>
        {!ready&&<div className="hm-loading" role="status">Menyiapkan Ducati 3D…</div>}
        <section className="hm-copy" aria-label="Hero concept">
          {option===1?<><span className="hm-eyebrow">AUTOMOTIVE EXPRESSION / ZAN DECAL</span><h1><span>KARAKTER</span><span>TANPA BATAS.</span></h1><p>Custom wrap & decal.<br/>Dibentuk untuk jadi milikmu.</p></>:<><span className="hm-eyebrow">PRECISION INDEX / COLOUR STUDY</span><h1><span>PRESISI.</span><em>Punya<br/>karakter.</em></h1><p>Dari detail kecil,<br/>lahir identitas yang berbeda.</p></>}
          <Link prefetch={false} href="/#3d-studio" className="hm-cta">{option===1?"Masuki 3D Studio":"Rancang di 3D Studio"}<ArrowUpRight size={21}/></Link>
        </section>
        <div className="hm-color-picker" role="group" aria-label="Warna cat utama">{DECAL_COLORS.slice(0,6).map(item=><button key={item.hex} type="button" title={item.name} aria-label={item.name} aria-pressed={color.hex===item.hex} style={{backgroundColor:item.hex}} onClick={()=>setColor(item)}/>)}<span aria-live="polite">{color.name}</span></div>
        {option===3&&<div className="hm-wordmark" aria-hidden="true">ZAN / DECAL</div>}
        <div className="hm-scroll-copy"><span>DESIGNED IN DETAIL.</span><strong>{option===1?"Jalanmu. Identitasmu.":"Setiap sudut, sebuah karakter."}</strong><Link prefetch={false} href="/#3d-studio">Lanjut ke studio <ArrowUpRight size={18}/></Link></div>
        <div className="hm-bottom"><span>DUCATI STREETFIGHTER / COLOUR IN MOTION</span><span>SCROLL TO EXPLORE <ArrowDown size={15}/></span></div>
        <div className="hm-progress" aria-hidden="true"><i/></div>
        <div className="hm-playback"><button type="button" onClick={()=>setPaused(value=>!value)} aria-pressed={!paused}>{paused?<Play size={15}/>:<Pause size={15}/>} {paused?"Putar":"Jeda"}</button><button type="button" onClick={restart}><RotateCcw size={15}/> Ulangi</button></div>
      </div>
    </div>
    <section className="hm-after"><span>EXPLORATION / {option===1?"01":"03"}</span><h2>{option===1?"Ruang, gerak, karakter.":"Presisi yang bisa kamu rasakan."}</h2><p>{option===1?"Kendaraan masuk dengan laju nyata. Scroll menggerakkan kamera dan membuka komposisi berikutnya.":"Kamera bergerak dari studi bentuk ke sudut pandang yang lebih dekat. Garis ukur, pemindaian cahaya, dan pilihan cat membangun karakter studio desain."}</p><div><Link prefetch={false} href={option===1?"/hero-motion?option=3":"/hero-motion?option=1"}>Bandingkan opsi {option===1?"3":"1"} <ArrowUpRight size={18}/></Link><Link prefetch={false} href="/">Kembali ke website <ArrowUpRight size={18}/></Link></div><small>Model Ducati oleh <Link prefetch={false} href="https://sketchfab.com/3d-models/2024-ducati-streetfighter-v4-s-c501252f8af64c559bf91dc306c3a550">OUTPISTON</Link> · CC BY-NC-SA 4.0 · Warna disesuaikan.</small></section>
    <dialog ref={original} className="hm-reference"><button type="button" onClick={()=>original.current?.close()} aria-label="Tutup mockup"><X/></button><Image src={`/design-preview/hero-v5-${option}.png`} width={1536} height={1024} alt={`Mockup asli opsi ${option}`} unoptimized/></dialog>
  </main>;
}
