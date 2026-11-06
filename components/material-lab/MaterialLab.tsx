"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Asterisk, Check, Crosshair, Maximize2, Moon, Pause, Play, Plus, Sun } from "lucide-react";
import { useSiteContent } from "../SiteContentContext";
import { useTheme } from "../ThemeContext";
import type { Material } from "../../lib/content-types";

const directions=["Chromatic Atelier","Engineered Surface","The Finish Library","After Hours","Workshop Notes"];
const materialImage="/images/atelier-material.png";
const number=(value:number)=>String(value).padStart(2,"0");

function Specs({material}:{material:Material}){
  const rows=[["Jenis / seri",material.type],["Asal / produsen",material.origin],["Elastisitas",material.elongation],["Rentang suhu",material.tempRange],["Kode spesifikasi",material.specCode]].filter(([,value])=>value);
  return <dl className="ml-specs">{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function Description({material,compact=false}:{material:Material;compact?:boolean}){
  return <div className={`ml-description${compact?" is-compact":""}`}>
    {material.badge&&<span className="ml-badge">{material.badge}</span>}
    <h3>{material.name}</h3>
    {material.desc&&<p>{material.desc}</p>}
    {material.features.length>0&&<ul>{material.features.map((feature,index)=><li key={`${index}-${feature}`}><Check size={14}/><span>{feature}</span></li>)}</ul>}
    <details className="ml-detail"><summary>Lihat spesifikasi <Plus size={17}/></summary><Specs material={material}/></details>
    <Link className="ml-consult" href="/#konsultasi">Konsultasikan bahan <ArrowUpRight size={18}/></Link>
  </div>;
}

function Photo({src=materialImage,className="",alt="Gulungan vinyl lavender, biru dan coral di studio Zan Decal",position,priority=false}:{src?:string;className?:string;alt?:string;position?:string;priority?:boolean}){
  return <div className={`ml-photo ${className}`}><Image src={src} alt={alt} fill sizes="(max-width: 760px) 100vw, 70vw" priority={priority} style={{objectFit:"cover",objectPosition:position}}/><span className="ml-photo-light" aria-hidden="true"/></div>;
}

export function MaterialLab({option}:{option:number}){
  const {materials}=useSiteContent();
  const {theme,toggleTheme}=useTheme();
  const [selected,setSelected]=useState("");
  const [paused,setPaused]=useState(false);
  const [auto,setAuto]=useState(true);
  const root=useRef<HTMLElement>(null);
  const material=materials.find(item=>item.id===selected)||materials[0];
  const index=Math.max(0,materials.findIndex(item=>item.id===material?.id));
  function choose(id:string){setSelected(id);setAuto(false);}

  useEffect(()=>{
    const element=root.current;if(!element)return;
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame=0;
    const paint=()=>{frame=0;if(paused||media.matches){element.style.setProperty("--ml-scroll","0");return;}const rect=element.getBoundingClientRect();element.style.setProperty("--ml-scroll",String(Math.max(-1,Math.min(1,-rect.top/window.innerHeight))));};
    const update=()=>{if(!frame)frame=requestAnimationFrame(paint);};
    window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);media.addEventListener("change",update);update();
    return()=>{cancelAnimationFrame(frame);window.removeEventListener("scroll",update);window.removeEventListener("resize",update);media.removeEventListener("change",update);};
  },[paused]);
  useEffect(()=>{
    if(paused||!auto||materials.length<2)return;
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer=setInterval(()=>{if(document.hidden||media.matches||root.current?.contains(document.activeElement))return;setSelected(current=>{const currentIndex=Math.max(0,materials.findIndex(item=>item.id===current));return materials[(currentIndex+1)%materials.length].id;});},7000);
    return()=>clearInterval(timer);
  },[paused,auto,materials]);
  const selectors=<div className="ml-material-picker" aria-label="Pilih jenis bahan">{materials.map((item,itemIndex)=><button key={item.id} type="button" onClick={()=>choose(item.id)} aria-pressed={item.id===material?.id}><span>{number(itemIndex+1)}</span><strong>{item.name}</strong><ArrowUpRight size={16}/></button>)}</div>;
  return <main className={`material-lab ml-option-${option}${paused?" ml-paused":""}`} data-theme={theme} ref={root}>
    <header className="ml-toolbar"><Link className="ml-wordmark" href="/">ZAN<span>DECAL®</span></Link><nav aria-label="Pilihan mockup bahan">{directions.map((direction,i)=><Link key={direction} href={`/material-lab?option=${i+1}`} aria-current={option===i+1?"page":undefined}><span>{number(i+1)}</span><span>{direction}</span></Link>)}</nav><div className="ml-tools"><button type="button" aria-label={paused?"Jalankan animasi":"Jeda animasi"} aria-pressed={paused} title={paused?"Jalankan animasi":"Jeda animasi"} onClick={()=>setPaused(!paused)}>{paused?<Play size={17}/>:<Pause size={17}/>}</button><button type="button" onClick={toggleTheme} aria-label={theme==="dark"?"Gunakan tema Light":"Gunakan tema Dark"} title="Ganti tema">{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button></div></header>
    <div className="ml-study-label"><span>MATERIAL STUDIES / {number(option)}</span><span>{directions[option-1]} <ArrowDownRight size={14}/></span><span>SCROLL UNTUK EKSPLORASI <ArrowDown size={12}/></span></div>
    {!material?<section className="ml-empty"><h1>Koleksi sedang disiapkan.</h1><p>Bahan yang diterbitkan admin akan muncul di sini.</p><Link href="/">Kembali ke Zan Decal <ArrowRight size={17}/></Link></section>:<>
      {option===1&&<section className="ml-atelier ml-stage">
        <div className="ml-atelier-heading"><span className="ml-eyebrow">PILIH BAHAN. TEMUKAN KARAKTER.</span><h1>Good things<br/>start with<br/><em>the surface.</em></h1><div className="ml-atelier-note"><Asterisk className="ml-small-cross" size={44} aria-hidden="true"/><p>Warna menarik perhatian.<br/>Bahan yang tepat membuatnya bertahan.</p></div></div>
        <div className="ml-atelier-visual"><Photo priority/><div className="ml-floating-tag"><span>THE MATERIAL EDIT</span><strong>Lavender.<br/>Sky. Coral.</strong><ArrowDownRight size={24}/></div><span className="ml-image-caption">STUDI TEKSTUR / ZAN DECAL</span></div>
        <div className="ml-atelier-bottom"><div className="ml-selection-heading"><span className="ml-eyebrow">KOLEKSI BAHAN / {number(materials.length)}</span><p>Bukan sekadar warna.<br/>Pilih fondasinya.</p>{selectors}</div><div key={material.id} className="ml-material-content"><Description material={material}/></div></div>
      </section>}
      {option===2&&<section className="ml-engineering ml-stage">
        <div className="ml-tech-top"><span><Crosshair size={18}/> ZAN / MATERIAL DIVISION</span><span>VINYL · SURFACE · APPLICATION</span></div>
        <div className="ml-engineer-title"><h1>DI BALIK<br/>SETIAP <i>FINISH.</i></h1><p>Kenali apa yang menempel<br/>pada kendaraanmu.<br/><span>Material terpilih. Detail terbuka.</span></p></div>
        <div className="ml-inspection"><Photo priority/><div className="ml-scan-line" aria-hidden="true"/><div className="ml-inspection-top"><span><Crosshair size={15}/> SURFACE INSPECTION</span><span>LIVE / MATERIAL {number(index+1)}</span></div><span className="ml-inspection-marker"><Plus size={25}/> TEKSTUR & FINISHING</span><div className="ml-inspection-caption"><strong>{material.type||"Pilihan vinyl studio"}</strong><span>{material.origin}</span></div></div>
        <div className="ml-engineering-bottom"><div><span className="ml-eyebrow">PILIH MATERIAL UNTUK DITELUSURI</span>{selectors}</div><div key={material.id} className="ml-material-content"><Description material={material}/></div></div>
      </section>}
      {option===3&&<section className="ml-library ml-stage">
        <div className="ml-library-title"><span className="ml-eyebrow">THE FINISH LIBRARY / ZAN DECAL</span><h1>A little colour.<br/><em>A lot of character.</em></h1><p>Setiap pilihan punya cerita.<br/>Mulai dari bahan yang kamu percaya.</p></div>
        <div className="ml-library-shelf">{materials.map((item,i)=><button type="button" key={item.id} onClick={()=>choose(item.id)} aria-pressed={material.id===item.id} style={{"--ml-card-index":i%3} as CSSProperties}><div className="ml-shelf-image"><Photo position={`${i%3*50}% center`}/><span>{number(i+1)}.</span><ArrowUpRight size={25}/></div><div className="ml-shelf-label"><span>{item.origin||"PILIHAN STUDIO"}</span><h2>{item.name}</h2><p>{item.type}</p></div></button>)}</div>
        <div className="ml-library-detail"><span className="ml-editorial-number">{number(index+1)}<small>/ THE SELECTED MATERIAL</small></span><div key={material.id} className="ml-material-content"><Description material={material}/></div></div>
      </section>}
      {option===4&&<section className="ml-afterhours ml-stage">
        <div className="ml-night-intro"><span className="ml-eyebrow">AFTER HOURS / MATERIAL COLLECTION</span><h1>LET THE<br/><em>SURFACE</em><br/>DO THE TALKING.</h1><p>Untuk tampilan yang terasa berbeda,<br/>bahkan sebelum mesin dinyalakan.</p></div>
        <div className="ml-night-visual"><Photo src="/images/consultation-vinyl.png" alt="Studi visual vinyl lavender dan bodi mobil hitam" priority/><span className="ml-night-vertical">ZAN DECAL — SURFACE CULTURE</span><div className="ml-night-stamp"><Maximize2 size={20}/><span>IT STARTS<br/>WITH THE MATERIAL.</span></div></div>
        <div className="ml-night-catalog"><div><span className="ml-eyebrow">EXPLORE THE COLLECTION</span>{selectors}<span className="ml-night-counter">{number(index+1)}<small>/{number(materials.length)}</small></span></div><div key={material.id} className="ml-material-content"><Description material={material}/></div></div>
      </section>}
      {option===5&&<section className="ml-workbench ml-stage">
        <div className="ml-work-title"><div><span className="ml-eyebrow">DARI MEJA KERJA ZAN DECAL</span><h1>BAHAN BAGUS.<br/>TANGAN <em>TEPAT.</em></h1></div><p>Kenali bahannya.<br/>Lihat detailnya.<br/>Bicarakan hasil yang kamu mau.</p></div>
        <div className="ml-work-grid"><div className="ml-work-list"><div className="ml-work-list-title"><span>CATATAN MATERIAL</span><span>{number(materials.length)} PILIHAN</span></div>{materials.map((item,i)=><article key={item.id} className={item.id===material.id?"is-open":""}><h2><button type="button" aria-expanded={item.id===material.id} aria-controls={`work-material-${item.id}`} onClick={()=>choose(item.id)}><span>{number(i+1)}</span>{item.name}<Plus size={20}/></button></h2>{item.id===material.id&&<div id={`work-material-${item.id}`} className="ml-work-expanded"><Description material={item} compact/></div>}</article>)}</div><div className="ml-work-scene"><Photo src="/images/workflow-install.png" alt="Teknisi memasang vinyl lavender pada kap mobil dengan squeegee" priority/><div className="ml-work-photo-footer"><span>01 / IN THE WORKSHOP</span><ArrowDownRight size={24}/></div><span className="ml-work-caption">Pilihan yang tepat dimulai sebelum pemasangan.</span><div className="ml-work-ticket"><span>MATERIAL NOTE / {number(index+1)}</span><strong>{material.specCode||material.type||material.name}</strong><span>{material.origin||"Zan Decal Studio"}</span></div></div></div>
      </section>}
      <section className="ml-next"><span className="ml-eyebrow">DARI BAHAN KE HASIL AKHIR</span><div><h2>Sudah tahu<br/><em>karakter yang kamu mau?</em></h2><Link href="/#konsultasi" aria-label="Konsultasikan proyek dengan Zan Decal"><ArrowUpRight size={36}/></Link></div><footer><span>ZAN DECAL / MATERIAL STUDIES {number(option)}</span><span>{auto&&!paused?"Pilihan bahan berganti setiap 7 detik · Klik bahan untuk menahan pilihan":"Pilih bahan untuk mengeksplorasi detail"}</span><Link href="/">Kembali ke website <ArrowRight size={14}/></Link></footer></section>
    </>}
  </main>;
}
