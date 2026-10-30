"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, Environment, Grid, Html, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { VehicleModel } from "../DecalCanvas3D";
import type { DecalColor, FinishType } from "../DecalVisualizer3D";
import type { StudioVehicle } from "../vehiclePaint";

const ignore = () => {};

function Vinyl({ running }: { running: boolean }) {
  const mesh = useRef<THREE.Mesh<THREE.PlaneGeometry>>(null);
  useFrame(({ clock }) => {
    if (!running || !mesh.current) return;
    const positions = mesh.current.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      positions.setZ(i, Math.sin(positions.getX(i) * .9 + clock.elapsedTime * .45) * .4);
    }
    positions.needsUpdate = true;
    mesh.current.geometry.computeVertexNormals();
  });
  return <mesh ref={mesh} position={[0, 3.2, -2.4]} rotation={[0, -.2, -.16]}>
    <planeGeometry args={[9, 1.5, 64, 8]}/>
    <meshPhysicalMaterial color="#b8a1e7" side={THREE.DoubleSide} metalness={.25} roughness={.2} transparent opacity={.64}/>
  </mesh>;
}

function Lighting({ running }: { running: boolean }) {
  const light = useRef<THREE.DirectionalLight>(null);
  useFrame(({ clock }) => {
    if (running && light.current) light.current.position.x = 3 + Math.sin(clock.elapsedTime * .25) * 4;
  });
  return <><ambientLight intensity={.8}/><directionalLight ref={light} position={[4, 6, 3]} intensity={2.6}/>
    <Environment resolution={128} frames={1}>
      <Lightformer position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[9, 5, 1]} intensity={3}/>
      <Lightformer position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[6, 3, 1]} intensity={2}/>
    </Environment></>;
}

function Model({ vehicle, color, finish }: { vehicle: StudioVehicle; color: DecalColor; finish: FinishType }) {
  const path = vehicle === "car" ? "/models/byd-seal.glb" : "/models/2024_ducati_streetfighter_v4_s.glb";
  const { scene } = useGLTF(path);
  const scale = useMemo(() => {
    const size = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    return 4 / Math.max(size.x, size.z);
  }, [scene]);
  return <Center top><group scale={scale}>
    <VehicleModel vehicle={vehicle} color={color} finish={finish} clickedMesh={null} setClickedMesh={ignore} setMatchedCount={ignore}/>
  </group></Center>;
}

export default function MotionCanvas({ option, dark, running, vehicle, color, finish, hero = false, view = "orbit" }: {
  option: number; dark: boolean; running: boolean; vehicle: StudioVehicle; color: DecalColor; finish: FinishType; hero?: boolean; view?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const animate = running && visible;
  const camera: [number, number, number] = view === "side" ? [0, 2, 7] : view === "front" ? [7, 2, 0] : option === 3 ? [5.5, 6, 5.5] : [5.8, 2.9, 5.8];
  const paper = dark ? "#08090c" : option === 3 ? "#e1f2f8" : "#f5f4f1";
  return <div ref={root} className="lab-webgl" aria-label={`${vehicle === "car" ? "BYD Seal" : "Ducati"} 3D, geser untuk memutar dan scroll untuk zoom`}>
    <Canvas key={`${vehicle}-${view}-${option}-${dark}`} dpr={[1, 1.5]} frameloop={animate ? "always" : "demand"}
      camera={{ position: camera, fov: 38 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <color attach="background" args={[paper]}/><fog attach="fog" args={[paper, 13, 28]}/>
      <Lighting running={animate}/>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.17, 0]}><planeGeometry args={[100, 100]}/><meshStandardMaterial color={paper} roughness={.4}/></mesh>
      <mesh position={[0, -.09, 0]}>
        {option === 3 ? <boxGeometry args={[5.7, .16, 4.6]}/> : <cylinderGeometry args={[3.1, 3.1, .16, 96]}/>}
        <meshStandardMaterial color={dark ? "#1a1c24" : "#ffffff"} metalness={.18} roughness={.3}/>
      </mesh>
      <Grid position={[0, -.005, 0]} args={[28, 28]} cellSize={.4} sectionSize={2} cellThickness={.45} sectionThickness={.8}
        cellColor={dark ? "#393b48" : "#bac4cf"} sectionColor={dark ? "#5b536d" : "#a3b1c1"} fadeDistance={18} fadeStrength={2}/>
      <mesh position={[0, 3.8, 0]}><cylinderGeometry args={[14, 14, 8, 96, 1, true, Math.PI / 2, Math.PI]}/>
        <meshStandardMaterial color={dark ? "#15151c" : "#f6f5f3"} side={THREE.DoubleSide} roughness={.65}/></mesh>
      {option === 3 ? <mesh position={[-3.7, 2.1, -.8]} rotation={[0, .25, 0]}><boxGeometry args={[.08, 4.5, 5]}/><meshPhysicalMaterial color="#91d2ec" transparent opacity={.32} roughness={.12} metalness={.1}/></mesh>
        : <mesh position={[0, 4.5, -.2]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[3.6, .07, 12, 96]}/><meshStandardMaterial color="white" emissive="white" emissiveIntensity={1}/></mesh>}
      {hero && option !== 2 && <Vinyl running={animate}/>}
      <Suspense fallback={<Html center><span className="lab-model-loading">Menyiapkan model 3D…</span></Html>}>
        <Model vehicle={vehicle} color={color} finish={finish}/>
        <ContactShadows position={[0, .002, 0]} opacity={dark ? .7 : .35} scale={10} blur={2.5} far={4} resolution={256} frames={1}/>
      </Suspense>
      <OrbitControls makeDefault target={[0, .8, 0]} enablePan={false} enableZoom={!hero} minDistance={4.5} maxDistance={12}
        minPolarAngle={.3} maxPolarAngle={Math.PI / 2 - .04} autoRotate={animate && !dragging && view === "orbit"}
        autoRotateSpeed={option === 2 ? .38 : .22} onStart={() => setDragging(true)} onEnd={() => setDragging(false)}/>
    </Canvas>
  </div>;
}
