"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02] ${className}`}
    >
      {/* Sporty Z Icon with Realistic Sticker Peel Effect */}
      <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11">
        {/* Glow backdrop behind the logo */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] opacity-35 blur-md group-hover:opacity-75 transition-opacity duration-300" />

        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Tri-Color Brand Gradient */}
            <linearGradient id="zanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9A9E" />
              <stop offset="50%" stopColor="#A18CD1" />
              <stop offset="100%" stopColor="#8FD3F4" />
            </linearGradient>

            {/* Reverse gradient for peel underside */}
            <linearGradient id="zanPeelUnderside" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#A18CD1" />
            </linearGradient>

            {/* Shadow beneath the peeling sticker corner */}
            <filter id="peelShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="-2" dy="4" stdDeviation="3" floodColor="#0B0914" floodOpacity="0.45" />
            </filter>

            {/* Subtle gloss highlight on the decal body */}
            <linearGradient id="glossSheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background decal contour container (aerodynamic rounded shield) */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="18"
            className="fill-[#141026]/90 dark:fill-[#0E0B1A] stroke-white/10 dark:stroke-white/10"
            strokeWidth="1.5"
          />

          {/* Sporty Racing Decal Crosshair / Plotter Alignment Marks */}
          <line x1="50" y1="9" x2="50" y2="14" stroke="#8FD3F4" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="50" y1="86" x2="50" y2="91" stroke="#8FD3F4" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="9" y1="50" x2="14" y2="50" stroke="#FF9A9E" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="86" y1="50" x2="91" y2="50" stroke="#FF9A9E" strokeWidth="1.5" strokeOpacity="0.5" />

          {/* Main Body of Letter "Z" with Aerodynamic Racing Cutouts */}
          {/* Top Bar of Z (truncated at top-right for the peel flap) */}
          <path
            d="M 22 24 L 62 24 L 56 38 L 22 38 Z"
            fill="url(#zanGradient)"
          />

          {/* Diagonal Slash of Z with aggressive automotive chevron taper */}
          <path
            d="M 52 32 L 68 32 L 36 74 L 20 74 Z"
            fill="url(#zanGradient)"
          />

          {/* Bottom Bar of Z with speed-cut finish */}
          <path
            d="M 32 68 L 78 68 L 72 82 L 20 82 Z"
            fill="url(#zanGradient)"
          />

          {/* Gloss overlay highlight */}
          <path
            d="M 22 24 L 62 24 L 56 38 L 22 38 Z"
            fill="url(#glossSheen)"
          />

          {/* Decal Cut Separation Line (Simulating Vinyl Cutter Knife Line) */}
          <path
            d="M 59 21 L 53 41"
            stroke="#0B0914"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />

          {/* THE PEELING STICKER FLAP (Stiker Mengelupas) */}
          {/* 1. Dark adhesive release bed left behind underneath */}
          <polygon
            points="62,24 80,24 80,42"
            fill="#0F0C1D"
            stroke="#A18CD1"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            strokeOpacity="0.6"
          />

          {/* 2. Peeling curled triangle with shadow and reverse vinyl adhesive gradient */}
          <g filter="url(#peelShadow)">
            <polygon
              points="62,24 80,42 62,42"
              fill="url(#zanPeelUnderside)"
            />
            {/* Edge curl crease line */}
            <line
              x1="62"
              y1="24"
              x2="80"
              y2="42"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          {/* Micro decorative decal badge at the bottom corner */}
          <circle cx="76" cy="74" r="2.5" fill="#8FD3F4" />
        </svg>
      </div>

      {/* Brand Name & Automotive Studio Tag */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight leading-none font-black text-xl sm:text-2xl">
            <span className="gradient-zan-text font-extrabold mr-1">ZAN</span>
            <span className="text-slate-900 dark:text-white font-extrabold tracking-wider">
              DECAL
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.28em] text-[#A18CD1] dark:text-[#A18CD1]/90 leading-tight">
            Automotive Studio
          </span>
        </div>
      )}
    </Link>
  );
}
