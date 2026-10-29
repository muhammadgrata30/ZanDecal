"use client";

import React, { useState } from "react";
import {
  Palette,
  MessageSquare,
  Printer,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Clock,
  Sparkles,
  Wand2,
  Cpu,
  Layers,
  Flame,
} from "lucide-react";

interface StepDetail {
  number: string;
  id: number;
  title: string;
  shortTitle: string;
  icon: React.ElementType;
  badge: string;
  stationCode: string;
  duration: string;
  description: string;
  checklist: string[];
  tips: string;
  ctaText: string;
  ctaHref: string;
}

const ORDER_STEPS: StepDetail[] = [
  {
    number: "01",
    id: 1,
    title: "Pilih / Eksplorasi Desain 3D",
    shortTitle: "Pilih Desain",
    icon: Palette,
    badge: "Tahap 1: Eksplorasi & Ideasi",
    stationCode: "STATION 01 // DIGITAL TWIN 3D MAPPING",
    duration: "Instan di Website",
    description:
      "Gunakan fitur 3D Visualizer interaktif Zan Decal untuk memutar siluet mobil BYD Seal 6 atau Motor Sport. Eksplorasi perpaduan warna gradien unik atau solid, serta tentukan karakter finishing Glossy, Matte, atau Satin. Anda juga dapat membawa konsep sketsa livery sendiri.",
    checklist: [
      "Pilih model kendaraan (Mobil / Motor / Custom)",
      "Pilih tema warna gradien atau solid",
      "Tentukan jenis finishing (Glossy, Matte, Satin)",
      "Simpan tangkapan layar atau kode preset 3D",
    ],
    tips: "Gunakan pencahayaan studio di 3D visualizer untuk melihat karakter pantulan cat dari berbagai sudut.",
    ctaText: "Buka 3D Visualizer",
    ctaHref: "#3d-studio",
  },
  {
    number: "02",
    id: 2,
    title: "Konsultasi WhatsApp & Mockup 3D",
    shortTitle: "Konsultasi WA",
    icon: MessageSquare,
    badge: "Tahap 2: Diskusi 1-on-1",
    stationCode: "STATION 02 // 1-ON-1 ATELIER DESK",
    duration: "1 - 2 Jam Respon Cepat",
    description:
      "Kirimkan hasil rancangan 3D atau ide livery Anda langsung ke tim WhatsApp Studio Zan Decal. Tim desainer profesional kami akan memverifikasi lekukan bodi kendaraan nyata Anda, merekomendasikan bahan terbaik (Oracal, Maxdecal, TeckWrap), dan menerbitkan digital mockup final sebelum diproduksi.",
    checklist: [
      "Diskusi 1-on-1 bersama lead automotive designer",
      "Kirim foto detail kondisi kendaraan saat ini",
      "Persetujuan digital mockup proporsional skala 1:1",
      "Penjadwalan hari instalasi di studio",
    ],
    tips: "Konsultasikan juga jika ada bagian kendaraan yang memerlukan perlindungan ekstra seperti PPF pada spion atau kap mesin.",
    ctaText: "Mulai Chat Konsultasi WA",
    ctaHref: "#konsultasi",
  },
  {
    number: "03",
    id: 3,
    title: "Produksi Presisi & Quality Check",
    shortTitle: "Produksi CNC",
    icon: Printer,
    badge: "Tahap 3: Pemotongan & Cetak",
    stationCode: "STATION 03 // CNC PLOTTER ±0.1MM",
    duration: "1 - 2 Hari Kerja",
    description:
      "Desain yang telah disetujui diproses menggunakan mesin cutting plotter CNC presisi tinggi dengan toleransi mikron dan mesin cetak tinta UV outdoor yang tahan cuaca tropis. Setiap lembar stiker dilapisi transfer tape khusus untuk memastikan peletakan garis decal yang lurus sempurna.",
    checklist: [
      "Pemotongan pisau CNC computer-guided tanpa cacat",
      "Pencetakan tinta outdoor solvent tahan cuaca & UV",
      "Pemeriksaan ketajaman kontur dan kelenturan bahan",
      "Pemberian lapisan transfer masking tape siap pasang",
    ],
    tips: "Setiap batch produksi melewati 3 tahapan inspeksi visual di bawah lampu inspeksi permukaan otomotif.",
    ctaText: "Pelajari Material Bahan",
    ctaHref: "#material",
  },
  {
    number: "04",
    id: 4,
    title: "Pemasangan Profesional di Clean Room",
    shortTitle: "Pemasangan Studio",
    icon: ShieldCheck,
    badge: "Tahap 4: Instalasi & Garansi",
    stationCode: "STATION 04 // VIP CLEAN ROOM ATELIER",
    duration: "1 Hari Pengerjaan",
    description:
      "Kendaraan Anda ditangani di Clean Room Studio ber-AC yang bebas debu dan terkontrol suhunya. Teknisi berlisensi kami menerapkan teknik knifeless tape (tanpa pisau pada cat mobil) dan heat-gun thermal profile agar stiker mengunci sempurna di lekukan tajam, diakhiri dengan serah terima kartu garansi resmi.",
    checklist: [
      "Pembersihan bodi deep-cleansing & clay bar",
      "Aplikasi di Clean Room berfilter partikel mikro",
      "Teknik Knifeless Tape 100% aman bagi cat orisinil",
      "Penerbitan kartu garansi resmi studio Zan Decal",
    ],
    tips: "Setelah pemasangan, teknisi kami akan memberikan panduan perawatan mudah agar kilap stiker awet bertahun-tahun.",
    ctaText: "Lihat Galeri Hasil Pemasangan",
    ctaHref: "#galeri",
  },
];

export function WorkflowSection() {
  const [activeStep, setActiveStep] = useState(1);
  const currentStep = ORDER_STEPS.find((s) => s.id === activeStep) || ORDER_STEPS[0];
  const IconComponent = currentStep.icon;

  const handleNext = () => {
    if (activeStep < 4) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  return (
    <section id="cara-order" className="py-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[550px] bg-gradient-to-r from-[#FF9A9E]/10 via-[#A18CD1]/15 to-[#8FD3F4]/10 blur-[170px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#A18CD1]/40 backdrop-blur-md mb-4 shadow-sm">
            <Wand2 className="w-4 h-4 text-[#A18CD1]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200">
              ATELIER PRODUCTION LINE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 text-slate-900 dark:text-white">
            4 Langkah Mudah{" "}
            <span className="gradient-zan-text">Alur Pemesanan</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Klik setiap langkah di bawah untuk melihat rincian proses, persiapan kendaraan, dan waktu pengerjaan dari awal hingga serah terima.
          </p>
        </div>

        {/* INTERACTIVE STEPPER TABS & PROGRESS BAR */}
        <div className="max-w-4xl mx-auto mb-14">
          
          {/* Progress bar background line */}
          <div className="relative mb-8">
            <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-slate-200 dark:bg-white/10 rounded-full" />
            <div
              className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] rounded-full transition-all duration-500 shadow-md shadow-[#A18CD1]/40"
              style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
            />

            {/* 4 Clickable Step Nodes */}
            <div className="relative flex items-center justify-between">
              {ORDER_STEPS.map((step) => {
                const isPassed = step.id <= activeStep;
                const isCurrent = step.id === activeStep;
                const StepIcon = step.icon;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(step.id)}
                    className="group flex flex-col items-center focus:outline-none cursor-pointer"
                  >
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 shadow-lg ${
                        isCurrent
                          ? "bg-gradient-to-tr from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] text-white scale-110 ring-4 ring-[#A18CD1]/40"
                          : isPassed
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                          : "bg-white dark:bg-[#0C091A] border border-slate-300 dark:border-white/15 text-slate-400"
                      }`}
                    >
                      <StepIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>

                    <span
                      className={`mt-3 text-xs font-bold transition-colors hidden sm:block font-mono ${
                        isCurrent
                          ? "text-[#A18CD1]"
                          : isPassed
                          ? "text-slate-800 dark:text-slate-200"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {step.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ACTIVE STEP CARD DEEP DIVE */}
        <div className="max-w-4xl mx-auto rounded-[2.2rem] p-7 sm:p-11 bg-white/95 dark:bg-[#0C091A]/95 border border-slate-200/80 dark:border-white/12 shadow-2xl backdrop-blur-2xl transition-all duration-300">
          
          {/* Card Top Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-4xl sm:text-6xl font-black font-mono text-[#A18CD1]">
                {currentStep.number}
              </span>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#A18CD1] block">
                  {currentStep.stationCode}
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {currentStep.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-[#8FD3F4]" />
              <span>EST: {currentStep.duration}</span>
            </div>
          </div>

          {/* Description & Details */}
          <div className="py-7 space-y-6">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {currentStep.description}
            </p>

            {/* Checklist */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-3.5">
                Ceklist & Yang Anda Dapatkan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentStep.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip Box */}
            <div className="flex items-start gap-3 p-4.5 rounded-2xl bg-purple-500/10 border border-[#A18CD1]/30 text-xs text-slate-700 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-[#A18CD1] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white font-mono uppercase">Tips Studio:</strong> {currentStep.tips}
              </div>
            </div>
          </div>

          {/* Card Footer Navigation & Action CTA */}
          <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            
            {/* Step Controls (Prev & Next) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeStep === 1}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={activeStep === 4}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Button for this step */}
            <a
              href={currentStep.ctaHref}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{currentStep.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}
