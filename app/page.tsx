"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import HomeMaterialSection from "../components/material-motion/HomeMaterialSection";
import "./home-material.css";
import { GallerySection } from "../components/GallerySection";
import { CustomStickerSection } from "../components/CustomStickerSection";
import { WorkflowSection } from "../components/WorkflowSection";
import { ConsultationSection } from "../components/ConsultationSection";
import { Footer } from "../components/Footer";
import { MotionObserver } from "../components/ScrollStage";
import { PortfolioHandoff } from "../components/PortfolioHandoff";
import { HeroStudioSequence } from "../components/experience/HeroStudioSequence";
import { SectionTransitions } from "../components/experience/SectionTransitions";
import { MaterialCurtain } from "../components/MaterialCurtain";
import { MotorStudio } from "../components/experience/MotorStudio";

const links = [["3D Studio", "3d-studio"], ["Material", "material"], ["Custom Sticker", "custom-sticker"], ["Galeri", "galeri"], ["Cara Order", "cara-order"]];

export default function Home() {
  const [menu, setMenu] = useState(false);
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
      <MaterialCurtain studio={<MotorStudio/>}><HomeMaterialSection/></MaterialCurtain>
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
