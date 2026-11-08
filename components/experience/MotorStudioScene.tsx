"use client";
import {Suspense,useEffect,useMemo,useRef} from "react";
import {Canvas,useFrame,useLoader,useThree} from "@react-three/fiber";
import {Environment,Lightformer,OrbitControls,useTexture} from "@react-three/drei";
import type {OrbitControls as Controls} from "three-stdlib";
import * as THREE from "three";
import {buildVehicleRig} from "./vehicleRig";
import {FINISH_SPECS,type FinishType} from "../../lib/studio-finishes";
import {PortableModelLoader} from "./PortableModelLoader";
import type {StudioVehicle} from "../vehiclePaint";
import {STUDIO_VEHICLES} from "../../lib/studio-vehicles";
import {bindStudioWheel} from "../../lib/studio-input";
interface Props{vehicle:StudioVehicle;color:string;finish:FinishType;dark:boolean;active:boolean;view:string;grid:boolean;resetKey:number;background?:string;gridTone?:string;enter?:boolean;onReady:()=>void}
function Vehicle({vehicle,color,finish,onReady,enter=true,active}:Props){
 const entrance=useRef<THREE.Group>(null);
 const progress=useRef(0);
 const reducedMotion=useRef(false);
 const {scene}=useLoader(PortableModelLoader,STUDIO_VEHICLES[vehicle].src);
 const neutral=useTexture("/models/ducati-paint-neutral.png");
 const rig=useMemo(()=>buildVehicleRig(scene,vehicle,neutral),[scene,vehicle,neutral]);
 const invalidate=useThree(state=>state.invalidate);
 useEffect(()=>{
  const preference=window.matchMedia("(prefers-reduced-motion: reduce)");
  const update=()=>{reducedMotion.current=preference.matches;invalidate();};
  update();preference.addEventListener("change",update);
  return()=>preference.removeEventListener("change",update);
 },[invalidate]);
 useEffect(()=>{if(enter&&active)invalidate();},[enter,active,invalidate]);
 useFrame((_,delta)=>{
  const group=entrance.current;if(!group||!enter||!active)return;
  progress.current=reducedMotion.current?1:Math.min(1,progress.current+Math.min(delta,.05)/1.35);
  const remaining=Math.pow(1-progress.current,4);
  group.position.x=-6*remaining;
  // Roll each wheel by travelled distance / its actual normalized radius.
  // Both translation and wheel rotation use the same eased progress.
  const travelled=reducedMotion.current?0:6*(1-remaining);
  rig.wheels.forEach(wheel=>{wheel.pivot.rotation.z=-travelled/Math.max(.1,wheel.radius);});
  if(progress.current<1)invalidate();
 });
 useEffect(()=>{onReady();return()=>rig.dispose();},[rig,onReady]);
 useEffect(()=>{
  const spec=FINISH_SPECS[finish];
  rig.paint.forEach(material=>{material.color.set(color);material.roughness=spec.roughness;material.metalness=spec.metalness;if(material instanceof THREE.MeshPhysicalMaterial)material.clearcoat=spec.coat;});
  invalidate();
 },[rig,color,finish,invalidate]);
 return <group ref={entrance} position={[-6,0,0]}><primitive object={rig.root} dispose={null}/><mesh rotation={[-Math.PI/2,0,0]} position={[0,-.015,0]} scale={[2.5,.72,1]}><circleGeometry args={[1,24]}/><meshBasicMaterial color="#080610" transparent opacity={.12} depthWrite={false}/></mesh></group>;
}
function Camera({view,active,resetKey}:Props){
 const orbit=useRef<Controls>(null);
 const {camera,invalidate,size,gl}=useThree();
 useEffect(()=>{
  const position=view==="front"?[7.5,1.8,0]:view==="side"?[0,2,8.2]:[5.4,2.7,6.7];
  const scale=size.width<600?1.12:1;
  camera.position.set(position[0]*scale,position[1]*scale,position[2]*scale);
  camera.lookAt(0,.95,0);orbit.current?.target.set(0,.95,0);orbit.current?.update();invalidate();
 },[camera,invalidate,size.width,view,resetKey]);
 useEffect(()=>{
  const controls=orbit.current;if(!controls)return;
  return bindStudioWheel(gl.domElement,controls);
 },[gl]);
 return <OrbitControls ref={orbit} domElement={gl.domElement} makeDefault enabled={active} target={[0,.95,0]} enablePan={false} enableZoom zoomSpeed={.75} minDistance={4} maxDistance={14} enableDamping={false} touches={{ONE:THREE.TOUCH.ROTATE,TWO:THREE.TOUCH.DOLLY_ROTATE}} minPolarAngle={.2} maxPolarAngle={Math.PI/2-.05}/>;
}
export default function MotorStudioScene(props:Props){
 return <Canvas frameloop="demand" resize={{scroll:false,debounce:{resize:100,scroll:100}}} dpr={[1,1.5]} camera={{position:[5.4,2.7,6.7],fov:36}} gl={{antialias:true,alpha:false,powerPreference:"default"}}>
  <color attach="background" args={[props.background??(props.dark?"#17141d":"#f5f3ef")]}/><ambientLight intensity={1.2}/><directionalLight position={[3,6,4]} intensity={2.8}/>
  <Environment resolution={128} frames={1}><Lightformer position={[0,5,0]} rotation={[Math.PI/2,0,0]} scale={[8,4,1]} intensity={3}/><Lightformer position={[-5,3,2]} rotation={[0,Math.PI/2,0]} scale={[5,3,1]} intensity={2}/></Environment>
  {props.grid&&<gridHelper args={[12,24,props.gridTone??(props.dark?"#8f7caa":"#9a86b1"),props.gridTone??(props.dark?"#63596e":"#bcb4c5")]} position={[0,-.025,0]} material-transparent material-opacity={.3} material-depthWrite={false}/>}
  <Camera {...props}/><Suspense fallback={null}><Vehicle key={props.vehicle} {...props}/></Suspense>
 </Canvas>;
}
