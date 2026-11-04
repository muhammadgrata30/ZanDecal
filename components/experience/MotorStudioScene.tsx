"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, useTexture } from "@react-three/drei";
import type { OrbitControls as Controls } from "three-stdlib";
import * as THREE from "three";
import { buildVehicleRig } from "./vehicleRig";
import { FINISH_SPECS, type FinishType } from "../../lib/studio-finishes";
import { PortableModelLoader } from "./PortableModelLoader";
interface Props{color:string;finish:FinishType;dark:boolean;active:boolean;view:string;zoom:number;onReady:()=>void}
function Motor({color,finish,onReady}:Props){
  const {scene}=useLoader(PortableModelLoader,"/models/transport/2024_ducati_streetfighter_v4_s.glb.gz");
  const neutral=useTexture("/models/ducati-paint-neutral.png");
  const rig=useMemo(()=>buildVehicleRig(scene,"ducati",neutral),[scene,neutral]);
  const invalidate=useThree(state=>state.invalidate);
  useEffect(()=>{onReady();return()=>rig.dispose();},[rig,onReady]);
  useEffect(()=>{
    const spec=FINISH_SPECS[finish];
    rig.paint.forEach(material=>{material.color.set(color);material.roughness=spec.roughness;material.metalness=spec.metalness;if(material instanceof THREE.MeshPhysicalMaterial)material.clearcoat=spec.coat;});
    invalidate();
  },[rig,color,finish,invalidate]);
  return <group><primitive object={rig.root} dispose={null}/><mesh rotation={[-Math.PI/2,0,0]} position={[0,-.015,0]} scale={[2.5,.72,1]}><circleGeometry args={[1,24]}/><meshBasicMaterial color="#080610" transparent opacity={.12} depthWrite={false}/></mesh></group>;
}
function Camera({view,zoom,active}:Props){
  const orbit=useRef<Controls>(null);
  const {camera,invalidate,size,gl}=useThree();
  useEffect(()=>{
    const position=view==="front"?[7.5,1.8,0]:view==="side"?[0,2,8.2]:[5.4,2.7,6.7];
    const scale=(size.width<600?1.12:1)/zoom;
    camera.position.set(position[0]*scale,position[1]*scale,position[2]*scale);
    camera.lookAt(0,.95,0);orbit.current?.target.set(0,.95,0);orbit.current?.update();invalidate();
  },[camera,invalidate,size.width,view,zoom]);
  useEffect(()=>{gl.domElement.style.setProperty("touch-action","pan-y");},[gl,active]);
  return <OrbitControls ref={orbit} makeDefault enabled={active} target={[0,.95,0]} enablePan={false} enableZoom={false} enableDamping={false} touches={{ONE:THREE.TOUCH.ROTATE,TWO:THREE.TOUCH.DOLLY_ROTATE}} minPolarAngle={.2} maxPolarAngle={Math.PI/2-.05}/>;
}
export default function MotorStudioScene(props:Props){
  return <Canvas frameloop="demand" dpr={[1,1.75]} camera={{position:[5.4,2.7,6.7],fov:36}} gl={{antialias:true,alpha:false,powerPreference:"default"}}>
    <color attach="background" args={[props.dark?"#100d1c":"#eeedf5"]}/><ambientLight intensity={1.2}/><directionalLight position={[3,6,4]} intensity={2.8}/>
    <Environment resolution={128} frames={1}><Lightformer position={[0,5,0]} rotation={[Math.PI/2,0,0]} scale={[8,4,1]} intensity={3}/><Lightformer position={[-5,3,2]} rotation={[0,Math.PI/2,0]} scale={[5,3,1]} intensity={2}/></Environment>
    <Camera {...props}/><Suspense fallback={null}><Motor {...props}/></Suspense>
  </Canvas>;
}
