"use client";
import { useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";
function subscribeHeroTheme(callback:()=>void){window.addEventListener("zan-theme-change",callback);window.addEventListener("storage",callback);return()=>{window.removeEventListener("zan-theme-change",callback);window.removeEventListener("storage",callback);};}
const readHeroTheme=()=>{const value=localStorage.getItem("zan-decal-theme");return value==="light"||value==="dark"?value:"split";};
const serverHeroTheme=()=>"split" as const;
export function SplitImageHero({embedded=false}:{embedded?:boolean}={}){
  const selectedTheme=useSyncExternalStore(subscribeHeroTheme,readHeroTheme,serverHeroTheme);
  const {setTheme}=useTheme();
  return <section id={embedded?undefined:"beranda"} className="split-image-hero" data-theme-choice={selectedTheme} data-vehicle="0" aria-labelledby="split-hero-title" style={{"--split-offset":selectedTheme==="light"?"0%":selectedTheme==="dark"?"100%":"50%"} as CSSProperties}>
    <div className="split-surface split-surface-dark" aria-hidden="true"/><div className="split-surface split-surface-light" aria-hidden="true"/>
    <div className="split-theme-switch" role="group" aria-label="Pilih tema website"><button type="button" aria-label="Tema terang, sapu ke kiri" aria-pressed={selectedTheme==="light"} onClick={()=>setTheme("light")}><Sun size={15}/><span>Light</span></button><button type="button" aria-label="Tema gelap, sapu ke kanan" aria-pressed={selectedTheme==="dark"} onClick={()=>setTheme("dark")}><Moon size={15}/><span>Dark</span></button></div>
    <h1 id="split-hero-title" className="split-hero-title"><span>SATU<br/>BENTUK.</span><span>BANYAK<br/>KARAKTER.</span></h1>
    <div className="split-vehicle-stage" aria-label="Ducati Streetfighter dengan karakter warna berbeda"><div className="split-vehicle-layer split-vehicle-motor"><Image src="/images/split-hero-ducati.webp" alt="Ducati Streetfighter V4 S tampak depan, lavender dan putih" fill sizes="(max-width:760px) 94vw, 60vw" priority unoptimized/>{(["light","dark"] as const).map(mode=><Image key={mode} src={`/images/split-hero-ducati-${mode}.webp`} alt="" aria-hidden="true" className={`split-photo-theme split-photo-${mode}`} fill sizes="(max-width:760px) 94vw, 60vw" unoptimized/>)}</div></div>
    <div className="split-hero-footer"><p><span>01</span><i/>Kamu tentukan identitasnya.<br className="split-mobile-break"/> Kami kerjakan detailnya.</p><a href="#3d-studio">Temukan warnamu <ArrowUpRight size={18}/></a><span className="split-studio-caption">3D STUDIO</span></div>
    <div className="split-hero-meta"><span>DUCATI STREETFIGHTER V4 S</span><div><a href="#3d-studio" aria-label="Lanjut ke studio"><ArrowDown size={14}/></a></div></div>
  </section>;
}
