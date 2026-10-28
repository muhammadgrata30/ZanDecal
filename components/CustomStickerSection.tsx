"use client";

import React from "react";
import { Sticker, Scissors, Trophy, Truck, ShieldAlert, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";

const STICKER_SERVICES = [
  {
    icon: Scissors,
    title: "Precision Die-Cut Decal",
    badge: "Vector Cutting CNC",
    description:
      "Stiker potongan presisi tanpa background transparan. Sangat cocok untuk logo sponsor, tipografi custom, striping velg, dan nomor start balap.",
    gradient: "from-[#FF9A9E] to-[#A18CD1]",
    points: [
      "Toleransi pemotongan akurat hingga 0.1 mm",
      "Termasuk masking tape transfer siap tempel",
      "Pilihan material: Gloss, Matte, Chrome, Reflective",
    ],
  },
  {
    icon: Trophy,
    title: "Motorsport & Livery Balap",
    badge: "Track & Circuit Grade",
    description:
      "Desain grafis livery lengkap untuk mobil balap turing, drift, drag, dan motor sport sirkuit dengan penempatan sponsor aerodinamis.",
    gradient: "from-[#A18CD1] to-[#8FD3F4]",
    points: [
      "Layout disesuaikan regulasi nomor & sponsor kejuaraan",
      "Stiker tahan terhadap oli mesin & suhu panas knalpot",
      "Proses pengerjaan cepat untuk jadwal seri balap",
    ],
  },
  {
    icon: Truck,
    title: "Commercial Fleet Branding",
    badge: "Armada Bisnis",
    description:
      "Transformasi visual armada niaga (van, truk box, mobil operasional kantor) menjadi media promosi berjalan yang menarik perhatian publik.",
    gradient: "from-[#8FD3F4] to-[#FF9A9E]",
    points: [
      "Standarisasi identitas visual merk di seluruh armada",
      "Menggunakan cast vinyl tahan cuaca jangka panjang",
      "Layanan pemasangan massal di lokasi pool kendaraan",
    ],
  },
  {
    icon: Sparkles,
    title: "Helmet & Visor Decal",
    badge: "Aerodynamic Fit",
    description:
      "Kustomisasi livery helm full face maupun open face dengan lekukan tajam, striping visor anti-silau, dan emblem personal inisial rider.",
    gradient: "from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4]",
    points: [
      "Vinyl super elastis anti-kerut pada kurva helm bulat",
      "Lapisan finishing gloss kristal atau ultra-matte",
      "Perlindungan tambahan terhadap benturan kerikil kecil",
    ],
  },
];

export function CustomStickerSection() {
  return (
    <section id="custom-sticker" className="py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#FF9A9E]/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#A18CD1]/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#A18CD1]/30 backdrop-blur-md mb-4">
            <Sticker className="w-4 h-4 text-[#FF9A9E]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Custom Decal & Cutting
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
            Setiap Detail,{" "}
            <span className="gradient-zan-text">Dibuat Khusus Untuk Anda</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Dari satu stiker logo eksklusif hingga striping balap satu set lengkap. Kami mewujudkan imajinasi grafis otomotif Anda dengan presisi pisau plotter mutakhir.
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STICKER_SERVICES.map((srv, idx) => {
            const IconComponent = srv.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl p-7 sm:p-9 bg-white/90 dark:bg-[#110E23]/90 border border-slate-200/80 dark:border-white/10 shadow-xl backdrop-blur-xl hover:border-[#A18CD1]/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF9A9E]/20 via-[#A18CD1]/20 to-[#8FD3F4]/20 border border-[#A18CD1]/30 flex items-center justify-center text-[#A18CD1] group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
                    {srv.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {srv.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-white/10">
                    {srv.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-[#A18CD1] shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <a
                    href="#konsultasi"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#A18CD1] group-hover:text-[#8FD3F4] transition-colors"
                  >
                    <span>Konsultasikan Kebutuhan Ini</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
