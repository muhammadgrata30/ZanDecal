"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Sparkles, MapPin, Phone, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export function ConsultationSection() {
  const [vehicleType, setVehicleType] = useState("Mobil Sport / Coupe");
  const [serviceType, setServiceType] = useState("Full Wrap Livery");
  const [finishType, setFinishType] = useState("Signature Chameleon");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Construct WhatsApp message URL
    const message = `Halo Studio Zan Decal, saya ingin konsultasi custom decal:%0A- Tipe Kendaraan: ${vehicleType}%0A- Layanan: ${serviceType}%0A- Finishing: ${finishType}%0A- Catatan: ${notes || "Belum ada catatan khusus"}`;
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
  };

  return (
    <section id="konsultasi" className="py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-[#FF9A9E]/15 via-[#A18CD1]/20 to-[#8FD3F4]/15 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-[#A18CD1]/30 backdrop-blur-md mb-4">
            <MessageSquare className="w-4 h-4 text-[#A18CD1]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Konsultasi & Penjadwalan
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
            Wujudkan Desain Impian{" "}
            <span className="gradient-zan-text">Bersama Tim Zan</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Diskusikan kebutuhan stiker dan decal kendaraan Anda langsung dengan lead designer kami. 
            Mulai dari konsep sketsa, pemilihan warna, hingga fitting mockup digital.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Brief (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl p-7 sm:p-10 bg-white/90 dark:bg-[#110E23]/90 border border-slate-200/80 dark:border-white/10 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Kirim Brief Desain Anda
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
              Pilih spesifikasi awal kendaraan dan tim kami akan menghubungi Anda untuk pembahasan mockup 3D.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Tipe Kendaraan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Tipe / Model Kendaraan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Mobil Sport / Coupe",
                    "Superbike / Motor Sport",
                    "Sedan / Hatchback",
                    "SUV / Crossover",
                    "Armada Bisnis / Fleet",
                    "Lainnya",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setVehicleType(item)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                        vehicleType === item
                          ? "bg-slate-100 dark:bg-white/10 border-[#A18CD1] text-slate-900 dark:text-white shadow-sm"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layanan yang Diinginkan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Jenis Layanan Decal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Full Wrap Livery",
                    "Custom Striping & Racing Decal",
                    "Precision Die-Cut Cutting Sticker",
                    "Paint Protection Film (PPF)",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setServiceType(item)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left truncate cursor-pointer ${
                        serviceType === item
                          ? "bg-slate-100 dark:bg-white/10 border-[#A18CD1] text-slate-900 dark:text-white shadow-sm"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finishing Diinginkan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Karakter Finishing
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    "Signature Chameleon",
                    "Ultra High-Gloss",
                    "Satin Stealth Matte",
                    "Prismatic Holo",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFinishType(item)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center truncate cursor-pointer ${
                        finishType === item
                          ? "bg-slate-100 dark:bg-white/10 border-[#A18CD1] text-slate-900 dark:text-white shadow-sm"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Ide / Catatan Konsep Khusus (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Honda CBR 250RR livery balap aksen ungu lavender, atau Porsche 911 decal sponsor minimalis..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A18CD1]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] shadow-lg shadow-[#A18CD1]/30 hover:shadow-xl hover:shadow-[#A18CD1]/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim & Mulai Konsultasi Langsung via WhatsApp</span>
              </button>

              {isSubmitted && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Membuka obrolan konsultasi WhatsApp studio...</span>
                </div>
              )}

            </form>
          </div>

          {/* Right Column: Studio Information & Quality Guarantees (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Studio Info Card */}
            <div className="rounded-3xl p-7 bg-white/90 dark:bg-[#110E23]/90 border border-slate-200/80 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-5">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#A18CD1]" />
                Zan Decal Studio Experience
              </h4>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FF9A9E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-100">Studio & Clean Room:</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Jl. Otomotif Raya No. 88, Kawasan Modifikasi Terpadu, Jakarta / Tangerang
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#A18CD1] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-100">Jam Operasional Studio:</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      Senin - Sabtu: 09:00 - 18:00 WIB (Instalasi Berdasarkan Reservasi)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#8FD3F4] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-100">Direct Contact:</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      WhatsApp Studio: +62 812-3456-7890 • Email: studio@zandecal.id
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Studio Clean Room Standards */}
            <div className="rounded-3xl p-7 bg-white/90 dark:bg-[#110E23]/90 border border-slate-200/80 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Standar Keamanan & Mutu
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#A18CD1] shrink-0" />
                  Ruang instalasi ber-AC tertutup bebas debu & partikel pasir.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#A18CD1] shrink-0" />
                  Teknik pemasangan pisau knifeless tape untuk menjaga cat aman dari goresan cutter.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#A18CD1] shrink-0" />
                  Heat gun thermal profiling menjamin vinyl menempel sempurna di lekukan ekstrem.
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
