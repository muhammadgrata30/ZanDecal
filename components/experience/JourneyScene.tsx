"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import type { OrbitControls as Controls } from "three-stdlib";
import * as THREE from "three";
import type { StudioVehicle } from "../vehiclePaint";
import { FINISH_SPECS, type DecalColor, type FinishType } from "../DecalVisualizer3D";
import { buildVehicleRig } from "./vehicleRig";
import { journeyPose, phase, pinchScale } from "./journeyMath";

import { GarageRoom } from "./GarageRoom";

interface Props {
  progress: { current: number }; vehicle: StudioVehicle; color: DecalColor; finish: FinishType;
  dark: boolean; running: boolean; active: boolean; studio: boolean; view: string;
  onReady: (wheels: number) => void;
  palette?: {hex:string}[];
}

function Vehicle({ progress, vehicle, color, finish, running, onReady }: Props) {
  const { scene } = useGLTF(vehicle === "ducati" ? "/models/2024_ducati_streetfighter_v4_s.glb" : "/models/byd-seal.glb");
  const neutral = useTexture("/models/ducati-paint-neutral.png");
  const rig = useMemo(() => buildVehicleRig(scene, vehicle, neutral), [scene, vehicle, neutral]);
  const group = useRef<THREE.Group>(null);
  const targetColor = useMemo(() => new THREE.Color(color.hex), [color.hex]);
  const elapsed = useRef(0);
  const intro = useRef(0);
  const previousVehicle = useRef(vehicle);
  useEffect(() => { onReady(rig.wheels.length); return () => rig.dispose(); }, [rig, onReady]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, .05);
    if (running) elapsed.current += dt;
    if (previousVehicle.current !== vehicle) { previousVehicle.current = vehicle; intro.current = 0; }
    if (running) intro.current = Math.min(1, intro.current + dt / 2.4);
    const pose = journeyPose(progress.current);
    const modelScale = THREE.MathUtils.lerp(1.22, 1, pose.room);
    // A real approach on first load, then a forward departure driven by scroll.
    const approach = -3.5 * (1 - phase(intro.current, 0, 1)) * (1 - phase(progress.current, .02, .12));
    if (group.current) {
      group.current.scale.setScalar(modelScale);
      group.current.position.set(pose.x + approach + (1 - pose.room) * .65, .018 + (running && vehicle === "ducati" ? Math.sin(elapsed.current * 24) * .001 : 0), pose.z);
      group.current.rotation.y = pose.yaw;
    }
    rig.wheels.forEach(wheel => { wheel.pivot.rotation.z = -(pose.distance + approach + 3.5) / Math.max(.1, wheel.radius); });
    const spec = FINISH_SPECS[finish];
    const blend = 1 - Math.exp(-dt * 9);
    rig.paint.forEach(material => {
      material.color.lerp(targetColor, blend);
      material.roughness = THREE.MathUtils.lerp(material.roughness, spec.roughness, blend);
      material.metalness = THREE.MathUtils.lerp(material.metalness, spec.metalness, blend);
    });
  });
  return <group ref={group}><primitive object={rig.root} dispose={null}/><mesh position={[0, -.01, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[2.5, .72, 1]}><circleGeometry args={[1, 40]}/><meshBasicMaterial color="#080b10" transparent opacity={.2} depthWrite={false}/></mesh></group>;
}

function Camera({ progress, studio, view, vehicle }: Pick<Props, "progress" | "studio" | "view" | "vehicle">) {
  const controls = useRef<Controls>(null);
  const last = useRef({ view: "", vehicle: "", settling: false });
  const target = useMemo(() => new THREE.Vector3(), []);
  const { camera, size, setDpr } = useThree();
  const perf = useRef({ time: 0, frames: 0, adjusted: false });
  useEffect(() => {
    const orbit = controls.current;
    const element = orbit?.domElement;
    if (!orbit || !element) return;
    const previousTouchAction = element.style.touchAction;
    element.style.touchAction = "pan-y";
    let previousDistance = 0;
    const zoom = (scale: number) => {
      if (!orbit.enabled) return;
      const offset = orbit.object.position.clone().sub(orbit.target);
      const distance = THREE.MathUtils.clamp(offset.length() * scale, orbit.minDistance, orbit.maxDistance);
      orbit.object.position.copy(orbit.target).add(offset.setLength(distance));
      orbit.update();
    };
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey || !orbit.enabled) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      zoom(pinchScale(event.deltaY));
    };
    const distance = (touches: TouchList) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    const start = (event: TouchEvent) => {
      previousDistance = event.touches.length === 2 ? distance(event.touches) : 0;
      if (previousDistance && orbit.enabled) event.preventDefault();
    };
    const move = (event: TouchEvent) => {
      if (event.touches.length !== 2 || !orbit.enabled) return;
      event.preventDefault(); event.stopPropagation();
      const next = distance(event.touches);
      if (previousDistance > 0 && next > 0) zoom(previousDistance / next);
      previousDistance = next;
    };
    const end = () => { previousDistance = 0; };
    element.addEventListener("wheel", wheel, { passive: false, capture: true });
    element.addEventListener("touchstart", start, { passive: false });
    element.addEventListener("touchmove", move, { passive: false });
    element.addEventListener("touchend", end);
    element.addEventListener("touchcancel", end);
    return () => {
      element.style.touchAction = previousTouchAction;
      element.removeEventListener("wheel", wheel, true);
      element.removeEventListener("touchstart", start); element.removeEventListener("touchmove", move);
      element.removeEventListener("touchend", end); element.removeEventListener("touchcancel", end);
    };
  }, []);
  useFrame((state, delta) => {
    if (state.camera instanceof THREE.PerspectiveCamera) {
      const fov = state.size.width < 760 ? 43 : THREE.MathUtils.lerp(31, 36, journeyPose(progress.current).room);
      if (state.camera.fov !== fov) { state.camera.fov = fov; state.camera.updateProjectionMatrix(); }
    }
    const dt = Math.min(delta, .05);
    const mobile = size.width < 760;
    const pose = journeyPose(progress.current);
    const t = pose.room;
    if (last.current.view !== view || last.current.vehicle !== vehicle) last.current = { view, vehicle, settling: true };
    const final: [number, number, number] = view === "side" ? [.4, 2.2, 10.5] : view === "front" ? [10, 2.1, 1.7] : [4.7, 3.1, 10.5];
    if (!studio || last.current.settling) {
      target.set(THREE.MathUtils.lerp(4.3, final[0], t), THREE.MathUtils.lerp(1.85, final[1], t), THREE.MathUtils.lerp(8.3, final[2], t));
      if (mobile) target.multiplyScalar(1.08);
      camera.position.lerp(target, 1 - Math.exp(-dt * 6));
      camera.lookAt(mobile ? .8 : -.35, .95, 0);
      if (studio && camera.position.distanceToSquared(target) < .002) last.current.settling = false;
    }
    if (controls.current) controls.current.enabled = studio && !last.current.settling;
    if (!perf.current.adjusted) {
      perf.current.time += delta; perf.current.frames++;
      if (perf.current.frames === 100) { if (perf.current.time > 2.7) setDpr(1); perf.current.adjusted = true; }
    }
  }, -1);
  return <OrbitControls ref={controls} makeDefault enabled={false} target={[size.width < 760 ? .8 : -.35, .95, 0]} enablePan={false} enableZoom={false} touches={{ ONE: THREE.TOUCH.ROTATE }} enableDamping dampingFactor={.075} minDistance={5} maxDistance={14} maxPolarAngle={Math.PI / 2 - .06} minPolarAngle={.2}/>;
}

function Lighting({ dark }: Pick<Props, "dark">) {
  return <><ambientLight intensity={dark ? .65 : 1.2}/><directionalLight position={[3, 6, 4]} intensity={2.8}/><pointLight position={[-3, 4, -3]} color="#c6deff" intensity={18} distance={16}/>
    <Environment resolution={128} frames={1}>
      <Lightformer position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[9, 5, 1]} intensity={3}/>
      <Lightformer position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[6, 3, 1]} intensity={2}/>
      <Lightformer position={[4, 3, -3]} rotation={[0, -Math.PI / 4, 0]} scale={[5, 2, 1]} intensity={2} color="#c8b5ec"/>
    </Environment></>;
}

export default function JourneyScene(props: Props) {
  return <Canvas dpr={[1, 1.35]} frameloop={props.active ? "always" : "demand"} camera={{ position: [7.8, 2.5, 7.2], fov: 36 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
    <color attach="background" args={[props.dark ? "#090a0e" : "#f5f3ef"]}/>
    <Lighting {...props}/><GarageRoom {...props}/><Camera {...props}/>
    <Suspense fallback={null}><Vehicle {...props}/></Suspense>
  </Canvas>;
}
