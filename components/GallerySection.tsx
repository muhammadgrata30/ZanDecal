
"use client";
import { useEffect, useRef, useState } from "react";
import { PinnedScrollScene } from "./PinnedScrollScene";

import { ArrowUpRight, Pause, Play } from "lucide-react";

import { useSiteContent } from "./SiteContentContext";
import gallery from "./GalleryArchive.module.css";
import { publicImage } from "../lib/public-images";
import {PortfolioCollection} from "./PortfolioCollection";
import {ArchiveLink} from "./ArchiveLink";

// Public gallery reads the same persisted portfolio that the admin edits.
export function GallerySection({ showcaseVideoSrc: suppliedVideo, showcasePoster: suppliedPoster }: { showcaseVideoSrc?: string; showcasePoster?: string }) {
  const content=useSiteContent();
  const showcaseVideoSrc=suppliedVideo ?? content.showcaseVideo;
  const showcasePoster=publicImage(suppliedPoster ?? content.showcasePoster);
  const showcaseVideo=useRef<HTMLVideoElement>(null);
  const userPausedVideo=useRef(false);
  const [videoPaused,setVideoPaused]=useState(true);
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
  return <section id="galeri" className={`${gallery.section} editorial-gallery`} aria-labelledby="gallery-title">
    <PinnedScrollScene distance={1.15} className={gallery.stage}><div className={gallery.hero}>
      
      <div className={gallery.heroMedia} aria-hidden="true"><video ref={showcaseVideo} src={showcaseVideoSrc || undefined} poster={showcasePoster || publicImage(content.portfolio.find(item=>item.mediaType==="photo")?.mediaSrc || "") || undefined} muted loop playsInline preload="metadata" onPlay={()=>setVideoPaused(false)} onPause={()=>setVideoPaused(true)}/></div>
      <div className={gallery.heroCopy}><h2 id="gallery-title"><span>BUKAN</span><span><em>BIASA.</em><i>↗</i></span></h2><ArchiveLink>Masuk ke arsip <ArrowUpRight size={18}/></ArchiveLink></div>
      
      <div className={gallery.heroFooter}><button type="button" disabled={!showcaseVideoSrc} aria-label={videoPaused?"Putar video latar":"Jeda video latar"} aria-pressed={!videoPaused} onClick={()=>{const video=showcaseVideo.current;if(!video) return;userPausedVideo.current=!video.paused;if(video.paused) void video.play().catch(()=>{});else video.pause();}}>{videoPaused?<Play size={15}/>:<Pause size={15}/>}<span>{videoPaused?"Putar":"Jeda"}</span></button></div>
      <div className={gallery.heroProgress} aria-hidden="true"><i/></div>
    </div></PinnedScrollScene>
    <PortfolioCollection compact/>
  </section>;
}
