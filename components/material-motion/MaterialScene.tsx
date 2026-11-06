"use client";

import { Suspense, useEffect, useMemo, useRef, useState, useSyncExternalStore, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Color, DoubleSide, Group, Mesh, MeshPhysicalMaterial, SpotLight } from "three";
import { applyHoodWrap, materialRollShape, motionEase, updateVinylBuffers } from "../../lib/material-motion";
import { MATERIAL_QUALITY, initialMaterialQuality, lowerMaterialQuality, effectiveMaterialQuality, type MaterialQuality } from "../../lib/material-quality";
import { materialSurface, type PreviewFinish } from "../../lib/material-preview";
import type { Material } from "../../lib/content-types";

export interface MotionControl {
  time: number; progress: number; manual: boolean; playing: boolean; reduced: boolean;
  dragging: boolean; pointer: number; restart: number;
}
interface SceneProps {
  option: number; control: MutableRefObject<MotionControl>; dark: boolean; color: string;
  finish: PreviewFinish; material?: Material; active: boolean; economy?: boolean; onMaterial: (index: number) => void;
  presentation?: "sheet" | "wrap" | "duel"; comparison?: PreviewFinish; split?: number;
  onReady?: () => void; onUnavailable?: () => void;
  fullRoll?: boolean;
}
interface WorldProps extends SceneProps { quality: MaterialQuality }

const colors = ["#A18CD1", "#8FD3F4", "#FF9A9E"];

function Foil({ control, variant, index = 0, color, finish, selectedMaterial, quality, presentation = "sheet", comparison = "Matte", split = .5, fullRoll = false, onClick }: {
  control: SceneProps["control"]; variant: number; index?: number; color: string; finish: PreviewFinish; selectedMaterial?: Material; quality: MaterialQuality; onClick?: () => void;
  presentation?: SceneProps["presentation"]; comparison?: PreviewFinish; split?: number;
  fullRoll?: boolean;
}) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<MeshPhysicalMaterial>(null);
  const targetColor = useMemo(() => new Color(color), [color]);
  const [initialColor] = useState(color);
  const [initialProfile] = useState(() => materialSurface(selectedMaterial, finish));
  const surfaceProfile = materialSurface(selectedMaterial, finish);
  const grain = useRef({ value: surfaceProfile.grain });
  const duel = useRef({ value: 0 }), seam = useRef({ value: .5 }), rightRoughness = useRef({ value: .75 });
  const previous = useRef({ progress: -1, time: -1, columns: -1, presentation: "", fullRoll: false });
  const budget = MATERIAL_QUALITY[quality];
  useEffect(() => {
    const surface = material.current;
    if (!surface) return;
    // Both faces retain the chosen color, including curled areas facing the camera.
    surface.onBeforeCompile = shader => {
      shader.uniforms.uFoilGrain = grain.current;
      shader.uniforms.uFoilDuel = duel.current; shader.uniforms.uFoilSplit = seam.current; shader.uniforms.uFoilRight = rightRoughness.current;
      shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vFoilLocal;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvFoilLocal = position;");
      shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vFoilLocal;\nuniform float uFoilGrain;\nuniform float uFoilDuel;\nuniform float uFoilSplit;\nuniform float uFoilRight;\nfloat foilGrain(vec3 p){return fract(sin(dot(floor(p * 350.0),vec3(12.9898,78.233,39.425)))*43758.5453);}");
      shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, uFoilRight, uFoilDuel * smoothstep(uFoilSplit - 0.004, uFoilSplit + 0.004, vFoilLocal.x / 6.4 + 0.5));\nroughnessFactor = clamp(roughnessFactor + (foilGrain(vFoilLocal)-0.5)*uFoilGrain, 0.05, 1.0);");
    };
    surface.customProgramCacheKey = () => `zan-foil-wrap-duel-${variant}-${index}`;
    surface.needsUpdate = true;
  }, [variant, index]);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    const geometry = mesh.current.geometry;
    const { progress: p, time, pointer, reduced } = control.current;
    const t = reduced ? 0 : time;
    let open = .8, wave = .16;
    if (variant === 1) { open = .12 + p * .88; wave = p * .16; }
    if (variant === 2) { open = .84; wave = .5; }
    if (variant === 3) { open = .98; wave = .65; }
    if (variant === 4) { open = .95; wave = index === 1 ? .1 : .24; }
    if (variant === 5) { const shape = materialRollShape(p, fullRoll); open = shape.open; wave = shape.wave; }
    if (previous.current.progress !== p || previous.current.time !== t || previous.current.columns !== budget.columns || previous.current.presentation !== presentation || previous.current.fullRoll !== fullRoll) {
      updateVinylBuffers(geometry.attributes.position.array as Float32Array, geometry.attributes.normal.array as Float32Array, budget.columns, budget.rows, open, wave, t * .65);
      if (presentation !== "sheet") applyHoodWrap(geometry.attributes.position.array as Float32Array, geometry.attributes.normal.array as Float32Array, budget.columns, budget.rows, presentation === "duel" ? 1 : p);
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.normal.needsUpdate = true;
      previous.current = { progress: p, time: t, columns: budget.columns, presentation, fullRoll };
    }
    const blend = reduced ? 1 : 1 - Math.exp(-Math.min(delta, .05) * 9);
    grain.current.value += (surfaceProfile.grain - grain.current.value) * blend;
    duel.current.value = presentation === "duel" ? 1 : 0;
    seam.current.value = split;
    rightRoughness.current.value += (materialSurface(selectedMaterial, comparison).roughness - rightRoughness.current.value) * blend;
    if (material.current) {
      material.current.color.lerp(targetColor, blend);
      material.current.roughness += (surfaceProfile.roughness - material.current.roughness) * blend;
      material.current.clearcoat += ((presentation === "duel" ? .12 : surfaceProfile.clearcoat) - material.current.clearcoat) * blend;
      const metalness = index === 1 && variant === 4 ? .1 : surfaceProfile.metalness;
      material.current.metalness += (metalness - material.current.metalness) * blend;
    }
    mesh.current.rotation.y = variant === 5 && presentation === "sheet" ? (p - .5) * .65 : pointer * .08;
  });
  return <mesh ref={mesh} castShadow receiveShadow onClick={onClick ? event => { event.stopPropagation(); onClick(); } : undefined}>
    <planeGeometry args={[8, 3.8, budget.columns, budget.rows]} />
    <meshPhysicalMaterial ref={material} color={initialColor} metalness={index === 1 && variant === 4 ? .1 : initialProfile.metalness} roughness={initialProfile.roughness} clearcoat={initialProfile.clearcoat} clearcoatRoughness={.18} side={DoubleSide} envMapIntensity={1.3} transparent={variant === 4 && index === 1} opacity={variant === 4 && index === 1 ? .35 : 1} depthWrite={!(variant === 4 && index === 1)} />
  </mesh>;
}

function HoodBase({ dark }: { dark: boolean }) {
  const mesh = useRef<Mesh>(null);
  const prepared = useRef(false);
  useFrame(() => {
    if (!mesh.current || prepared.current) return;
    const geometry = mesh.current.geometry;
    updateVinylBuffers(geometry.attributes.position.array as Float32Array, geometry.attributes.normal.array as Float32Array, 20, 8, 1, 0, 0);
    applyHoodWrap(geometry.attributes.position.array as Float32Array, geometry.attributes.normal.array as Float32Array, 20, 8, 1, 0);
    geometry.attributes.position.needsUpdate = true; geometry.attributes.normal.needsUpdate = true;
    prepared.current = true;
  });
  return <mesh ref={mesh}><planeGeometry args={[8, 3.8, 20, 8]} /><meshPhysicalMaterial color={dark ? "#37313f" : "#b7b4bf"} roughness={.3} metalness={.3} side={DoubleSide} /></mesh>;
}

function Choreography(props: WorldProps) {
  const { option, control, color, finish, onMaterial } = props;
  const root = useRef<Group>(null);
  const actors = useRef<(Group | null)[]>([]);
  const { camera, size } = useThree();
  const mobile = size.width < 700;
  useFrame(() => {
    const state = control.current;
    const p = state.reduced ? .55 : state.progress;
    if (!root.current) return;
    root.current.rotation.set(-.12, 0, -.12);
    root.current.position.set(0, 0, 0);
    const widthScale = mobile ? .62 : 1;
    root.current.scale.setScalar(widthScale);
    let cameraZ = mobile ? 13.5 : 12;
    if (option === 1) {
      root.current.rotation.set(-.35 + p * .25, -.65 + p * .95, -.32 + p * .1);
      root.current.position.x = mobile ? -.1 : -.7;
      cameraZ -= p * 2.5;
    }
    if (option === 2) {
      root.current.rotation.set(.05, 0, 0);
      root.current.position.y = -.3;
      actors.current.forEach((actor, i) => {
        if (!actor) return;
        const angle = i / 3 * Math.PI * 2 + p * Math.PI * 2;
        actor.position.set(Math.sin(angle) * 5.8, Math.sin(angle * 2) * .45, Math.cos(angle) * 3.8 - 2.4);
        actor.rotation.set(.12, -Math.sin(angle) * .9, Math.sin(angle) * .2);
        actor.scale.setScalar(.86);
      });
      cameraZ += 1;
    }
    if (option === 3) {
      root.current.rotation.set(0, 0, 0);
      root.current.position.z = p * 20;
      actors.current.forEach((actor, i) => {
        if (!actor) return;
        actor.position.set(i % 2 ? 2.8 : -2.8, .5, -i * 8);
        actor.rotation.set(.04, i % 2 ? -.65 : .65, i % 2 ? -.09 : .09);
        actor.scale.set(1, 2, 1);
      });
      cameraZ = mobile ? 12 : 9;
    }
    if (option === 4) {
      root.current.rotation.set(-.65 + p * .22, -.5 + p * .6, -.16);
      root.current.position.x = mobile ? 0 : 1;
      actors.current.forEach((actor, i) => {
        if (!actor) return;
        actor.position.set((i - 1.5) * p * .6, (1.5 - i) * (.08 + p * 1.65), (1.5 - i) * p * .7);
        actor.scale.setScalar(.86);
      });
      cameraZ += 1.8;
    }
    if (option === 5) {
      root.current.rotation.set(-.2, -.55 + p * .95, -.4 + p * .3);
      root.current.position.x = (p - .5) * 2;
      cameraZ -= motionEase(p) * 2.3;
      if (props.presentation && props.presentation !== "sheet") {
        root.current.rotation.set(-.35, -.12, -.04);
        root.current.position.x = 0;
        cameraZ = mobile ? 12.5 : 10.5;
      }
    }
    camera.position.set((state.pointer || 0) * .25, option === 3 ? .4 : 1, cameraZ);
    camera.lookAt(0, 0, option === 3 ? -7 : 0);
  });
  return <group ref={root}>
    {option === 5 && props.presentation && props.presentation !== "sheet" && <HoodBase dark={props.dark} />}
    {(option === 1 || option === 5) && <Foil control={control} variant={option} color={color} finish={finish} selectedMaterial={props.material} quality={props.quality} presentation={option === 5 ? props.presentation : "sheet"} comparison={props.comparison} split={props.split} fullRoll={props.fullRoll} />}
    {(option === 2 || option === 3) && colors.map((tone, i) => <group key={tone} ref={value => { actors.current[i] = value; }}>
      <Foil control={control} variant={option} index={i} color={i === 0 ? color : tone} finish={finish} selectedMaterial={props.material} quality={props.quality} onClick={() => onMaterial(i)} />
    </group>)}
    {option === 4 && [color, "#dbe9f3", "#282331", "#f3efe9"].map((tone, i) => <group key={i} ref={value => { actors.current[i] = value; }}>
      <Foil control={control} variant={option} index={i} color={tone} finish={i === 0 ? finish : "Matte"} selectedMaterial={i === 0 ? props.material : undefined} quality={props.quality} />
    </group>)}
  </group>;
}

function MovingLight({ control }: { control: SceneProps["control"] }) {
  const light = useRef<SpotLight>(null);
  useFrame(() => {
    if (!light.current) return;
    const p = control.current.progress;
    light.current.position.set(-7 + p * 14, 5, 5 + Math.sin(p * Math.PI) * 3);
  });
  return <spotLight ref={light} color="#f3e8ff" intensity={75} angle={.65} penumbra={1} distance={30} decay={2} position={[-7, 5, 5]} />;
}

function GalleryArchitecture({ control, dark, quality }: Pick<WorldProps, "control" | "dark" | "quality">) {
  const hall = useRef<Group>(null);
  useFrame(() => { if (hall.current) hall.current.position.z = control.current.progress * 20; });
  const stone = dark ? "#191421" : "#e9e5ee";
  return <group ref={hall}>{Array.from({ length: MATERIAL_QUALITY[quality].portals }, (_, i) => <group key={i} position={[0, 0, -i * 8]}>
    {[-6.5, 6.5].map(x => <group key={x} position={[x, 1.5, 0]}><mesh castShadow><boxGeometry args={[.35, 10, .55]} /><meshStandardMaterial color={stone} roughness={.6} /></mesh><mesh position={[x > 0 ? -.2 : .2, 0, .1]}><boxGeometry args={[.035, 9, .05]} /><meshStandardMaterial color="#d0b8fa" emissive="#a18cd1" emissiveIntensity={2} /></mesh></group>)}
    <mesh position={[0, 6.4, 0]}><boxGeometry args={[13.4, .35, .55]} /><meshStandardMaterial color={stone} /></mesh>
  </group>)}</group>;
}

function World(props: WorldProps) {
  const floor = props.dark ? "#15101f" : "#e5e3ed";
  const budget = MATERIAL_QUALITY[props.quality];
  return <>
    <color attach="background" args={[props.dark ? "#07050e" : "#f8f9fe"]} />
    <fog attach="fog" args={[props.dark ? "#07050e" : "#f8f9fe", 18, 55]} />
    <ambientLight intensity={props.dark ? .55 : 1.2} />
    <directionalLight position={[3, 7, 6]} intensity={3.5} castShadow={budget.shadows} shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-bias={-.0005} />
    <directionalLight position={[-6, 2, -2]} intensity={2} color="#a18cd1" />
    <Environment key={budget.environment} resolution={budget.environment} frames={1}>
      <Lightformer position={[0, 5, -4]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 3, 1]} intensity={5} />
      <Lightformer position={[-5, 1, 3]} rotation={[0, Math.PI / 2, 0]} scale={[8, 5, 1]} intensity={3} />
      <Lightformer position={[5, 0, 4]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 9, 1]} color="#8FD3F4" intensity={2} />
    </Environment>
    <MovingLight control={props.control} />
    <Choreography {...props} />
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, -8]}>
      <planeGeometry args={[150, 150]} /><meshStandardMaterial color={floor} roughness={.46} metalness={.22} />
    </mesh>
    {props.option === 3 && <GalleryArchitecture control={props.control} dark={props.dark} quality={props.quality} />}
    {props.option === 2 && <mesh receiveShadow position={[0, -3.25, -2]}><cylinderGeometry args={[7, 7.25, .25, 80]} /><meshPhysicalMaterial color={floor} metalness={.55} roughness={.24} clearcoat={.7} /></mesh>}
  </>;
}

function subscribeDevice(callback: () => void) {
  window.addEventListener("resize", callback);
  const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
  connection?.addEventListener("change", callback);
  return () => { window.removeEventListener("resize", callback); connection?.removeEventListener("change", callback); };
}
function deviceQuality() {
  const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return initialMaterialQuality(window.matchMedia("(max-width: 900px), (pointer: coarse)").matches, device.hardwareConcurrency, device.deviceMemory, device.connection?.saveData);
}
const serverQuality = (): MaterialQuality => "mobile";

function SceneReady({ onReady }: { onReady?: () => void }) {
  const notified = useRef(false);
  useFrame(() => { if (!notified.current) { notified.current = true; onReady?.(); } });
  return null;
}
function SceneFallback({ option, onUnavailable }: Pick<SceneProps, "option" | "onUnavailable">) {
  useEffect(() => { onUnavailable?.(); }, [onUnavailable]);
  return <div className="mm-webgl-fallback">Preview 3D tidak tersedia pada browser ini. <a href={`/design-preview/material-v2-${option}.png`}>Lihat referensi bahan</a></div>;
}

function RenderScheduler({ active, quality, control, appearance, onSlow }: { active: boolean; quality: MaterialQuality; control: SceneProps["control"]; appearance: string; onSlow: () => void }) {
  const invalidate = useThree(state => state.invalidate);
  const setDpr = useThree(state => state.setDpr);
  const samples = useRef({ time: 0, count: 0, warmup: 0 });
  const budget = MATERIAL_QUALITY[quality];
  useEffect(() => { setDpr(Math.min(window.devicePixelRatio || 1, budget.dpr)); samples.current = { time: 0, count: 0, warmup: 0 }; }, [budget.dpr, setDpr]);
  useEffect(() => {
    if (!active) return;
    let frame = 0, lastDraw = -Infinity, lastTime = -1, lastProgress = -1, lastPointer = -1;
    // Finish/color changes get a short settling window even when playback is paused.
    const settleUntil = performance.now() + (control.current.reduced ? 0 : 1100);
    const tick = (now: number) => {
      const state = control.current;
      if (now - lastDraw >= 1000 / budget.fps - .5 && (now < settleUntil || state.time !== lastTime || state.progress !== lastProgress || state.pointer !== lastPointer)) {
        invalidate(); lastDraw = now;
        lastTime = state.time; lastProgress = state.progress; lastPointer = state.pointer;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, budget.fps, control, invalidate, appearance]);
  useFrame((_, delta) => {
    if (!active || !control.current.playing || control.current.manual || control.current.reduced || delta > 1) return;
    samples.current.warmup += delta;
    if (samples.current.warmup < 1) return;
    samples.current.time += delta; samples.current.count++;
    if (samples.current.time >= 1.5) {
      if (samples.current.time / samples.current.count > 1 / (budget.fps * .7)) onSlow();
      samples.current.time = 0; samples.current.count = 0;
    }
  });
  return null;
}

export default function MaterialScene(props: SceneProps) {
  const initial = useSyncExternalStore(subscribeDevice, deviceQuality, serverQuality);
  const [limit, setLimit] = useState<MaterialQuality>("desktop");
  const quality = props.economy ? "lite" : effectiveMaterialQuality(initial, limit);
  const budget = MATERIAL_QUALITY[quality];
  return <Canvas shadows={budget.shadows} dpr={[1, budget.dpr]} frameloop="demand" camera={{ position: [0, 1, 12], fov: 40, near: .1, far: 120 }} gl={{ antialias: false, alpha: false, powerPreference: "default" }} fallback={<SceneFallback option={props.option} onUnavailable={props.onUnavailable} />}>
    <RenderScheduler active={props.active} quality={quality} control={props.control} appearance={`${props.option}/${props.color}/${props.finish}/${props.material?.id}/${props.dark}/${props.presentation}/${props.comparison}/${props.split}/${props.fullRoll}`} onSlow={() => setLimit(current => lowerMaterialQuality(effectiveMaterialQuality(initial, current)))} />
    <Suspense fallback={null}><World {...props} quality={quality} /><SceneReady onReady={props.onReady} /></Suspense>
  </Canvas>;
}
