
"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PinnedScrollScene } from "./PinnedScrollScene";

import { ArrowUpRight, X, CheckCircle2, Send, Pause, Play } from "lucide-react";

import { useSiteContent } from "./SiteContentContext";
import type { Portfolio as PortfolioItem } from "../lib/content-types";
import gallery from "./GalleryArchive.module.css";
import { publicImage } from "../lib/public-images";

// Public gallery reads the same persisted portfolio that the admin edits.
export function GallerySection({ showcaseVideoSrc: suppliedVideo, showcasePoster: suppliedPoster }: { showcaseVideoSrc?: string; showcasePoster?: string }) {
  const content=useSiteContent();
  const showcaseVideoSrc=suppliedVideo ?? content.showcaseVideo;
  const showcasePoster=publicImage(suppliedPoster ?? content.showcasePoster);
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
    let visible=false;
    const respectMotion=()=>{if(motion.matches||document.hidden||!visible) video.pause();else if(!userPausedVideo.current)void video.play().catch(()=>{});};
    respectMotion();
    motion.addEventListener("change",respectMotion);
    document.addEventListener("visibilitychange",respectMotion);
    const observer=new IntersectionObserver(([entry])=>{
      visible=entry.isIntersecting;
      if(!entry.isIntersecting||document.hidden) video.pause();
      else if(!motion.matches && !userPausedVideo.current) void video.play().catch(()=>{});
    });
    observer.observe(video);
    return ()=>{observer.disconnect();motion.removeEventListener("change",respectMotion);document.removeEventListener("visibilitychange",respectMotion);};
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
  return <section id="galeri" className={`${gallery.section} editorial-gallery`} aria-labelledby="gallery-title">
    <PinnedScrollScene distance={1.15} className={gallery.stage}><div className={gallery.hero}>
      
      <div className={gallery.heroMedia} aria-hidden="true"><video ref={showcaseVideo} src={showcaseVideoSrc || undefined} poster={showcasePoster || publicImage(content.portfolio.find(item=>item.mediaType==="photo")?.mediaSrc || "") || undefined} muted loop playsInline preload="metadata" onPlay={()=>setVideoPaused(false)} onPause={()=>setVideoPaused(true)}/></div>
      <div className={gallery.heroCopy}><h2 id="gallery-title"><span>BUKAN</span><span><em>BIASA.</em><i>↗</i></span></h2><a href="#gallery-collection">Masuk ke arsip <ArrowUpRight size={18}/></a></div>
      
      <div className={gallery.heroFooter}><button type="button" disabled={!showcaseVideoSrc} aria-label={videoPaused?"Putar video latar":"Jeda video latar"} aria-pressed={!videoPaused} onClick={()=>{const video=showcaseVideo.current;if(!video) return;userPausedVideo.current=!video.paused;if(video.paused) void video.play().catch(()=>{});else video.pause();}}>{videoPaused?<Play size={15}/>:<Pause size={15}/>}<span>{videoPaused?"Putar":"Jeda"}</span></button></div>
      <div className={gallery.heroProgress} aria-hidden="true"><i/></div>
    </div></PinnedScrollScene>
    <div className={gallery.collection} id="gallery-collection">
      <div className={gallery.archiveHeader}><div><h2>Arsip <em>karakter.</em><sup>({String(content.portfolio.length).padStart(2,"0")})</sup></h2></div><p>Dari konsep ke permukaan.<br/>Temukan arah yang terasa seperti kamu.</p></div>
      <div className={gallery.toolbar}><div role="group" aria-label="Filter galeri">{([["semua","Semua"],["mobil","Mobil"],["motor","Motor"],["sticker","Custom Sticker"]] as const).map(([id,label])=><button type="button" key={id} aria-pressed={activeFilter===id} onClick={()=>setActiveFilter(id)}>{label}<sup>{String(id==="semua"?content.portfolio.length:content.portfolio.filter(item=>item.category===id).length).padStart(2,"0")}</sup></button>)}</div><span role="status" aria-live="polite">{String(filtered.length).padStart(2,"0")} KARYA DITAMPILKAN</span></div>
      <div className={gallery.grid}>{filtered.map(item=><button type="button" key={item.id} onClick={()=>setSelectedItem(item)} className={gallery.project} aria-label={"Lihat detail "+item.title}>
        <div className={gallery.projectTop}><span>{item.categoryLabel}</span></div>
        <div className={gallery.image}>{item.mediaType==="video"?<video src={item.mediaSrc} poster={item.posterSrc||undefined} preload="metadata" muted playsInline/>:<Image src={publicImage(item.mediaSrc)} alt={item.vehicleModel+" - "+item.finishType} width={1536} height={1024} sizes="(max-width:760px) 88vw, (max-width:1100px) 46vw, 65vw" unoptimized/>}<span className={gallery.open}><span>{item.mediaType==="video"?"PUTAR FILM":"LIHAT KARYA"}</span>{item.mediaType==="video"?<Play size={20}/>:<ArrowUpRight size={23}/>}</span></div>
        <div className={gallery.meta}><div><h3>{item.title}</h3><p>{item.vehicleModel}</p></div><span>{item.finishType}<ArrowUpRight size={20}/></span></div>
      </button>)}</div>{!filtered.length&&<p className={gallery.empty}>Karya untuk kategori ini sedang disiapkan. Jelajahi kategori lainnya.</p>}
      <div className={gallery.archiveEnd}><a href="#konsultasi">Giliran karaktermu.<ArrowUpRight size={30}/></a></div><p className={gallery.disclosure}>Visual merupakan inspirasi desain. Detail material dan pengerjaan dapat dibahas saat konsultasi.</p>
    </div>
    <dialog ref={dialog} className={gallery.dialog} onCancel={()=>setSelectedItem(null)} onClose={()=>setSelectedItem(null)} onClick={event=>{if(event.target===event.currentTarget)setSelectedItem(null);}} aria-labelledby="gallery-dialog-title">
      {selectedItem&&<div className={gallery.dialogContent}><button type="button" className={gallery.close} aria-label="Tutup detail" onClick={()=>setSelectedItem(null)}><X size={24}/></button>
        <div className={gallery.dialogImage}>{selectedItem.mediaType==="video"?<video src={selectedItem.mediaSrc} poster={selectedItem.posterSrc||undefined} controls playsInline preload="metadata"/>:<Image src={publicImage(selectedItem.mediaSrc)} alt={selectedItem.vehicleModel} width={1536} height={1024} sizes="(max-width:870px) 92vw, 744px" unoptimized/>}<span>ZD—{String(selectedItem.id).padStart(3,"0")} / SELECTED EXPRESSION</span></div>
        <div className={gallery.dialogCopy}><span className={gallery.kicker}>{selectedItem.categoryLabel} / {selectedItem.vehicleModel}</span><h3 id="gallery-dialog-title">{selectedItem.title}</h3>
        <dl><div><dt>Material</dt><dd>{selectedItem.materialBrand}</dd></div><div><dt>Finishing</dt><dd>{selectedItem.finishType}</dd></div></dl><p>{selectedItem.description}</p><ul>{selectedItem.transformationHighlights.map(item=><li key={item}><CheckCircle2 size={16}/>{item}</li>)}</ul>
        <button type="button" className={gallery.order} onClick={()=>handleOrderSimilar(selectedItem)}>Konsultasikan desain serupa <Send size={18}/></button></div>
      </div>}
    </dialog>
  </section>;
}
