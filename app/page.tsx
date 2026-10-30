"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import type { FinishType } from "../components/DecalVisualizer3D";
import { MaterialSection } from "../components/MaterialSection";
import { GallerySection } from "../components/GallerySection";
import { CustomStickerSection } from "../components/CustomStickerSection";
import { WorkflowSection } from "../components/WorkflowSection";
import { ConsultationSection } from "../components/ConsultationSection";
import { Footer } from "../components/Footer";
import { MotionObserver, ScrollStage } from "../components/ScrollStage";
import { PortfolioHandoff } from "../components/PortfolioHandoff";
import { HeroStudioSequence } from "../components/experience/HeroStudioSequence";
import { SectionTransitions, TransitionVeil } from "../components/experience/SectionTransitions";
import { useSiteContent } from "../components/SiteContentContext";

const links = [["3D Studio", "3d-studio"], ["Material", "material"], ["Custom Sticker", "custom-sticker"], ["Galeri", "galeri"], ["Cara Order", "cara-order"]];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const {materials}=useSiteContent();
  return <div className="atelier-site split-home">
    <MotionObserver/>
    <SectionTransitions/>
    <a className="atelier-skip" href="#main">Lewati ke konten</a>
    <header className="atelier-nav">
      <a href="#beranda" className="atelier-wordmark" aria-label="Zan Decal beranda"><strong>ZAN</strong> DECAL</a>
      <nav className={menu ? "atelier-nav-links is-open" : "atelier-nav-links"} aria-label="Navigasi utama" id="atelier-navigation">
        {links.map(([name,id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{name}</a>)}
      </nav>
      <div className="atelier-nav-actions"><button className="atelier-menu" onClick={() => setMenu(!menu)} aria-label={menu ? "Tutup menu" : "Buka menu"} aria-expanded={menu} aria-controls="atelier-navigation">{menu ? <X/> : <Menu/>}</button></div>
    </header>
    <main id="main">
      <HeroStudioSequence/>
      <ScrollStage distance={.3} className="material-stage"><section id="material" className="atelier-material" aria-labelledby="material-title" data-arrival="material"><TransitionVeil/>
        <div className="atelier-section-copy"><span className="atelier-kicker">03 — MATERIAL</span><h2 id="material-title">Material<br/>pilihan, hasil<br/><em>maksimal.</em></h2><p>Pilihan material wrap dengan karakter warna dan finishing yang presisi. Temukan kombinasi yang sesuai kendaraan Anda.</p><a href="#material-detail" className="atelier-button atelier-button-outline">Eksplorasi material <ArrowRight size={17}/></a></div>
        <div className="atelier-material-visual"><div className="atelier-material-image"><Image src="/images/atelier-material.png" alt="Roll vinyl lavender, cyan, dan pink dengan tekstur finishing" fill sizes="(max-width: 760px) 100vw, 65vw"/></div><div className="atelier-finish-previews">{(["Glossy","Matte","Satin","Metallic"] as FinishType[]).map((item,index) => <a key={item} href="#3d-studio" onClick={() => window.dispatchEvent(new CustomEvent("zan:finish", { detail: item }))}><div className={`finish-photo finish-photo-${index}`}><Image src="/images/atelier-material.png" alt="" fill sizes="18vw"/></div><strong>{item}</strong><p>{["Kilau maksimal, warna lebih hidup.","Tampilan tenang, bebas pantulan.","Seimbang antara doff dan glossy.","Pendar metalik yang lebih dinamis."][index]}</p><span>Coba di 3D <ArrowRight size={12}/></span></a>)}</div></div>
      </section></ScrollStage>
      <details className="atelier-details atelier-legacy" id="material-detail"><summary>Kenali bahan & struktur vinyl <span>{materials.map(item=>item.name).join(" · ")}</span></summary><MaterialSection id="material-specification"/></details>
      <CustomStickerSection/>
      <PortfolioHandoff>
        <GallerySection/>
        <WorkflowSection/>
      </PortfolioHandoff>
      <ConsultationSection/>
    </main>
    <Footer/>
  </div>;
}
