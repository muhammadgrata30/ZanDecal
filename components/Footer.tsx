"use client";
import {ArrowUpRight} from "lucide-react";
import {useRef} from "react";
import {useSelectedSectionMotion} from "./experience/useSelectedSectionMotion";
import "./experience/selected-sections.css";

function FooterText({text}:{text:string}){
 return <span className="footer-motion-text"><span className="sr-only">{text}</span><span aria-hidden="true">{text.split(" ").map((word,i)=><span key={i}><span className="footer-text-word">{Array.from(word).map((letter,j)=><span className="footer-char" key={j}>{letter}</span>)}</span>{" "}</span>)}</span></span>;
}

export function Footer(){
 const root=useRef<HTMLElement>(null);
 useSelectedSectionMotion(root,"footer");
 return <footer ref={root} className="cutclose-footer" role="contentinfo" aria-label="Zan Decal footer">
  <div className="cutclose-top"><a href="#beranda"><FooterText text="Kembali ke atas ↑"/></a></div>
  <svg className="cutclose-art" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true"><path className="cutclose-path" pathLength="1" d="M-20 480L250 140L600 200L930 80L1480 310"/></svg>
  <div className="cutclose-invitation"><h2><FooterText text="TRUST ME IT WORKS."/></h2><a href="#komisi-visual" className="cutclose-round" aria-label="Lihat gambar Komisi Baru"><ArrowUpRight size={48}/></a></div>
  <div className="cutclose-columns">
   <div><p><FooterText text="ZAN DECAL"/><br/><FooterText text="Jakarta / Tangerang, Indonesia"/></p><a href="mailto:studio@zandecal.id"><FooterText text="studio@zandecal.id ↗"/></a></div>
   <nav aria-label="Eksplorasi footer"><h3><FooterText text="EKSPLORASI"/></h3>{[["Interactive Studio","3d-studio"],["Material","material"],["Custom Sticker","custom-sticker"],["Galeri","galeri"],["Cara Order","cara-order"],["Mulai komisi","komisi-visual"]].map(([name,id])=><a href={`#${id}`} key={id}><FooterText text={name}/><ArrowUpRight size={16}/></a>)}</nav>
   <div className="cutclose-contact"><h3><FooterText text="TERHUBUNG"/></h3><a href="https://instagram.com" target="_blank" rel="noreferrer"><FooterText text="Instagram ↗"/></a><a href="https://youtube.com" target="_blank" rel="noreferrer"><FooterText text="YouTube ↗"/></a><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"><FooterText text="WhatsApp ↗"/></a></div>
  </div>
  <div className="cutclose-base"><FooterText text={`© ${new Date().getFullYear()} ZAN DECAL. HAK CIPTA DILINDUNGI.`}/>{/* Full navigation releases the departing WebGL scene before entering admin. */}<a href="/admin"><FooterText text="Masuk Admin ↗"/></a></div>
  <div className="cutclose-wordmark" aria-label="ZAN DECAL">{"ZAN DECAL".split("").map((letter,i)=><span key={i} aria-hidden="true">{letter===" "?"\u00a0":letter}</span>)}</div>
 </footer>;
}
