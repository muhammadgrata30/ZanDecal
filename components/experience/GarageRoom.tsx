"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import { HeroEnvironment } from "./HeroEnvironment";
import { DECAL_COLORS } from "../DecalVisualizer3D";
import { journeyPose } from "./journeyMath";

function Block({ at, size, color, metal = .25, glow = false }: {
  at: [number, number, number]; size: [number, number, number]; color: string; metal?: number; glow?: boolean;
}) {
  return <mesh position={at}><boxGeometry args={size}/><meshStandardMaterial color={color} metalness={metal} roughness={glow ? .3 : .65} emissive={glow ? color : "#000000"} emissiveIntensity={glow ? 1.8 : 0}/></mesh>;
}

/** Procedural architecture: no external textures, remote fonts, or heavy room asset. */
export function GarageRoom({ dark, progress, running, palette = DECAL_COLORS }: { dark: boolean; progress: { current: number }; running: boolean; palette?:{hex:string}[] }) {
  const heroBay = useRef<THREE.Group>(null);
  const studioBay = useRef<THREE.Group>(null);
  const backdrop = useMemo(() => new THREE.Color(), []);
  const heroColor = useMemo(() => new THREE.Color(dark ? "#171222" : "#f2edf5"), [dark]);
  const studioColor = useMemo(() => new THREE.Color(dark ? "#11151c" : "#e9e9e5"), [dark]);
  const wall = dark ? "#1b222b" : "#deded8";
  const steel = dark ? "#303c49" : "#9ca7af";
  const darkSteel = dark ? "#121820" : "#afb8bb";
  const floor = dark ? "#171d25" : "#deded7";
  const light = dark ? "#c5e4f9" : "#f9fcff";
  const accent = dark ? "#9f8cc9" : "#8b76ae";
  useFrame(({ scene }) => {
    const studio = journeyPose(progress.current).room > .5;
    backdrop.copy(studio ? studioColor : heroColor);
    if (scene.background instanceof THREE.Color) scene.background.copy(backdrop);
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(backdrop);
    if (heroBay.current) heroBay.current.visible = !studio;
    if (studioBay.current) studioBay.current.visible = studio;
  });
  return <>
    <fog attach="fog" args={[backdrop, 18, 40]}/>
    <group ref={heroBay}><HeroEnvironment dark={dark} running={running}/></group>
    <group ref={studioBay} visible={false}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.012, 0]}><planeGeometry args={[80, 60]}/><meshStandardMaterial color={floor} roughness={.38} metalness={.18}/></mesh>
    <Grid position={[0, -.008, 0]} args={[44, 24]} cellSize={1.5} sectionSize={6} fadeDistance={25} fadeStrength={2} cellThickness={.35} sectionThickness={.45} cellColor={dark ? "#34404a" : "#b5bcb9"} sectionColor={dark ? "#48525d" : "#a1aba9"}/>
    {/* A continuous back wall, structural columns, and ceiling light tracks. */}
    <Block at={[0, 3.6, -6.2]} size={[36, 7.2, .3]} color={wall}/>
    {[-12, -6, 0, 6, 12].map(x => <group key={x}>
      <Block at={[x, 3.5, -6]} size={[.18, 7, .3]} color={steel}/>
      <Block at={[x, 6.7, -1]} size={[.15, .25, 11]} color={steel}/>
      <Block at={[x + .15, 6.5, -.8]} size={[.065, .04, 8]} color={light} glow/>
    </group>)}
    <Block at={[0, .18, -5.96]} size={[36, .06, .03]} color={accent} glow/>
      {/* A fitted wrap bay: illuminated frame, workbench, material rack. */}
      <Block at={[1, 2.8, -5.9]} size={[8.8, 5.2, .18]} color={darkSteel}/>
      {[-3.6, 5.6].map(x => <group key={x}><Block at={[x, 2.6, -4.9]} size={[.12, 5.2, .2]} color={steel}/><Block at={[x, 2.65, -4.77]} size={[.055, 4.9, .025]} color={light} glow/></group>)}
      <Block at={[1, 5.2, -4.9]} size={[9.3, .12, .2]} color={steel}/>
      <Block at={[1, 5.14, -4.77]} size={[9.1, .055, .025]} color={light} glow/>
      {/* Cutting table, measuring grid and film sheet. */}
      <Block at={[-4.9, 1.25, -3.4]} size={[3.5, .12, 1.6]} color={steel}/>
      <Block at={[-4.9, 1.32, -3.4]} size={[3.2, .025, 1.35]} color={dark ? "#285b51" : "#4a8170"}/>
      {[-6.3, -3.5].map(x => <Block key={x} at={[x, .62, -3.4]} size={[.09, 1.25, 1.35]} color={steel}/>)}
      {Array.from({length: 9}, (_, i) => <Block key={i} at={[-6.3 + i * .35, 1.338, -3.4]} size={[.008, .004, 1.3]} color="#a2c7b4"/>)}
      <Block at={[-4.3, 1.35, -3.4]} size={[1.1, .012, .9]} color="#b7a1d8"/>
      {/* Heat gun, squeegees, knife and steel ruler on the cutting table. */}
      <group position={[-5.8, 1.47, -3.5]} rotation={[0, .3, 0]}><Block at={[0, 0, 0]} size={[.42, .17, .16]} color="#e17137"/><Block at={[.27, 0, 0]} size={[.2, .1, .1]} color={steel}/><Block at={[-.08, -.1, 0]} size={[.1, .25, .12]} color={darkSteel}/></group>
      {[0, 1, 2].map(i => <Block key={i} at={[-5.5 + i * .3, 1.36, -2.9]} size={[.22, .025, .13]} color={i === 1 ? "#edcb55" : "#5898cc"}/>)}
      <Block at={[-4.5, 1.36, -3.9]} size={[1.2, .018, .055]} color="#bec6cf"/>
      <Block at={[-5.4, 1.36, -3.9]} size={[.32, .025, .05]} color="#e6b238"/>
      {/* Rolling tool chest and pegboard. */}
      <Block at={[5.5, .65, -2.8]} size={[1.25, 1.1, .8]} color={accent}/>
      {[.3, .5, .7, .9].map(y => <Block key={y} at={[5.5, y, -2.39]} size={[1.1, .025, .03]} color={steel}/>)}
      {[5, 6].map(x => <mesh key={x} position={[x, .13, -2.6]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.12,.12,.08,12]}/><meshStandardMaterial color={darkSteel}/></mesh>)}
      <Block at={[-4.9, 3.1, -5.8]} size={[3.4, 1.8, .08]} color={darkSteel}/>
      {Array.from({length: 8}, (_,i) => <group key={i}><Block at={[-6.3+i*.4, 3.2, -5.69]} size={[.045,.55,.05]} color={steel}/><Block at={[-6.3+i*.4, 3.49, -5.69]} size={[.15,.09,.05]} color={steel}/></group>)}
      <Block at={[8.8, 1.05, -5.2]} size={[4.5, 2.1, 1]} color={darkSteel}/>
      <Block at={[8.8, 2.13, -5.2]} size={[4.65, .12, 1.1]} color={steel}/>
      {[7.3, 8.3, 9.3, 10.3].map(x => <Block key={x} at={[x, 1.05, -4.68]} size={[.018, 1.9, .025]} color={steel}/>)}
      {palette.slice(0,12).map((color, i) => <mesh key={i} position={[7.1 + (i % 6) * .65, 2.9 + Math.floor(i / 6) * 1.3, -5.5]}><cylinderGeometry args={[.16, .16, 1.1, 16]}/><meshStandardMaterial color={color.hex} roughness={.45}/></mesh>)}
      {[-2.3, 4.3].map(x => <Block key={x} at={[x, .004, .2]} size={[.035, .008, 7.8]} color={accent}/>)}
      <Block at={[1, .004, -3.7]} size={[6.6, .008, .035]} color={accent}/>
      <Block at={[1, .004, 4.1]} size={[6.6, .008, .035]} color={accent}/>
    </group>
  </>;
}
