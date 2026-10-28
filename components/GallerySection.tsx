"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Play,
  Sparkles,
  ExternalLink,
  X,
  Layers,
  Car,
  Bike,
  Sticker,
  CheckCircle2,
  Eye,
  Send,
} from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  category: "mobil" | "motor" | "sticker";
  categoryLabel: string;
  mediaType: "video" | "photo";
  videoDuration?: string;
  materialBrand: string;
  finishType: string;
  gradient: string;
  vehicleModel: string;
  description: string;
  transformationHighlights: string[];
}

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 1,
    title: "BYD Seal 6 // Signature Tri-Tone Flow Wrap",
    category: "mobil",
    categoryLabel: "Mobil",
    mediaType: "video",
    videoDuration: "0:45 Reels",
    materialBrand: "Maxdecal 9700 Pro Series",
    finishType: "Ultra Glossy Chameleon",
    gradient: "from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4]",
    vehicleModel: "BYD Seal 6 EV Coupe",
    description:
      "Transformasi full body wrap mobil listrik BYD Seal 6 menggunakan gradasi warna khas Zan Decal. Dikerjakan dengan teknik knifeless tape pada lekukan pintu tanpa menyentuh cat orisinil.",
    transformationHighlights: [
      "Full wrap bodi eksterior + ceramic clear topcoat",
      "Aksen black-out piano pada atap kaca panoramik",
      "Garansi gelembung & kelupas resmi studio",
    ],
  },
  {
    id: 2,
    title: "Ducati Panigale V4 // Cyber Track Livery",
    category: "motor",
    categoryLabel: "Motor",
    mediaType: "photo",
    materialBrand: "Oracal 970RA Premium Cast",
    finishType: "Satin Silk Lavender & Cyan",
    gradient: "from-[#A18CD1] via-[#8FD3F4] to-[#6B5B95]",
    vehicleModel: "Ducati Panigale V4 S",
    description:
      "Desain aero race livery sirkuit dengan nomor start balap custom dan logo sponsor vector tajam. Tahan terhadap panas mesin dan percikan oli balap.",
    transformationHighlights: [
      "Custom full fairing race layout",
      "Striping velg forged alloy presisi",
      "Heat-shield barrier di area knalpot bawah",
    ],
  },
  {
    id: 3,
    title: "Porsche 911 GT3 RS // Aero Precision Wrap",
    category: "mobil",
    categoryLabel: "Mobil",
    mediaType: "photo",
    materialBrand: "TeckWrap Supergloss USA",
    finishType: "High Gloss Mint & Sunset Flare",
    gradient: "from-[#8FD3F4] via-[#FF9A9E] to-[#FA709A]",
    vehicleModel: "Porsche 911 GT3 RS (992)",
    description:
      "Perpaduan warna kontras tinggi pada sayap belakang swan-neck dan kap mesin carbon fiber ventilasi ganda. Menghadirkan pantulan kilap showroom basah.",
    transformationHighlights: [
      "Aero wing dual-side wrap",
      "PPF perlindungan batu kerikil pada bumper depan",
      "Logo samping PORSCHE die-cut vector CNC",
    ],
  },
  {
    id: 4,
    title: "Honda CBR 1000RR-R // Midnight Stealth Spec",
    category: "motor",
    categoryLabel: "Motor",
    mediaType: "video",
    videoDuration: "0:38 Reels",
    materialBrand: "Maxdecal 9700 Special Cast",
    finishType: "Stealth Matte Violet",
    gradient: "from-[#1F1B2E] via-[#A18CD1] to-[#8FD3F4]",
    vehicleModel: "Honda CBR 1000RR-R SP Fireblade",
    description:
      "Livery doff elegan anti-pantul cahaya dengan aksen grafis garis tajam lavender pada winglet depan. Tampilan agresif ala motor pengujian sirkuit.",
    transformationHighlights: [
      "Tekstur matte silk anti-sidik jari",
      "Aksen striping reflective berpendar malam",
      "Full tank grip protector terintegrasi",
    ],
  },
  {
    id: 5,
    title: "Toyota GR Supra // Cyberpunk Neon Drift Wrap",
    category: "mobil",
    categoryLabel: "Mobil",
    mediaType: "video",
    videoDuration: "1:02 Reels",
    materialBrand: "TeckWrap Chameleon Chrome",
    finishType: "Prismatic Shift",
    gradient: "from-[#00F2FE] via-[#7F00FF] to-[#FF007F]",
    vehicleModel: "Toyota GR Supra A90",
    description:
      "Mobil kompetisi drift dengan livery grafis geometric cyber neon yang memancarkan pendaran warna berbeda di setiap sudut pantulan sinar lampu sirkuit.",
    transformationHighlights: [
      "Full wrap bodi widebody pandem kit",
      "Sponsor logo die-cut multi-layer reflective",
      "Finishing tahan semprotan air tekanan tinggi",
    ],
  },
  {
    id: 6,
    title: "Multi-Layer Helmet & Visor Die-Cut Kit",
    category: "sticker",
    categoryLabel: "Custom Sticker",
    mediaType: "photo",
    materialBrand: "Oracal 651 & Reflective Cast",
    finishType: "Prismatic & Gloss Die-Cut",
    gradient: "from-[#FF9A9E] to-[#8FD3F4]",
    vehicleModel: "Arai & Shoei Racing Helmets",
    description:
      "Stiker emblem inisial pembalap, bendera nasional, dan striping visor anti-silau yang dipotong dengan akurasi pisau plotter 0.1 mm tanpa sambungan kasar.",
    transformationHighlights: [
      "0.1 mm vector cut accuracy",
      "Vinyl elastis anti-kerut kurva bulat 3D",
      "Termasuk transfer tape bening siap tempel",
    ],
  },
];

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState<"semua" | "mobil" | "motor" | "sticker">("semua");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredData =
    activeFilter === "semua"
      ? PORTFOLIO_DATA
      : PORTFOLIO_DATA.filter((item) => item.category === activeFilter);

  const handleOrderSimilar = (item: PortfolioItem) => {
    const text =
      `Halo Studio Zan Decal, saya melihat portofolio customer: "${item.title}".%0A%0A` +
      `🚗 Kendaraan: ${encodeURIComponent(item.vehicleModel)}%0A` +
      `🏷️ Bahan: ${encodeURIComponent(item.materialBrand)}%0A` +
      `✨ Finishing: ${encodeURIComponent(item.finishType)}%0A%0A` +
      `Saya tertarik membuat rancangan stiker / decal serupa untuk kendaraan saya. Mohon informasi jadwal konsultasi mockup. Terima kasih!`;

    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  return (
    <section id="galeri" className="py-24 relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-[#A18CD1]/15 via-[#8FD3F4]/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#A18CD1]/30 backdrop-blur-md mb-4 shadow-sm">
            <ImageIcon className="w-4 h-4 text-[#8FD3F4]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Galeri Portofolio Customer
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
            Karya Nyata &{" "}
            <span className="gradient-zan-text">Kepuasan Pelanggan</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Jelajahi transformasi visual mobil sport, motor sirkuit, dan custom sticker hasil pengerjaan studio Zan Decal dengan bahan Oracal, Maxdecal, dan TeckWrap.
          </p>
        </div>

        {/* Filter Tabs: Semua, Mobil, Motor, Custom Sticker */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {[
            { id: "semua", label: "Semua Karya", icon: Sparkles },
            { id: "mobil", label: "Mobil (BYD & Sport)", icon: Car },
            { id: "motor", label: "Motor Sport", icon: Bike },
            { id: "sticker", label: "Custom Sticker", icon: Sticker },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg shadow-purple-950/20 scale-[1.02]"
                    : "bg-white/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:border-[#A18CD1]"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredData.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative rounded-3xl overflow-hidden bg-white/90 dark:bg-[#110E23]/90 border border-slate-200/80 dark:border-white/10 shadow-xl backdrop-blur-xl hover:border-[#A18CD1]/60 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Card Media Preview Canvas */}
              <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100 dark:from-[#0B0914] dark:to-[#17132D] flex items-center justify-center p-6">
                
                {/* Dynamic colored background glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-tr ${item.gradient} opacity-25 group-hover:opacity-45 transition-opacity duration-500 blur-xl`}
                />

                {/* Tech Pattern Grid */}
                <div className="absolute inset-0 pattern-carbon opacity-35 dark:opacity-25" />

                {/* Graphic Representation */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${item.gradient} p-0.5 shadow-2xl group-hover:scale-110 transition-transform duration-300 mb-3`}
                  >
                    <div className="w-full h-full rounded-2xl bg-slate-950/85 backdrop-blur-md flex items-center justify-center text-white">
                      {item.mediaType === "video" ? (
                        <Play className="w-7 h-7 text-[#8FD3F4] fill-current ml-0.5" />
                      ) : (
                        <Eye className="w-7 h-7 text-[#A18CD1]" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300">
                    {item.vehicleModel}
                  </span>
                </div>

                {/* Media Type Badge (Top Right) */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/10">
                    {item.mediaType === "video" ? (
                      <>
                        <Play className="w-3 h-3 text-[#FF9A9E] fill-current" />
                        <span>{item.videoDuration}</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-3 h-3 text-[#8FD3F4]" />
                        <span>High-Res</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Category Badge (Top Left) */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-white/90 dark:bg-[#0B0914]/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                    {item.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <span className="font-semibold text-[#A18CD1]">{item.materialBrand}</span>
                  <span className="text-[10px] uppercase font-mono">{item.finishType}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#A18CD1] transition-colors line-clamp-1 mb-3">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Showroom Ready
                  </span>
                  <span className="text-[#A18CD1] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Detail Portofolio <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* LIGHTBOX MODAL DETAIL PORTOFOLIO */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#120F24] border border-slate-200 dark:border-white/15 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Tutup Detail"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pr-8 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A18CD1] block mb-1">
                  {selectedItem.categoryLabel} // {selectedItem.vehicleModel}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  {selectedItem.title}
                </h3>
              </div>

              {/* Showcase Banner */}
              <div className="relative h-56 rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 to-[#17132D] flex items-center justify-center p-6 mb-6">
                <div
                  className={`absolute inset-0 bg-gradient-to-tr ${selectedItem.gradient} opacity-30 blur-2xl`}
                />
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] p-0.5 mx-auto mb-2 shadow-xl">
                    <div className="w-full h-full rounded-2xl bg-black/80 flex items-center justify-center text-white">
                      {selectedItem.mediaType === "video" ? (
                        <Play className="w-8 h-8 text-[#8FD3F4] fill-current" />
                      ) : (
                        <Eye className="w-8 h-8 text-[#A18CD1]" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-300">
                    Dokumentasi Asli Studio Zan Decal
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Merk Bahan</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {selectedItem.materialBrand}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Karakter Finishing</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {selectedItem.finishType}
                  </span>
                </div>
              </div>

              {/* Description & Transformation Highlights */}
              <div className="space-y-4 mb-8">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Poin Pengerjaan Studio:
                  </span>
                  {selectedItem.transformationHighlights.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Button via WhatsApp */}
              <button
                type="button"
                onClick={() => handleOrderSimilar(selectedItem)}
                className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] shadow-lg shadow-[#A18CD1]/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Pesan Desain & Livery Serupa Ini via WhatsApp</span>
              </button>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
