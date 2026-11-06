"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Menu, Moon, Sun, X } from "lucide-react";
import { HeroStudioSequence } from "../experience/HeroStudioSequence";
import { ConsultationSection } from "../ConsultationSection";
import { Footer } from "../Footer";
import { MotionObserver } from "../ScrollStage";
import { useSiteContent } from "../SiteContentContext";
import { useTheme } from "../ThemeContext";
import ScrollDirector from "./ScrollDirector";
import type { Material } from "../../lib/content-types";

const directions = [
  { name: "Surface Index", title: <>BUKAN SEKADAR<br /><em>PERMUKAAN.</em></>, copy: "Sebuah indeks material. Kenali karakter setiap bahan, satu per satu.", marker: "INDEX / COLOUR / CHARACTER" },
  { name: "Moving Archive", title: <>KARAKTERMU.<br /><em>SELURUH ARAH.</em></>, copy: "Koleksi bahan yang terbuka seperti arsip visual. Ikuti alurnya.", marker: "THE MATERIAL ARCHIVE" },
  { name: "Street Editions", title: <>SATU PILIHAN.<br /><em>BANYAK CERITA.</em></>, copy: "Dari sampel ke jalan. Material, detail, dan inspirasi dalam satu edisi.", marker: "STREET CULTURE / STUDIO CRAFT" },
  { name: "Precision Journal", title: <>DETAIL KECIL.<br /><em>KARAKTER BESAR.</em></>, copy: "Buka setiap lapisan informasi. Keputusan yang tepat dimulai dari detail.", marker: "COLOUR IS ONLY THE BEGINNING" },
  { name: "Signature Atelier", title: <>PILIH BAHANNYA.<br /><em>BENTUK IDENTITASNYA.</em></>, copy: "Sebuah perjalanan dari permukaan, menuju tampilan yang kamu inginkan.", marker: "ZAN DECAL / THE SIGNATURE EDIT" },
];
const photos = ["atelier-material", "consultation-vinyl", "workflow-install"];
const imagePath = (name: string) => `/images/scroll-lab/${name}.webp`;
const number = (value: number) => String(value).padStart(2, "0");
function MaterialSpecs({ material }: { material: Material }) {
  return <dl>{[["Jenis", material.type], ["Asal", material.origin], ["Elastisitas", material.elongation], ["Rentang suhu", material.tempRange], ["Kode", material.specCode]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

export default function ScrollPreview({ option }: { option: number }) {
  const { materials, portfolio, colors } = useSiteContent();
  const { theme, toggleTheme } = useTheme();
  const [menu, setMenu] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const direction = directions[option - 1];
  const storyMaterials = materials.slice(0, 8);
  const color = colors.find(item => item.id === selectedColor) || colors[1] || colors[0];
  const projects = portfolio.slice(0, 6);
  return <div className="atelier-site split-home sl-preview">
    <MotionObserver />
    <a className="atelier-skip" href="#material-preview">Lewati ke mockup baru</a>
    <header className="atelier-nav"><a href="#beranda" className="atelier-wordmark"><strong>ZAN</strong> DECAL</a><nav className={menu ? "atelier-nav-links is-open" : "atelier-nav-links"} aria-label="Navigasi utama" id="scroll-lab-nav">{[["3D Studio", "3d-studio"], ["Material", "material-preview"], ["Koleksi", "sl-gallery"], ["Konsultasi", "konsultasi"]].map(([name, id]) => <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>{name}</a>)}</nav><div className="atelier-nav-actions"><button className="atelier-menu" type="button" onClick={() => setMenu(!menu)} aria-label="Buka menu" aria-expanded={menu} aria-controls="scroll-lab-nav">{menu ? <X /> : <Menu />}</button></div></header>
    <HeroStudioSequence />
    <main className={`sl-lower sl-direction-${option}`} style={{ "--sl-chosen": color?.hex || "#A18CD1" } as CSSProperties}>
      <ScrollDirector variant={option} />
      <div className="sl-preview-tools" id="material-preview"><div><span className="sl-micro">LIVE SCROLL STUDIES</span><strong>0{option} / {direction.name}</strong></div><nav aria-label="Lima mockup scroll">{directions.map((item, index) => <a key={item.name} href={`/scroll-lab?option=${index + 1}#material-preview`} aria-current={option === index + 1 ? "page" : undefined} title={item.name}>{number(index + 1)}</a>)}</nav><button type="button" onClick={toggleTheme} aria-label="Ganti tema">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button></div>
      <section className="sl-manifesto" data-reveal><div className="sl-meta"><span>03 / MATERIAL & CHARACTER</span><span>ZAN DECAL ATELIER</span></div><h1>{direction.title}</h1><div className="sl-manifesto-bottom"><p>{direction.copy}</p><span>SCROLL UNTUK MENJELAJAHI <ArrowDown size={17} /></span></div></section>
      {storyMaterials.length > 0 ? <section className="sl-story" data-scroll-story style={{ "--sl-count": storyMaterials.length } as CSSProperties} aria-label="Perjalanan koleksi bahan">
        <div className="sl-story-pin"><div className="sl-story-meta"><span className="sl-micro">{direction.marker}</span><span data-story-counter>{number(1)} / {number(storyMaterials.length)}</span></div><div className="sl-story-watermark" aria-hidden="true">{["SURFACE", "ARCHIVE", "EDITION", "PRECISION", "SIGNATURE"][option - 1]}</div>
          <div className="sl-story-media">{storyMaterials.map((material, index) => <figure className={`sl-story-frame${index === 0 ? " is-current" : ""}`} data-story-frame key={material.id} style={{ "--sl-layer": option === 3 ? storyMaterials.length - index : index + 1 } as CSSProperties}><div className="sl-frame-photo"><Image src={imagePath(photos[index % photos.length])} alt="Ilustrasi permukaan vinyl dan proses pengerjaan studio" fill sizes="(max-width:760px) 80vw, 55vw" style={{ objectFit: "cover" }} /></div><figcaption><span>ZAN / MATERIAL {number(index + 1)}</span><ArrowUpRight size={18} /></figcaption></figure>)}</div>
          <div className="sl-story-texts">{storyMaterials.map((material, index) => <article className="sl-story-text" data-story-text key={material.id}><div className="sl-material-heading"><span className="sl-micro">{number(index + 1)} — {material.badge || "PILIHAN STUDIO"}</span><h2>{material.name}</h2><span className="sl-material-type">{material.type}</span></div><div className="sl-material-copy"><p>{material.desc}</p><ul>{material.features.slice(0, 3).map((feature, featureIndex) => <li key={featureIndex}><Check size={13} />{feature}</li>)}</ul><a href="#sl-catalog">Spesifikasi & koleksi <ArrowUpRight size={16} /></a></div></article>)}</div>
          <div className="sl-story-footer"><span>ILUSTRASI MATERIAL / SCROLL UNTUK LANJUT</span><span className="sl-story-progress"><i data-story-fill /></span></div>
        </div>
      </section> : <section className="sl-empty"><h2>Koleksi bahan sedang disiapkan.</h2><a href="#konsultasi">Konsultasikan pilihanmu</a></section>}
      <section className="sl-catalog" id="sl-catalog" data-reveal><div><span className="sl-micro">THE COMPLETE MATERIAL INDEX</span><h2>KENALI<br /><em>PILIHANMU.</em></h2><p>Nama dan spesifikasi mengikuti koleksi bahan yang diterbitkan studio.</p></div><div>{materials.map((material, index) => <details key={material.id}><summary><span>{number(index + 1)}</span><strong>{material.name}</strong><ArrowUpRight size={21} /></summary><div className="sl-spec-content"><p>{material.desc}</p><MaterialSpecs material={material} /><a href="#konsultasi">Bicarakan bahan ini <ArrowUpRight size={15} /></a></div></details>)}</div></section>
      <section className="sl-process" data-reveal><div className="sl-process-visual"><Image src={imagePath("workflow-install")} alt="Ilustrasi pemasangan vinyl pada panel kendaraan" fill sizes="(max-width:760px) 100vw, 70vw" style={{ objectFit: "cover" }} /><span>FROM SURFACE TO STATEMENT.</span></div><div className="sl-process-copy"><span className="sl-micro">BUKAN HANYA MEMILIH WARNA</span><h2>DARI IDE.<br />JADI <em>IDENTITAS.</em></h2><p>Mulai dari karakter yang kamu inginkan. Bicarakan material, desain, dan bagian kendaraan yang ingin kamu ubah bersama studio.</p><a href="#konsultasi">Mulai percakapan <ArrowUpRight size={19} /></a></div></section>
      <section className="sl-gallery" id="sl-gallery"><header data-reveal><span className="sl-micro">04 / VISUAL INSPIRATION</span><h2>BUKAN UNTUK<br /><em>LEWAT BEGITU SAJA.</em></h2><p>Referensi tampilan dari koleksi studio.</p></header><div className="sl-projects">{projects.map((project, index) => {
        const localName = project.mediaSrc.match(/^\/images\/(gallery-(?:ferrari-magenta|raptor-black|ktm-black|yamaha-r1-blue))\.png$/)?.[1];
        return <article key={project.id} className="sl-project" data-reveal style={{ "--sl-tilt": `${index % 2 ? 5 : -5}deg` } as CSSProperties}><div className="sl-project-photo">{project.mediaType === "video" ? <video controls playsInline preload="none" src={project.mediaSrc} poster={project.posterSrc || undefined} /> : <Image src={localName ? imagePath(localName) : project.mediaSrc} alt={project.title} fill sizes="(max-width:760px) 90vw, 50vw" style={{ objectFit: "cover" }} />}</div><div className="sl-project-caption"><span>{number(index + 1)} / {project.categoryLabel}</span><h3>{project.title}</h3><details><summary>Lihat ceritanya <ArrowUpRight size={16} /></summary><p>{project.description}</p><span>{project.finishType}</span></details></div></article>;
      })}</div></section>
      <section className="sl-palette" data-reveal><div><span className="sl-micro">COLOUR / YOUR NEXT CHAPTER</span><h2>SATU WARNA.<br /><em>BANYAK KEMUNGKINAN.</em></h2><p className="sl-color-name" aria-live="polite">{color?.name || "Palet sedang disiapkan"}</p></div><div className="sl-swatch-grid">{colors.map(item => <button key={item.id} type="button" aria-label={item.name} aria-pressed={color?.id === item.id} onClick={() => setSelectedColor(item.id)}><span style={{ backgroundColor: item.hex }}>{color?.id === item.id && <Check size={19} color={parseInt(item.hex.slice(1), 16) < 0x777777 ? "white" : "#17131e"} />}</span><strong>{item.name}</strong></button>)}</div></section>
      <section className="sl-order"><div className="sl-order-title" data-reveal><span className="sl-micro">05 / LET’S MAKE IT HAPPEN</span><h2>IDE BESAR.<br /><em>LANGKAH JELAS.</em></h2></div><div className="sl-steps">{[["CERITAKAN", "Kendaraan, gaya dan hasil yang kamu inginkan."], ["RANCANG", "Bicarakan konsep, material dan finishing bersama studio."], ["WUJUDKAN", "Sepakati detail pengerjaan dan jadwal pemasangan."]].map(([title, description], index) => <article key={title} data-reveal><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p><ArrowRight size={25} /></article>)}</div></section>
      <div className="sl-contact" data-reveal><ConsultationSection /></div>
      <footer className="sl-study-footer"><span>SCROLL STUDY 0{option} / {direction.name}</span><Link href="/">Website utama <ArrowUpRight size={16} /></Link><a href={`/scroll-lab?option=${option === 5 ? 1 : option + 1}#material-preview`}>Mockup berikutnya <ArrowRight size={16} /></a></footer>
    </main><Footer />
  </div>;
}
