"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown, ArrowRight, Box, Menu, MessageCircle, X } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { DECAL_COLORS, FINISH_SPECS, type FinishType } from "../components/DecalVisualizer3D";
import { MaterialSection } from "../components/MaterialSection";
import { GallerySection } from "../components/GallerySection";
import { CustomStickerSection } from "../components/CustomStickerSection";
import { WorkflowSection } from "../components/WorkflowSection";
import { ConsultationSection } from "../components/ConsultationSection";
import { Footer } from "../components/Footer";
import { MotionObserver, ScrollStage } from "../components/ScrollStage";

const Studio = dynamic(() => import("../components/DecalVisualizer3D"), {
  ssr: false,
  loading: () => <div className="atelier-studio-loading">Menyiapkan studio 3D…</div>,
});
const links = [["3D Studio", "3d-studio"], ["Material", "material"], ["Custom Sticker", "custom-sticker"], ["Galeri", "galeri"], ["Cara Order", "cara-order"]];

class StudioBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="atelier-studio-loading"><h2>Preview 3D belum tersedia di perangkat ini.</h2><p>Diskusikan warna dan desain pilihan Anda bersama tim.</p><a href="#konsultasi" className="atelier-button">Mulai konsultasi <ArrowRight size={16}/></a></div> : this.props.children;
  }
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [colorIndex, setColorIndex] = useState(1);
  const [finish, setFinish] = useState<FinishType>("Glossy");
  const [studioReady, setStudioReady] = useState(false);
  const studioRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStudioReady(true); observer.disconnect(); }
    }, { rootMargin: "250px" });
    if (studioRef.current) observer.observe(studioRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".atelier-reveal").forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return <div className="atelier-site">
    <MotionObserver/>
    <a className="atelier-skip" href="#main">Lewati ke konten</a>
    <header className="atelier-nav">
      <a href="#beranda" className="atelier-wordmark" aria-label="Zan Decal beranda"><strong>ZAN</strong> DECAL</a>
      <nav className={menu ? "atelier-nav-links is-open" : "atelier-nav-links"} aria-label="Navigasi utama" id="atelier-navigation">
        {links.map(([name,id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{name}</a>)}
      </nav>
      <div className="atelier-nav-actions"><ThemeToggle/><button className="atelier-menu" onClick={() => setMenu(!menu)} aria-label={menu ? "Tutup menu" : "Buka menu"} aria-expanded={menu} aria-controls="atelier-navigation">{menu ? <X/> : <Menu/>}</button></div>
    </header>
    <main id="main">
      <ScrollStage distance={.3} className="hero-stage"><section className="atelier-hero" id="beranda" aria-labelledby="atelier-title">
        <Image className="atelier-hero-image" src="/images/atelier-hero.png" alt="Inspirasi BYD Seal dengan wrapping lavender dan cyan di studio terang" fill sizes="100vw" preload/>
        <div className="atelier-hero-shade"/>
        <aside className="atelier-index" aria-label="Jelajahi halaman">{[["01","Beranda","beranda"],["02","3D Studio","3d-studio"],["03","Material","material"],["04","Galeri","galeri"]].map(([n,label,id]) => <a href={`#${id}`} key={n}><span>{n}</span><i/>{label}</a>)}</aside>
        <div className="atelier-hero-copy">
          <span className="atelier-kicker">AUTOMOTIVE WRAP & CUSTOM STICKER</span>
          <h1 id="atelier-title">Dirancang<br/>untuk <em>berbeda.</em></h1>
          <p>Karakter Anda. Kanvas kami. Pilih warna, eksplorasi di 3D Studio, dan wujudkan tampilan kendaraan yang terasa benar-benar milik Anda.</p>
          <div className="atelier-hero-actions"><a className="atelier-button" href="#3d-studio"><Box size={18}/> Buka 3D Studio <ArrowRight size={17}/></a><a className="atelier-button atelier-button-outline" href="#konsultasi"><MessageCircle size={18}/> Konsultasi</a></div>
        </div>
        <a href="#3d-studio" className="atelier-scroll"><ArrowDown size={22}/><span>SCROLL TO EXPLORE</span></a>
        <div className="atelier-hero-controls"><span>PILIH WARNA & FINISH</span><div className="atelier-quick-colors">{DECAL_COLORS.map((color,index) => <button key={color.hex} aria-label={`Pilih ${color.name}`} aria-pressed={colorIndex === index} title={color.name} style={{backgroundColor:color.hex}} onClick={() => setColorIndex(index)}/>)}</div><label><span className="sr-only">Finishing awal studio 3D</span><select aria-label="Finishing awal studio 3D" value={finish} onChange={event => setFinish(event.target.value as FinishType)}>{Object.keys(FINISH_SPECS).map(item => <option key={item}>{item}</option>)}</select></label><a href="#3d-studio" aria-label="Lihat pilihan di studio 3D"><ArrowRight size={18}/></a></div>
      </section></ScrollStage>
      <ScrollStage distance={.3} className="studio-stage"><section id="3d-studio" ref={studioRef} className="atelier-studio-section" aria-label="Studio 3D interaktif">
        <StudioBoundary>{studioReady ? <Studio color={DECAL_COLORS[colorIndex]} finish={finish} onColorChange={color => setColorIndex(DECAL_COLORS.findIndex(item => item.hex === color.hex))} onFinishChange={setFinish}/> : <div className="atelier-studio-loading">Studio 3D segera tersedia…</div>}</StudioBoundary>
      </section></ScrollStage>
      <ScrollStage distance={.3} className="material-stage"><section id="material" className="atelier-material atelier-reveal" aria-labelledby="material-title">
        <div className="atelier-section-copy"><span className="atelier-kicker">03 — MATERIAL</span><h2 id="material-title">Material<br/>pilihan, hasil<br/><em>maksimal.</em></h2><p>Pilihan material wrap dengan karakter warna dan finishing yang presisi. Temukan kombinasi yang sesuai kendaraan Anda.</p><a href="#material-detail" className="atelier-button atelier-button-outline">Eksplorasi material <ArrowRight size={17}/></a></div>
        <div className="atelier-material-visual"><div className="atelier-material-image"><Image src="/images/atelier-material.png" alt="Roll vinyl lavender, cyan, dan pink dengan tekstur finishing" fill sizes="(max-width: 760px) 100vw, 65vw"/></div><div className="atelier-finish-previews">{(["Glossy","Matte","Satin","Metallic"] as FinishType[]).map((item,index) => <a key={item} href="#3d-studio" onClick={() => setFinish(item)}><div className={`finish-photo finish-photo-${index}`}><Image src="/images/atelier-material.png" alt="" fill sizes="18vw"/></div><strong>{item}</strong><p>{["Kilau maksimal, warna lebih hidup.","Tampilan tenang, bebas pantulan.","Seimbang antara doff dan glossy.","Pendar metalik yang lebih dinamis."][index]}</p><span>Coba di 3D <ArrowRight size={12}/></span></a>)}</div></div>
      </section></ScrollStage>
      <details className="atelier-details atelier-legacy" id="material-detail"><summary>Kenali bahan & struktur vinyl <span>Oracal · Maxdecal · TeckWrap</span></summary><MaterialSection id="material-specification"/></details>
      <CustomStickerSection/>
      <GallerySection/>
      <WorkflowSection/>
      <ConsultationSection/>
    </main>
    <Footer/>
  </div>;
}
