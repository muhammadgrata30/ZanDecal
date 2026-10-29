"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type * as THREE from "three";
import {
  Sparkles,
  Send,
  RotateCw,
  Layers,
  Palette,
  Check,
  MousePointerClick,
  Car,
  ExternalLink,
  ShieldCheck,
  Compass,
  Cpu,
  RefreshCw,
} from "lucide-react";

export type FinishType = "Glossy" | "Matte" | "Satin" | "Metallic";

export interface DecalColor {
  name: string;
  hex: string;
  accent: string;
  desc: string;
}

// 5 Pilihan Warna Decal
export const DECAL_COLORS: DecalColor[] = [
  { name: "Soft Pink", hex: "#FF9A9E", accent: "from-[#FF9A9E] to-[#FECFEF]", desc: "Zan Signature Pastel Pink" },
  { name: "Lavender Purple", hex: "#A18CD1", accent: "from-[#A18CD1] to-[#FBC2EB]", desc: "Cyber Studio Lavender" },
  { name: "Sky Blue", hex: "#8FD3F4", accent: "from-[#8FD3F4] to-[#84FAB0]", desc: "Aerodynamic Sky Cyan" },
  { name: "Cyber Magenta", hex: "#F43F5E", accent: "from-[#F43F5E] to-[#FB7185]", desc: "Vibrant Motorsport Magenta" },
  { name: "Stealth Black", hex: "#1E1E24", accent: "from-[#1E1E24] to-[#2E2E38]", desc: "Midnight Satin Stealth" },
];

export const FINISH_SPECS: Record<FinishType, { roughness: number; metalness: number; label: string; desc: string }> = {
  Glossy: { roughness: 0.1, metalness: 0.2, label: "Glossy", desc: "Refleksi jernih cermin wet-look" },
  Matte: { roughness: 0.7, metalness: 0.05, label: "Matte", desc: "Doff beludru anti-silau" },
  Satin: { roughness: 0.35, metalness: 0.25, label: "Satin", desc: "Semi-gloss mewah sentuhan sutra" },
  Metallic: { roughness: 0.2, metalness: 0.85, label: "Metallic", desc: "Pendaran butiran kristal metalik" },
};

// Indikator Loading Estetik
function VisualizerLoader() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#F8F9FE]/92 dark:bg-[#07050E]/92 backdrop-blur-xl">
      <div className="relative flex items-center justify-center w-20 h-20 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-t-[#FF9A9E] border-r-[#A18CD1] border-b-[#8FD3F4] border-l-transparent animate-spin" />
        <Car className="w-8 h-8 text-[#A18CD1] animate-pulse" />
      </div>
      <div className="text-center px-4">
        <div className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#A18CD1] mb-1">
          CONFIGURING 3D ENVIRONMENT
        </div>
        <div className="text-base font-black tracking-tight text-slate-900 dark:text-white">
          Memuat Model 3D BYD Seal EV
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
          Menginisialisasi PBR material, studio HDRI, dan penyesuaian skala mesh...
        </p>
      </div>
    </div>
  );
}

// Dynamic Client-Only Import untuk Kanvas 3D (Mencegah SSR Memory Overflow)
const DecalCanvas3D = dynamic(() => import("./DecalCanvas3D"), {
  ssr: false,
  loading: () => <VisualizerLoader />,
});

export default function DecalVisualizer3D() {
  const [selectedColor, setSelectedColor] = useState<DecalColor>(DECAL_COLORS[0]);
  const [selectedFinish, setSelectedFinish] = useState<FinishType>("Glossy");
  const [clickedMesh, setClickedMesh] = useState<THREE.Mesh | null>(null);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOrderWhatsApp = () => {
    const text =
      `Halo Studio Zan Decal, saya tertarik memesan decal dari 3D Visualizer:%0A%0A` +
      `🚗 Kendaraan: BYD Seal EV%0A` +
      `🎨 Warna Decal: ${encodeURIComponent(selectedColor.name)} (${selectedColor.hex})%0A` +
      `✨ Karakter Finishing: ${selectedFinish}%0A` +
      (clickedMesh ? `🎯 Target Khusus: Mesh "${clickedMesh.name}"%0A` : "") +
      `%0AMohon informasi jadwal konsultasi mockup dan antrian pemasangan studio. Terima kasih!`;

    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#A18CD1]/30 backdrop-blur-md mb-4 shadow-sm">
          <Car className="w-4 h-4 text-[#A18CD1]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            3D Decal Visualizer Studio
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
          Simulasi 3D Interaktif{" "}
          <span className="gradient-zan-text">BYD Seal EV</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Model 3D asli BYD Seal dengan refleksi studio real-time. Putar mobil 360°, coba kombinasi warna decal pastel & stealth, atau klik langsung bodi mobil untuk mewarnai part spesifik.
        </p>
      </div>

      {/* Main Studio Console Container */}
      <div className="relative rounded-3xl sm:rounded-[2rem] overflow-hidden bg-white/90 dark:bg-[#0C091A]/90 border border-slate-200/80 dark:border-white/12 shadow-2xl backdrop-blur-2xl transition-colors duration-300">
        
        {/* Telemetry Header Bar */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] p-0.5 shadow-md">
              <div className="w-full h-full rounded-2xl bg-white dark:bg-[#07050E] flex items-center justify-center">
                <Car className="w-5 h-5 text-[#A18CD1]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  BYD Seal EV // Studio Viewport
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  REAL-TIME GLB
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Orbit kamera 360° • Click-to-paint bodi • PBR Shaders
              </p>
            </div>
          </div>

          {/* Active Target Indicator Badge */}
          <div className="flex items-center gap-2 text-xs">
            {clickedMesh ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-[#A18CD1]/40 text-[#A18CD1] font-semibold">
                <MousePointerClick className="w-3.5 h-3.5 text-[#FF9A9E]" />
                Target: {clickedMesh.name || "Bagian Terpilih"}
                <button
                  type="button"
                  onClick={() => setClickedMesh(null)}
                  className="ml-1 text-[11px] underline hover:text-white flex items-center gap-0.5 cursor-pointer"
                  title="Kembali ke filter otomatis bodi"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-[#8FD3F4]" />
                Auto Body Filter ({matchedCount} parts aktif)
              </span>
            )}
          </div>
        </div>

        {/* 3D Canvas Viewport Area */}
        <div className="relative w-full h-[420px] sm:h-[500px] md:h-[580px] bg-gradient-to-b from-slate-100 via-slate-200/50 to-slate-100 dark:from-[#07050E] dark:via-[#110D24] dark:to-[#07050E] cursor-grab active:cursor-grabbing overflow-hidden">
          
          {/* Subtle Viewport Grid Lines */}
          <div className="absolute inset-0 pattern-grid-telemetry opacity-25 dark:opacity-20 pointer-events-none" />

          {/* Viewport Corner Crosshairs */}
          <div className="absolute top-4 left-4 text-slate-400 dark:text-slate-600 pointer-events-none select-none text-xs font-mono">
            + [TL 0,0]
          </div>
          <div className="absolute top-4 right-4 text-slate-400 dark:text-slate-600 pointer-events-none select-none text-xs font-mono">
            [TR 1,0] +
          </div>
          <div className="absolute bottom-12 left-4 text-slate-400 dark:text-slate-600 pointer-events-none select-none text-xs font-mono">
            + [BL 0,1]
          </div>
          <div className="absolute bottom-12 right-4 text-slate-400 dark:text-slate-600 pointer-events-none select-none text-xs font-mono">
            [BR 1,1] +
          </div>

          {/* R3F Canvas Mount */}
          {isMounted ? (
            <DecalCanvas3D
              color={selectedColor}
              finish={selectedFinish}
              clickedMesh={clickedMesh}
              setClickedMesh={setClickedMesh}
              setMatchedCount={setMatchedCount}
            />
          ) : (
            <VisualizerLoader />
          )}

          {/* Bottom Floating Viewport Controls Hints */}
          <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pointer-events-none">
            <span className="flex items-center gap-1.5 backdrop-blur-md bg-white/80 dark:bg-black/60 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-white/10 shadow-sm">
              <RotateCw className="w-3.5 h-3.5 text-[#A18CD1]" /> Drag 360° untuk memutar sudut pandang
            </span>
            <span className="hidden sm:flex items-center gap-1.5 backdrop-blur-md bg-white/80 dark:bg-black/60 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-white/10 shadow-sm">
              <MousePointerClick className="w-3.5 h-3.5 text-[#8FD3F4]" /> Klik bagian bodi untuk fitur Click-to-Paint
            </span>
          </div>
        </div>

        {/* UI CONTROL DOCK */}
        <div className="p-6 sm:p-8 bg-white/95 dark:bg-[#0B0818]/95 border-t border-slate-200/80 dark:border-white/10 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Pilihan Warna Decal */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#A18CD1]" />
                  Pilihan Warna Decal:
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                  {selectedColor.name} // <span className="text-[#A18CD1]">{selectedColor.hex}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {DECAL_COLORS.map((col) => {
                  const isSelected = selectedColor.hex === col.hex;
                  return (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-slate-100 dark:bg-white/10 border-[#A18CD1] ring-2 ring-[#A18CD1]/40 shadow-md scale-[1.02]"
                          : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${col.accent} shadow-md flex items-center justify-center mb-2 transition-transform relative ${
                          isSelected ? "scale-110" : ""
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {/* Specular gloss sheen overlay */}
                        <div className="absolute inset-0 rounded-xl bg-white/25 opacity-40 pointer-events-none" />
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow" />}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate w-full">
                        {col.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {col.hex}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pilihan Finishing */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8FD3F4]" />
                Tekstur Finishing Material:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["Glossy", "Matte", "Satin", "Metallic"] as FinishType[]).map((finish) => {
                  const isSelected = selectedFinish === finish;
                  const spec = FINISH_SPECS[finish];
                  return (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => setSelectedFinish(finish)}
                      className={`p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-slate-100 dark:bg-white/10 border-[#8FD3F4] ring-2 ring-[#8FD3F4]/40 shadow-md scale-[1.02]"
                          : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                      }`}
                    >
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {spec.label}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {spec.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Cast vinyl grade industri, 100% aman bagi cat asli BYD.</span>
              </div>
            </div>

          </div>

          {/* Tombol Order WhatsApp */}
          <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              Konfigurasi aktif: <strong className="text-slate-900 dark:text-white">{selectedColor.name}</strong> •{" "}
              <strong className="text-slate-900 dark:text-white">{selectedFinish} Finish</strong>
              {clickedMesh ? ` (Target: ${clickedMesh.name})` : " (Full Body)"}
            </div>

            <button
              type="button"
              onClick={handleOrderWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] shadow-lg shadow-[#A18CD1]/30 hover:shadow-xl hover:shadow-[#A18CD1]/45 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Order Konsep Ini via WhatsApp</span>
              <ExternalLink className="w-4 h-4 ml-0.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
