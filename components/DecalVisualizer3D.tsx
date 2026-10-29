"use client";

import React, { Suspense, useEffect, useState, useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls } from "@react-three/drei";
import {
  Sparkles,
  Send,
  RotateCw,
  Layers,
  Palette,
  Check,
  MousePointerClick,
  Info,
  Car,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

// Types
export type FinishType = "Glossy" | "Matte" | "Satin" | "Metallic";

export interface DecalColor {
  name: string;
  hex: string;
  accent: string;
  desc: string;
}

// 5 Warna Pilihan Sesuai Ketentuan
export const DECAL_COLORS: DecalColor[] = [
  {
    name: "Soft Pink",
    hex: "#FF9A9E",
    accent: "from-[#FF9A9E] to-[#FECFEF]",
    desc: "Zan Signature Pastel Pink",
  },
  {
    name: "Lavender Purple",
    hex: "#A18CD1",
    accent: "from-[#A18CD1] to-[#FBC2EB]",
    desc: "Cyber Studio Lavender",
  },
  {
    name: "Sky Blue",
    hex: "#8FD3F4",
    accent: "from-[#8FD3F4] to-[#84FAB0]",
    desc: "Aerodynamic Sky Cyan",
  },
  {
    name: "Cyber Magenta",
    hex: "#F43F5E",
    accent: "from-[#F43F5E] to-[#FB7185]",
    desc: "Vibrant Motorsport Magenta",
  },
  {
    name: "Stealth Black",
    hex: "#1E1E24",
    accent: "from-[#1E1E24] to-[#2E2E38]",
    desc: "Midnight Satin Stealth",
  },
];

export const FINISH_SPECS: Record<
  FinishType,
  { roughness: number; metalness: number; label: string; desc: string }
> = {
  Glossy: {
    roughness: 0.1,
    metalness: 0.2,
    label: "Glossy",
    desc: "Refleksi jernih cermin wet-look",
  },
  Matte: {
    roughness: 0.7,
    metalness: 0.05,
    label: "Matte",
    desc: "Doff beludru anti-silau",
  },
  Satin: {
    roughness: 0.35,
    metalness: 0.25,
    label: "Satin",
    desc: "Semi-gloss mewah sentuhan sutra",
  },
  Metallic: {
    roughness: 0.2,
    metalness: 0.85,
    label: "Metallic",
    desc: "Pendaran butiran kristal metalik",
  },
};

// Helper: Terapkan warna, roughness, metalness ke material Three.js
function applyDecalToMaterial(
  mat: THREE.Material,
  hexColor: string,
  finish: FinishType
) {
  const spec = FINISH_SPECS[finish];
  const targetColor = new THREE.Color(hexColor);

  if ("color" in mat && mat.color instanceof THREE.Color) {
    mat.color.copy(targetColor);
  }
  if ("roughness" in mat && typeof mat.roughness === "number") {
    mat.roughness = spec.roughness;
  }
  if ("metalness" in mat && typeof mat.metalness === "number") {
    mat.metalness = spec.metalness;
  }
  if ("clearcoat" in mat && typeof mat.clearcoat === "number") {
    mat.clearcoat = finish === "Glossy" ? 1.0 : finish === "Satin" ? 0.4 : 0.0;
  }
  mat.needsUpdate = true;
}

// Sub-komponen 3D Model BYD Seal
interface ModelProps {
  color: DecalColor;
  finish: FinishType;
  clickedMesh: THREE.Mesh | null;
  setClickedMesh: (mesh: THREE.Mesh | null) => void;
  setMatchedCount: (count: number) => void;
}

function BydSealModel({
  color,
  finish,
  clickedMesh,
  setClickedMesh,
  setMatchedCount,
}: ModelProps) {
  // Load model .glb dari public/models/byd-seal.glb
  const { scene } = useGLTF("/models/byd-seal.glb");

  // Filter Otomatis & Logging Mesh/Material
  useEffect(() => {
    if (!scene) return;

    console.group("🏁 [Zan Decal] Inspeksi Mesh & Material GLB: BYD Seal");
    console.log("Total Nodes di Scene:", scene.children.length);

    // Kata kunci target bodi
    const includeKeywords = ["body", "paint", "car", "shell", "coat"];
    // Kata kunci yang harus diabaikan
    const excludeKeywords = [
      "glass",
      "window",
      "tire",
      "wheel",
      "rim",
      "light",
      "interior",
      "black",
    ];

    let matchCount = 0;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const meshName = (mesh.name || "").toLowerCase();

        // Ambil material
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        materials.forEach((mat, idx) => {
          if (!mat) return;
          const matName = (mat.name || "").toLowerCase();

          // Tampilkan log semua nama mesh dan material di console
          console.log(
            `📦 Mesh: "${mesh.name}" | Material[${idx}]: "${mat.name}" (${mat.type})`
          );

          // Cek apakah mengandung kata kunci target
          const isTarget =
            includeKeywords.some(
              (kw) => meshName.includes(kw) || matName.includes(kw)
            ) &&
            !excludeKeywords.some(
              (kw) => meshName.includes(kw) || matName.includes(kw)
            );

          if (isTarget) {
            matchCount++;
            applyDecalToMaterial(mat, color.hex, finish);
          }
        });
      }
    });

    console.log(`✅ Otomatis terapkan decal pada ${matchCount} mesh/material bodi.`);
    console.groupEnd();

    setMatchedCount(matchCount);
  }, [scene, color, finish, setMatchedCount]);

  // Efek kedua: jika user pernah mengklik mesh tertentu (Click-to-Paint)
  useEffect(() => {
    if (!clickedMesh) return;
    const materials = Array.isArray(clickedMesh.material)
      ? clickedMesh.material
      : [clickedMesh.material];

    materials.forEach((mat) => {
      if (mat) {
        applyDecalToMaterial(mat, color.hex, finish);
      }
    });
  }, [clickedMesh, color, finish]);

  // Handler Click-to-Paint Cadangan
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (e.object && e.object.isMesh) {
      const targetMesh = e.object as THREE.Mesh;
      console.log("🎯 [Click-to-Paint] Target mesh dipilih:", targetMesh.name);
      setClickedMesh(targetMesh);

      // Langsung beri warna
      const materials = Array.isArray(targetMesh.material)
        ? targetMesh.material
        : [targetMesh.material];
      materials.forEach((mat) => {
        if (mat) applyDecalToMaterial(mat, color.hex, finish);
      });
    }
  };

  return (
    <primitive
      object={scene}
      onPointerDown={handlePointerDown}
      cursor="pointer"
    />
  );
}

// Preload model agar instan saat dibuka
useGLTF.preload("/models/byd-seal.glb");

// Indikator Loading Estetik
function VisualizerLoader() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#F8F9FE]/90 dark:bg-[#0B0914]/90 backdrop-blur-md">
      <div className="relative flex items-center justify-center w-20 h-20 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-t-[#FF9A9E] border-r-[#A18CD1] border-b-[#8FD3F4] border-l-transparent animate-spin" />
        <Car className="w-8 h-8 text-[#A18CD1] animate-pulse" />
      </div>
      <div className="text-center">
        <div className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] bg-clip-text text-transparent">
          Memuat Model 3D BYD Seal...
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Menyiapkan shader material & studio lighting
        </p>
      </div>
    </div>
  );
}

// Komponen Utama
export default function DecalVisualizer3D() {
  const [selectedColor, setSelectedColor] = useState<DecalColor>(DECAL_COLORS[0]);
  const [selectedFinish, setSelectedFinish] = useState<FinishType>("Glossy");
  const [clickedMesh, setClickedMesh] = useState<THREE.Mesh | null>(null);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Hindari masalah SSR canvas pada Next.js
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // WhatsApp Order Handler
  const handleOrderWhatsApp = () => {
    const text =
      `Halo Studio Zan Decal, saya tertarik memesan decal dari 3D Visualizer:%0A%0A` +
      `🚗 Kendaraan: BYD Seal EV%0A` +
      `🎨 Warna Decal: ${encodeURIComponent(selectedColor.name)} (${selectedColor.hex})%0A` +
      `✨ Karakter Finishing: ${selectedFinish}%0A` +
      (clickedMesh ? `🎯 Target Khusus: Mesh "${clickedMesh.name}"%0A` : "") +
      `%0AMohon informasi jadwal konsultasi mockup dan antrian pemasangan studio. Terima kasih!`;

    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Container Utama Glassmorphism */}
      <div className="relative rounded-3xl overflow-hidden bg-white/90 dark:bg-[#110E23]/90 border border-slate-200/80 dark:border-white/10 shadow-2xl backdrop-blur-2xl transition-colors duration-300">
        
        {/* Header Visualizer */}
        <div className="p-5 sm:p-7 border-b border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] p-0.5 shadow-md">
              <div className="w-full h-full rounded-2xl bg-white dark:bg-[#0B0914] flex items-center justify-center">
                <Car className="w-5 h-5 text-[#A18CD1]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  BYD Seal 6 // 3D Decal Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Live 3D
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih warna & finishing, atau klik langsung bodi mobil untuk mewarnai bagian tertentu
              </p>
            </div>
          </div>

          {/* Status Target Badge */}
          <div className="flex items-center gap-2 text-xs">
            {clickedMesh ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-[#A18CD1]/40 text-[#A18CD1] font-semibold">
                <MousePointerClick className="w-3.5 h-3.5" />
                Target: {clickedMesh.name || "Bagian Terpilih"}
                <button
                  type="button"
                  onClick={() => setClickedMesh(null)}
                  className="ml-1 text-[11px] underline hover:text-white"
                  title="Kembali ke filter otomatis bodi"
                >
                  (Reset)
                </button>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#8FD3F4]" />
                Auto Body Filter ({matchedCount} parts aktif)
              </span>
            )}
          </div>
        </div>

        {/* 3D Canvas Area */}
        <div className="relative w-full h-[400px] sm:h-[480px] md:h-[540px] bg-gradient-to-b from-slate-100 via-slate-200/50 to-slate-100 dark:from-[#0B0914] dark:via-[#130F24] dark:to-[#0B0914] cursor-grab active:cursor-grabbing">
          {isMounted ? (
            <Suspense fallback={<VisualizerLoader />}>
              <Canvas
                shadows
                camera={{ position: [4, 2, 5], fov: 45 }}
                gl={{ antialias: true, alpha: true }}
              >
                {/* Stage dari Drei: skala otomatis pas dan posisi otomatis di tengah */}
                <Stage environment="city" intensity={0.6} adjustCamera={1.2}>
                  <BydSealModel
                    color={selectedColor}
                    finish={selectedFinish}
                    clickedMesh={clickedMesh}
                    setClickedMesh={setClickedMesh}
                    setMatchedCount={setMatchedCount}
                  />
                </Stage>

                {/* OrbitControls Default */}
                <OrbitControls
                  makeDefault
                  enablePan={false}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI / 2 - 0.05}
                  minDistance={2.5}
                  maxDistance={9.0}
                />
              </Canvas>
            </Suspense>
          ) : (
            <VisualizerLoader />
          )}

          {/* Hint Navigasi */}
          <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pointer-events-none">
            <span className="flex items-center gap-1.5 backdrop-blur-sm bg-white/70 dark:bg-black/50 px-2.5 py-1 rounded-lg">
              <RotateCw className="w-3 h-3 text-[#A18CD1]" /> Drag 360° untuk memutar sudut pandang
            </span>
            <span className="hidden sm:flex items-center gap-1.5 backdrop-blur-sm bg-white/70 dark:bg-black/50 px-2.5 py-1 rounded-lg">
              <MousePointerClick className="w-3 h-3 text-[#8FD3F4]" /> Klik bagian bodi untuk fitur Click-to-Paint
            </span>
          </div>
        </div>

        {/* UI CONTROL DOCK (Cyber-Pastel Theme) */}
        <div className="p-6 sm:p-8 bg-white/95 dark:bg-[#120F24]/95 border-t border-slate-200/80 dark:border-white/10 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Pilihan Warna Decal (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#A18CD1]" />
                  Pilihan Warna Decal:
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {selectedColor.name} ({selectedColor.hex})
                </span>
              </div>

              {/* Grid 5 Pilihan Warna */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {DECAL_COLORS.map((col) => {
                  const isSelected = selectedColor.hex === col.hex;
                  return (
                    <button
                      key={col.hex}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-100 dark:bg-white/10 border-[#A18CD1] ring-2 ring-[#A18CD1]/50 shadow-md scale-[1.02]"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${col.accent} shadow-md flex items-center justify-center mb-2 transition-transform ${
                          isSelected ? "scale-110" : ""
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white stroke-[3] drop-shadow" />}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate w-full">
                        {col.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {col.hex}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pilihan Finishing (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8FD3F4]" />
                Tekstur Finishing Material:
              </span>

              {/* 4 Pilihan Finishing */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["Glossy", "Matte", "Satin", "Metallic"] as FinishType[]).map((finish) => {
                  const isSelected = selectedFinish === finish;
                  const spec = FINISH_SPECS[finish];
                  return (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => setSelectedFinish(finish)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-slate-100 dark:bg-white/10 border-[#8FD3F4] ring-2 ring-[#8FD3F4]/50 shadow-md scale-[1.02]"
                          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                      }`}
                    >
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        {spec.label}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {spec.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Info Garansi Non-Residu */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Cast vinyl grade industri, 100% aman bagi cat asli BYD.</span>
              </div>
            </div>

          </div>

          {/* Tombol Order Otomatis via WhatsApp */}
          <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              Konfigurasi aktif: <strong className="text-slate-900 dark:text-white">{selectedColor.name}</strong> •{" "}
              <strong className="text-slate-900 dark:text-white">{selectedFinish} Finish</strong>
              {clickedMesh ? ` (Target: ${clickedMesh.name})` : " (Full Body)"}
            </div>

            <button
              type="button"
              onClick={handleOrderWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4] shadow-lg shadow-[#A18CD1]/30 hover:shadow-xl hover:shadow-[#A18CD1]/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Order Konsep Ini via WhatsApp</span>
              <ExternalLink className="w-4 h-4 ml-0.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
