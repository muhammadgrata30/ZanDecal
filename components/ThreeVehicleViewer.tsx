"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RotateCw, ZoomIn, Play, Pause, RefreshCw, Upload, Eye } from "lucide-react";

export interface ColorPreset {
  id: string;
  name: string;
  type: "gradient" | "solid";
  hex: string;
  gradientColors?: [string, string, string];
  cssGradient?: string;
  desc: string;
}

export type FinishType = "glossy" | "matte" | "satin";
export type VehicleType = "car" | "bike";

interface ThreeVehicleViewerProps {
  vehicleType: VehicleType;
  activeColor: ColorPreset;
  finishType: FinishType;
  isDarkMode: boolean;
}

export function ThreeVehicleViewer({
  vehicleType,
  activeColor,
  finishType,
  isDarkMode,
}: ThreeVehicleViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const vehicleGroupRef = useRef<THREE.Group | null>(null);
  const carPaintMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [loadedCustomModel, setLoadedCustomModel] = useState(false);
  const [customModelName, setCustomModelName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to generate dynamic canvas gradient texture for Three.js
  const createGradientTexture = (colors: [string, string, string]) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Diagonal automotive speed-line livery gradient
      const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(0.5, colors[1]);
      grad.addColorStop(1, colors[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Add subtle sporty carbon / aero decal racing stripes
      ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
      ctx.beginPath();
      ctx.moveTo(350, 0);
      ctx.lineTo(450, 0);
      ctx.lineTo(650, 1024);
      ctx.lineTo(550, 1024);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(11, 9, 20, 0.25)";
      ctx.beginPath();
      ctx.moveTo(480, 0);
      ctx.lineTo(520, 0);
      ctx.lineTo(720, 1024);
      ctx.lineTo(680, 1024);
      ctx.closePath();
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Build Procedural BYD Seal 6 EV Fastback Model
  const buildBYDSeal6 = (paintMaterial: THREE.MeshPhysicalMaterial) => {
    const group = new THREE.Group();
    group.name = "byd-seal-6";

    // Common non-paint materials
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111322,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.85,
      transparent: true,
      opacity: 0.9,
    });

    const blackTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x141220,
      roughness: 0.5,
      metalness: 0.4,
    });

    const chromeTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.9,
    });

    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: 0x8fd3f4,
      emissive: 0x8fd3f4,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });

    const taillightMaterial = new THREE.MeshStandardMaterial({
      color: 0xff3b30,
      emissive: 0xff1744,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });

    const wheelRubberMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a24,
      roughness: 0.8,
      metalness: 0.1,
    });

    // 1. Lower Body Chassis
    const lowerBodyGeo = new THREE.BoxGeometry(4.4, 0.48, 1.95);
    const lowerBody = new THREE.Mesh(lowerBodyGeo, paintMaterial);
    lowerBody.position.y = 0.52;
    group.add(lowerBody);

    // 2. Chiseled Aerodynamic Front Hood & Bumper (BYD Seal Ocean aesthetic)
    const hoodGeo = new THREE.CylinderGeometry(0.85, 0.98, 1.4, 32, 1, false, 0, Math.PI);
    const hood = new THREE.Mesh(hoodGeo, paintMaterial);
    hood.rotation.x = -Math.PI / 2;
    hood.rotation.z = Math.PI / 2;
    hood.position.set(1.45, 0.62, 0);
    hood.scale.set(0.48, 1.15, 1.9);
    group.add(hood);

    // Front Aerodynamic Lip & Diffuser
    const lipGeo = new THREE.BoxGeometry(0.8, 0.14, 1.88);
    const lip = new THREE.Mesh(lipGeo, blackTrimMaterial);
    lip.position.set(2.0, 0.28, 0);
    group.add(lip);

    // 3. Cabin & Panoramic Fastback Roof
    const cabinGeo = new THREE.BoxGeometry(2.3, 0.65, 1.6);
    const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
    cabin.position.set(-0.15, 1.05, 0);
    group.add(cabin);

    // Roof Top Panel
    const roofGeo = new THREE.BoxGeometry(2.0, 0.08, 1.5);
    const roof = new THREE.Mesh(roofGeo, paintMaterial);
    roof.position.set(-0.18, 1.38, 0);
    group.add(roof);

    // Windshield (Front Rake)
    const windshieldGeo = new THREE.BoxGeometry(0.9, 0.04, 1.55);
    const windshield = new THREE.Mesh(windshieldGeo, glassMaterial);
    windshield.rotation.z = -Math.PI / 5.2;
    windshield.position.set(0.95, 1.02, 0);
    group.add(windshield);

    // Rear Fastback Slanted Glass
    const rearGlassGeo = new THREE.BoxGeometry(1.2, 0.04, 1.52);
    const rearGlass = new THREE.Mesh(rearGlassGeo, glassMaterial);
    rearGlass.rotation.z = Math.PI / 6.5;
    rearGlass.position.set(-1.42, 0.98, 0);
    group.add(rearGlass);

    // 4. Rear Trunk & Integrated Ducktail Spoiler
    const trunkGeo = new THREE.BoxGeometry(0.9, 0.35, 1.88);
    const trunk = new THREE.Mesh(trunkGeo, paintMaterial);
    trunk.position.set(-1.85, 0.72, 0);
    group.add(trunk);

    const spoilerGeo = new THREE.BoxGeometry(0.3, 0.08, 1.75);
    const spoiler = new THREE.Mesh(spoilerGeo, blackTrimMaterial);
    spoiler.position.set(-2.15, 0.88, 0);
    group.add(spoiler);

    // 5. Headlights (BYD Ocean Dual C-Slash)
    const hlLeftGeo = new THREE.BoxGeometry(0.3, 0.08, 0.35);
    const hlLeft = new THREE.Mesh(hlLeftGeo, headlightMaterial);
    hlLeft.position.set(2.05, 0.68, 0.65);
    hlLeft.rotation.y = -Math.PI / 8;
    group.add(hlLeft);

    const hlRight = hlLeft.clone();
    hlRight.position.set(2.05, 0.68, -0.65);
    hlRight.rotation.y = Math.PI / 8;
    group.add(hlRight);

    // 6. Rear Connected LED Light Bar
    const tailBarGeo = new THREE.BoxGeometry(0.12, 0.06, 1.78);
    const tailBar = new THREE.Mesh(tailBarGeo, taillightMaterial);
    tailBar.position.set(-2.22, 0.78, 0);
    group.add(tailBar);

    // 7. Side Mirrors
    const mirrorLeftGeo = new THREE.BoxGeometry(0.2, 0.1, 0.28);
    const mirrorLeft = new THREE.Mesh(mirrorLeftGeo, blackTrimMaterial);
    mirrorLeft.position.set(0.75, 1.05, 0.98);
    group.add(mirrorLeft);

    const mirrorRight = mirrorLeft.clone();
    mirrorRight.position.set(0.75, 1.05, -0.98);
    group.add(mirrorRight);

    // 8. Wheels & Aero Turbine Rims (4 wheels)
    const createWheel = (x: number, z: number) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, 0.36, z);

      // Tire
      const tireGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.28, 24);
      const tire = new THREE.Mesh(tireGeo, wheelRubberMaterial);
      tire.rotation.x = Math.PI / 2;
      wheelGroup.add(tire);

      // Aero Rim Rim Disc
      const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.29, 16);
      const rim = new THREE.Mesh(rimGeo, chromeTrimMaterial);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      // Rim Center Hub
      const hubGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.31, 16);
      const hub = new THREE.Mesh(hubGeo, blackTrimMaterial);
      hub.rotation.x = Math.PI / 2;
      wheelGroup.add(hub);

      // Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.1, 0.14, 0.06);
      const caliperMat = new THREE.MeshStandardMaterial({ color: 0xff9a9e, roughness: 0.3 });
      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(0, 0.15, z > 0 ? 0.09 : -0.09);
      wheelGroup.add(caliper);

      return wheelGroup;
    };

    group.add(createWheel(1.35, 0.98));
    group.add(createWheel(1.35, -0.98));
    group.add(createWheel(-1.35, 0.98));
    group.add(createWheel(-1.35, -0.98));

    return group;
  };

  // Build Procedural Sportbike / Superbike Model
  const buildMotorbike = (paintMaterial: THREE.MeshPhysicalMaterial) => {
    const group = new THREE.Group();
    group.name = "sportbike-track";

    const metalFrameMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f1b2e,
      roughness: 0.4,
      metalness: 0.8,
    });

    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x14121d,
      roughness: 0.8,
      metalness: 0.1,
    });

    const chromeExhaustMaterial = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.2,
      metalness: 0.95,
    });

    const visorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8fd3f4,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
      metalness: 0.9,
    });

    // 1. Aerodynamic Front Fairing (Cowling)
    const fairingGeo = new THREE.ConeGeometry(0.55, 1.1, 16);
    const fairing = new THREE.Mesh(fairingGeo, paintMaterial);
    fairing.rotation.z = -Math.PI / 3;
    fairing.position.set(0.65, 0.95, 0);
    fairing.scale.set(0.7, 1.1, 0.7);
    group.add(fairing);

    // Windshield Visor
    const visorGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.4, 16, 1, false, 0, Math.PI);
    const visor = new THREE.Mesh(visorGeo, visorMaterial);
    visor.rotation.z = -Math.PI / 3.5;
    visor.position.set(0.6, 1.25, 0);
    group.add(visor);

    // 2. Sculpted Fuel Tank
    const tankGeo = new THREE.BoxGeometry(0.85, 0.5, 0.58);
    const tank = new THREE.Mesh(tankGeo, paintMaterial);
    tank.position.set(0.05, 1.05, 0);
    group.add(tank);

    // 3. Racing Rider Seat & Slim Aerodynamic Tail
    const seatGeo = new THREE.BoxGeometry(0.55, 0.15, 0.38);
    const seat = new THREE.Mesh(seatGeo, metalFrameMaterial);
    seat.position.set(-0.45, 0.95, 0);
    group.add(seat);

    const tailGeo = new THREE.ConeGeometry(0.3, 0.85, 16);
    const tail = new THREE.Mesh(tailGeo, paintMaterial);
    tail.rotation.z = Math.PI / 2.3;
    tail.position.set(-0.95, 1.05, 0);
    tail.scale.set(0.6, 1, 0.6);
    group.add(tail);

    // 4. Aluminum Twin-Spar Frame & Engine Block
    const frameGeo = new THREE.BoxGeometry(1.2, 0.55, 0.45);
    const frame = new THREE.Mesh(frameGeo, metalFrameMaterial);
    frame.position.set(0, 0.65, 0);
    group.add(frame);

    // 5. Sport Exhaust Pipe (Titanium look)
    const exhaustGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.0, 16);
    const exhaust = new THREE.Mesh(exhaustGeo, chromeExhaustMaterial);
    exhaust.rotation.z = -Math.PI / 5;
    exhaust.position.set(-0.65, 0.45, 0.32);
    group.add(exhaust);

    // 6. Front Fork & Handlebars
    const forkGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.0, 12);
    const forkLeft = new THREE.Mesh(forkGeo, chromeExhaustMaterial);
    forkLeft.rotation.z = -Math.PI / 8;
    forkLeft.position.set(0.85, 0.65, 0.16);
    group.add(forkLeft);

    const forkRight = forkLeft.clone();
    forkRight.position.set(0.85, 0.65, -0.16);
    group.add(forkRight);

    // 7. Front & Rear Wheels
    const createBikeWheel = (x: number) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(x, 0.38, 0);

      const tire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.38, 0.16, 24),
        tireMaterial
      );
      tire.rotation.x = Math.PI / 2;
      wGroup.add(tire);

      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.17, 16),
        chromeExhaustMaterial
      );
      rim.rotation.x = Math.PI / 2;
      wGroup.add(rim);

      const disc = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.18, 16),
        new THREE.MeshStandardMaterial({ color: 0x8fd3f4, roughness: 0.3 })
      );
      disc.rotation.x = Math.PI / 2;
      wGroup.add(disc);

      return wGroup;
    };

    group.add(createBikeWheel(1.05));
    group.add(createBikeWheel(-1.05));

    return group;
  };

  // Initialize Three.js Scene, Camera, Lights, and Render Loop
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.2, 2.2, 4.6);
    cameraRef.current = camera;

    // 3. Renderer with High-DPI and Color Management
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear previous canvas if any
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't go below floor
    controls.minDistance = 2.8;
    controls.maxDistance = 11.0;
    controls.target.set(0, 0.6, 0);
    controlsRef.current = controls;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 0.8 : 1.1);
    scene.add(ambientLight);

    // Warm Key Light (Pink flare accent)
    const keyLight = new THREE.DirectionalLight(0xfff0f5, 1.4);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    // Cool Fill Light (Cyan studio bounce)
    const fillLight = new THREE.DirectionalLight(0x8fd3f4, 1.0);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    // Rim Highlight (Lavender edge shine)
    const rimLight = new THREE.DirectionalLight(0xa18cd1, 1.2);
    rimLight.position.set(0, 6, -6);
    scene.add(rimLight);

    // 6. Ground Shadow Disc
    const shadowGeo = new THREE.CircleGeometry(3.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: isDarkMode ? 0.55 : 0.25,
    });
    const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.y = 0.02;
    scene.add(shadowDisc);

    // Subtle Ground Grid
    const grid = new THREE.GridHelper(10, 20, isDarkMode ? 0xa18cd1 : 0xd1d5db, isDarkMode ? 0x221c3b : 0xe5e7eb);
    grid.position.y = 0.01;
    scene.add(grid);

    // 7. Base Paint Material
    const paintMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeColor.hex),
      roughness: finishType === "matte" ? 0.88 : finishType === "satin" ? 0.38 : 0.12,
      metalness: finishType === "matte" ? 0.08 : finishType === "satin" ? 0.32 : 0.25,
      clearcoat: finishType === "glossy" ? 1.0 : finishType === "satin" ? 0.45 : 0.0,
      clearcoatRoughness: finishType === "glossy" ? 0.08 : 0.3,
    });

    if (activeColor.type === "gradient" && activeColor.gradientColors) {
      paintMaterial.map = createGradientTexture(activeColor.gradientColors);
    }
    carPaintMaterialRef.current = paintMaterial;

    // 8. Vehicle Mesh Insertion
    const vehicleGroup = new THREE.Group();
    if (vehicleType === "car") {
      vehicleGroup.add(buildBYDSeal6(paintMaterial));
    } else {
      vehicleGroup.add(buildMotorbike(paintMaterial));
    }
    scene.add(vehicleGroup);
    vehicleGroupRef.current = vehicleGroup;

    // 9. Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = 1.2;
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    // 10. Responsive Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [vehicleType, isDarkMode]);

  // Update Paint Material when activeColor or finishType changes
  useEffect(() => {
    if (!carPaintMaterialRef.current) return;
    const mat = carPaintMaterialRef.current;

    // Apply Finishing Specs
    if (finishType === "glossy") {
      mat.roughness = 0.12;
      mat.metalness = 0.25;
      mat.clearcoat = 1.0;
      mat.clearcoatRoughness = 0.08;
    } else if (finishType === "matte") {
      mat.roughness = 0.88;
      mat.metalness = 0.08;
      mat.clearcoat = 0.0;
      mat.clearcoatRoughness = 0.9;
    } else if (finishType === "satin") {
      mat.roughness = 0.38;
      mat.metalness = 0.32;
      mat.clearcoat = 0.45;
      mat.clearcoatRoughness = 0.25;
    }

    // Apply Color / Gradient Map
    if (activeColor.type === "gradient" && activeColor.gradientColors) {
      mat.color.set(0xffffff);
      mat.map = createGradientTexture(activeColor.gradientColors);
    } else {
      mat.map = null;
      mat.color.set(activeColor.hex);
    }
    mat.needsUpdate = true;
  }, [activeColor, finishType]);

  // Handle Loading User's Local .GLB File
  const handleGLBUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sceneRef.current) return;

    const loader = new GLTFLoader();
    const reader = new FileReader();

    reader.onload = (event) => {
      const contents = event.target?.result;
      if (!contents) return;

      loader.parse(
        contents as ArrayBuffer,
        "",
        (gltf) => {
          if (!sceneRef.current || !vehicleGroupRef.current) return;

          // Remove procedural model
          sceneRef.current.remove(vehicleGroupRef.current);

          const customGroup = gltf.scene;

          // Auto-scale and center the loaded model
          const box = new THREE.Box3().setFromObject(customGroup);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 4.0 / maxDim;
          customGroup.scale.setScalar(scale);
          customGroup.position.sub(center.multiplyScalar(scale));
          customGroup.position.y += (size.y * scale) / 2;

          // Traverse and apply paint material to body meshes
          if (carPaintMaterialRef.current) {
            customGroup.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
              }
            });
          }

          sceneRef.current.add(customGroup);
          vehicleGroupRef.current = customGroup;
          setLoadedCustomModel(true);
          setCustomModelName(file.name);
        },
        (error) => {
          console.error("Gagal membaca file GLB:", error);
          alert("Gagal membaca file 3D .glb. Pastikan file valid.");
        }
      );
    };

    reader.readAsArrayBuffer(file);
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(4.2, 2.2, 4.6);
    controlsRef.current.target.set(0, 0.6, 0);
    controlsRef.current.update();
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-100/90 via-slate-200/50 to-slate-100/80 dark:from-[#0B0914] dark:via-[#141026] dark:to-[#0B0914] border border-slate-200/80 dark:border-white/10 shadow-inner">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Badges & Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/80 dark:bg-[#120F24]/80 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white shadow-sm">
          <Eye className="w-3.5 h-3.5 text-[#8FD3F4]" />
          <span>{vehicleType === "car" ? "BYD Seal 6 Aero" : "Superbike RR Track"}</span>
        </span>

        {loadedCustomModel && (
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            Loaded: {customModelName}
          </span>
        )}
      </div>

      {/* Floating Interactive Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1 rounded-2xl bg-white/85 dark:bg-[#120F24]/85 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-lg">
        {/* Toggle Auto-Rotate */}
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl text-xs font-semibold transition-all ${
            autoRotate
              ? "bg-[#A18CD1]/20 text-[#A18CD1]"
              : "text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
          }`}
          title={autoRotate ? "Jeda Rotasi Otomatis" : "Mulai Rotasi 360°"}
        >
          {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Reset Camera View */}
        <button
          type="button"
          onClick={handleResetCamera}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
          title="Reset Sudut Pandang Kamera"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Upload Custom GLB Model */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-[#8FD3F4] transition-colors"
          title="Unggah Model 3D Sendiri (.GLB)"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf"
          onChange={handleGLBUpload}
          className="hidden"
        />
      </div>

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pointer-events-none">
        <span className="flex items-center gap-1.5 backdrop-blur-sm bg-white/60 dark:bg-black/40 px-2.5 py-1 rounded-lg">
          <RotateCw className="w-3 h-3 text-[#A18CD1]" /> Klik & Geser untuk rotasi 3D bebas
        </span>
        <span className="hidden sm:flex items-center gap-1.5 backdrop-blur-sm bg-white/60 dark:bg-black/40 px-2.5 py-1 rounded-lg">
          <ZoomIn className="w-3 h-3 text-[#8FD3F4]" /> Scroll mouse untuk zoom in/out
        </span>
      </div>
    </div>
  );
}
