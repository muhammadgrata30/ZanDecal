"use client";

import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Home from "../page";
import "./preview.css";

export function HeroDetailPreview({ cinematic = false }: { cinematic?: boolean } = {}) {
  const [hero, setHero] = useState<HTMLElement | null>(null);
  const attach = useCallback((node: HTMLDivElement | null) => {
    const section = node?.querySelector<HTMLElement>("#beranda");
    if (section) { section.dataset.heroDetails = "true"; if (cinematic) section.dataset.heroCinematic = "true"; setHero(section); }
  }, [cinematic]);
  return <div className={`hero-details-lab${cinematic ? " cinematic-hero-lab" : ""}`} ref={attach}>
    <Home/>
    {hero && createPortal(<div className="hero-detail-overlay">
      <div className="detail-callout detail-cut" aria-hidden="true"><span>01 / PRECISION CUT</span><small>Potongan mengikuti karakter.</small></div>
      <div className="detail-callout detail-finish" aria-hidden="true"><span>02 / SMOOTH FINISH</span><small>Diratakan sampai detail terakhir.</small></div>
      <div className="detail-material" aria-hidden="true"><i/><span>CYAN / GLOSS FINISH</span></div>
      <a href="#3d-studio" className="detail-studio-link"><span>Lanjut ke 3D Studio</span><span aria-hidden="true">↓</span></a>
      <div className="detail-bridge" aria-hidden="true"/>
      {cinematic && <>
        <div className="cinematic-caption" aria-hidden="true"><span>FROM RAW SURFACE</span><strong>TO YOUR SIGNATURE.</strong></div>
        <button className="cinematic-replay" type="button" onClick={() => { window.scrollTo({top:0,behavior:"instant"}); hero.dispatchEvent(new Event("zan-replay-intro")); }}>Putar ulang pengalaman ↻</button>
      </>}
    </div>, hero)}
    <Link className="detail-preview-return" href="/">{cinematic ? "Mockup / Surface to Signature" : "Mockup detail hero"} <span>· Kembali ke website ↗</span></Link>
  </div>;
}
