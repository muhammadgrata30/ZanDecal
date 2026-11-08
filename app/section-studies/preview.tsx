"use client";

import {useEffect,useRef,useState,type CSSProperties,type FormEvent} from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {commissions,footers,presets,references,studios} from "./data";
import "./studies.css";

const LiveStudio=dynamic(()=>import("../../components/experience/MotorStudio").then(m=>m.MotorStudio),{ssr:false,loading:()=> <p className="live-loading">Menyiapkan studio 3D asli…</p>});
const swatches=[{name:"Glacier Cyan",hex:"#6fbcd3"},{name:"Dust Lavender",hex:"#a18cd1"},{name:"Pearl White",hex:"#e5e2dc"},{name:"Graphite",hex:"#40424b"},{name:"Burgundy",hex:"#773c51"},{name:"Moss",hex:"#73816e"}];
type Selection={s:number;c:number;f:number};

function Title({lines}:{lines:string[]}){return <h2 className="study-title">{lines.map(line=><span className="study-line" key={line}><span className="study-word">{line}</span></span>)}</h2>;}
function Source({index}:{index:number}){const source=references[index];return <a className="study-source" href={source.url} target="_blank" rel="noreferrer">Inspirasi / {source.name} ↗</a>;}
function Bridge(){return <div className="study-bridge" aria-hidden="true"><svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M-120 100Q350-100 770 60T1600 10"/><path d="M-120 115Q350-85 770 75T1600 25"/><path d="M-120 130Q350-70 770 90T1600 40"/></svg><span>FROM A COLOUR / TO A CHARACTER</span></div>;}

export function SectionStudies({initialPreset}:{initialPreset:number}){
 const initial=presets[initialPreset-1];
 const [selection,setSelection]=useState<Selection>({s:initial.s,c:initial.c,f:initial.f});
 const [preset,setPreset]=useState(initialPreset),[vehicle,setVehicle]=useState("motor"),[swatch,setSwatch]=useState(1),[finish,setFinish]=useState("Gloss"),[live,setLive]=useState(false);
 const [service,setService]=useState("Custom decal"),[brief,setBrief]=useState(""),[status,setStatus]=useState(""),[motion,setMotion]=useState("Menyiapkan GSAP"),[saved,setSaved]=useState<Partial<Selection>>({});
 const root=useRef<HTMLDivElement>(null);
 const s=studios[selection.s-1],c=commissions[selection.c-1],f=footers[selection.f-1];

 useEffect(()=>{
  const stored=localStorage.getItem("zan-section-study-picks");
  if(stored){try{const value=JSON.parse(stored);requestAnimationFrame(()=>setSaved(value));}catch{localStorage.removeItem("zan-section-study-picks");}}
 },[]);

 useEffect(()=>{
  let cancelled=false;
  let cleanup:undefined|(()=>void);
  async function mount(){
   try{
    const [{gsap},{ScrollTrigger}]=await Promise.all([import("gsap"),import("gsap/ScrollTrigger")]);
    if(cancelled||!root.current)return;
    gsap.registerPlugin(ScrollTrigger);
    const mm=gsap.matchMedia();
    const context=gsap.context(()=>{
     mm.add("(prefers-reduced-motion: no-preference)",()=>{
      const sections=gsap.utils.toArray<HTMLElement>(".motion-section");
      sections.forEach(section=>{
       const words=section.querySelectorAll(".study-word");
       gsap.from(words,{yPercent:112,rotate:selection.s===2?3:0,stagger:.12,ease:"power3.out",scrollTrigger:{trigger:section,start:"top 88%",end:"top 32%",scrub:1}});
       gsap.from(section.querySelectorAll("[data-reveal]"),{y:38,autoAlpha:0,stagger:.09,ease:"power2.out",scrollTrigger:{trigger:section,start:"top 72%",end:"top 12%",scrub:.7}});
      });
      const image=root.current!.querySelector(".studio-visual");
      gsap.fromTo(image,{scale:selection.s===3?1.3:1.08,xPercent:selection.s===2?-10:selection.s===5?8:0},{scale:1,yPercent:-5,xPercent:0,ease:"none",scrollTrigger:{trigger:".studio-section",start:"top bottom",end:"bottom top",scrub:1}});
      gsap.fromTo(".studio-index",{y:80},{y:-65,ease:"none",scrollTrigger:{trigger:".studio-section",start:"top bottom",end:"bottom top",scrub:true}});
      gsap.from(".studio-ruler",{scaleX:0,transformOrigin:"left",scrollTrigger:{trigger:".studio-section",start:"top 70%",end:"top 10%",scrub:1}});
      gsap.from(".swatch-sheet",{y:90,rotate:0,stagger:.09,scrollTrigger:{trigger:".studio-section",start:"top 80%",end:"top 0%",scrub:1}});
      gsap.fromTo(".commission-visual img",{scale:1.2,yPercent:5},{scale:1.02,yPercent:-7,ease:"none",scrollTrigger:{trigger:".commission-section",start:"top bottom",end:"bottom top",scrub:1}});
      gsap.from(".commission-visual",{clipPath:selection.c===5?"inset(0 49% 0 49%)":"inset(0 100% 0 0)",ease:"power2.out",scrollTrigger:{trigger:".commission-section",start:"top 85%",end:"top 25%",scrub:1}});
      gsap.from(".commission-form fieldset",{y:40,autoAlpha:0,stagger:.1,scrollTrigger:{trigger:".commission-form",start:"top 90%",end:"top 30%",scrub:.6}});
      gsap.from(".foot-mark span",{yPercent:100,rotate:selection.f===4?-3:0,stagger:.04,ease:"power3.out",scrollTrigger:{trigger:".study-footer",start:"top 85%",end:"bottom bottom",scrub:1}});
      if(root.current!.querySelector(".footer-frame img"))gsap.fromTo(".footer-frame img",{scale:1.15,yPercent:7},{scale:1,yPercent:-7,scrollTrigger:{trigger:".study-footer",start:"top bottom",end:"bottom top",scrub:1}});
      if(root.current!.querySelector(".footer-cut-line"))gsap.fromTo(".footer-cut-line",{strokeDashoffset:1},{strokeDashoffset:0,scrollTrigger:{trigger:".study-footer",start:"top 90%",end:"top 5%",scrub:1}});
      gsap.to(".study-bridge svg",{xPercent:18,ease:"none",scrollTrigger:{trigger:".study-bridge",start:"top bottom",end:"bottom top",scrub:true}});
     });
     mm.add("(min-width: 1000px) and (prefers-reduced-motion: no-preference)",()=>{
      if(selection.s===1||selection.s===2||selection.s===4){ScrollTrigger.create({trigger:".studio-section",start:"top 88px",end:()=>`+=${Math.min(innerHeight*.65,600)}`,pin:".stage-shell",pinSpacing:true,invalidateOnRefresh:true});}
     });
    },root);
    cleanup=()=>{mm.revert();context.revert();};
    setMotion(matchMedia("(prefers-reduced-motion: reduce)").matches?"Reduced motion / tampilan statis":"GSAP + ScrollTrigger aktif");
    await document.fonts.ready;
    if(!cancelled)ScrollTrigger.refresh();
   }catch{if(!cancelled)setMotion("Tampilan statis / animasi belum tersedia");}
  }
  void mount();
  return()=>{cancelled=true;cleanup?.();};
 },[selection.s,selection.c,selection.f,live]);

 function chooseSet(index:number){const p=presets[index];setPreset(index+1);setSelection({s:p.s,c:p.c,f:p.f});setLive(false);setBrief("");history.replaceState(null,"",`?set=${index+1}`);}
 function changeSection(key:keyof Selection,value:number){setSelection(current=>({...current,[key]:value}));setLive(false);setPreset(0);setBrief("");}
 function keep(key:keyof Selection){const next={...saved,[key]:selection[key]};setSaved(next);localStorage.setItem("zan-section-study-picks",JSON.stringify(next));setStatus(`Pilihan ${key==="s"?"Studio":key==="c"?"Komisi":"Footer"} ${selection[key]} tersimpan di browser ini.`);}
 function review(event:FormEvent<HTMLFormElement>){event.preventDefault();const data=new FormData(event.currentTarget);setBrief(`Kendaraan: ${data.get("kendaraan")}\nLayanan: ${service}\nWarna konsep: ${swatches[swatch].name}\nFinishing: ${finish}\nArah desain: ${data.get("arah")}\nCatatan: ${data.get("catatan")||"Belum ada"}`);}

 return <div ref={root} className="section-studies" style={{"--concept":swatches[swatch].hex} as CSSProperties}>
  <header className="study-nav"><Link href="/" aria-label="Kembali ke website Zan">ZAN<span> / SECTION STUDIES</span></Link><nav aria-label="Navigasi mockup"><a href="#pilihan">10 mockup</a><a href="#studio-study">Studio</a><a href="#komisi-study">Komisi</a><a href="#footer-study">Footer</a><a href="#catatan-study">Detail & sumber ↗</a></nav></header>
  <section className="study-intro" id="pilihan"><span className="study-kicker">DESIGN DIRECTIONS / 2026 / VOL. II</span><h1>BUKAN SEKADAR<br/>BAGIAN BAWAH<span>↘</span></h1><div className="intro-bottom"><p>Studio untuk mencoba. Brief untuk memulai.<br/>Penutup yang masih punya sesuatu untuk dikatakan.</p><p>10 kombinasi • 5 opsi setiap section<br/><span>{motion}</span></p></div>
   <div className="preset-grid">{presets.map((p,i)=><button key={p.name} onClick={()=>chooseSet(i)} aria-pressed={preset===i+1}><span className={`preset-art preset-art-${p.s}`}><i/><i/><i/><b>{String(i+1).padStart(2,"0")}</b></span><strong>{p.name}</strong><small>STUDIO {p.s} / KOMISI {p.c} / FOOTER {p.f}</small></button>)}</div>
   <div className="section-picker">{([["s","Interactive Studio",studios],["c","Komisi Baru",commissions],["f","Footer",footers]] as const).map(([key,label,items])=><label key={key}>{label}<select value={selection[key]} onChange={e=>changeSection(key,Number(e.target.value))}>{items.map((item,i)=><option key={item.name} value={i+1}>0{i+1} / {item.name}</option>)}</select></label>)}<a href="#studio-study">Coba saat scroll ↓</a></div>
  </section>

  <section id="studio-study" className={`studio-section motion-section studio-v${selection.s}`} key={`studio-${selection.s}`}>
   <div className="stage-shell"><header className="section-eyebrow"><span>02 / INTERACTIVE STUDIO</span><span>CONCEPT 0{selection.s} — {s.name}</span></header>
    <div className="studio-body"><div className="studio-copy"><span className="study-kicker">COLOUR / MATERIAL / CHARACTER</span><Title lines={s.title}/><p className="studio-description" data-reveal>Jelajahi arah warna dan finishing.<br/>Temukan karakter sebelum mulai mengerjakan.</p><Source index={s.ref}/></div>
     <div className="studio-image-area"><div className="studio-orbit"/><div className="studio-index">0{selection.s}</div><div className="studio-sheets">{[0,1,2,3].map(i=><i className="swatch-sheet" key={i} style={{"--sheet":swatches[i].hex,"--n":i} as CSSProperties}/>)}</div><figure className="studio-visual"><Image src={vehicle==="motor"?"/images/sticker-motor.png":"/images/gallery-ferrari-magenta.lossless.webp"} alt={vehicle==="motor"?"Referensi komposisi livery motor lavender":"Referensi komposisi livery mobil magenta"} width={1536} height={1024} sizes="(max-width:999px) 95vw, 65vw"/><figcaption>VISUAL KONSEP / {vehicle==="motor"?"MOTOR":"MOBIL"}<span>Gambar referensi • buka studio untuk simulasi 3D</span></figcaption></figure><div className="studio-ruler"><span>← DETAIL MAKES THE DIFFERENCE →</span></div></div>
     <aside className="studio-console" data-reveal><div className="console-top"><span>YOUR BUILD</span><b>0{selection.s} / ZAN</b></div><div className="study-tabs" role="group" aria-label="Jenis visual kendaraan">{["motor","mobil"].map(v=><button key={v} aria-pressed={vehicle===v} onClick={()=>setVehicle(v)}>{v}</button>)}</div><fieldset><legend>01 / WARNA KONSEP</legend><div className="study-swatches">{swatches.map((color,i)=><button key={color.name} aria-label={color.name} aria-pressed={swatch===i} onClick={()=>setSwatch(i)} style={{backgroundColor:color.hex}}>{swatch===i?"↗":""}</button>)}</div><p>{swatches[swatch].name} <span>{swatches[swatch].hex.toUpperCase()}</span></p></fieldset><fieldset><legend>02 / FINISHING</legend><div className="study-tabs">{["Gloss","Satin","Matte"].map(v=><button key={v} aria-pressed={finish===v} onClick={()=>setFinish(v)}>{v}</button>)}</div></fieldset><dl><div><dt>Karakter pantulan</dt><dd>{finish==="Gloss"?"Tajam":finish==="Satin"?"Lembut":"Tenang"}</dd></div><div><dt>Konsep pilihan</dt><dd>{swatches[swatch].name}</dd></div></dl><button className="study-action" onClick={()=>setLive(v=>!v)}>{live?"Tutup studio asli":"Buka studio 3D asli"}<span>↗</span></button><small>Swatch mengubah aksen konsep. Simulasi cat kendaraan ada di studio 3D asli.</small></aside>
    </div><div className="studio-bottom" data-reveal><span>01 / PILIH BENTUK</span><span>02 / TEMUKAN WARNA</span><span>03 / SUSUN KARAKTER</span><button onClick={()=>keep("s")}>Pilih studio ini ↗</button></div>
   </div>
  </section>
  {live&&<div className="live-studio-host"><p>STUDIO 3D PROYEK ASLI / KONTROL WARNA DAN KAMERA</p><LiveStudio/></div>}
  <Bridge/>

  <section id="komisi-study" className={`commission-section motion-section commission-v${selection.c}`} key={`commission-${selection.c}`}><header className="section-eyebrow"><span>07 / KOMISI BARU</span><span>CONCEPT 0{selection.c} — {c.name}</span></header><div className="commission-lead"><div className="commission-copy"><span className="study-kicker">YOUR NEXT CHAPTER STARTS HERE</span><Title lines={c.title}/><p data-reveal>Mulai dari kendaraanmu, satu referensi,<br/>atau warna yang terus kepikiran.</p><Source index={c.ref}/><button className="pick-inline" onClick={()=>keep("c")}>Pilih komisi ini ↗</button></div><figure className="commission-visual"><Image src={selection.c===4?"/images/workflow-install.lossless.webp":"/images/consultation-vinyl.lossless.webp"} alt={selection.c===4?"Detail proses pemasangan vinyl kendaraan":"Vinyl lavender dengan refleksi kendaraan sebagai arah material"} width={1536} height={1024} sizes="(max-width:999px) 100vw, 60vw"/><figcaption>IDE / MATERIAL / TEKNIK / KARAKTER</figcaption></figure><div className="commission-note" data-reveal><b>SEBELUM MULAI.</b><p>Warna di layar adalah arah awal.<br/>Material dan hasil akhir dibahas bersama studio.</p></div></div>
   <div className="commission-process" data-reveal>{[["01","Ceritakan kendaraan","Model, pemakaian, dan karakter yang kamu cari."],["02","Susun arah desain","Layanan, bahan, warna, serta referensi visual."],["03","Tinjau bersama","Periksa brief sebelum menghubungi studio."]].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
   <form className="commission-form" onSubmit={review}><div className="form-heading"><span className="study-kicker">A SHORT BRIEF. A CLEAR DIRECTION.</span><h3>MULAI DARI<br/>KENDARAANMU.</h3><p>Isi contoh brief ini untuk mencoba alurnya. Data tetap di halaman mockup.</p></div><fieldset><legend>01 / KENDARAAN</legend><label>Merek & model<input name="kendaraan" required placeholder="Contoh: Ducati Streetfighter V4 S"/></label><label>Karakter yang dicari<select name="arah"><option>Berani dan tegas</option><option>Tenang dan bersih</option><option>Racing dan ekspresif</option><option>Masih mencari arah</option></select></label></fieldset><fieldset><legend>02 / LAYANAN & IDE</legend><div className="service-options">{["Custom decal","Full wrap","Cutting sticker"].map(v=><button type="button" key={v} aria-pressed={service===v} onClick={()=>setService(v)}>{v}</button>)}</div><label>Referensi atau catatan<textarea name="catatan" rows={3} placeholder="Warna, penggunaan kendaraan, atau detail yang penting buatmu."/></label></fieldset><div className="form-submit"><p><b>{swatches[swatch].name} / {finish}</b><br/>Warna konsep dari studio pilihanmu.</p><button className="study-action" type="submit">Tinjau brief<span>↗</span></button><small>Preview lokal. Tidak mengirim pesan atau membuat pesanan.</small></div>{brief&&<output className="brief-preview"><b>BRIEF KAMU</b><pre>{brief}</pre><button type="button" onClick={()=>setBrief("")}>Kembali mengedit ↑</button></output>}</form>
  </section>

  <footer id="footer-study" className={`study-footer motion-section footer-v${selection.f}`} key={`footer-${selection.f}`}><div className="footer-topline"><span>ZAN / AUTOMOTIVE SURFACE STUDIO</span><button onClick={()=>keep("f")}>Pilih footer ini ↗</button></div>{selection.f===3&&<figure className="footer-frame"><Image src="/images/gallery-yamaha-r1-blue.lossless.webp" alt="Livery motor cyan sebagai penutup visual" width={1536} height={1024} sizes="100vw"/></figure>}{selection.f===4&&<svg className="footer-cut" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true"><path className="footer-cut-line" pathLength="1" d="M-20 480L250 140L600 200L930 80L1480 310"/></svg>}<div className="footer-invitation"><Title lines={[f.title]}/><a href="#komisi-study" className="footer-round" aria-label="Mulai konsultasi">↗</a></div><div className="study-footer-columns" data-reveal><div><span>BUKAN WARNA BAWAAN.</span><p>Decal, wrapping, dan potongan presisi.<br/>Dari ide di kepala sampai karakter di jalan.</p><Source index={f.ref}/></div><nav aria-label="Eksplorasi mockup"><h3>EKSPLORASI</h3><a href="#studio-study">Interactive Studio ↗</a><a href="#komisi-study">Mulai komisi ↗</a><a href="#catatan-study">Catatan desain ↗</a></nav><div><h3>SEBELUM KE STUDIO</h3><p>Siapkan model kendaraan,<br/>arah warna, dan referensi.<br/>Detail pengerjaan dibahas bersama.</p><Link href="/#konsultasi">Konsultasi di website utama ↗</Link></div></div><div className="foot-mark" aria-label="ZAN DECAL">{"ZAN DECAL".split("").map((letter,i)=><span key={i} aria-hidden="true">{letter===" "?"\u00a0":letter}</span>)}</div><div className="footer-base"><span>© 2026 ZAN DECAL / DESIGN STUDY</span><span>WRAP. PERSONAL EXPRESSION.</span><a href="#pilihan">Ke pilihan mockup ↑</a></div></footer>

  <section id="catatan-study" className="study-notes"><span className="study-kicker">DETAIL PER SECTION / SUMBER & PILIHAN</span><h2>APA YANG BERUBAH.<br/>KENAPA BERGERAK.</h2><p>Ini adaptasi desain untuk Zan, bukan salinan situs referensi. Sumber Awwwards di bawah mendukung arah interaksi; komposisi, isi, dan animasi mockup dibuat khusus untuk proyek ini.</p><div className="notes-columns">{[["Studio",s],["Komisi Baru",c],["Footer",f]].map(([label,item])=>typeof item!=="string"&&<article key={label as string}><span>{label as string}</span><h3>{item.name}</h3><p>{item.desc}</p><b>GERAK SAAT SCROLL</b><p>{item.motion}</p><b>DETAIL ISI</b><p>{item.detail}</p><Source index={item.ref}/></article>)}</div><div className="source-grid">{references.map(source=><article key={source.name}><a href={source.url} target="_blank" rel="noreferrer">{source.name} / Awwwards ↗</a><p>{source.evidence}</p><p><b>Adaptasi Zan:</b> {source.adaptation}</p></article>)}</div><div className="saved-picks"><h3>PILIHAN YANG DISIMPAN</h3><p>Studio {saved.s??"—"} / Komisi {saved.c??"—"} / Footer {saved.f??"—"}</p><p>Kamu bisa mencampur opsi tiap section melalui dropdown di atas. Pilihan disimpan di browser ini; halaman utama belum diganti.</p></div></section><div role="status" className="study-toast" hidden={!status}>{status}<button onClick={()=>setStatus("")} aria-label="Tutup pemberitahuan">×</button></div>
 </div>;
}
