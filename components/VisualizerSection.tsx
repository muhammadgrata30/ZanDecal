"use client";

import React, { useState } from "react";
import { useTheme } from "./ThemeContext";
import {
  ThreeVehicleViewer,
  ColorPreset,
  FinishType,
  VehicleType,
} from "./ThreeVehicleViewer";
import {
  Box,
  Car,
  Bike,
  Sparkles,
  Layers,
  Send,
  Check,
  Palette,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const GRADIENT_PRESETS: ColorPreset[] = [
  {
    id: "tri-zan",
    name: "Zan Signature Flow",
    type: "gradient",
    hex: "#A18CD1",
    gradientColors: ["#FF9A9E", "#A18CD1", "#8FD3F4"],
    cssGradient: "from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4]",
    desc: "Kombinasi orisinil Zan Studio: Soft Pink, Lavender, dan Cyan.",
  },
  {
    id: "cyber-neon",
    name: "Cyberpunk Night Grid",
    type: "gradient",
    hex: "#00F2FE",
    gradientColors: ["#00F2FE", "#7F00FF", "#FF007F"],
    cssGradient: "from-[#00F2FE] via-[#7F00FF] to-[#FF007F]",
    desc: "Aksen neon cyan berpendar ungu dan magenta bergaya sirkuit malam.",
  },
  {
    id: "sunset-flare",
    name: "Sunset Candy Flare",
    type: "gradient",
    hex: "#FA709A",
    gradientColors: ["#FEE140", "#FA709A", "#FF5E62"],
    cssGradient: "from-[#FEE140] via-[#FA709A] to-[#FF5E62]",
    desc: "Kilauan jingga keemasan matahari terbenam dengan sentuhan coral.",
  },
  {
    id: "aurora-flow",
    name: "Nordic Aurora Violet",
    type: "gradient",
    hex: "#8FD3F4",
    gradientColors: ["#8FD3F4", "#A18CD1", "#4A00E0"],
    cssGradient: "from-[#8FD3F4] via-[#A18CD1] to-[#4A00E0]",
    desc: "Pendaran cahaya kutub utara berpadu violet pekat.",
  },
];

const SOLID_PRESETS: ColorPreset[] = [
  {
    id: "midnight-black",
    name: "Midnight Garage Black",
    type: "solid",
    hex: "#0B0914",
    cssGradient: "from-[#0B0914] to-[#1F1B2E]",
    desc: "Warna hitam garasi malam pekat dengan kedalaman refleksi mewah.",
  },
  {
    id: "nardo-grey",
    name: "Chalk Nardo Grey",
    type: "solid",
    hex: "#78808A",
    cssGradient: "from-[#78808A] to-[#596068]",
    desc: "Abu-abu sport modern khas sirkuit balap Eropa.",
  },
  {
    id: "cyan-spec",
    name: "Aero Cyan Blue",
    type: "solid",
    hex: "#3ea7d4",
    cssGradient: "from-[#8FD3F4] to-[#2B89B2]",
    desc: "Biru cyan aerodinamis cerah dengan kesan futuristik.",
  },
  {
    id: "royal-lavender",
    name: "Royal Lavender Veil",
    type: "solid",
    hex: "#9C84CC",
    cssGradient: "from-[#A18CD1] to-[#7B5EB5]",
    desc: "Ungu lavender elegan aksen khas automotive studio.",
  },
  {
    id: "satin-white",
    name: "Alpine Studio White",
    type: "solid",
    hex: "#F8F9FE",
    cssGradient: "from-[#FFFFFF] to-[#E2E8F0]",
    desc: "Putih bersih mutiara satin bebas silau.",
  },
  {
    id: "monza-red",
    name: "Monza Racing Red",
    type: "solid",
    hex: "#E53935",
    cssGradient: "from-[#FF5252] to-[#C62828]",
    desc: "Merah balap agresif motorsport dengan pantulan berani.",
  },
];

const FINISH_OPTIONS: { id: FinishType; name: string; tag: string; desc: string }[] = [
  {
    id: "glossy",
    name: "Ultra Glossy",
    tag: "Refleksi Cermin",
    desc: "Pantulan cahaya jernih layaknya vernis basah showroom.",
  },
  {
    id: "matte",
    name: "Stealth Matte",
    tag: "Anti Silau",
    desc: "Tekstur doff beludru pekat yang meredam refleksi tajam.",
  },
  {
    id: "satin",
    name: "Satin Silk",
    tag: "Kilau Mewah",
    desc: "Perpaduan elegan antara pantulan lembut dan sentuhan sutra halus.",
  },
];

export function VisualizerSection() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Tab State: 'car' (BYD Seal 6) or 'bike' (Motor)
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");

  // Color Tab: 'gradient' or 'solid'
  const [colorCategory, setColorCategory] = useState<"gradient" | "solid">("gradient");
  const [activeColor, setActiveColor] = useState<ColorPreset>(GRADIENT_PRESETS[0]);

  // Finishing State: 'glossy' | 'matte' | 'satin'
  const [finishType, setFinishType] = useState<FinishType>("glossy");

  // Order WhatsApp URL Constructor (Strictly zero price mention)
  const handleOrderWhatsApp = () => {
    const vehicleLabel =
      vehicleType === "car" ? "Mobil (BYD Seal 6 Aero)" : "Motor Sport (Superbike Track)";
    const colorLabel = `${activeColor.name} (${activeColor.type === "gradient" ? "Gradien Custom" : "Warna Solid"})`;
    const finishLabel =
      finishType === "glossy" ? "Ultra Glossy" : finishType === "matte" ? "Stealth Matte" : "Satin Silk";

    const text =
      `Halo Studio Zan Decal, saya tertarik memesan decal dari 3D Visualizer:%0A%0A` +
      `🚗 Kendaraan: ${encodeURIComponent(vehicleLabel)}%0A` +
      `🎨 Skema Warna: ${encodeURIComponent(colorLabel)}%0A` +
      `✨ Jenis Finishing: ${encodeURIComponent(finishLabel)}%0A` +
      `🔖 Kode Preset: ZAN-3D-${activeColor.id.toUpperCase()}-${finishType.toUpperCase()}%0A%0A` +
      `Mohon info ketersediaan material dan jadwal konsultasi mockup digital 3D. Terima kasih!`;

    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  return (
    <section id="3d-studio" className="py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-r from-[#A18CD1]/15 via-[#8FD3F4]/15 to-transparent blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#A18CD1]/30 backdrop-blur-md mb-4 shadow-sm">
            <Box className="w-4 h-4 text-[#A18CD1]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              3D Decal Visualizer Studio
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
            Simulasi 3D Interaktif{" "}
            <span className="gradient-zan-text">Real-Time</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Putar kendaraan dalam kanvas 360°, pilih skema gradien atau solid, tentukan tekstur finishing film, 
            lalu hubungkan rancangan Anda langsung ke tim studio kami.
          </p>
        </div>

        {/* Vehicle Tab Switcher: Mobil (BYD Seal 6) vs Motor */}
        <div className="flex items-center justify-center mb-8">
          <div className="p-1.5 rounded-2xl bg-white/90 dark:bg-[#120F24]/90 border border-slate-200/80 dark:border-white/10 shadow-lg backdrop-blur-md inline-flex gap-2">
            
            {/* Tab Mobil (BYD Seal 6) */}
            <button
              type="button"
              onClick={() => setVehicleType("car")}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                vehicleType === "car"
                  ? "bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] text-white shadow-md shadow-[#A18CD1]/25 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Mobil (BYD Seal 6)</span>
            </button>

            {/* Tab Motor */}
            <button
              type="button"
              onClick={() => setVehicleType("bike")}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                vehicleType === "bike"
                  ? "bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] text-white shadow-md shadow-[#A18CD1]/25 scale-[1.02]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Motor (Superbike Track)</span>
            </button>

          </div>
        </div>

        {/* 3D Visualizer Main Stage Container */}
        <div className="rounded-3xl p-4 sm:p-6 md:p-8 bg-white/90 dark:bg-[#110E23]/90 border border-slate-200/80 dark:border-white/10 shadow-2xl backdrop-blur-2xl">
          
          {/* Three.js Interactive Canvas Component */}
          <ThreeVehicleViewer
            vehicleType={vehicleType}
            activeColor={activeColor}
            finishType={finishType}
            isDarkMode={isDarkMode}
          />

          {/* CONTROL DOCK DI BAWAH KANVAS 3D */}
          <div className="mt-8 pt-8 border-t border-slate-200/80 dark:border-white/10 space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Kolom 1: Pemilihan Warna (Gradien / Solid) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#A18CD1]" />
                    Pilihan Warna Kendaraan:
                  </span>

                  {/* Sub-tab Gradient vs Solid */}
                  <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setColorCategory("gradient");
                        setActiveColor(GRADIENT_PRESETS[0]);
                      }}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        colorCategory === "gradient"
                          ? "bg-white dark:bg-[#1E1935] text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                      }`}
                    >
                      Warna Gradien
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setColorCategory("solid");
                        setActiveColor(SOLID_PRESETS[0]);
                      }}
                      className={`px-3 py-1 rounded-lg transition-all ${
                        colorCategory === "solid"
                          ? "bg-white dark:bg-[#1E1935] text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                      }`}
                    >
                      Warna Solid
                    </button>
                  </div>
                </div>

                {/* Swatches Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(colorCategory === "gradient" ? GRADIENT_PRESETS : SOLID_PRESETS).map((preset) => {
                    const isSelected = activeColor.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setActiveColor(preset)}
                        className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-100 dark:bg-white/10 border-[#A18CD1] ring-2 ring-[#A18CD1]/40 shadow-sm"
                            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${preset.cssGradient} shrink-0 shadow-sm flex items-center justify-center text-white`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {preset.name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            {preset.type === "gradient" ? "Tri-Tone Cast" : "High Solid Film"}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kolom 2: Pemilihan Jenis Finishing (Glossy, Matte, Satin) */}
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#8FD3F4]" />
                  Tekstur Finishing Permukaan:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {FINISH_OPTIONS.map((f) => {
                    const isSelected = finishType === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFinishType(f.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "bg-slate-100 dark:bg-white/10 border-[#8FD3F4] ring-2 ring-[#8FD3F4]/40 shadow-sm"
                            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {f.name}
                          </div>
                          <span className="inline-block text-[10px] font-semibold text-[#8FD3F4] mt-0.5">
                            {f.tag}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-tight">
                          {f.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Ringkasan Konfigurasi Aktif */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      Aktif: <strong className="text-slate-900 dark:text-white">{activeColor.name}</strong> •{" "}
                      <span className="capitalize">{finishType}</span>
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                    BYD-ZAN-V2
                  </span>
                </div>
              </div>

            </div>

            {/* BARIS CTA ORDER WHATSAPP OTOMATIS */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>
                  Tombol ini akan otomatis merangkai spesifikasi warna & finishing yang Anda pilih ke WhatsApp Studio.
                </span>
              </div>

              {/* Tombol Order WhatsApp Otomatis */}
              <button
                type="button"
                onClick={handleOrderWhatsApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] shadow-lg shadow-[#A18CD1]/30 hover:shadow-xl hover:shadow-[#A18CD1]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Order Rangkaian 3D Ini via WhatsApp</span>
                <ExternalLink className="w-4 h-4 ml-0.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
