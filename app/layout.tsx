import type { Metadata } from "next";
import { GentleScroll } from "../components/GentleScroll";
import "lenis/dist/lenis.css";
import localFont from "next/font/local";
import "./globals.css";
import "./atelier.css";
import "./editorial.css";
import "./experience.css";
import "./split-hero.css";
import "./typography.css";
import { ThemeProvider } from "../components/ThemeContext";
import { SiteContentProvider } from "../components/SiteContentContext";
import { readInitialContent } from "../lib/content-store";

export const dynamic = "force-dynamic";

const geistSans = localFont({
  src: "../public/fonts/geist-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-footer-body",
  preload: false,
});

const geistMono = localFont({
  src: "../public/fonts/geist-mono-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist-mono",
});

const display = localFont({ variable: "--font-footer-display", preload: false, src: [
  { path: "../public/fonts/barlow-condensed-0.ttf", weight: "600", style: "normal" },
  { path: "../public/fonts/barlow-condensed-1.ttf", weight: "700", style: "normal" },
  { path: "../public/fonts/barlow-condensed-2.ttf", weight: "800", style: "normal" },
], display: "swap" });
const archivo = localFont({ variable: "--font-archivo", src: [
  { path: "../public/fonts/type-study/archivo-condensed-900.ttf", weight: "900", style: "normal" },
], display: "swap" });
const chivo = localFont({ variable: "--font-chivo", src: [
  { path: "../public/fonts/type-study/chivo-400.ttf", weight: "400", style: "normal" },
  { path: "../public/fonts/type-study/chivo-600.ttf", weight: "600", style: "normal" },
  { path: "../public/fonts/type-study/chivo-700.ttf", weight: "700", style: "normal" },
], display: "swap" });

export const metadata: Metadata = {
  title: "Zan Decal - Premium Decal & Custom Sticker Studio",
  description:
    "Transformasi Visual Tanpa Batas untuk Kendaraan Anda. Spesialis decal otomotif, custom livery balap, full wrap vinyl, dan cutting sticker presisi tinggi.",
  keywords: [
    "Zan Decal",
    "Decal Mobil",
    "Decal Motor",
    "Stiker Custom",
    "Livery Balap",
    "Wrapping Mobil",
    "3D Visualizer Decal",
    "Paint Protection Film",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await readInitialContent();
  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <head><script dangerouslySetInnerHTML={{__html:"try{if(localStorage.getItem('zan-decal-theme')==='dark')document.documentElement.classList.add('dark')}catch{}"}}/></head>
      <body
        className={`${archivo.variable} ${chivo.variable} ${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-[#A18CD1]/30 selection:text-white`}
      >
        <GentleScroll/>
        <ThemeProvider><SiteContentProvider initial={content}>{children}</SiteContentProvider></ThemeProvider>
      </body>
    </html>
  );
}
