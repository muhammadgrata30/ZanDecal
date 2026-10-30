import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./atelier.css";
import "./editorial.css";
import "./experience.css";
import "./split-hero.css";
import { ThemeProvider } from "../components/ThemeContext";
import { SiteContentProvider } from "../components/SiteContentContext";
import { readContent } from "../lib/content-store";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = localFont({ variable: "--font-display", src: [
  { path: "../public/fonts/barlow-condensed-0.ttf", weight: "600", style: "normal" },
  { path: "../public/fonts/barlow-condensed-1.ttf", weight: "700", style: "normal" },
  { path: "../public/fonts/barlow-condensed-2.ttf", weight: "800", style: "normal" },
], display: "swap" });
const editorial = localFont({ variable: "--font-editorial", src: [
  { path: "../public/fonts/instrument-serif-0.ttf", weight: "400", style: "italic" },
  { path: "../public/fonts/instrument-serif-1.ttf", weight: "400", style: "normal" },
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
  const content = await readContent();
  return (
    <html lang="id" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${editorial.variable} antialiased min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-[#A18CD1]/30 selection:text-white`}
      >
        <ThemeProvider><SiteContentProvider initial={content}>{children}</SiteContentProvider></ThemeProvider>
      </body>
    </html>
  );
}
