"use client";

import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowUpRight, Pause, Play, RotateCw, Check } from "lucide-react";
import { useTheme } from "../ThemeContext";
import { useSiteContent } from "../SiteContentContext";
import { FINISH_SPECS, type FinishType } from "../DecalVisualizer3D";
import type { StudioVehicle } from "../vehiclePaint";
import { clamp01, journeyPose, studioEntrancePose } from "./journeyMath";
import type { StudioSequence } from "./HeroStudioSequence";

const Scene = dynamic(() => import("./JourneyScene"), { ssr: false, loading: () => <div className="journey-scene-loading">Menyiapkan ruang 3D…</div> });
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const readMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverMotion = () => false;

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="journey-scene-loading"><p>Preview 3D belum dapat dimuat.</p><a href="#konsultasi">Konsultasikan konsep Anda <ArrowUpRight size={16}/></a></div> : this.props.children; }
}

export function DrivingExperience({ studioOnly = false, sequence }: { studioOnly?: boolean; sequence?:StudioSequence } = {}) {
  const root = useRef<HTMLDivElement>(null);
  const entranceProgress = useRef(0);
  const progress = useRef(studioOnly ? .53 : 0);
  const [stage, setStage] = useState<"hero" | "transition" | "studio">(studioOnly ? "transition" : "hero");
  const currentStage = useRef(stage);
  const [active, setActive] = useState(!studioOnly);
  const activeFlag = useRef(!studioOnly);
  const [loadScene, setLoadScene] = useState(!studioOnly);
  const [paused, setPaused] = useState(false);
  const [vehicle, setVehicle] = useState<StudioVehicle>("ducati");
  const {colors}=useSiteContent();
  const [colorId,setColorId]=useState("");
  const color=colors.find(item=>item.id===colorId)||colors[1]||colors[0];
  const [finish, setFinish] = useState<FinishType>("Glossy");
  const [view, setView] = useState("orbit");
  const [wheels, setWheels] = useState(0);
  const { theme } = useTheme();
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const onReady = useCallback((count: number) => setWheels(count), []);

  useEffect(() => {
    const selectFinish = (event: Event) => {
      const next = (event as CustomEvent<FinishType>).detail;
      if (next in FINISH_SPECS) setFinish(next);
    };
    window.addEventListener("zan:finish", selectFinish);
    return () => window.removeEventListener("zan:finish", selectFinish);
  }, []);

  useEffect(() => {
    const element = root.current;
    const pin = element?.querySelector<HTMLElement>(".journey-pin");
    if (!element || !pin) return;
    let frame = 0, visible = true, previousTime = 0;
    const updateActivity=()=>{
      const next=visible&&!document.hidden&&(!sequence||sequence.progress.current>.001);
      if(activeFlag.current!==next){activeFlag.current=next;setActive(next);}
    };
    const measure = () => {
      if(reduced)return 1;
      if(sequence)return sequence.progress.current;
      const rect = element.getBoundingClientRect();
      return clamp01(-rect.top / Math.max(1, element.offsetHeight - pin.offsetHeight));
    };
    const write = () => {
      const pose = journeyPose(progress.current);
      const entrance = studioEntrancePose(entranceProgress.current);
      element.style.setProperty("--journey", String(progress.current));
      element.style.setProperty("--hero-opacity", String(pose.heroOpacity));
      element.style.setProperty("--hero-y", `${-(1 - pose.heroOpacity) * 65}px`);
      const controls = studioOnly ? entrance.controls : pose.studio;
      element.style.setProperty("--studio-opacity", String(controls));
      element.style.setProperty("--studio-y", `${(1 - controls) * 65}px`);
      element.style.setProperty("--garage-shutter", String(reduced ? 0 : studioOnly ? entrance.shutter : pose.shutter));
      const next = studioOnly ? controls > .99 ? "studio" : "transition" : progress.current > .9 ? "studio" : progress.current > .32 ? "transition" : "hero";
      if (currentStage.current !== next) { currentStage.current = next; setStage(next); }
    };
    const tick = (time: number) => {
      frame = 0;
      const target = measure();
      const dt = Math.min((time - (previousTime || time - 16)) / 1000, .05);
      previousTime = time;
      entranceProgress.current += (target - entranceProgress.current) * (1 - Math.exp(-dt * 12));
      if (Math.abs(target - entranceProgress.current) < .0002) entranceProgress.current = target;
      progress.current = studioOnly ? studioEntrancePose(entranceProgress.current).journey : entranceProgress.current;
      write();
      if (visible && entranceProgress.current !== target) frame = requestAnimationFrame(tick);
    };
    const schedule = () => { if (!sequence && visible && !frame) { previousTime = 0; frame = requestAnimationFrame(tick); } };
    const syncSequence=()=>{
      entranceProgress.current=measure();
      progress.current=studioOnly?studioEntrancePose(entranceProgress.current).journey:entranceProgress.current;
      if(entranceProgress.current>.02)setLoadScene(true);
      updateActivity();
      write();
    };
    const unsubscribe=sequence?.subscribe(syncSequence);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateActivity();
      if (visible) setLoadScene(true);
      if (visible) schedule();
    }, { rootMargin: studioOnly ? "300px" : "0px" });
    observer.observe(element);
    const visibility = () => { updateActivity(); if (!document.hidden) schedule(); };
    const resize = new ResizeObserver(schedule);
    resize.observe(element); resize.observe(pin);
    document.addEventListener("visibilitychange", visibility);
    if(!sequence)window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    entranceProgress.current = measure();
    progress.current = studioOnly ? studioEntrancePose(entranceProgress.current).journey : entranceProgress.current;
    write();
    return () => {
      observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame);
      unsubscribe?.();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [reduced, studioOnly, sequence]);

  const consult = () => {
    const message = `Halo Zan Decal, saya ingin konsultasi konsep 3D:\nKendaraan: ${vehicle === "ducati" ? "Ducati Streetfighter V4 S" : "BYD Seal EV"}\nWarna cat utama: ${color.name} (${color.hex})\nFinishing: ${finish}`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };
  return <div ref={root} id={studioOnly ? undefined : "beranda"} className={`driving-journey${reduced ? " is-reduced" : ""}${studioOnly ? " is-studio-only" : ""}${sequence?" is-sequenced":""}`} data-stage={stage} data-wheel-count={wheels}>
    {!sequence&&<div id="3d-studio" className="journey-studio-anchor" aria-hidden="true"/>}
    <div className="journey-pin">
      <div className="journey-canvas">{wheels === 0 && <div className="journey-model-loading" role="status">Menyiapkan {vehicle === "ducati" ? "Ducati" : "BYD Seal"}?</div>}<SceneBoundary>{loadScene && <Scene progress={progress} vehicle={vehicle} palette={colors} color={color} finish={finish} dark={theme === "dark"} running={!paused && !reduced} active={active} studio={stage === "studio"} view={view} onReady={onReady}/>}</SceneBoundary></div>
      <div className="journey-garage-shutter" aria-hidden="true"><div><span>AUTOMOTIVE WRAP & CUSTOM DECAL</span><strong>ZAN DECAL</strong><span>COLOUR · CRAFT · CHARACTER</span></div></div>
      <div className="journey-model-switch" role="group" aria-label="Pilih kendaraan 3D">
        <span>ZAN DECAL / STUDIO</span><div>{([["ducati", "Ducati V4 S"], ["car", "BYD Seal"]] as const).map(([id, name]) => <button type="button" key={id} aria-pressed={vehicle === id} onClick={() => { setWheels(0); setVehicle(id); }}>{name}</button>)}</div>
      </div>
      {!studioOnly && <section className="journey-hero" aria-labelledby="journey-title" aria-hidden={!reduced && stage !== "hero"} inert={!reduced && stage !== "hero"}>
        <div className="journey-side-index" aria-hidden="true"><span>COLOUR</span><i/><span>FORM</span><i/><span>EXPRESSION</span></div>
        <div className="journey-hero-copy"><span className="journey-kicker">AUTOMOTIVE WRAP & CUSTOM DECAL</span><h1 id="journey-title"><span>Bukan sekadar warna.</span><em><b>INI</b><br/><b>KARAKTER.</b></em></h1><p className="journey-manifesto">Bawa identitasmu ke jalan.<br/>Dibentuk presisi. Dikenali sekali lihat.</p><a href="#3d-studio" className="journey-primary">Masuki 3D Studio <ArrowUpRight size={20}/></a></div>
        <a href="#3d-studio" className="journey-scroll"><ArrowDown size={17}/><span>SCROLL TO REVEAL</span></a>
      </section>}
      <section className="journey-studio" aria-labelledby="journey-studio-title" aria-hidden={stage !== "studio"} inert={stage !== "studio"}>
        <div className="journey-studio-heading"><span className="journey-kicker">02 / DESIGN CHAMBER</span><h2 id="journey-studio-title">Satu ruang.<br/>Tak terbatas.</h2></div>
        <div className="journey-camera" role="group" aria-label="Sudut kamera studio">{[["orbit", "Orbit"], ["front", "Depan"], ["side", "Samping"]].map(([id, name]) => <button type="button" key={id} aria-pressed={view === id} onClick={() => setView(id)}>{name}</button>)}</div>
        <div className="journey-control-rail">
          <fieldset><legend><span>01</span> Model</legend><div className="journey-vehicle-options">{([["ducati", "Ducati"], ["car", "Mobil"]] as const).map(([id, name]) => <button type="button" key={id} aria-pressed={vehicle === id} onClick={() => { setWheels(0); setVehicle(id); }}>{name}</button>)}</div></fieldset>
          <fieldset><legend><span>02</span> Warna utama</legend><div className="journey-swatches">{colors.map(item => <button type="button" key={item.hex} style={{ backgroundColor: item.hex }} title={item.name} aria-label={`Cat utama ${item.name}`} aria-pressed={color.hex === item.hex} onClick={() => setColorId(item.id)}>{color.hex === item.hex && <Check size={14} color={item.name === "Stealth Black" ? "#fff" : "#17131e"}/>}</button>)}</div><p className="journey-color-name" aria-live="polite">{color.name}</p></fieldset>
          <fieldset><legend><span>03</span> Finishing</legend><div className="journey-finishes">{(Object.keys(FINISH_SPECS) as FinishType[]).map(item => <button type="button" key={item} aria-pressed={finish === item} onClick={() => setFinish(item)}>{item}</button>)}</div></fieldset>
          <button type="button" className="journey-primary" onClick={consult}>Konsultasikan konsep <ArrowUpRight size={18}/></button>
        </div>
        <p className="journey-orbit-hint"><RotateCw size={16}/><span>Geser untuk memutar · Cubit dua jari untuk zoom · Scroll untuk lanjut</span></p>
        <p className="journey-credit">Ducati oleh <a href="https://sketchfab.com/3d-models/2024-ducati-streetfighter-v4-s-c501252f8af64c559bf91dc306c3a550" target="_blank" rel="noopener noreferrer">OUTPISTON</a> · CC BY-NC-SA 4.0 · Tekstur cat disesuaikan.</p>
      </section>
      <button type="button" className="journey-motion-toggle" aria-label={paused ? "Aktifkan gerak ambient" : "Jeda gerak ambient"} aria-pressed={!paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={14}/> : <Pause size={14}/>}<span>{paused ? "Putar" : "Jeda"}</span></button>
      <div className="journey-track" aria-hidden="true"><span/></div>
    </div>
  </div>;
}
