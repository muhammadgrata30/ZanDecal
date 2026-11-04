"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Check, Pause, Play } from "lucide-react";
import { useSiteContent } from "../SiteContentContext";
import { materialDefaultFinish, type PreviewFinish } from "../../lib/material-preview";
import type { Material } from "../../lib/content-types";
import DecalImage from "./DecalImage";
import studio from "../StudioSections.module.css";
import { ScrollStage } from "../ScrollStage";
const subscribeMotion = (notify: () => void) => { const media = matchMedia("(prefers-reduced-motion:reduce)"); media.addEventListener("change", notify); return () => media.removeEventListener("change", notify); };
const readMotion = () => matchMedia("(prefers-reduced-motion:reduce)").matches;
const serverMotion = () => false;
function SpecificationContent({ material }: { material: Material }) {
  return <><span className="hm-eyebrow">{material.origin || "PILIHAN STUDIO"}</span><h3>{material.name}</h3><p>{material.desc}</p><dl>{[["Jenis", material.type], ["Kode", material.specCode], ["Elastisitas", material.elongation], ["Rentang suhu", material.tempRange]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><ul>{material.features.map((feature, index) => <li key={index}><Check size={14} />{feature}</li>)}</ul><a href="#konsultasi">Konsultasikan bahan ini <ArrowUpRight size={18} /></a></>;
}

export default function HomeMaterialSection() {
  const { materials, colors } = useSiteContent();
  const reduced = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const [selected, setSelected] = useState("");
  const [previousMaterial, setPreviousMaterial] = useState<Material | null>(null);
  const [colorId, setColorId] = useState("");
  const [finish, setFinish] = useState<PreviewFinish>(()=>materialDefaultFinish(materials[0]));
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const material = materials.find(item => item.id === selected) || materials[0];
  const color = colors.find(item => item.id === colorId) || colors.find(item => item.hex.toLowerCase() === "#a18cd1") || colors[0];
  const chooseMaterial = (id: string) => {
    if (id === material?.id) return;
    setPreviousMaterial(reduced ? null : material || null);
    setSelected(id);
  };
  useEffect(() => {
    if (!previousMaterial) return;
    const timer = window.setTimeout(() => setPreviousMaterial(null), 380);
    return () => window.clearTimeout(timer);
  }, [previousMaterial]);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let visible = false;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, { threshold: .02 });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <section className={`${studio.material} hm-material hm-flat${reduced ? " hm-reduced" : ""}`} id="material" aria-labelledby="hm-title">
    <ScrollStage className="hm-explorer-stage" distance={.45} top={0}><div className="hm-explorer-layout">
    <div ref={stage} className="hm-image-stage" data-paused={paused || !active || reduced}>
      <div className="hm-flat-heading"><span className="hm-eyebrow">03 / MATERIAL EXPLORER — ZAN DECAL</span><h2 id="hm-title"><span>BEDANYA</span><span>TERASA.</span></h2><p>Bukan sekadar warna.<br />Temukan permukaan yang jadi karaktermu.</p></div>
      <span className={studio.specimenLabel} aria-hidden="true">VINYL STUDY / 001</span>
      <div className="hm-decal-viewport"><DecalImage color={color?.hex || "#A18CD1"} colorName={color?.name || "Lavender"} finish={finish} paused={paused || !active} reduced={reduced} /></div>
      <div className="hm-flat-shade" aria-hidden="true" />
      <div className="hm-flat-caption" aria-live="polite"><span>SURFACE / {finish.toUpperCase()}</span><strong>{color?.name || "Lavender"}</strong><small>VINYL / COLOUR STUDY</small></div>
      <button className="hm-wind-control" type="button" onClick={() => setPaused(value => !value)} disabled={reduced} aria-pressed={!paused && !reduced} aria-label={paused ? "Putar animasi decal" : "Jeda animasi decal"}>{paused || reduced ? <Play size={16} /> : <Pause size={16} />}<span>{paused ? "Putar" : "Jeda"}</span></button>
    </div>
    <div className="hm-choices"><fieldset className="hm-finishes"><legend>FINISH PILIHAN</legend><div>{(["Gloss", "Satin", "Matte"] as const).map(item => <button key={item} type="button" aria-pressed={finish === item} onClick={() => setFinish(item)}>{item}</button>)}</div></fieldset><fieldset className="hm-colors"><legend>PILIH WARNA <strong>{color?.name}</strong></legend><div data-material-scroll>{colors.map(item => <button key={item.id} type="button" onClick={() => setColorId(item.id)} aria-label={item.name} aria-pressed={color?.id === item.id}><span style={{ backgroundColor: item.hex }}>{color?.id === item.id && <Check size={16} />}</span><strong>{item.name}</strong></button>)}</div></fieldset></div>
    </div></ScrollStage>
    <div className="hm-collection" id="material-detail"><div className="hm-material-list"><span className="hm-eyebrow">TEMUKAN KARAKTER PERMUKAANMU</span><h2>Koleksi <em>bahan.</em></h2><p>Arahkan ke nama bahan untuk mengenal detailnya. Di layar sentuh, ketuk pilihanmu.</p>{materials.map((item, index) => <button type="button" key={item.id} aria-pressed={item.id === material?.id} aria-controls="material-specification" onPointerEnter={event => { if (event.pointerType === "mouse") chooseMaterial(item.id); }} onFocus={() => chooseMaterial(item.id)} onClick={() => { chooseMaterial(item.id); if (matchMedia("(hover:none)").matches) requestAnimationFrame(() => document.getElementById("material-specification")?.scrollIntoView({ block: "nearest", behavior: reduced ? "instant" : "smooth" })); }}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.name}</strong><small>{item.type}</small></div><ArrowUpRight size={22} /></button>)}</div>
      <article className="hm-specification" id="material-specification" aria-label="Spesifikasi bahan pilihan"><div className="hm-spec-shell">{previousMaterial && !reduced && <div key={`out-${previousMaterial.id}`} className="hm-spec-sheet hm-spec-out" aria-hidden="true" inert><SpecificationContent material={previousMaterial} /></div>}{material ? <div className="hm-spec-sheet hm-spec-current" key={material.id}><SpecificationContent material={material} /></div> : <p>Belum ada bahan diterbitkan.</p>}</div></article>
    </div><p className="hm-note">Warna dan finish merupakan simulasi visual. Spesifikasi mengikuti bahan pilihan.</p>
  </section>;
}
