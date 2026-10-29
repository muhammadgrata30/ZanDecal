"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Box,
  MessageSquare,
  ShieldCheck,
  Layers,
  Wand2,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Eye,
  Sliders,
  Gauge,
  Compass,
  Activity,
  Flame,
} from "lucide-react";

// Interactive showcase finishes
const FINISH_PREVIEWS = [
  {
    id: "chameleon",
    name: "Chameleon Cyber Shift",
    tag: "Signature Tri-Tone",
    gradient: "from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4]",
    accent: "#A18CD1",
    desc: "Perubahan gradasi warna dinamis mengikuti sudut pencahayaan studio.",
    specCode: "SPEC-01 // PRISMATIC SPECTRUM",
    reflectivity: "98% Specular",
    durability: "7 Tahun Outdoor",
    finishType: "Ultra-Gloss Chameleon",
  },
  {
    id: "satin-purple",
    name: "Satin Stealth Lavender",
    tag: "Ultra Matte Finish",
    gradient: "from-[#6B5B95] via-[#A18CD1] to-[#D8B4E2]",
    accent: "#A18CD1",
    desc: "Tekstur satin halus anti-silau dengan refleksi cahaya elegan.",
    specCode: "SPEC-02 // VELVET SATIN",
    reflectivity: "15% Diffuse",
    durability: "6 Tahun Outdoor",
    finishType: "Silk Satin Doff",
  },
  {
    id: "neo-cyan",
    name: "Neo Cyan Racing Spec",
    tag: "Motorsport Cast",
    gradient: "from-[#4FACFE] via-[#00F2FE] to-[#8FD3F4]",
    accent: "#8FD3F4",
    desc: "Aksen cyan tajam terinspirasi dari aero racing livery sirkuit modern.",
    specCode: "SPEC-03 // CIRCUIT AERODYNAMICS",
    reflectivity: "92% Gloss",
    durability: "5 Tahun Extreme Track",
    finishType: "Competition Cast",
  },
  {
    id: "candy-pink",
    name: "Sunset Candy Flare",
    tag: "High-Gloss Polymeric",
    gradient: "from-[#FA709A] via-[#FEE140] to-[#FF9A9E]",
    accent: "#FF9A9E",
    desc: "Kilap mendalam layaknya pernis permen dengan proteksi UV jangka panjang.",
    specCode: "SPEC-04 // DEEP CANDY FLARE",
    reflectivity: "99% Wet-Look",
    durability: "7 Tahun Outdoor",
    finishType: "Polymeric Multi-Layer",
  },
];

export function HeroSection() {
  const [activeFinish, setActiveFinish] = useState(FINISH_PREVIEWS[0]);

  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-36 overflow-hidden">
      {/* MONUMENTAL BACKGROUND WATERMARK */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none -z-10 w-full overflow-hidden flex justify-center">
        <span className="text-[14vw] font-black tracking-tighter uppercase text-slate-200/40 dark:text-white/[0.02] leading-none whitespace-nowrap">
          ZAN ATELIER
        </span>
      </div>

      {/* Dynamic Ambient Horizon Stage Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] lg:w-[1200px] h-[400px] bg-gradient-to-r from-[#FF9A9E]/15 via-[#A18CD1]/20 to-[#8FD3F4]/15 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-80 h-80 bg-[#FF9A9E]/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8FD3F4]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Automotive Telemetry Grid Lines */}
      <div className="absolute inset-0 pattern-grid-telemetry opacity-30 dark:opacity-20 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP STATUS TELEMETRY BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-slate-200/80 dark:border-white/10 text-[11px] font-mono tracking-wider">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9A9E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF9A9E]"></span>
            </span>
            <span className="text-slate-900 dark:text-white font-bold uppercase tracking-[0.2em]">
              ZAN DECAL // BESPOKE AUTOMOTIVE ATELIER
            </span>
          </div>
          <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#8FD3F4]" /> 3D SIMULATION CALIBRATED
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#A18CD1]" /> BYD SEAL & MOTORSPORT SPEC
            </span>
          </div>
        </div>

        {/* HERO MAIN EDITORIAL COMPOSITION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Left Column: Monumental Headline & Core CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Required Badge: 'Premium Decal & Custom Sticker Studio' */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 dark:bg-white/[0.04] border border-[#A18CD1]/40 shadow-sm backdrop-blur-xl mb-7 hover:border-[#8FD3F4]/70 transition-all">
              <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#FF9A9E] to-[#A18CD1]" />
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] bg-clip-text text-transparent">
                Premium Decal & Custom Sticker Studio
              </span>
            </div>

            {/* Required Headline: 'Transformasi Visual Tanpa Batas untuk Kendaraan Anda' */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.6rem] font-black tracking-tight leading-[1.03] mb-7 text-slate-900 dark:text-white">
              Transformasi Visual{" "}
              <span className="gradient-zan-text block lg:inline-block">
                Tanpa Batas
              </span>{" "}
              untuk Kendaraan Anda
            </h1>

            {/* Supporting Editorial Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed font-normal">
              Dari full car wrap, livery racing motor sport, hingga custom cutting sticker presisi tinggi. 
              Dikerjakan dengan material ultra-cast vinyl bergaransi dan teknologi simulasi digital 3D sebelum instalasi.
            </p>

            {/* Required 2 CTAs: 'Coba 3D Visualizer' & 'Konsultasi Custom' (NO PRICE MENTION) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
              {/* CTA 1: Coba 3D Visualizer */}
              <a
                href="#3d-studio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] shadow-xl shadow-[#A18CD1]/30 hover:shadow-2xl hover:shadow-[#A18CD1]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
              >
                <Box className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Coba 3D Visualizer</span>
                <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* CTA 2: Konsultasi Custom */}
              <a
                href="#konsultasi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-2xl font-bold text-sm sm:text-base text-slate-800 dark:text-white bg-white/90 dark:bg-white/[0.04] border border-slate-300 dark:border-white/12 backdrop-blur-xl hover:bg-white dark:hover:bg-white/10 hover:border-[#A18CD1] transition-all duration-200 shadow-sm"
              >
                <MessageSquare className="w-5 h-5 text-[#A18CD1]" />
                <span>Konsultasi Custom</span>
              </a>
            </div>

            {/* Trust and Engineering Highlights (Zero Prices) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-200/80 dark:border-white/10 w-full text-left">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-xl bg-pink-500/15 text-[#FF9A9E]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">Cat Asli Aman</div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Zero Adhesive Residue</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-xl bg-purple-500/15 text-[#A18CD1]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">Ultra-Cast Vinyl</div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Air-Release Channels</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 rounded-xl bg-cyan-500/15 text-[#8FD3F4]">
                    <Wand2 className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">Presisi CNC Vector</div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">Custom 1-on-1 Fitting</div>
              </div>
            </div>

          </div>

          {/* Right Column: High-Impact Automotive Studio Stage Simulator */}
          <div className="lg:col-span-5 relative">
            
            {/* Illuminated Outer Halo */}
            <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#FF9A9E]/30 via-[#A18CD1]/40 to-[#8FD3F4]/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="relative rounded-[2.2rem] p-6 sm:p-8 bg-white/95 dark:bg-[#0A0716]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 shadow-2xl">
              
              {/* Studio Stage Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF9A9E] shadow-sm shadow-[#FF9A9E]/50" />
                  <span className="w-3 h-3 rounded-full bg-[#A18CD1] shadow-sm shadow-[#A18CD1]/50" />
                  <span className="w-3 h-3 rounded-full bg-[#8FD3F4] shadow-sm shadow-[#8FD3F4]/50" />
                  <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-400 ml-2">
                    TURNTABLE // STUDIO SIM
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider bg-[#8FD3F4]/15 text-[#2481aa] dark:text-[#8FD3F4] border border-[#8FD3F4]/30">
                  <Eye className="w-3.5 h-3.5" /> Live Render
                </span>
              </div>

              {/* Stage Viewport Area */}
              <div className="relative my-6 py-10 px-4 rounded-3xl bg-gradient-to-b from-slate-100 to-slate-200/70 dark:from-[#05030C] dark:to-[#120D26] border border-slate-200/70 dark:border-white/5 overflow-hidden flex flex-col items-center justify-center min-h-[280px]">
                
                {/* Dynamic stage spotlight mapped to finish */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${activeFinish.gradient} opacity-25 blur-3xl transition-all duration-700`}
                />

                {/* Plotter vector alignment grid */}
                <div className="absolute inset-0 pattern-grid-telemetry opacity-25 pointer-events-none" />

                {/* Top Badge Stamp */}
                <div className="absolute top-4 left-4 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  {activeFinish.specCode}
                </div>

                <div className="absolute top-4 right-4 bg-white/90 dark:bg-[#07050E]/90 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-xl text-[11px] font-mono text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{activeFinish.tag}</span>
                </div>

                {/* Silhouette GT Vehicle Graphic with Live Shader */}
                <div className="relative w-full max-w-[360px] h-36 flex items-center justify-center my-3">
                  <svg
                    viewBox="0 0 420 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto drop-shadow-2xl"
                  >
                    <defs>
                      <linearGradient id="bodyFinishHero" x1="0%" y1="0%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#FF9A9E" />
                        <stop offset="50%" stopColor="#A18CD1" />
                        <stop offset="100%" stopColor="#8FD3F4" />
                      </linearGradient>
                      <linearGradient id="windowTintHero" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#07050E" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#17112E" stopOpacity="0.95" />
                      </linearGradient>
                    </defs>

                    {/* Ground reflection shadow */}
                    <ellipse cx="210" cy="128" rx="195" ry="9" fill="#000000" fillOpacity="0.45" />

                    {/* Aerodynamic GT Silhouette Body */}
                    <path
                      d="M 40 102 
                         C 40 92, 55 90, 75 88 
                         C 95 86, 120 84, 145 68 
                         C 170 52, 215 42, 280 44 
                         C 320 45, 345 62, 370 78 
                         C 390 90, 405 98, 405 106 
                         L 400 114 
                         C 395 116, 375 116, 360 116 
                         C 355 102, 335 98, 320 102 
                         C 305 106, 298 116, 290 116 
                         L 150 116 
                         C 145 102, 125 98, 110 102 
                         C 95 106, 88 116, 75 116 
                         L 40 114 Z"
                      className="fill-slate-800 dark:fill-[#0E0B1A] stroke-white/20"
                      strokeWidth="2"
                    />

                    {/* Active Custom Decal Livery Overlay on Body */}
                    <path
                      d="M 120 85 
                         L 240 50 
                         L 310 65 
                         L 380 92 
                         L 320 94 
                         L 210 75 
                         L 100 100 Z"
                      fill="url(#bodyFinishHero)"
                      opacity="0.9"
                    />

                    {/* Sharp Racing Decal Chevron Accent */}
                    <path
                      d="M 190 60 L 260 55 L 245 78 L 180 80 Z"
                      fill="#FFFFFF"
                      opacity="0.95"
                    />
                    <path
                      d="M 270 58 L 320 70 L 305 82 L 260 72 Z"
                      fill="#8FD3F4"
                      opacity="0.9"
                    />

                    {/* Cabin Glass Canopy */}
                    <path
                      d="M 155 67 
                         C 180 53, 215 46, 275 48 
                         C 310 49, 328 62, 345 75 
                         L 200 75 Z"
                      fill="url(#windowTintHero)"
                      stroke="#A18CD1"
                      strokeWidth="1.2"
                      strokeOpacity="0.5"
                    />

                    {/* Wheels with Custom Rim Cutouts */}
                    <circle cx="110" cy="110" r="22" fill="#07050E" stroke="#A18CD1" strokeWidth="2.5" />
                    <circle cx="110" cy="110" r="13" fill="#1C1830" stroke="#8FD3F4" strokeWidth="1.5" />
                    <circle cx="110" cy="110" r="4" fill="#FF9A9E" />

                    <circle cx="320" cy="110" r="22" fill="#07050E" stroke="#A18CD1" strokeWidth="2.5" />
                    <circle cx="320" cy="110" r="13" fill="#1C1830" stroke="#8FD3F4" strokeWidth="1.5" />
                    <circle cx="320" cy="110" r="4" fill="#FF9A9E" />

                    {/* Dynamic Headlight beam slash */}
                    <path d="M 400 104 L 418 106 L 398 111 Z" fill="#8FD3F4" opacity="0.95" />
                  </svg>
                </div>

                {/* Active Finish Description & Telemetry Badges */}
                <div className="text-center z-10 px-4 mt-1">
                  <div className="text-base font-black text-slate-900 dark:text-white">
                    {activeFinish.name}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {activeFinish.desc}
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-2 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      {activeFinish.reflectivity}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      {activeFinish.durability}
                    </span>
                  </div>
                </div>
              </div>

              {/* Finish Selector Buttons */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Pilih Karakter Livery:
                  </span>
                  <span className="text-[10px] font-mono text-[#A18CD1]">4 ATELIER SPECS</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {FINISH_PREVIEWS.map((finish) => {
                    const isSelected = activeFinish.id === finish.id;
                    return (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => setActiveFinish(finish)}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-slate-100 dark:bg-white/10 border-[#A18CD1] ring-2 ring-[#A18CD1]/40 shadow-sm"
                            : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-gradient-to-tr ${finish.gradient} shrink-0 shadow-sm`}
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold truncate text-slate-900 dark:text-white">
                            {finish.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {finish.finishType}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Feature Tagline */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Precision 3D Mapping
                </span>
                <a
                  href="#3d-studio"
                  className="font-bold text-[#A18CD1] hover:text-[#8FD3F4] transition-colors flex items-center gap-1 group font-mono text-[11px]"
                >
                  <span>BUKA FULL 3D STUDIO</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
