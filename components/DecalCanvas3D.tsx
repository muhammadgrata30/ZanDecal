"use client";

import React, { useEffect } from "react";
import * as THREE from "three";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls, Environment, Lightformer } from "@react-three/drei";
import { FinishType, DecalColor, FINISH_SPECS } from "./DecalVisualizer3D";

interface DecalCanvas3DProps {
  color: DecalColor;
  finish: FinishType;
  clickedMesh: THREE.Mesh | null;
  setClickedMesh: (mesh: THREE.Mesh | null) => void;
  setMatchedCount: (count: number) => void;
}

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
    mat.clearcoat = spec.coat;
  }
  mat.needsUpdate = true;
}

function BydSealModel({
  color,
  finish,
  clickedMesh,
  setClickedMesh,
  setMatchedCount,
}: DecalCanvas3DProps) {
  const { scene } = useGLTF("/models/byd-seal.glb");

  // 1. Filter Otomatis & Logging Mesh/Material
  useEffect(() => {
    if (!scene) return;

    console.group("🏁 [Zan Decal] Inspeksi Mesh & Material GLB: BYD Seal");
    const includeKeywords = ["body", "paint", "car", "shell", "coat"];
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

          // Cek kecocokan kata kunci
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

  // 2. Terapkan pada clickedMesh jika ada (Click-to-Paint)
  useEffect(() => {
    if (!clickedMesh) return;
    const materials = Array.isArray(clickedMesh.material)
      ? clickedMesh.material
      : [clickedMesh.material];

    materials.forEach((mat) => {
      if (mat) applyDecalToMaterial(mat, color.hex, finish);
    });
  }, [clickedMesh, color, finish]);

  // 3. Pointer event handler untuk Click-to-Paint
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.object instanceof THREE.Mesh) {
      const targetMesh = e.object as THREE.Mesh;
      setClickedMesh(targetMesh);
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

export default function DecalCanvas3D(props: DecalCanvas3DProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [4, 2, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Stage environment={null} intensity={0.6} adjustCamera={1.2}>
        <BydSealModel {...props} />
      </Stage>
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={3} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 5, 1]} />
        <Lightformer intensity={2} position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[8, 3, 1]} />
        <Lightformer intensity={2} position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 3, 1]} />
      </Environment>
      <OrbitControls
        makeDefault
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={2.5}
        maxDistance={9.0}
      />
    </Canvas>
  );
}
