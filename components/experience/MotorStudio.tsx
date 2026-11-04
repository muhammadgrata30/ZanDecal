"use client";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Check, Minus, Plus } from "lucide-react";
import { useSiteContent } from "../SiteContentContext";
import { FINISH_SPECS, type FinishType } from "../../lib/studio-finishes";
import { useTheme } from "../ThemeContext";
const Scene=dynamic(()=>import("./MotorStudioScene"),{ssr:false,loading:()=>null});
class MotorBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onFailure();}
  render(){return this.state.failed?<div className="motor-loading"><p>Preview 3D belum dapat dimuat.</p><a href="#konsultasi">Konsultasikan konsep <ArrowUpRight size={16}/></a></div>:this.props.children;}
}
export function MotorStudio(){
  const root=useRef<HTMLElement>(null);
  const [mounted,setMounted]=useState(false);
  const [active,setActive]=useState(false);
  const [ready,setReady]=useState(false);
  const [colorId,setColorId]=useState("");
  const [finish,setFinish]=useState<FinishType>("Glossy");
  const [view,setView]=useState("orbit");
  const [zoom,setZoom]=useState(1);
  const {colors}=useSiteContent();
  const color=colors.find(item=>item.id===colorId)||colors[1]||colors[0];
  const {theme}=useTheme();
  const onReady=useCallback(()=>setReady(true),[]);
  useEffect(()=>{
    const element=root.current;if(!element)return;
    let visible=false;
    const update=()=>setActive(visible&&!document.hidden);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)setMounted(true);update();},{rootMargin:"180px"});
    observer.observe(element);document.addEventListener("visibilitychange",update);
    return()=>{observer.disconnect();document.removeEventListener("visibilitychange",update);};
  },[]);
  const consult=()=>{
    const message=`Halo Zan Decal, saya ingin konsultasi konsep 3D:\nKendaraan: Ducati Streetfighter V4 S\nWarna cat utama: ${color?.name||"Belum dipilih"} (${color?.hex||"#A18CD1"})\nFinishing: ${finish}`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
  };
  return <section ref={root} id="3d-studio" className="motor-studio" aria-labelledby="motor-studio-title">
    <header className="motor-studio-heading"><div><span>02 / MOTORCYCLE STUDIO</span><h2 id="motor-studio-title">Satu motor.<br/><em>Karakter pilihanmu.</em></h2></div><p>Eksplorasi warna dan finishing.<br/>Lihat detailnya dari sudut yang berbeda.</p></header>
    <div className="motor-workspace">
      <div className="motor-preview" role="group" aria-label="Preview 3D Ducati Streetfighter">
        <div className="motor-view-buttons" role="group" aria-label="Sudut kamera studio">{[["orbit","Perspektif"],["front","Depan"],["side","Samping"]].map(([id,label])=><button type="button" key={id} aria-pressed={view===id} onClick={()=>setView(id)}>{label}</button>)}</div>
        <div className="motor-canvas">{!ready&&<p className="motor-loading" role="status">Menyiapkan Ducati Streetfighter…</p>}<MotorBoundary onFailure={onReady}>{mounted&&<Scene color={color?.hex||"#A18CD1"} finish={finish} dark={theme==="dark"} active={active} view={view} zoom={zoom} onReady={onReady}/>}</MotorBoundary></div>
        <div className="motor-preview-tools"><div><button type="button" aria-label="Perkecil model" disabled={zoom<=.8} onClick={()=>setZoom(value=>Math.max(.8,value-.1))}><Minus size={17}/></button><button type="button" aria-label="Perbesar model" disabled={zoom>=1.4} onClick={()=>setZoom(value=>Math.min(1.4,value+.1))}><Plus size={17}/></button></div></div>
        <p className="motor-interaction-hint">Geser mendatar untuk memutar · Scroll vertikal untuk lanjut · Gunakan + / − untuk zoom</p>
      </div>
      <aside className="motor-settings"><span className="motor-model-label">DUCATI STREETFIGHTER V4 S</span><fieldset><legend>01 / Warna utama <strong aria-live="polite">{color?.name}</strong></legend><div className="motor-palette">{colors.map(item=><button type="button" key={item.id} aria-label={`Cat utama ${item.name}`} title={item.name} aria-pressed={color?.id===item.id} style={{backgroundColor:item.hex}} onClick={()=>setColorId(item.id)}>{color?.id===item.id&&<Check size={17}/>}</button>)}</div></fieldset><fieldset><legend>02 / Finishing</legend><div className="motor-finishes">{(Object.keys(FINISH_SPECS) as FinishType[]).map(item=><button type="button" key={item} aria-pressed={finish===item} onClick={()=>setFinish(item)}>{item}</button>)}</div></fieldset><p className="motor-summary">Pilihanmu: <strong>{color?.name} / {finish}</strong></p><button type="button" className="motor-consult" onClick={consult}>Konsultasikan konsep <ArrowUpRight size={19}/></button><small>Warna di layar merupakan simulasi. Konfirmasi hasil dan material bersama tim studio.</small></aside>
    </div>
    <p className="motor-credit">Model Ducati oleh <a href="https://sketchfab.com/3d-models/2024-ducati-streetfighter-v4-s-c501252f8af64c559bf91dc306c3a550" target="_blank" rel="noopener noreferrer">OUTPISTON</a> · CC BY-NC-SA 4.0 · Tekstur cat disesuaikan.</p>
  </section>;
}
