"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** An open architectural runway, deliberately separate from the working garage. */
export function HeroEnvironment({ dark, running }: { dark: boolean; running: boolean }) {
  const lights = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    if (running) elapsed.current += Math.min(delta, .05);
    if (lights.current) lights.current.position.x = Math.sin(elapsed.current * .35) * .35;
  });
  return <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.013, 0]}><planeGeometry args={[100, 80]}/><meshStandardMaterial color={dark ? "#13121e" : "#e9e5ed"} metalness={.35} roughness={.28}/></mesh>
    {/* Monumental light portals and staggered fins, with open space between them. */}
    {[0, 1, 2].map(i => <mesh key={i} position={[4.4, 1.6, -6 - i * 2.4]}><torusGeometry args={[4.5 + i * .22, .055, 8, 96]}/><meshStandardMaterial color={dark ? "#cbb9ed" : "#84709e"} emissive={dark ? "#a48ccf" : "#b9a6cf"} emissiveIntensity={dark ? 1.4 : .3} metalness={.5} roughness={.25}/></mesh>)}
    {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[6.7 + i * .8, 2.1 + i * .13, -6.5 - i * .6]} rotation={[0, -.4, -.13]}><boxGeometry args={[.13, 7.4, 1.5]}/><meshStandardMaterial color={dark ? "#393043" : "#c9bed5"} metalness={.55} roughness={.33}/></mesh>)}
    <group ref={lights}>{[-2.5, 2.8].map(z => <mesh key={z} position={[4, .002, z]}><boxGeometry args={[40, .006, .025]}/><meshBasicMaterial color={dark ? "#a794d4" : "#9d88b7"}/></mesh>)}</group>
    <mesh position={[3, .004, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[7.8, 7.82, 120]}/><meshBasicMaterial color={dark ? "#544560" : "#b9a8c4"}/></mesh>
  </>;
}
