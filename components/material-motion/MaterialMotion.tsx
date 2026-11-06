"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Moon, Pause, Play, RotateCcw, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";
import { useSiteContent } from "../SiteContentContext";
import type { MotionControl } from "./MaterialScene";
import { materialPhase, materialTimeAtProgress } from "../../lib/material-motion";
import { materialDefaultFinish, type PreviewFinish } from "../../lib/material-preview";

const Scene = dynamic(() => import("./MaterialScene"), { ssr: false, loading: () => <div className="mm-loading">Menyiapkan panggung material 3D…</div> });
const concepts = [
  { name: "Unroll", title: <>BUKA<br />KARAKTERMU.</>, eyebrow: "UNROLL THE POSSIBILITIES", hint: "Gulungan membuka hingga memenuhi panggung.", action: "Buka gulungan", steps: ["TERGULUNG", "TERBUKA", "PERMUKAAN"] },
  { name: "Orbit", title: <>PUTAR.<br />RASAKAN. PILIH.</>, eyebrow: "MATERIAL ORBIT", hint: "Tiga bahan berputar dalam ruang. Klik lembar untuk memilih.", action: "Putar koleksi", steps: ["GESER", "BERPUTAR", "TERPILIH"] },
  { name: "Gallery", title: <>MASUK KE DUNIA<br />PERMUKAAN.</>, eyebrow: "THE MATERIAL GALLERY", hint: "Kamera melintasi lembar bahan setinggi ruangan.", action: "Jelajahi ruang", steps: ["MASUK", "MELINTAS", "TEMUKAN"] },
  { name: "Anatomy", title: <>LEBIH DALAM.<br />LEBIH PAHAM.</>, eyebrow: "SURFACE ANATOMY", hint: "Lapisan membuka dan menyatu lagi. Ilustrasi, bukan susunan teknis tiap produk.", action: "Urai lapisan", steps: ["UTUH", "TERURAI", "DETAIL"] },
  { name: "Touch", title: <>BEDANYA<br />TERASA.</>, eyebrow: "TOUCH THE DIFFERENCE", hint: "Tarik panggung ke samping untuk membentangkan lembar.", action: "Bentangkan bahan", steps: ["TARIK", "BENTANGKAN", "PILIH"] },
];
function subscribeReduced(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const readReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReduced = () => false;

class SceneBoundary extends Component<{ children: ReactNode; option: number }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidUpdate(previous: { option: number }) {
    if (previous.option !== this.props.option && this.state.failed) this.setState({ failed: false });
  }
  render() {
    return this.state.failed ? <div className="mm-webgl-fallback">Panggung 3D tidak dapat dimuat pada browser ini. <a href={`/design-preview/material-v2-${this.props.option}.png`}>Lihat gambar referensi ↗</a></div> : this.props.children;
  }
}

export default function MaterialMotion({ initialOption, wrapStudy = false }: { initialOption: number; wrapStudy?: boolean }) {
  const [option, setOption] = useState(initialOption);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [scrollMode, setScrollMode] = useState(false);
  const [active, setActive] = useState(true);
  const [economy, setEconomy] = useState(false);
  const [presentation, setPresentation] = useState<"sheet" | "wrap" | "duel">(wrapStudy ? "wrap" : "sheet");
  const [comparison, setComparison] = useState<PreviewFinish>("Matte");
  const [split, setSplit] = useState(.5);
  const [selected, setSelected] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [materialFinishes, setMaterialFinishes] = useState<Record<string, PreviewFinish>>({});
  const { theme, toggleTheme } = useTheme();
  const { materials, colors } = useSiteContent();
  const reduced = useSyncExternalStore(subscribeReduced, readReduced, serverReduced);
  const stage = useRef<HTMLElement>(null);
  const sceneSurface = useRef<HTMLDivElement>(null);
  const runway = useRef<HTMLDivElement>(null);
  const scrollTarget = useRef(0);
  const slider = useRef<HTMLInputElement>(null);
  const percent = useRef<HTMLOutputElement>(null);
  const drag = useRef<{ x: number; y: number; progress: number; locked: boolean } | null>(null);
  const control = useRef<MotionControl>({ time: 0, progress: .05, manual: false, playing: true, reduced: false, dragging: false, pointer: 0, restart: 0 });
  const isWrapStudy = wrapStudy && option === 5;
  const concept = isWrapStudy ? { ...concepts[4], title: <>SATU BAHAN.<br />DUA DUNIA.</>, eyebrow: "WRAP / COMPARE / DISCOVER", hint: presentation === "duel" ? "Geser pembatas untuk membandingkan dua finish pada warna yang sama." : "Tarik slider. Lembaran mengikuti bentuk panel kap mobil.", action: "Tarik untuk membungkus", steps: ["LEMBARAN", "MEMBUNGKUS", "TERPASANG"] } : concepts[option - 1];
  const material = materials.find(item => item.id === selected) || materials[0];
  const color = colors.find(item => item.id === selectedColor) || colors.find(item => item.hex.toLowerCase() === "#a18cd1") || colors[0];
  const finish = materialFinishes[material?.id || ""] || materialDefaultFinish(material);

  useEffect(() => {
    if (reduced || !sceneSurface.current) return;
    const entrance = sceneSurface.current.animate([
      { opacity: .15, transform: "translateY(12px) scale(.985)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ], { duration: 650, easing: "cubic-bezier(.16,1,.3,1)" });
    return () => entrance.cancel();
  }, [option, reduced, presentation]);

  useEffect(() => {
    control.current.playing = !paused && active;
    control.current.manual = manual;
    control.current.reduced = reduced;
    if (reduced) control.current.progress = .55;
  }, [paused, manual, reduced, active]);

  useEffect(() => {
    let inView = true;
    const update = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; update(); }, { threshold: .05 });
    if (stage.current) observer.observe(stage.current);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  useEffect(() => {
    if (!scrollMode) return;
    const update = () => {
      if (!runway.current) return;
      const rect = runway.current.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      scrollTarget.current = Math.max(0, Math.min(1, -rect.top / distance));
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    scrollTarget.current = control.current.progress;
    const frame = requestAnimationFrame(() => {
      if (!runway.current) return;
      const rect = runway.current.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top + control.current.progress * Math.max(1, rect.height - window.innerHeight), behavior: "instant" });
      update();
    });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [scrollMode]);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let previous = performance.now();
    let lastProgress = -1;
    const update = (now: number) => {
      const delta = Math.min((now - previous) / 1000, .05);
      previous = now;
      if (control.current.playing && !control.current.manual && !control.current.reduced && !control.current.dragging) {
        control.current.time += delta;
        control.current.progress = materialPhase(control.current.time);
      }
      if (scrollMode && !control.current.reduced) control.current.progress += (scrollTarget.current - control.current.progress) * (1 - Math.exp(-delta * 9));
      if (lastProgress !== control.current.progress) {
        lastProgress = control.current.progress;
        stage.current?.style.setProperty("--mm-progress", String(lastProgress));
        const value = String(Math.round(lastProgress * 100));
        if (slider.current && slider.current.value !== value) slider.current.value = value;
        if (percent.current && percent.current.value !== `${value}%`) percent.current.value = `${value}%`;
      }
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [active, scrollMode]);

  function chooseOption(next: number) {
    leaveScroll();
    setOption(next); setManual(false); setPaused(false); setScrollMode(false);
    control.current.time = 0; control.current.progress = .05;
    control.current.manual = false; control.current.dragging = false;
    const url = new URL(window.location.href); url.searchParams.set("option", String(next));
    window.history.replaceState(null, "", url);
  }
  function scrub(value: number) {
    control.current.progress = Math.max(0, Math.min(1, value));
    control.current.manual = true;
    setManual(true);
  }
  function replay() {
    leaveScroll();
    control.current.time = 0; control.current.progress = .05;
    control.current.manual = false; control.current.dragging = false;
    setManual(false); setPaused(false); setScrollMode(false);
  }
  function chooseMaterial(index: number) {
    const item = materials[index % Math.max(1, materials.length)];
    if (item) setSelected(item.id);
  }
  function togglePlayback() {
    leaveScroll();
    setScrollMode(false);
    if (manual) {
      control.current.time = materialTimeAtProgress(control.current.progress);
      control.current.manual = false;
      setManual(false); setPaused(false);
    } else setPaused(!paused);
  }
  function leaveScroll() {
    if (scrollMode && runway.current) window.scrollTo({ top: window.scrollY + runway.current.getBoundingClientRect().top, behavior: "instant" });
  }
  function toggleScroll() {
    if (scrollMode) { togglePlayback(); return; }
    control.current.manual = true;
    setManual(true); setPaused(false); setScrollMode(true);
  }
  function choosePresentation(next: "sheet" | "wrap" | "duel") {
    leaveScroll(); setScrollMode(false); setPresentation(next);
    if (next === "duel") { setPaused(true); setManual(true); control.current.manual = true; control.current.progress = 1; }
    else replay();
  }

  return <main className={`mm-page mm-option-${option}${isWrapStudy ? " mm-wrap-study" : ""}`}>
    <header className="mm-header"><Link href="/" className="mm-brand">ZAN DECAL<span>LIVE MATERIAL STUDIES</span></Link><div className="mm-header-actions"><Link href="/material-lab?option=1">Preview sebelumnya <ArrowUpRight size={14} /></Link><button type="button" onClick={toggleTheme} aria-label={`Aktifkan tema ${theme === "dark" ? "Light" : "Dark"}`}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}<span>{theme === "dark" ? "Light" : "Dark"}</span></button></div></header>
    <nav className="mm-tabs" aria-label="Lima mockup animasi" style={{ "--mm-active": option - 1 } as React.CSSProperties}>{concepts.map((item, index) => <button type="button" key={item.name} aria-pressed={option === index + 1} onClick={() => chooseOption(index + 1)}><span>0{index + 1}</span>{item.name}<ArrowUpRight size={15} /></button>)}</nav>
    <div ref={runway} className={`mm-runway${scrollMode ? " is-scroll-driven" : ""}`}>
    <section ref={stage} className="mm-stage" aria-label={`Mockup ${option}: ${concept.eyebrow}`}
      onPointerDown={event => {
        if (!(event.target instanceof HTMLCanvasElement) || scrollMode || reduced || !event.isPrimary || event.button !== 0) return;
        drag.current = { x: event.clientX, y: event.clientY, progress: control.current.progress, locked: false };
      }}
      onPointerMove={event => {
        const bounds = event.currentTarget.getBoundingClientRect();
        control.current.pointer = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
        if (drag.current && !drag.current.locked && Math.abs(event.clientY - drag.current.y) > Math.max(8, Math.abs(event.clientX - drag.current.x))) { drag.current = null; return; }
        if (drag.current && Math.abs(event.clientX - drag.current.x) > 8) {
          drag.current.locked = true; control.current.dragging = true;
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
          if (isWrapStudy && presentation === "duel") setSplit(Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)));
          else scrub(drag.current.progress + (event.clientX - drag.current.x) / (bounds.width * .7));
        }
      }}
      onPointerUp={event => { drag.current = null; control.current.dragging = false; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
      onPointerCancel={() => { drag.current = null; control.current.dragging = false; }}>
      <div ref={sceneSurface} className="mm-canvas"><SceneBoundary option={option}><Scene option={option} control={control} dark={theme === "dark"} color={color?.hex || "#A18CD1"} finish={finish} material={material} active={active} economy={economy} presentation={isWrapStudy ? presentation : "sheet"} comparison={comparison} split={split} onMaterial={chooseMaterial} /></SceneBoundary></div>
      {isWrapStudy && <nav className="mm-wrap-modes" aria-label="Tahap eksplorasi bahan">{(["sheet", "wrap", "duel"] as const).map((mode, index) => <button key={mode} type="button" aria-pressed={presentation === mode} onClick={() => choosePresentation(mode)}><span>0{index + 1}</span>{["Lembaran", "Bungkus", "Bandingkan"][index]}</button>)}</nav>}
      <div className="mm-stage-heading" key={`${option}/${presentation}`}><span className="mm-eyebrow">JENIS BAHAN / {concept.eyebrow}</span><h1>{concept.title}</h1></div>
      <span className="mm-ghost-type" aria-hidden="true">{["UNFOLD", "SURFACE", "GALLERY", "BENEATH", "FEEL IT"][option - 1]}</span>
      <span className="mm-stage-number" aria-hidden="true">0{option}</span>
      {material && <div className="mm-stage-material"><span className="mm-label">MATERIAL PILIHAN</span><strong key={material.id}>{material.name}</strong><span>{material.type}</span><span key={`${finish}/${color?.id}`}>{finish} / {color?.name || "Warna belum tersedia"}</span></div>}
      <div className="mm-caption"><span className="mm-status"><i />{isWrapStudy && presentation === "duel" ? `${finish.toUpperCase()} / ${comparison.toUpperCase()}` : reduced ? "REDUCED MOTION" : scrollMode ? "SCROLL UNTUK MENGGERAKKAN" : paused ? "ANIMASI DIJEDA" : manual ? "KONTROL MANUAL" : "ANIMASI LIVE / AUTO"}</span><p>{scrollMode ? "Gulir ke bawah untuk menjelajahi adegan. Gulir ke atas untuk membalikkan gerak." : concept.hint}</p></div>
      <div className="mm-stage-controls"><button type="button" onClick={() => setEconomy(!economy)} aria-pressed={economy}>Mode hemat</button><button type="button" onClick={toggleScroll} disabled={reduced} aria-pressed={scrollMode}><ArrowDown size={17} />{scrollMode ? "Mode scroll aktif" : "Ikuti scroll"}</button><button type="button" onClick={togglePlayback} disabled={reduced} aria-label={paused || manual ? "Putar animasi" : "Jeda animasi"}>{paused || manual ? <Play size={18} /> : <Pause size={18} />}{paused || manual ? "Putar" : "Jeda"}</button><button type="button" onClick={replay} disabled={reduced}><RotateCcw size={17} /><span>Ulangi</span></button></div>
    </section>
    </div>
    {isWrapStudy && <section className="mm-wrap-tools" aria-label="Konfigurasi panel dan perbandingan"><div className="mm-wrap-material"><label htmlFor="wrap-material">Bahan pilihan</label><select id="wrap-material" value={material?.id || ""} onChange={event => setSelected(event.target.value)}>{materials.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>{presentation === "duel" ? <><div className="mm-duel-range"><div><label htmlFor="duel-position">{finish} <span>↔</span> {comparison}</label><output>{Math.round(split * 100)}%</output></div><input id="duel-position" type="range" min="0" max="100" value={Math.round(split * 100)} onChange={event => setSplit(Number(event.target.value) / 100)} aria-label="Geser pembatas dua finish" /></div><div className="mm-duel-finish"><label htmlFor="right-finish">Finish kanan</label><select id="right-finish" value={comparison} onChange={event => setComparison(event.target.value as PreviewFinish)}>{["Gloss", "Satin", "Matte"].map(item => <option key={item}>{item}</option>)}</select></div></> : <p>Ilustrasi panel kap mobil. Warna dan finish mengikuti pilihanmu.</p>}</section>}
    <section className="mm-console" aria-label="Kendalikan animasi dan bahan">
      <div className="mm-timeline" hidden={isWrapStudy && presentation === "duel"}><div><label htmlFor="material-progress">{scrollMode ? "Gerak mengikuti scroll halaman" : concept.action}</label><output ref={percent} htmlFor="material-progress">5%</output></div><input ref={slider} id="material-progress" type="range" min="0" max="100" defaultValue="5" onChange={event => scrub(Number(event.target.value) / 100)} aria-label="Posisi animasi, geser untuk mengendalikan gerakan" disabled={reduced || scrollMode} /><div className="mm-steps">{concept.steps.map(step => <span key={step}>{step}</span>)}</div></div>
      <div className="mm-finishes"><span className="mm-label">{isWrapStudy && presentation === "duel" ? "FINISH KIRI" : "SIMULASI FINISH BAHAN"}</span><div>{(["Gloss", "Satin", "Matte"] as const).map(item => <button type="button" key={item} aria-pressed={finish === item} onClick={() => setMaterialFinishes(current => ({ ...current, [material?.id || ""]: item }))}>{item}</button>)}</div>{isWrapStudy && presentation === "duel" && finish === comparison && <p className="mm-duel-note">Kedua sisi memakai finish yang sama. Pilih finish berbeda untuk melihat perbandingan.</p>}</div>
      <div className="mm-colors"><div className="mm-color-heading"><span className="mm-label">PILIH WARNA</span><strong key={color?.id}>{color?.name || "Belum tersedia"}</strong></div><div className="mm-published-colors">{colors.map(item => <button key={item.id} type="button" aria-label={item.name} aria-pressed={color?.id === item.id} onClick={() => setSelectedColor(item.id)} style={{ "--swatch": item.hex } as React.CSSProperties}><span className="mm-color-swatch" aria-hidden="true" /><strong className="mm-color-name">{item.name}</strong><Check className="mm-color-check" size={15} aria-hidden="true" /></button>)}</div></div>
    </section>
    <section className="mm-materials" aria-label="Koleksi bahan dari admin">
      <div className="mm-material-list"><h2 className="mm-collection-heading">Koleksi <em>bahan.</em></h2>{materials.length ? materials.map((item, index) => <button key={item.id} type="button" aria-pressed={material?.id === item.id} onClick={() => setSelected(item.id)}><span className="mm-material-index">{String(index + 1).padStart(2, "0")}</span><div className="mm-material-title"><strong>{item.name}</strong>{item.type && <small>{item.type}</small>}</div><ArrowUpRight size={21} aria-hidden="true" /></button>) : <p>Belum ada bahan diterbitkan.</p>}</div>
      {material && <div className="mm-material-detail" key={material.id}><span className="mm-label">{material.origin || "PILIHAN STUDIO"}</span><h2>{material.name}</h2><p>{material.desc}</p><details><summary>Lihat spesifikasi bahan</summary><dl>{[["Jenis", material.type], ["Kode", material.specCode], ["Elastisitas", material.elongation], ["Rentang suhu", material.tempRange]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{material.features.map(feature => <p key={feature}>{feature}</p>)}</details><Link href="/#konsultasi">Konsultasikan bahan ini <ArrowUpRight size={20} /></Link></div>}
    </section>
    <footer className="mm-footer"><p>Eksplorasi visual 3D; warna dan finish adalah simulasi. Spesifikasi mengikuti bahan yang dipilih.</p><div><a href={`/design-preview/material-v2-${option}.png`} target="_blank" rel="noopener noreferrer">Gambar konsep <ArrowUpRight size={14} /></a><button type="button" onClick={() => chooseOption(option === 1 ? 5 : option - 1)} aria-label="Mockup sebelumnya"><ArrowLeft size={18} /></button><span>{option} / 5</span><button type="button" onClick={() => chooseOption(option === 5 ? 1 : option + 1)} aria-label="Mockup berikutnya"><ArrowRight size={18} /></button></div></footer>
  </main>;
}
