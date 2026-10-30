"use client";

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { useGLTF, useTexture, Stage, OrbitControls, Environment, Lightformer } from "@react-three/drei";
import { type FinishType, type DecalColor, FINISH_SPECS } from "./DecalVisualizer3D";
import { isVehiclePaint, type StudioVehicle } from "./vehiclePaint";

interface DecalCanvas3DProps {
  vehicle: StudioVehicle;
  color: DecalColor;
  finish: FinishType;
  clickedMesh: THREE.Mesh | null;
  setClickedMesh: (mesh: THREE.Mesh | null) => void;
  setMatchedCount: (count: number) => void;
}

function applyDecalToMaterial(mat: THREE.Material, hexColor: string, finish: FinishType) {
  const spec = FINISH_SPECS[finish];
  if ("color" in mat && mat.color instanceof THREE.Color) mat.color.set(hexColor);
  if ("roughness" in mat) mat.roughness = spec.roughness;
  if ("metalness" in mat) mat.metalness = spec.metalness;
  if ("clearcoat" in mat) mat.clearcoat = spec.coat;
}

export function VehicleModel({ vehicle, color, finish, clickedMesh, setClickedMesh, setMatchedCount }: DecalCanvas3DProps) {
  const path = vehicle === "ducati" ? "/models/2024_ducati_streetfighter_v4_s.glb" : "/models/byd-seal.glb";
  const { scene: source } = useGLTF(path);
  const neutralPaint = useTexture("/models/ducati-paint-neutral.png");
  const prepared = useMemo(() => {
    // Paint private material copies; switching vehicles never mutates the GLTF cache.
    const scene = source.clone(true);
    const materials = new Map<THREE.Material, THREE.Material>();
    const paintMaterials = new Set<THREE.Material>();
    const maps = new Map<THREE.Texture, THREE.Texture>();
    scene.traverse(child => {
      if (!(child instanceof THREE.Mesh)) return;
      const copy = (original: THREE.Material) => {
        let material = materials.get(original);
        if (!material) { material = original.clone(); materials.set(original, material); }
        if (isVehiclePaint(vehicle, child.name, material.name)) {
          paintMaterials.add(material);
          if (vehicle === "ducati" && material instanceof THREE.MeshStandardMaterial && material.map) {
            const originalMap = material.map;
            let map = maps.get(originalMap);
            if (!map) {
              map = originalMap.clone();
              // Texture.clone shares its Source; replace it to protect the cached GLB.
              map.source = new THREE.Source(neutralPaint.image);
              map.needsUpdate = true;
              maps.set(originalMap, map);
            }
            material.map = map;
          }
        }
        return material;
      };
      child.material = Array.isArray(child.material) ? child.material.map(copy) : copy(child.material);
    });
    return { scene, materials, paintMaterials, maps };
  }, [source, vehicle, neutralPaint]);

  useEffect(() => { setMatchedCount(prepared.paintMaterials.size); }, [prepared, setMatchedCount]);

  useEffect(() => {
    const selected = clickedMesh ? (Array.isArray(clickedMesh.material) ? clickedMesh.material : [clickedMesh.material]) : [...prepared.paintMaterials];
    selected.forEach(material => {
      if (prepared.paintMaterials.has(material)) applyDecalToMaterial(material, color.hex, finish);
    });
  }, [prepared, clickedMesh, color.hex, finish]);

  useEffect(() => () => {
    prepared.materials.forEach(material => material.dispose());
    prepared.maps.forEach(map => map.dispose());
  }, [prepared]);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!(event.object instanceof THREE.Mesh)) return;
    const materials = Array.isArray(event.object.material) ? event.object.material : [event.object.material];
    if (!materials.some(material => prepared.paintMaterials.has(material))) return;
    event.stopPropagation();
    setClickedMesh(event.object);
  };

  return <primitive object={prepared.scene} onPointerDown={handlePointerDown}/>;
}

export default function DecalCanvas3D(props: DecalCanvas3DProps) {
  return <Canvas key={props.vehicle} shadows camera={{ position: [4, 2, 5], fov: 45 }}
    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
    <Stage environment={null} intensity={0.6} adjustCamera={1.2}>
      <VehicleModel {...props}/>
    </Stage>
    <Environment resolution={128} frames={1}>
      <Lightformer intensity={3} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 5, 1]}/>
      <Lightformer intensity={2} position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[8, 3, 1]}/>
      <Lightformer intensity={2} position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 3, 1]}/>
    </Environment>
    <OrbitControls makeDefault enablePan={false} minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2 - 0.05} minDistance={2.5} maxDistance={9}/>
  </Canvas>;
}
