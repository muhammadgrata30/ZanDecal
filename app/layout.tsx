import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-[#A18CD1]/30 selection:text-white`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
