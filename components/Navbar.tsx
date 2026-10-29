"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Sparkles, Box, Layers, Sticker, Image as ImageIcon, CheckCircle2, ChevronRight } from "lucide-react";

const NAV_LINKS = [
  { name: "3D Studio", href: "#3d-studio", icon: Box, tag: "Interactive" },
  { name: "Material", href: "#material", icon: Layers, tag: "OEM Cast" },
  { name: "Custom Sticker", href: "#custom-sticker", icon: Sticker, tag: "CNC Vector" },
  { name: "Galeri", href: "#galeri", icon: ImageIcon, tag: "Portfolio" },
  { name: "Cara Order", href: "#cara-order", icon: CheckCircle2, tag: "4 Steps" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3.5 px-3 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Floating Aerodynamic Glass Capsule */}
        <nav
          className={`flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-3xl transition-all duration-300 ${
            scrolled
              ? "bg-white/85 dark:bg-[#0B0817]/85 backdrop-blur-2xl shadow-xl shadow-purple-950/10 dark:shadow-black/60 border border-slate-200/80 dark:border-white/12"
              : "bg-white/70 dark:bg-[#07050E]/75 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/30 border border-slate-200/60 dark:border-white/8"
          }`}
        >
          {/* Logo with Sporty Z Sticker Peel */}
          <Logo />

          {/* Desktop Navigation Links with Telemetry Tags */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-slate-100/60 dark:bg-white/[0.03] p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
            {NAV_LINKS.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-all duration-200 group"
                >
                  <IconComponent className="w-3.5 h-3.5 text-[#A18CD1] opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action: Studio Indicator + Theme Switcher + CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Studio Indicator (Desktop) */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Studio Open</span>
            </div>

            {/* Theme Switcher Button */}
            <ThemeToggle />

            {/* Quick Consultation CTA */}
            <a
              href="#konsultasi"
              className="hidden sm:inline-flex items-center gap-2 px-4.5 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] hover:opacity-95 hover:shadow-lg hover:shadow-[#A18CD1]/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Konsultasi</span>
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu with Glassmorphism */}
        {isOpen && (
          <div className="lg:hidden mt-2 p-4 rounded-3xl bg-white/95 dark:bg-[#0B0817]/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/12 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-2xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4 text-[#A18CD1]" />
                      <span>{link.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {link.tag}
                    </span>
                  </Link>
                );
              })}

              <div className="pt-3 mt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
                <a
                  href="#konsultasi"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] shadow-md shadow-[#A18CD1]/30"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Konsultasi Custom</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
