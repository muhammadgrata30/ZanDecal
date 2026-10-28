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
} from "lucide-react";

// Interactive showcase finishes
const FINISH_PREVIEWS = [
  {
    id: "chameleon",
    name: "Chameleon Cyber Shift",
    tag: "Signature Livery",
    gradient: "from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4]",
    accent: "#A18CD1",
    desc: "Perubahan gradasi warna dinamis mengikuti sudut pencahayaan studio.",
  },
  {
    id: "satin-purple",
    name: "Satin Stealth Lavender",
    tag: "Ultra Matte Finish",
    gradient: "from-[#6B5B95] via-[#A18CD1] to-[#D8B4E2]",
    accent: "#A18CD1",
    desc: "Tekstur satin halus anti-silau dengan refleksi cahaya elegan.",
  },
  {
    id: "neo-cyan",
    name: "Neo Cyan Racing Spec",
    tag: "Motorsport Cast",
    gradient: "from-[#4FACFE] via-[#00F2FE] to-[#8FD3F4]",
    accent: "#8FD3F4",
    desc: "Aksen cyan tajam terinspirasi dari aero racing livery sirkuit modern.",
  },
  {
    id: "candy-pink",
    name: "Sunset Candy Flare",
    tag: "High-Gloss Polymeric",
    gradient: "from-[#FA709A] via-[#FEE140] to-[#FF9A9E]",
    accent: "#FF9A9E",
    desc: "Kilap mendalam layaknya pernis permen dengan proteksi UV jangka panjang.",
  },
];

export function HeroSection() {
  const [activeFinish, setActiveFinish] = useState(FINISH_PREVIEWS[0]);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-[#FF9A9E]/20 via-[#A18CD1]/25 to-[#8FD3F4]/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-[#FF9A9E]/15 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-[#8FD3F4]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Automotive Technical Grid Background */}
      <div className="absolute inset-0 pattern-carbon opacity-35 dark:opacity-20 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Badge, CTAs, Value Props */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Required Badge: 'Premium Decal & Custom Sticker Studio' */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-[#151128]/90 border border-[#A18CD1]/30 dark:border-[#A18CD1]/40 shadow-sm backdrop-blur-md mb-6 hover:border-[#8FD3F4]/60 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9A9E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF9A9E]"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold tracking-wide uppercase bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] bg-clip-text text-transparent">
                Premium Decal & Custom Sticker Studio
              </span>
            </div>

            {/* Required Headline: 'Transformasi Visual Tanpa Batas untuk Kendaraan Anda' */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.8rem] font-black tracking-tight leading-[1.1] mb-6 text-slate-900 dark:text-white">
              Transformasi Visual{" "}
              <span className="gradient-zan-text block sm:inline">
                Tanpa Batas
              </span>{" "}
              untuk Kendaraan Anda
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-8 leading-relaxed font-normal">
              Dari full car wrap, livery racing motor sport, hingga custom cutting sticker presisi tinggi. 
              Dikerjakan dengan material ultra-cast vinyl bergaransi dan teknologi simulasi digital 3D sebelum instalasi.
            </p>

            {/* Required 2 CTAs: 'Coba 3D Visualizer' & 'Konsultasi Custom' (NO PRICE MENTION) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
              {/* CTA 1: Coba 3D Visualizer */}
              <a
                href="#3d-studio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] shadow-lg shadow-[#A18CD1]/30 hover:shadow-xl hover:shadow-[#A18CD1]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
              >
                <Box className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Coba 3D Visualizer</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* CTA 2: Konsultasi Custom */}
              <a
                href="#konsultasi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-slate-800 dark:text-white bg-white/80 dark:bg-white/5 border border-slate-300 dark:border-white/15 backdrop-blur-md hover:bg-white dark:hover:bg-white/10 hover:border-[#A18CD1] dark:hover:border-[#A18CD1] transition-all duration-200 shadow-sm"
              >
                <MessageSquare className="w-5 h-5 text-[#A18CD1]" />
                <span>Konsultasi Custom</span>
              </a>
            </div>

            {/* Trust and Engineering Highlights (Zero Prices) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10 w-full text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 text-[#FF9A9E]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Cat Asli Aman</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Zero Adhesive Residue</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-[#A18CD1]">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Ultra-Cast Vinyl</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Air-Release Channels</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="p-2 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 text-[#8FD3F4]">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Presisi CNC Vector</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Custom 1-on-1 Fitting</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Studio Visual Showcase */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Interactive Showcase Card with Glassmorphism */}
            <div className="relative rounded-3xl p-6 sm:p-7 transition-all duration-300 bg-white/90 dark:bg-[#120F24]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/15 shadow-2xl shadow-purple-950/15 dark:shadow-black/70">
              
              {/* Studio Header Bar */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF9A9E]" />
                  <span className="w-3 h-3 rounded-full bg-[#A18CD1]" />
                  <span className="w-3 h-3 rounded-full bg-[#8FD3F4]" />
                  <span className="text-xs font-mono font-medium tracking-wider text-slate-400 dark:text-slate-500 ml-2">
                    STUDIO VIEW // SIMULATION
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#8FD3F4]/15 text-[#3ea7d4] dark:text-[#8FD3F4]">
                  <Eye className="w-3 h-3" /> Live Render
                </span>
              </div>

              {/* Dynamic Vehicle Visualizer Display */}
              <div className="relative my-6 py-10 px-4 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/60 dark:from-[#0B0914] dark:to-[#17132D] border border-slate-200/60 dark:border-white/5 overflow-hidden flex flex-col items-center justify-center min-h-[260px]">
                
                {/* Background Ambient Glow mapped to active finish */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${activeFinish.gradient} opacity-20 blur-2xl transition-all duration-500`}
                />

                {/* Plotter Grid Decal Guides */}
                <div className="absolute inset-0 opacity-15">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#smallGrid)" className="text-slate-400 dark:text-slate-500" />
                  </svg>
                </div>

                {/* Peeling Sticker Corner Badge on Vehicle Canvas */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#0E0B1A]/90 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-lg text-[11px] font-medium text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{activeFinish.tag}</span>
                </div>

                {/* Automotive Sport Silhouette Graphic with Active Livery Gradient */}
                <div className="relative w-full max-w-[340px] h-32 flex items-center justify-center">
                  <svg
                    viewBox="0 0 420 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto drop-shadow-xl"
                  >
                    <defs>
                      <linearGradient id="bodyFinish" x1="0%" y1="0%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor="#FF9A9E" />
                        <stop offset="50%" stopColor="#A18CD1" />
                        <stop offset="100%" stopColor="#8FD3F4" />
                      </linearGradient>
                      <linearGradient id="windowTint" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0B0914" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#1E1938" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>

                    {/* Ground reflection shadow */}
                    <ellipse cx="210" cy="128" rx="190" ry="8" fill="#000000" fillOpacity="0.35" />

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
                      className={`fill-slate-800 dark:fill-[#120F22] stroke-white/20`}
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
                      fill="url(#bodyFinish)"
                      opacity="0.85"
                    />

                    {/* Sharp Racing Decal Chevron Accent */}
                    <path
                      d="M 190 60 L 260 55 L 245 78 L 180 80 Z"
                      fill="#FFFFFF"
                      opacity="0.9"
                    />
                    <path
                      d="M 270 58 L 320 70 L 305 82 L 260 72 Z"
                      fill="#8FD3F4"
                      opacity="0.85"
                    />

                    {/* Cabin Glass Canopy */}
                    <path
                      d="M 155 67 
                         C 180 53, 215 46, 275 48 
                         C 310 49, 328 62, 345 75 
                         L 200 75 Z"
                      fill="url(#windowTint)"
                      stroke="#A18CD1"
                      strokeWidth="1.2"
                      strokeOpacity="0.4"
                    />

                    {/* Wheels with Custom Rim Cutouts */}
                    <circle cx="110" cy="110" r="22" fill="#0B0914" stroke="#A18CD1" strokeWidth="2.5" />
                    <circle cx="110" cy="110" r="13" fill="#1C1830" stroke="#8FD3F4" strokeWidth="1.5" />
                    <circle cx="110" cy="110" r="4" fill="#FF9A9E" />

                    <circle cx="320" cy="110" r="22" fill="#0B0914" stroke="#A18CD1" strokeWidth="2.5" />
                    <circle cx="320" cy="110" r="13" fill="#1C1830" stroke="#8FD3F4" strokeWidth="1.5" />
                    <circle cx="320" cy="110" r="4" fill="#FF9A9E" />

                    {/* Dynamic Headlight beam slash */}
                    <path d="M 400 104 L 418 106 L 398 111 Z" fill="#8FD3F4" opacity="0.9" />
                  </svg>
                </div>

                {/* Active Finish Description */}
                <div className="text-center z-10 px-4 mt-2">
                  <div className="text-sm font-bold text-slate-800 dark:text-white">
                    {activeFinish.name}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {activeFinish.desc}
                  </p>
                </div>
              </div>

              {/* Finish Selector Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Pilih Simulasi Karakter Wrap:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {FINISH_PREVIEWS.map((finish) => {
                    const isSelected = activeFinish.id === finish.id;
                    return (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => setActiveFinish(finish)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border-[#A18CD1] dark:border-[#A18CD1] shadow-sm"
                            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-gradient-to-tr ${finish.gradient} shrink-0 shadow-sm`}
                        />
                        <span className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
                          {finish.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Feature Tagline */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Precision 3D Mapping
                </span>
                <a
                  href="#3d-studio"
                  className="font-bold text-[#A18CD1] hover:text-[#8FD3F4] transition-colors flex items-center gap-1"
                >
                  Buka Full 3D Studio <ChevronRight className="w-3 h-3" />
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
