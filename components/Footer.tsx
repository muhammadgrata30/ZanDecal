"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Sparkles, Shield, Compass, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-slate-200/80 dark:border-white/10 pt-16 pb-12 overflow-hidden bg-white/50 dark:bg-[#07060E]/80 backdrop-blur-md">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-t from-[#A18CD1]/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-200/60 dark:border-white/10">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Logo />
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Studio otomotif spesialis decal, full wrap bodi, livery motor sport, dan cutting sticker presisi. 
              Menghadirkan perpaduan estetika visual mutakhir dan perlindungan cat terbaik untuk kendaraan Anda.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram SVG */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-[#FF9A9E] hover:to-[#A18CD1] transition-all"
                aria-label="Instagram Zan Decal"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* YouTube SVG */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-[#FF9A9E] hover:to-[#8FD3F4] transition-all"
                aria-label="YouTube Zan Decal"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Eksplorasi Studio
            </h4>
            <ul className="space-y-2 text-sm font-medium">
              <li>
                <Link
                  href="#3d-studio"
                  className="text-slate-600 dark:text-slate-300 hover:text-[#A18CD1] transition-colors"
                >
                  3D Studio Visualizer
                </Link>
              </li>
              <li>
                <Link
                  href="#material"
                  className="text-slate-600 dark:text-slate-300 hover:text-[#A18CD1] transition-colors"
                >
                  Spesifikasi Material Vinyl
                </Link>
              </li>
              <li>
                <Link
                  href="#custom-sticker"
                  className="text-slate-600 dark:text-slate-300 hover:text-[#A18CD1] transition-colors"
                >
                  Custom Decal & Cutting
                </Link>
              </li>
              <li>
                <Link
                  href="#galeri"
                  className="text-slate-600 dark:text-slate-300 hover:text-[#A18CD1] transition-colors"
                >
                  Galeri Karya Transformasi
                </Link>
              </li>
              <li>
                <Link
                  href="#cara-order"
                  className="text-slate-600 dark:text-slate-300 hover:text-[#A18CD1] transition-colors"
                >
                  Tahapan Alur Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Guarantee & Features (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Jaminan Kualitas
            </h4>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
                <span className="font-bold text-slate-900 dark:text-slate-200 block mb-0.5">
                  100% Paint-Safe Formula
                </span>
                Vinyl otomotif kami dirancang tanpa residu lem keras dan menjaga kondisi cat pabrikan orisinil.
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
                <span className="font-bold text-slate-900 dark:text-slate-200 block mb-0.5">
                  Clean Room Studio Installation
                </span>
                Setiap pengerjaan dilakukan di fasilitas tertutup berfilter udara untuk hasil tanpa debu.
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            &copy; 2026 Zan Decal Studio. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-1 font-medium">
            <span>Crafted for Automotive Enthusiasts</span>
            <span className="text-[#FF9A9E]">•</span>
            <span className="gradient-zan-text font-bold">Midnight Garage & Clean Studio</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
