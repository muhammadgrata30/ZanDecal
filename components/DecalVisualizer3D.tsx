"use client";

import React, { useState } from "react";
import { useSiteContent } from "./SiteContentContext";
import dynamic from "next/dynamic";
import type * as THREE from "three";
import type { StudioVehicle } from "./vehiclePaint";
import { ArrowRight, Check, MessageCircle, MousePointerClick, RefreshCw, RotateCw } from "lucide-react";

export type FinishType = "Glossy" | "Matte" | "Satin" | "Metallic";

export interface DecalColor {
  name: string;
  hex: string;
  accent: string;
  desc: string;
  pantone: string;
}

// Shared palette for the live studio and vehicle configurator.
export const DECAL_COLORS: DecalColor[] = [
  { name: "Soft Pink", hex: "#FF9A9E", accent: "from-[#FF9A9E] to-[#FECFEF]", desc: "Zan Signature Pastel Pink", pantone: "PANTONE 13-1510" },
  { name: "Lavender Purple", hex: "#A18CD1", accent: "from-[#A18CD1] to-[#FBC2EB]", desc: "Cyber Studio Lavender", pantone: "PANTONE 15-3817" },
  { name: "Sky Blue", hex: "#8FD3F4", accent: "from-[#8FD3F4] to-[#84FAB0]", desc: "Aerodynamic Sky Cyan", pantone: "PANTONE 14-4318" },
  { name: "Cyber Magenta", hex: "#F43F5E", accent: "from-[#F43F5E] to-[#FB7185]", desc: "Vibrant Motorsport Magenta", pantone: "PANTONE 18-1763" },
  { name: "Stealth Black", hex: "#1E1E24", accent: "from-[#1E1E24] to-[#2E2E38]", desc: "Midnight Satin Stealth", pantone: "PANTONE 19-4007" },
  { name: "Racing Red", hex: "#D52232", accent: "from-[#D52232] to-[#F45A55]", desc: "Merah balap", pantone: "" },
  { name: "Burnt Orange", hex: "#E56B2F", accent: "from-[#E56B2F] to-[#F6AE63]", desc: "Oranye tembaga", pantone: "" },
  { name: "Solar Yellow", hex: "#F2CC38", accent: "from-[#F2CC38] to-[#FFE99C]", desc: "Kuning terang", pantone: "" },
  { name: "British Green", hex: "#165B46", accent: "from-[#165B46] to-[#439C75]", desc: "Hijau klasik", pantone: "" },
  { name: "Cobalt Blue", hex: "#244CBB", accent: "from-[#244CBB] to-[#668DEB]", desc: "Biru kobalt", pantone: "" },
  { name: "Pearl White", hex: "#EEEDE5", accent: "from-[#EEEDE5] to-[#FFFFFF]", desc: "Putih mutiara", pantone: "" },
  { name: "Titanium Silver", hex: "#929CA6", accent: "from-[#929CA6] to-[#DCE2E7]", desc: "Abu titanium", pantone: "" },
];

export const FINISH_SPECS: Record<FinishType, { roughness: number; metalness: number; label: string; desc: string; coat: number }> = {
  Glossy: { roughness: 0.1, metalness: 0.2, label: "Glossy", desc: "Refleksi jernih cermin wet-look", coat: 1.0 },
  Matte: { roughness: 0.7, metalness: 0.05, label: "Matte", desc: "Doff beludru anti-silau", coat: 0.0 },
  Satin: { roughness: 0.35, metalness: 0.25, label: "Satin", desc: "Semi-gloss mewah sentuhan sutra", coat: 0.4 },
  Metallic: { roughness: 0.2, metalness: 0.85, label: "Metallic", desc: "Pendaran butiran kristal metalik", coat: 0.8 },
};

function VisualizerLoader() {
  return <div className="atelier-canvas-loading"><span/><p>Menyiapkan model 3D…</p></div>;
}
const DecalCanvas3D = dynamic(() => import("./DecalCanvas3D"), { ssr: false, loading: () => <VisualizerLoader/> });
interface VisualizerProps {
  color?: DecalColor;
  finish?: FinishType;
  onColorChange?: (color: DecalColor) => void;
  onFinishChange?: (finish: FinishType) => void;
}
export default function DecalVisualizer3D({color, finish, onColorChange, onFinishChange}: VisualizerProps = {}) {
  const {colors:palette}=useSiteContent();
  const [localColor, setLocalColor] = useState<DecalColor>(DECAL_COLORS[1]);
  const [localFinish, setLocalFinish] = useState<FinishType>("Glossy");
  const [clickedMesh, setClickedMesh] = useState<THREE.Mesh | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [vehicle, setVehicle] = useState<StudioVehicle>("car");
  const vehicleName = vehicle === "car" ? "BYD Seal EV" : "Ducati Streetfighter V4 S";
  const selectVehicle = (next: StudioVehicle) => {
    if (next === vehicle) return;
    setClickedMesh(null);
    setMatchedCount(0);
    setVehicle(next);
  };
  const selectedColor = color ?? palette.find(item=>item.hex===localColor.hex) ?? palette[0];
  const selectedFinish = finish ?? localFinish;
  const selectColor = (next: DecalColor) => { setLocalColor(next); onColorChange?.(next); };
  const selectFinish = (next: FinishType) => { setLocalFinish(next); onFinishChange?.(next); };
  const currentSpec = FINISH_SPECS[selectedFinish];
  const handleOrderWhatsApp = () => {
    const message = `Halo Studio Zan Decal, saya tertarik memesan decal dari 3D Visualizer:\n\nKendaraan: ${vehicleName}\nWarna Decal: ${selectedColor.name} (${selectedColor.hex})\nFinishing: ${selectedFinish}\n${clickedMesh ? `Target khusus: ${clickedMesh.name}\n` : "Target: Full Body\n"}\nMohon informasi jadwal konsultasi mockup dan antrian pemasangan studio. Terima kasih!`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };
  return <div className="atelier-configurator">
    <div className="atelier-config-heading"><span className="atelier-kicker">02 <span/> THE PLAYGROUND</span><h2>3D STUDIO</h2><p>VISUALISASI REAL-TIME<br/><span>Pilih warna. Eksplorasi finish. Lihat dari segala sudut.</span></p></div>
    <div className="atelier-vehicle-options" role="group" aria-label="Pilih kendaraan 3D">
      <button type="button" aria-pressed={vehicle === "car"} onClick={() => selectVehicle("car")}><span>01 / MOBIL</span><strong>BYD Seal</strong></button>
      <button type="button" aria-pressed={vehicle === "ducati"} onClick={() => selectVehicle("ducati")}><span>02 / MOTOR SPORT</span><strong>Ducati Streetfighter V4 S</strong></button>
    </div>
    <div className="atelier-config-grid">
      <div className="atelier-car-stage">
        <div className="atelier-stage-label"><span aria-live="polite">{vehicleName.toUpperCase()}</span><span>360° INTERACTIVE</span></div>
        <div className="atelier-car-canvas"><DecalCanvas3D key={vehicle} vehicle={vehicle} color={selectedColor} finish={selectedFinish} clickedMesh={clickedMesh} setClickedMesh={setClickedMesh} setMatchedCount={setMatchedCount}/></div>
        <div className="atelier-orbit-hint"><RotateCw size={16}/><span>Geser untuk memutar · Scroll untuk zoom</span><MousePointerClick size={16}/></div>
        {vehicle === "ducati" && <p className="atelier-model-credit"><a href="https://sketchfab.com/3d-models/2024-ducati-streetfighter-v4-s-c501252f8af64c559bf91dc306c3a550" target="_blank" rel="noopener noreferrer">2024 Ducati Streetfighter V4 S</a> oleh OUTPISTON · <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> · Warna dan finishing disesuaikan.</p>}
      </div>
      <div className="atelier-config-controls">
        <fieldset><legend>PILIH WARNA</legend><div className="atelier-color-options">{palette.map(item => <button key={item.hex} className="atelier-color-option" onClick={() => selectColor(item)} aria-label={`Warna ${item.name}`} aria-pressed={selectedColor.hex === item.hex} title={item.name}><span style={{backgroundColor:item.hex}}>{selectedColor.hex === item.hex && <Check size={16} color={item.name === "Stealth Black" ? "#F4F3FA" : "#07050E"}/>}</span></button>)}</div><p className="atelier-selected-color" aria-live="polite"><strong>{selectedColor.name}</strong><span>{selectedColor.hex}</span></p></fieldset>
        <fieldset><legend>PILIH FINISH</legend><div className="atelier-finish-options">{(Object.keys(FINISH_SPECS) as FinishType[]).map(item => <button key={item} onClick={() => selectFinish(item)} aria-pressed={selectedFinish === item}><span className={`atelier-finish-sample finish-${item.toLowerCase()}`} style={{backgroundColor:selectedColor.hex}}/><span>{item}</span></button>)}</div><p className="atelier-finish-description" aria-live="polite">{currentSpec.desc}</p></fieldset>
        <div className="atelier-target-info">{clickedMesh ? <><p>Bagian terpilih <strong>{clickedMesh.name || "Bodi kendaraan"}</strong></p><button onClick={() => setClickedMesh(null)}><RefreshCw size={13}/> Kembali ke seluruh bodi</button></> : <p><MousePointerClick size={14}/> Klik bodi untuk mewarnai bagian tertentu.</p>}<small>{matchedCount} material bodi aktif</small></div>
        <button className="atelier-button atelier-config-cta" onClick={handleOrderWhatsApp}><MessageCircle size={19}/> Konsultasi konsep ini <ArrowRight size={17}/></button>
        <p className="atelier-config-summary">{selectedColor.name} / {selectedFinish}<br/><span>Warna di layar dapat berbeda dari material asli.</span></p>
      </div>
    </div>
  </div>;
}
