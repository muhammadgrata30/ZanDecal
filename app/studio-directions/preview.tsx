"use client";

import {Component,useCallback,useEffect,useRef,useState,type CSSProperties,type ReactNode} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import type {StudioVehicle} from "../../components/vehiclePaint";
import type {FinishType} from "../../lib/studio-finishes";
import {STUDIO_VEHICLES} from "../../lib/studio-vehicles";
import {directions} from "./directions";
import "./studio.css";

const Scene=dynamic(()=>import("../../components/experience/MotorStudioScene"),{ssr:false,loading:()=>null});
class SceneBoundary extends Component<{children:ReactNode;fallback:ReactNode},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?this.props.fallback:this.props.children;}
}

export function StudioDirections({initialOption}:{initialOption:number}){
 const [option,setOption]=useState(initialOption),[vehicle,setVehicle]=useState<StudioVehicle>("ducati"),[color,setColor]=useState(0),[finish,setFinish]=useState<FinishType>("Glossy"),[view,setView]=useState("orbit"),[grid,setGrid]=useState(true),[resetKey,setResetKey]=useState(0),[ready,setReady]=useState(false),[mounted,setMounted]=useState(false),[active,setActive]=useState(false),[status,setStatus]=useState("");
 const stage=useRef<HTMLElement>(null),root=useRef<HTMLDivElement>(null);
 const direction=directions[option-1],paint=direction.colors[color];
 const onReady=useCallback(()=>setReady(true),[]);
 useEffect(()=>{
  const element=stage.current;if(!element)return;let visible=false;
  const update=()=>setActive(visible&&!document.hidden);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)setMounted(true);update();},{rootMargin:"160px"});
  observer.observe(element);document.addEventListener("visibilitychange",update);
  return()=>{observer.disconnect();document.removeEventListener("visibilitychange",update);};
 },[]);
 useEffect(()=>{
  let disposed=false;let cleanup:undefined|(()=>void);
  async function motion(){
   const [{gsap},{ScrollTrigger}]=await Promise.all([import("gsap"),import("gsap/ScrollTrigger")]);
   if(disposed||!root.current)return;gsap.registerPlugin(ScrollTrigger);
   const mm=gsap.matchMedia(root.current);
   mm.add("(prefers-reduced-motion:no-preference)",()=>{
    gsap.from(".sd-title-word",{yPercent:105,duration:.8,stagger:.09,ease:"power3.out",scrollTrigger:{trigger:".sd-stage",start:"top 90%",toggleActions:"play none none none"}});
    gsap.from(".sd-controller",{y:22,autoAlpha:0,duration:.65,delay:.15,ease:"power2.out",scrollTrigger:{trigger:".sd-stage",start:"top 85%",toggleActions:"play none none none"}});
    gsap.from(".sd-material-card",{y:25,duration:.7,stagger:.08,scrollTrigger:{trigger:".sd-materials",start:"top 90%",toggleActions:"play none none none"}});
   });
   cleanup=()=>mm.revert();await document.fonts.ready;if(!disposed)ScrollTrigger.refresh();
  }
  void motion().catch(()=>{});return()=>{disposed=true;cleanup?.();};
 },[option]);
 function choose(value:number){setOption(value);setColor(0);setView("orbit");setStatus("");setResetKey(v=>v+1);const url=new URL(location.href);url.searchParams.set("option",String(value));history.replaceState(history.state,"",url);}
 function chooseVehicle(value:StudioVehicle){if(value!==vehicle){setVehicle(value);setReady(false);setView("orbit");}}
 function save(){localStorage.setItem("zan-studio-direction",JSON.stringify({option,name:direction.name,vehicle,color:paint,finish}));setStatus(`${direction.name} dipilih · ${STUDIO_VEHICLES[vehicle].label} / ${paint.name} / ${finish}`);}
 const fallback=<div className="sd-fallback"><Image src={vehicle==="ducati"?"/images/split-hero-ducati.webp":"/images/split-hero-byd.webp"} width={1536} height={1024} alt="Gambar referensi kendaraan" sizes="(max-width:900px) 100vw, 70vw"/><p>Preview gambar. Renderer 3D belum tersedia di perangkat ini.</p></div>;

 return <div className={`studio-directions sd-option-${option}`} ref={root} style={{"--sd-paper":direction.paper,"--sd-ink":direction.ink,"--sd-accent":direction.accent,"--sd-contrast":direction.contrast,"--sd-stage":direction.stage,"--sd-paint":paint.hex} as CSSProperties}>
  <header className="sd-nav"><Link href="/">ZAN</Link><span>Interactive Studio / Design directions</span><a href="#arah-desain">Dasar desain ↗</a></header>
  <nav className="sd-options" aria-label="Lima mockup studio">{directions.map((item,i)=><button type="button" key={item.name} onClick={()=>choose(i+1)} aria-pressed={option===i+1}><i style={{backgroundColor:item.accent}}/><span>{item.name}</span></button>)}</nav>

  <main><section ref={stage} className="sd-stage" aria-labelledby="sd-heading">
   <header className="sd-section-heading"><h1 id="sd-heading">{direction.headline.map(line=><span className="sd-title-line" key={line}><span className="sd-title-word">{line}</span></span>)}</h1><div className="sd-heading-rule"/></header>
   <div className="sd-viewport"><div className="sd-shape" aria-hidden="true"/><div className="sd-world">
    {!ready&&<div className="sd-loading" role="status"><span/><p>Menyiapkan {STUDIO_VEHICLES[vehicle].label}…</p></div>}
    <SceneBoundary key={vehicle} fallback={fallback}>{mounted&&<Scene vehicle={vehicle} color={paint.hex} finish={finish} dark={direction.dark} active={active} view={view} grid={grid} resetKey={resetKey} background={direction.stage} gridTone={direction.contrast} onReady={onReady}/>}</SceneBoundary>
   </div><div className="sd-camera" role="group" aria-label="Sudut pandang">{[["orbit","Perspektif"],["front","Depan"],["side","Samping"]].map(([id,label])=><button type="button" key={id} aria-pressed={view===id} onClick={()=>setView(id)}>{label}</button>)}</div><div className="sd-stage-tools"><button type="button" aria-pressed={grid} onClick={()=>setGrid(value=>!value)}>Grid {grid?"on":"off"}</button><button type="button" onClick={()=>setResetKey(v=>v+1)}>Reset tampilan ↺</button></div><p className="sd-gesture">Geser untuk memutar · Cubit / Ctrl + scroll untuk zoom</p></div>

   <aside className="sd-controller"><fieldset className="sd-vehicle"><legend>Kendaraan</legend><div>{(["ducati","car"] as const).map(value=><button type="button" key={value} aria-pressed={vehicle===value} onClick={()=>chooseVehicle(value)}>{STUDIO_VEHICLES[value].label}<span aria-hidden="true">↗</span></button>)}</div></fieldset><fieldset className="sd-colour"><legend>Warna</legend><div className="sd-colour-title" aria-live="polite"><strong>{paint.name}</strong><span>{paint.hex.toUpperCase()}</span></div><div className="sd-swatches">{direction.colors.map((item,i)=><button key={item.name} type="button" onClick={()=>setColor(i)} aria-label={item.name} aria-pressed={color===i} title={item.name} style={{backgroundColor:item.hex}}><span>{color===i?"✓":""}</span></button>)}</div></fieldset><fieldset className="sd-finish"><legend>Finishing</legend><div>{([["Glossy","Gloss"],["Satin","Satin"],["Matte","Matte"],["Metallic","Metallic"]] as [FinishType,string][]).map(([id,label])=><button type="button" key={id} aria-pressed={finish===id} onClick={()=>setFinish(id)}>{label}</button>)}</div></fieldset><div className="sd-build"><span>{STUDIO_VEHICLES[vehicle].name}</span><strong>{paint.name}<br/>{finish==="Glossy"?"Gloss":finish}</strong></div><button type="button" className="sd-primary" onClick={save}>Pilih desain ini <span>↗</span></button></aside>
   <div className="sd-rail" aria-hidden="true"><span/><span/><span/><span/></div>
  </section>

  <section className="sd-materials" aria-label="Karakter material"><div className="sd-material-card sd-material-photo"><Image src="/images/workflow-install.lossless.webp" alt="Proses pemasangan vinyl di studio Zan" width={1536} height={1024} sizes="(max-width:900px) 90vw, 35vw"/><span>Dibentuk sampai detail terakhir.</span></div><div className="sd-material-card sd-paint-specimen"><div style={{backgroundColor:paint.hex}}/><h2>{paint.name}</h2><p>{finish==="Glossy"?"Pantulan tegas dengan karakter permukaan yang jernih.":finish==="Satin"?"Pantulan lembut yang tetap memperlihatkan lekukan panel.":finish==="Matte"?"Permukaan tenang dengan pantulan yang lebih tertahan.":"Karakter metalik yang berubah mengikuti arah cahaya."}</p></div><div className="sd-material-card sd-next"><h2>Bentuknya kamu.<br/>Warnanya juga.</h2><button type="button" onClick={save}>Simpan arah pilihanmu ↗</button><p>Warna layar adalah simulasi. Material dan hasil akhir dikonfirmasi bersama studio.</p></div></section>

  <section id="arah-desain" className="sd-notes"><header><h2>{direction.name}</h2><p>Mockup {option} dari 5 · {direction.short}</p></header><div className="sd-note-grid"><article><h3>Komposisi</h3><p>{direction.layout}</p></article><article><h3>Alasan palet</h3><p>{direction.why}</p></article><article><h3>Gerak & interaksi</h3><p>{direction.motion}</p></article></div><div className="sd-reference"><div><h3>Referensi Awwwards</h3><a href={direction.url} target="_blank" rel="noreferrer">{direction.source} ↗</a></div><p>{direction.evidence}</p><p>Komposisi dan palet di atas adalah rancangan khusus untuk Zan. Referensi dipakai untuk arah interaksi, bukan menyalin layout atau mengklaim penghargaan.</p></div><div className="sd-palette">{[{hex:direction.paper,name:"Bidang"},{hex:direction.ink,name:"Teks"},{hex:direction.accent,name:"Aksen"},{hex:direction.contrast,name:"Kontras"},{hex:direction.stage,name:"Panggung"}].map(item=><div key={item.name}><i style={{backgroundColor:item.hex}}/><span>{item.name}</span><code>{item.hex.toUpperCase()}</code></div>)}</div><p className="sd-preview-note">Desain baru belum mengganti halaman utama. Satu renderer dipakai untuk opsi yang sedang dilihat; model berhenti dirender saat tidak ada interaksi.</p><p className="sd-credits">Model Ducati oleh OUTPISTON dan BYD Seal oleh Ddiaz Design, CC BY-NC-SA 4.0. <a href="https://sketchfab.com/3d-models/2024-ducati-streetfighter-v4-s-c501252f8af64c559bf91dc306c3a550" target="_blank" rel="noreferrer">Ducati ↗</a> · <a href="https://sketchfab.com/3d-models/2024-byd-seal-2e82d2aaaa3d47debf39b1160d3fe376" target="_blank" rel="noreferrer">BYD ↗</a></p></section>
  </main>{status&&<div className="sd-status" role="status"><p>{status}<small>Tersimpan di browser ini. Website utama belum diganti.</small></p><button type="button" onClick={()=>setStatus("")} aria-label="Tutup pemberitahuan">×</button></div>}
 </div>;
}
