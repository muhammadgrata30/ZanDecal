"use client";

import React, { useState } from "react";
import {
  Layers,
  Sun,
  Wind,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Award,
  ArrowUpRight,
  BadgeCheck,
} from "lucide-react";

import { useSiteContent } from "./SiteContentContext";

const VINYL_LAYERS = [
  {
    layer: "01",
    name: "Protective Optical Clear Cap",
    desc: "Melindungi pigmen dari sinar UV tropis, goresan mikro, dan swirl mark saat pencucian.",
    thickness: "30 Micron",
    gradient: "from-[#8FD3F4] to-[#A18CD1]",
  },
  {
    layer: "02",
    name: "Ultra-Cast Pigment Matrix",
    desc: "Pigmentasi murni kelas otomotif dengan dispersi warna merata dan stabilitas dimensi tinggi.",
    thickness: "80 Micron",
    gradient: "from-[#A18CD1] to-[#FF9A9E]",
  },
  {
    layer: "03",
    name: "RapidAir® Hexagonal Micro-Channels",
    desc: "Jaringan saluran pembuang angin mikroskopis untuk instalasi mulus tanpa gelembung udara.",
    thickness: "Micro Grid",
    gradient: "from-[#FF9A9E] to-[#8FD3F4]",
  },
  {
    layer: "04",
    name: "Low-Tack Solvent Acrylic Adhesive",
    desc: "Formula lem non-korosif yang aman bagi pernis cat pabrikan orisinil tanpa meninggalkan residu.",
    thickness: "Zero Residue",
    gradient: "from-[#141026] to-[#0A0716]",
  },
];

export function MaterialSection({ id = "material" }: { id?: string } = {}) {
  const {materials}=useSiteContent();
  const [activeBrandId,setActiveBrandId]=useState("");
  const activeBrand=materials.find(item=>item.id===activeBrandId)||materials[0];
  const [activeLayer, setActiveLayer] = useState(0);
  if(!activeBrand)return <section id={id} className="py-16"><p>Informasi bahan sedang diperbarui.</p></section>;

  return (
    <section id={id} className="py-24 relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-[#8FD3F4]/12 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-32 w-[500px] h-[500px] bg-[#FF9A9E]/12 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#A18CD1]/40 backdrop-blur-md mb-4 shadow-sm">
            <Layers className="w-4 h-4 text-[#A18CD1]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
              MATERIAL LAB & ENGINEERING
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 text-slate-900 dark:text-white">
            Katalog Bahan Terbaik &{" "}
            <span className="gradient-zan-text">Standar Rekayasa</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Zan Decal bermitra dengan prinsipal vinyl global terkemuka untuk memastikan setiap jengkal bodi kendaraan Anda terlindungi dan memancarkan estetika visual tertinggi.
          </p>
        </div>

        {/* 4-LAYER EXPLODED ANATOMY INSPECTION BAR */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-[#0A0716]/80 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A18CD1] animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                ANATOMI VINYL ULTRA-CAST // 4-LAYER STRUCTURE
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              TOTAL THICKNESS: 110 MICRON (0.11 MM)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VINYL_LAYERS.map((layer, idx) => (
              <div
                key={layer.layer}
                onClick={() => setActiveLayer(idx)}
                className={`p-4.5 rounded-2xl border transition-all cursor-pointer ${
                  activeLayer === idx
                    ? "bg-slate-100 dark:bg-white/10 border-[#A18CD1] ring-2 ring-[#A18CD1]/40 shadow-md"
                    : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-black text-[#A18CD1]">
                    LAYER {layer.layer}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/80 dark:bg-black/40 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-white/5">
                    {layer.thickness}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                  {layer.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {layer.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BENTO GRID MODERN ASYMMETRIC LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-7">
          
          {/* BENTO CARD 1 (Large - Span 8): Showcase Merk Decal Ternama */}
          <div className="lg:col-span-8 rounded-3xl p-7 sm:p-9 bg-white/90 dark:bg-[#0C091A]/90 border border-slate-200/80 dark:border-white/12 shadow-2xl backdrop-blur-2xl flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A18CD1] flex items-center gap-2">
                  <Award className="w-4 h-4" /> Prinsipal Bahan Otomotif Resmi
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  Global Certified Vinyl
                </span>
              </div>

              {/* Brand Selector Tabs */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {materials.map((brand) => {
                  const isSelected = activeBrand.id === brand.id;
                  return (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => setActiveBrandId(brand.id)}
                      className={`p-3.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-slate-100 dark:bg-white/10 border-[#A18CD1] ring-2 ring-[#A18CD1]/40 shadow-sm"
                          : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        {brand.id === "oracal" ? "ORACAL" : brand.id === "maxdecal" ? "MAXDECAL" : "TECKWRAP"}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                        {brand.origin}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Brand Information */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-[#07050E] dark:to-[#130E26] border border-slate-200/60 dark:border-white/5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {activeBrand.name}
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-[#A18CD1]/20 text-[#A18CD1] border border-[#A18CD1]/30">
                    {activeBrand.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {activeBrand.desc}
                </p>

                {/* Technical Metric Specs */}
                <div className="grid grid-cols-2 gap-3 mb-6 p-3.5 rounded-xl bg-white/70 dark:bg-black/40 border border-slate-200/60 dark:border-white/5 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Elastisitas Penarikan:</span>
                    <strong className="text-slate-800 dark:text-white">{activeBrand.elongation}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Rentang Ketahanan Suhu:</span>
                    <strong className="text-slate-800 dark:text-white">{activeBrand.tempRange}</strong>
                  </div>
                </div>

                {/* Feature Points */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/60 dark:border-white/10">
                  {activeBrand.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <span>Ruang penyimpanan suhu & kelembaban terkontrol.</span>
              <span className="font-bold text-[#A18CD1] flex items-center gap-1">
                <BadgeCheck className="w-4 h-4" /> 100% Original
              </span>
            </div>
          </div>

          {/* BENTO CARD 2 (Span 4): Keunggulan Ketahanan Cuaca */}
          <div className="lg:col-span-4 rounded-3xl p-7 sm:p-8 bg-white/90 dark:bg-[#0C091A]/90 border border-slate-200/80 dark:border-white/12 shadow-2xl backdrop-blur-2xl flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF9A9E]/20 to-[#A18CD1]/20 border border-[#FF9A9E]/30 flex items-center justify-center text-[#FF9A9E] mb-6 group-hover:scale-110 transition-transform">
                <Sun className="w-6 h-6" />
              </div>

              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF9A9E] block mb-1">
                POIN KEUNGGULAN #1
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">
                Ketahanan Cuaca Tropis Ekstrem
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Diformulasikan dengan UV-blocker tingkat tinggi dan resin tahan panas hingga 90°C. 
                Warna tidak pudar, tahan hujan asam kota, dan tidak getas meski terpapar matahari terik setiap hari.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="font-mono">DAYA TAHAN UV</span>
                <span className="text-[#FF9A9E] font-mono">5 - 7 TAHUN</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-[#FF9A9E] to-[#A18CD1]" />
              </div>
            </div>
          </div>

          {/* BENTO CARD 3 (Span 4): Keunggulan Bubble-Free Air Release */}
          <div className="lg:col-span-4 rounded-3xl p-7 sm:p-8 bg-white/90 dark:bg-[#0C091A]/90 border border-slate-200/80 dark:border-white/12 shadow-2xl backdrop-blur-2xl flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8FD3F4]/20 to-[#A18CD1]/20 border border-[#8FD3F4]/30 flex items-center justify-center text-[#8FD3F4] mb-6 group-hover:scale-110 transition-transform">
                <Wind className="w-6 h-6" />
              </div>

              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8FD3F4] block mb-1">
                POIN KEUNGGULAN #2
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">
                Teknologi Bubble-Free Air Release
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Saluran mikroskopis heksagonal pada lapisan perekat membuang udara terjebak saat pemasangan. 
                Hasil akhir mulus sempurna tanpa gelembung udara dan bebas bintik angin.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-[#8FD3F4]" />
                <span className="font-mono text-[11px]">Micro-Channel Air Flow</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Pemasangan rapi pada lekukan tajam bumper dan handle pintu.
              </div>
            </div>
          </div>

          {/* BENTO CARD 4 (Span 4): Keunggulan Garansi Resmi & Cat Aman */}
          <div className="lg:col-span-4 rounded-3xl p-7 sm:p-8 bg-white/90 dark:bg-[#0C091A]/90 border border-slate-200/80 dark:border-white/12 shadow-2xl backdrop-blur-2xl flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A18CD1]/20 to-[#FF9A9E]/20 border border-[#A18CD1]/30 flex items-center justify-center text-[#A18CD1] mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A18CD1] block mb-1">
                POIN KEUNGGULAN #3
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">
                Garansi Resmi & Cat Asli Aman
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Formula lem non-korosif dirancang khusus agar tidak merusak pernis atau cat orisinil pabrikan. 
                Saat dilepas bertahun-tahun kemudian, tidak ada residu perekat lengket yang tertinggal.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-mono text-[11px]">Zero Adhesive Residue</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Garansi resmi kelupas dan gelembung dari Zan Decal Studio.
              </div>
            </div>
          </div>

          {/* BENTO CARD 5 (Span 4): Clean Room Studio Standard */}
          <div className="lg:col-span-4 rounded-3xl p-7 sm:p-8 bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-[#A18CD1]/35 shadow-2xl backdrop-blur-2xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-[#0E0B1A]/80 border border-[#A18CD1]/30 text-xs font-bold text-slate-800 dark:text-white mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#A18CD1]" />
                Clean Room Facility
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3">
                Instalasi di Fasilitas Tertutup Bebas Debu
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                Setiap kendaraan dikerjakan di Clean Studio bersuhu terkontrol dengan filtrasi udara mikro. 
                Bebas debu jalanan, rambut, atau partikel pasir yang berpotensi mengganjal stiker.
              </p>
            </div>

            <a
              href="#konsultasi"
              className="inline-flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#0C091A] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white hover:border-[#A18CD1] transition-all group shadow-sm"
            >
              <span>Jadwalkan Pemasangan Studio</span>
              <ArrowUpRight className="w-4 h-4 text-[#A18CD1] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
