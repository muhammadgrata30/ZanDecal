"use client";

import React from "react";
import { useTheme } from "./ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, isMounted } = useTheme();

  if (!isMounted) {
    return (
      <div
        className={`w-16 h-8 rounded-full bg-slate-200 dark:bg-white/10 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? "Light Studio" : "Midnight Garage"} mode`}
      className={`relative flex items-center justify-between w-18 h-9 px-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#A18CD1]/50 cursor-pointer shadow-inner ${
        isDark
          ? "bg-[#181329] border border-white/15 text-slate-300 hover:border-[#8FD3F4]/50"
          : "bg-white/90 border border-slate-200 text-slate-700 hover:border-[#A18CD1]/50 shadow-sm"
      } ${className}`}
      title={isDark ? "Ganti ke Light Studio (#F8F9FE)" : "Ganti ke Midnight Garage (#0B0914)"}
    >
      {/* Sliding knob with gradient indicator */}
      <span
        className={`absolute top-1 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 shadow-md ${
          isDark
            ? "left-1 translate-x-9 bg-gradient-to-tr from-[#A18CD1] to-[#8FD3F4] text-[#0B0914]"
            : "left-1 translate-x-0 bg-gradient-to-tr from-[#FF9A9E] to-[#A18CD1] text-white"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 stroke-[2.5]" />
        ) : (
          <Sun className="w-3.5 h-3.5 stroke-[2.5]" />
        )}
      </span>

      {/* Sun icon background position */}
      <span
        className={`w-6 flex items-center justify-center text-xs transition-opacity duration-200 ${
          isDark ? "opacity-40 text-slate-400" : "opacity-0"
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
      </span>

      {/* Moon icon background position */}
      <span
        className={`w-6 flex items-center justify-center text-xs transition-opacity duration-200 ${
          isDark ? "opacity-0" : "opacity-40 text-slate-500"
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}
