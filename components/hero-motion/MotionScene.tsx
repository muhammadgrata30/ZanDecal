"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Line, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { buildVehicleRig } from "../experience/vehicleRig";
import { heroMotion } from "./motionMath";

export interface MotionSceneProps {
  option: 1 | 3; scroll: {current: number}; pointer: {current: {x: number; y: number}};
  color: string; dark: boolean; paused: boolean; reduced: boolean; active: boolean; replay: number; onReady: () => void;
}

function Motorcycle(props: MotionSceneProps) {
  const { onReady } = props;
  const { scene } = useGLTF("/models/2024_ducati_streetfighter_v4_s.glb");
  const texture = useTexture("/models/ducati-paint-neutral.png");
  const rig = useMemo(() => {
    const result = buildVehicleRig(scene, "ducati", texture);
    result.root.traverse(node => { if (node instanceof THREE.Mesh) { node.castShadow = true; node.receiveShadow = true; } });
    return result;
  }, [scene, texture]);
  const root = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const epoch = useRef(props.replay);
  const color = useMemo(() => new THREE.Color(props.color), [props.color]);
  useEffect(() => { onReady(); return () => rig.dispose(); }, [rig, onReady]);
  useFrame((_, delta) => {
    if (epoch.current !== props.replay) { epoch.current = props.replay; elapsed.current = 0; }
    if (!props.paused) elapsed.current += Math.min(delta, .05);
    const pose = heroMotion(props.option, props.reduced ? 3 : elapsed.current, props.scroll.current);
    if (root.current) { root.current.position.set(pose.x, .015, 0); root.current.rotation.y = pose.yaw; }
    rig.wheels.forEach(wheel => { wheel.pivot.rotation.z = -pose.distance / wheel.radius; });
    rig.paint.forEach(material => { material.color.lerp(color, 1 - Math.exp(-Math.min(delta,.05)*8)); material.roughness = .19; material.metalness = .3; });
  });
  return <group ref={root}><primitive object={rig.root} dispose={null}/></group>;
}

function Architecture({ option, dark }: Pick<MotionSceneProps, "option" | "dark">) {
  const concrete = dark ? "#282630" : "#d9cfc2";
  return <>
    <mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[80,80]}/><meshStandardMaterial color={option === 1 ? (dark ? "#201c29" : "#e2d7c8") : (dark ? "#15131e" : "#f2f2f6")} roughness={.65}/></mesh>
    {option === 1 && <>
      <mesh position={[-7,3,-3]} receiveShadow castShadow><boxGeometry args={[2,6,13]}/><meshStandardMaterial color={concrete} roughness={.86}/></mesh>
      <mesh position={[7.7,4,-5]} receiveShadow castShadow><boxGeometry args={[4,8,10]}/><meshStandardMaterial color={concrete} roughness={.86}/></mesh>
      <mesh position={[4.8,6.6,-6]} receiveShadow castShadow><boxGeometry args={[9,.6,5]}/><meshStandardMaterial color={concrete} roughness={.86}/></mesh>
      {[-15,-9,-3,3].map(x => <mesh key={x} position={[x,1,-10]} receiveShadow castShadow><boxGeometry args={[.3,2,3]}/><meshStandardMaterial color={concrete}/></mesh>)}
    </>}
  </>;
}

function Measurements(props: MotionSceneProps) {
  const root = useRef<THREE.Group>(null);
  const scan = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    if (!props.paused && !props.reduced) elapsed.current += Math.min(delta,.05);
    if(root.current) root.current.scale.setScalar(.9 + .1 * Math.min(1, elapsed.current / 2));
    if(scan.current) { scan.current.position.x = -2.4 + ((elapsed.current * .45 + props.scroll.current * 3) % 4.8); scan.current.visible = !props.reduced; }
  });
  if(props.option !== 3) return null;
  const color = props.dark ? "#82788d" : "#a8a0af";
  return <group ref={root}>
    <Line points={[[-2.7,.02,1],[2.7,.02,1]]} color={color} lineWidth={.7}/>
    <Line points={[[-2.7,.02,-1],[-2.7,.02,1.4]]} color={color} lineWidth={.7}/>
    {[-2.7,2.7].map(x => <Line key={x} points={[[x,.02,.8],[x,.02,1.2]]} color={color} lineWidth={1}/>)}
    <mesh ref={scan} position={[-2.5,1.2,0]}><boxGeometry args={[.015,2.7,1.4]}/><meshBasicMaterial color="#a18cd1" transparent opacity={.22} depthWrite={false}/></mesh>
  </group>;
}

function Camera(props: MotionSceneProps) {
  const target = useMemo(() => new THREE.Vector3(),[]);
  useFrame(({camera,size}, delta) => {
    const p = props.reduced ? 0 : props.scroll.current;
    const mobile = size.width < 680;
    if(props.option === 1) {
      target.set(5.4 + p*2.5, 2.25 + p*1.3, mobile ? 10.8 : 9.2);
      camera.position.lerp(target, 1-Math.exp(-Math.min(delta,.05)*5));
      camera.lookAt(-.25 + p*3.5, 1.5, 0);
    } else {
      target.set(5-p*1.8,7-p*4.5,mobile ? 9 : 7.5);
      camera.position.lerp(target,1-Math.exp(-Math.min(delta,.05)*5));
      camera.lookAt(.15,1.05,0);
    }
    if(!props.reduced) { camera.position.x += props.pointer.current.x*.012; camera.position.y += props.pointer.current.y*.008; }
  });
  return null;
}

export default function MotionScene(props: MotionSceneProps) {
  return <Canvas shadows dpr={[1,1.35]} frameloop={props.active ? "always" : "demand"} camera={{position: props.option === 1 ? [5.4,2.25,9.2] : [5,7,7.5],fov:32}} gl={{antialias:true,powerPreference:"high-performance"}}>
    <color attach="background" args={[props.dark ? "#14101f" : props.option === 1 ? "#e8e0ee" : "#f8f9fe"]}/>
    <fog attach="fog" args={[props.dark ? "#14101f" : props.option === 1 ? "#e8e0ee" : "#f8f9fe",19,45]}/>
    <ambientLight intensity={props.dark ? .6 : 1.3}/>
    <directionalLight castShadow position={[-6,10,6]} intensity={props.dark ? 2.4 : 3.5} color={props.option === 1 ? "#ffe2c6" : "#eef2ff"} shadow-mapSize={[1024,1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-normalBias={.04}/>
    <Environment resolution={128} frames={1}><Lightformer position={[0,6,0]} rotation={[Math.PI/2,0,0]} scale={[10,8,1]} intensity={3}/><Lightformer position={[4,3,4]} scale={[5,5,1]} intensity={2} color="#d9c8f0"/></Environment>
    <Architecture {...props}/><Camera {...props}/><Measurements {...props}/>
    <Suspense fallback={null}><Motorcycle {...props}/></Suspense>
  </Canvas>;
}
