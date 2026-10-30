
"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MotionHead, ScrollStage } from "./ScrollStage";
import { TransitionVeil } from "./experience/SectionTransitions";

import { ArrowUpRight, X, CheckCircle2, Send, Pause, Play } from "lucide-react";

import { useSiteContent } from "./SiteContentContext";
import type { Portfolio as PortfolioItem } from "../lib/content-types";

// Public gallery reads the same persisted portfolio that the admin edits.
export function GallerySection({ showcaseVideoSrc: suppliedVideo, showcasePoster: suppliedPoster }: { showcaseVideoSrc?: string; showcasePoster?: string }) {
  const content=useSiteContent();
  const showcaseVideoSrc=suppliedVideo ?? content.showcaseVideo;
  const showcasePoster=suppliedPoster ?? content.showcasePoster;
  const showcaseVideo=useRef<HTMLVideoElement>(null);
  const userPausedVideo=useRef(false);
  const [videoPaused,setVideoPaused]=useState(true);
  const [activeFilter,setActiveFilter]=useState<"semua"|"mobil"|"motor"|"sticker">("semua");
  const [selectedItem,setSelectedItem]=useState<PortfolioItem|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const video=showcaseVideo.current;
    if(!video) return;
    const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
    const respectMotion=()=>{if(motion.matches) video.pause();};
    respectMotion();
    motion.addEventListener("change",respectMotion);
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting) video.pause();
      else if(!motion.matches && !userPausedVideo.current) void video.play().catch(()=>{});
    });
    observer.observe(video);
    return ()=>{observer.disconnect();motion.removeEventListener("change",respectMotion);};
  },[showcaseVideoSrc]);
  useEffect(()=>{
    const modal=dialog.current;
    if(selectedItem && modal && !modal.open) modal.showModal();
    if(!selectedItem && modal?.open) modal.close();
    if(!selectedItem) return;
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return ()=>{document.body.style.overflow=previous;};
  },[selectedItem]);
  const filtered=activeFilter==="semua"?content.portfolio:content.portfolio.filter(item=>item.category===activeFilter);
  const handleOrderSimilar=(item:PortfolioItem)=>{
    const text=[
      'Halo Studio Zan Decal, saya tertarik dengan arah desain "'+item.title+'".',
      'Kendaraan: '+item.vehicleModel, 'Bahan: '+item.materialBrand, 'Finishing: '+item.finishType,
      'Saya ingin konsultasi rancangan decal serupa untuk kendaraan saya.'
    ].join("\n");
    window.open('https://wa.me/6281234567890?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');
  };
  return <section id="galeri" className="editorial-gallery" data-arrival="gallery">
    <TransitionVeil/>
    <ScrollStage distance={.55} className="gallery-stage"><div className="gallery-masthead">
      <div className="gallery-masthead-video" aria-hidden="true"><video ref={showcaseVideo} src={showcaseVideoSrc || undefined} poster={showcasePoster || undefined} muted loop playsInline preload="metadata" onPlay={()=>setVideoPaused(false)} onPause={()=>setVideoPaused(true)}/></div>
      <div className="gallery-masthead-copy"><span className="editorial-kicker">05 / GALERI</span><MotionHead><span>BUILT TO</span><span><em>STAND OUT.</em></span></MotionHead><p>Setiap kendaraan punya cerita.<br/>Setiap detail mencerminkan karakter.</p><a href="#gallery-collection" className="editorial-link">Jelajahi karya <ArrowUpRight size={18}/></a></div>
      <button type="button" className="gallery-video-toggle" aria-label={videoPaused?"Putar video latar":"Jeda video latar"} onClick={()=>{const video=showcaseVideo.current;if(!video) return;userPausedVideo.current=!video.paused;if(video.paused) void video.play().catch(()=>{});else video.pause();}}>{videoPaused?<Play size={15}/>:<Pause size={15}/>}<span>{videoPaused?"Putar":"Jeda"}</span></button>
    </div></ScrollStage>
    <div className="gallery-collection" id="gallery-collection">
      <div className="gallery-toolbar"><div role="group" aria-label="Filter galeri">{([["semua","Semua"],["mobil","Mobil"],["motor","Motor"],["sticker","Custom Sticker"]] as const).map(([id,label])=><button type="button" key={id} aria-pressed={activeFilter===id} onClick={()=>setActiveFilter(id)}>{label}</button>)}</div></div>
      <div className="gallery-editorial-grid">{filtered.map(item=><button type="button" key={item.id} onClick={()=>setSelectedItem(item)} className="gallery-project" aria-label={"Lihat detail "+item.title}>
        <div className="gallery-project-image">{item.mediaType==="video"?<video src={item.mediaSrc} poster={item.posterSrc||undefined} preload="metadata" muted playsInline/>:<Image src={item.mediaSrc} alt={item.vehicleModel+" - "+item.finishType} width={1536} height={1024} sizes="(max-width:760px) 100vw, 50vw" unoptimized/>}<span className="project-open"><ArrowUpRight size={24}/></span></div>
        <div className="gallery-project-meta"><div><small>{String(item.id).padStart(2,"0")} / {item.categoryLabel}</small><h3>{item.title}</h3></div><span>{item.finishType}</span></div>
      </button>)}</div><p className="gallery-disclosure">Visual merupakan inspirasi desain. Detail material dan pengerjaan dapat dibahas saat konsultasi.</p>
    </div>
    <dialog ref={dialog} className="gallery-dialog" onCancel={()=>setSelectedItem(null)} onClose={()=>setSelectedItem(null)} onClick={event=>{if(event.target===event.currentTarget)setSelectedItem(null);}} aria-labelledby="gallery-dialog-title">
      {selectedItem&&<div className="gallery-dialog-content"><button type="button" className="gallery-dialog-close" aria-label="Tutup detail" onClick={()=>setSelectedItem(null)}><X size={24}/></button>
        <div className="gallery-dialog-image">{selectedItem.mediaType==="video"?<video src={selectedItem.mediaSrc} poster={selectedItem.posterSrc||undefined} controls playsInline preload="metadata"/>:<Image src={selectedItem.mediaSrc} alt={selectedItem.vehicleModel} width={1536} height={1024} sizes="(max-width:870px) 92vw, 744px" unoptimized/>}</div>
        <span className="editorial-kicker">{selectedItem.categoryLabel} / {selectedItem.vehicleModel}</span><h3 id="gallery-dialog-title">{selectedItem.title}</h3>
        <dl><div><dt>Material</dt><dd>{selectedItem.materialBrand}</dd></div><div><dt>Finishing</dt><dd>{selectedItem.finishType}</dd></div></dl><p>{selectedItem.description}</p><ul>{selectedItem.transformationHighlights.map(item=><li key={item}><CheckCircle2 size={16}/>{item}</li>)}</ul>
        <button type="button" className="consultation-submit" onClick={()=>handleOrderSimilar(selectedItem)}>Konsultasikan desain serupa <Send size={18}/></button>
      </div>}
    </dialog>
  </section>;
}
