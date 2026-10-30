"use client";

import { Component, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDown, Pause, Play, Sun, Moon, RotateCw } from "lucide-react";
import { DECAL_COLORS, type FinishType } from "../DecalVisualizer3D";
import type { StudioVehicle } from "../vehiclePaint";

const MotionCanvas = dynamic(() => import("./MotionCanvas"), { ssr: false,
  loading: () => <div className="lab-loading">Menyiapkan ruang 3D…</div> });
const directions = [
  { name: "Sculpted Light", title: "Karakter, dalam gerak.", studio: "Ini ruang eksplorasi Anda.", copy: "Dari ide ke permukaan. Rancang tampilan kendaraan yang sepenuhnya milik Anda.", motion: "Orbit perlahan · vinyl bergerak · cahaya menyapu cat" },
  { name: "Afterimage", title: "Jangan lewat tanpa jejak.", studio: "Studio milik Anda.", copy: "Warna yang mengikuti bentuk. Karakter yang tinggal dalam ingatan.", motion: "Orbit sinematik · sorotan bergerak · studio malam" },
  { name: "Colour Chamber", title: "Bentuk baru. Karakter Anda.", studio: "Satu ruang. Tak terbatas.", copy: "Eksplorasi warna dan finishing. Lihat karakter Anda dari setiap sudut.", motion: "Kamera elevasi · bidang transparan · panggung material" },
];
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const readMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverMotion = () => true;

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className="lab-loading">WebGL belum tersedia. Buka tab Mockup visual untuk melihat rancangan lengkap.</p> : this.props.children; }
}

export function HeroStudioLab({ initialOption, initialMotion }: { initialOption: number; initialMotion: boolean }) {
  const [option, setOption] = useState(initialOption);
  const [motionMode, setMotionMode] = useState(initialMotion);
  const [moving, setMoving] = useState(true);
  const [dark, setDark] = useState(initialOption === 2);
  const [vehicle, setVehicle] = useState<StudioVehicle>("ducati");
  const [color, setColor] = useState(DECAL_COLORS[1]);
  const [finish, setFinish] = useState<FinishType>("Glossy");
  const [view, setView] = useState("orbit");
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const concept = directions[option - 1];
  const updateUrl = (next: number, motion: boolean) => window.history.replaceState(null, "", `?option=${next}${motion ? "&mode=motion" : ""}`);
  const selectOption = (next: number) => { setOption(next); setDark(next === 2); updateUrl(next, motionMode); };
  const selectMode = (next: boolean) => { setMotionMode(next); updateUrl(option, next); };
  const canvasProps = { option, dark, running: moving && !reduced, color, finish };
  return <div className={`lab-root lab-direction-${option}${dark ? " lab-dark" : ""}`}>
    <div className="lab-reviewbar"><Link href="/" className="lab-back">ZAN / DESIGN LAB</Link><div className="lab-direction-tabs" role="group" aria-label="Pilihan arah desain">{directions.map((item, index) => <button type="button" key={item.name} aria-pressed={option === index + 1} onClick={() => selectOption(index + 1)}>{String(index + 1).padStart(2, "0")} <span>{item.name}</span></button>)}</div><div className="lab-mode" role="group" aria-label="Mode preview"><button type="button" aria-pressed={!motionMode} onClick={() => selectMode(false)}>Mockup visual</button><button type="button" aria-pressed={motionMode} onClick={() => selectMode(true)}>Demo gerak 3D <ArrowUpRight size={13}/></button></div></div>
    {!motionMode ? <main className="lab-artboard"><div className="lab-art-caption"><div><span>EXPLORATION III / {concept.name.toUpperCase()}</span><h1>Hero & 3D Studio</h1></div><a href={`/design-preview/hero-studio-v3-${option}.png`} target="_blank" rel="noopener noreferrer">Buka gambar penuh <ArrowUpRight size={17}/></a></div><Image key={option} src={`/design-preview/hero-studio-v3-${option}.png`} alt={`Mockup ${option} ${concept.name}: hero dan ruang studio 3D Zan Decal`} width={1536} height={2048} sizes="100vw" unoptimized priority/><div className="lab-art-note"><p>Mockup ini menunjukkan arah visual lengkap. Demo gerak memperagakan model lokal, pergantian warna, pencahayaan, dan orbit kamera; detail artistik demo disederhanakan.</p><button type="button" onClick={() => selectMode(true)}>Coba demo gerak 3D <ArrowUpRight size={16}/></button></div><aside className="lab-research">Riset arah: <a href="https://lusion.co/projects/porsche_dream_machine/" target="_blank" rel="noopener noreferrer">Lusion / Porsche: Dream Machine</a> · <a href="https://www.awwwards.com/sites/lusion" target="_blank" rel="noopener noreferrer">Lusion / Awwwards</a></aside></main>
      : <main className="lab-demo"><div className="lab-demo-disclosure">DEMO GERAK / {concept.name.toUpperCase()} <span>Model 3D lokal · studi gerak dan ruang · detail artistik disederhanakan</span></div>
        <header className="lab-nav"><a href="#lab-hero" className="lab-wordmark">ZAN <span>DECAL</span></a><nav aria-label="Navigasi preview"><a href="#lab-studio">Studio</a><Link href="/#galeri">Karya</Link><Link href="/#konsultasi">Konsultasi <ArrowUpRight size={14}/></Link></nav><div><button type="button" aria-label={dark ? "Gunakan tema terang" : "Gunakan tema gelap"} onClick={() => setDark(!dark)}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button><button type="button" aria-label={moving ? "Jeda animasi" : "Putar animasi"} aria-pressed={moving} onClick={() => setMoving(!moving)}>{moving ? <Pause size={17}/> : <Play size={17}/>}</button></div></header>
        <section className="lab-hero" id="lab-hero"><div className="lab-hero-copy"><span className="lab-kicker">ZAN DECAL / COLOUR IN MOTION</span><h1>{concept.title}</h1><p>{concept.copy}</p><a className="lab-primary" href="#lab-studio">Masuki studio <ArrowUpRight size={20}/></a></div><div className="lab-hero-stage"><SceneBoundary key={`hero-${option}`}><MotionCanvas {...canvasProps} vehicle={option === 2 ? "ducati" : "car"} hero/></SceneBoundary></div><div className="lab-hero-bottom"><span>{concept.motion}</span><a href="#lab-studio">SCROLL TO EXPLORE <ArrowDown size={15}/></a></div></section>
        <section className="lab-studio" id="lab-studio"><div className="lab-studio-heading"><div><span className="lab-kicker">02 / LIVE DESIGN STUDIO</span><h2>{concept.studio}</h2></div><p>Putar model. Pilih warna.<br/>Temukan karakter Anda.</p></div>
          <div className="lab-workbench"><div className="lab-stage-top"><div role="group" aria-label="Pilih kendaraan"><button type="button" aria-pressed={vehicle === "car"} onClick={() => setVehicle("car")}>BYD Seal</button><button type="button" aria-pressed={vehicle === "ducati"} onClick={() => setVehicle("ducati")}>Ducati V4 S</button></div><div role="group" aria-label="Sudut kamera">{[["orbit", "Orbit"], ["front", "Depan"], ["side", "Samping"]].map(([id, label]) => <button type="button" key={id} aria-pressed={view === id} onClick={() => setView(id)}>{label}</button>)}</div></div>
            <div className="lab-studio-stage"><SceneBoundary key={`studio-${option}-${vehicle}`}><MotionCanvas {...canvasProps} vehicle={vehicle} view={view}/></SceneBoundary></div>
            <div className="lab-control-dock"><fieldset><legend>01 / CAT UTAMA</legend><div className="lab-swatches">{DECAL_COLORS.map(item => <button type="button" key={item.hex} style={{ background: item.hex }} aria-label={item.name} title={item.name} aria-pressed={color.hex === item.hex} onClick={() => setColor(item)}/>)}</div><p aria-live="polite">{color.name} <span>{color.hex}</span></p></fieldset><fieldset><legend>02 / FINISHING</legend><div className="lab-finishes">{(["Glossy", "Matte", "Satin", "Metallic"] as FinishType[]).map(item => <button type="button" key={item} aria-pressed={finish === item} onClick={() => setFinish(item)}>{item}</button>)}</div></fieldset><a className="lab-primary" href={`/#konsultasi`}>Konsultasikan konsep <ArrowUpRight size={20}/></a></div>
          </div><p className="lab-studio-hint"><RotateCw size={16}/> Geser untuk memutar · Scroll untuk mendekat · Pilihan warna hanya mengubah panel cat utama</p><p className="lab-model-license">Ducati: <a href="https://sketchfab.com/3d-models/2024-ducati-streetfighter-v4-s-c501252f8af64c559bf91dc306c3a550" target="_blank" rel="noopener noreferrer">OUTPISTON</a> / CC BY-NC-SA 4.0 · Tekstur cat disesuaikan untuk preview.</p>
        </section>
      </main>}
  </div>;
}
