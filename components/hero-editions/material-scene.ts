import * as THREE from "three";
import { filmPoint, ease } from "../experience/perfect-apply/model.js";
import type { Edition } from "./editions";

type Controls = { current: { dark: boolean; paused: boolean; reveal: boolean; replay: number } };

/** Five draw calls, no environment bake, no shadow map, and no permanent idle loop. */
export function mountMaterialScene(canvas: HTMLCanvasElement, edition: Edition, controls: Controls, fallback: () => void) {
  const mobile = matchMedia("(max-width:760px)").matches;
  const lean = mobile || (navigator.hardwareConcurrency || 4) <= 4;
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" }); }
  catch { fallback(); return () => {}; }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 30);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x17141d, 2));
  const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(-3, 5, 5); scene.add(key);
  const fill = new THREE.DirectionalLight(0xff9a9e, .7); fill.position.set(5, -1, 4); scene.add(fill);
  const rig = new THREE.Group(); scene.add(rig);
  const geometry = new THREE.PlaneGeometry(5.4, 3.65, lean ? 26 : 40, lean ? 18 : 26);
  (geometry.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
  const surface = document.createElement("canvas"); surface.width = lean ? 768 : 1024; surface.height = lean ? 512 : 684;
  const ctx = surface.getContext("2d")!;
  const map = new THREE.CanvasTexture(surface); map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = Math.min(lean ? 2 : 4, renderer.capabilities.getMaxAnisotropy());
  const vinyl = new THREE.MeshPhongMaterial({ map, color: 0xffffff, specular: 0x8f9cab, shininess: 110, side: THREE.DoubleSide });
  const sheet = new THREE.Mesh(geometry, vinyl); rig.add(sheet);
  const backingMaterial = new THREE.MeshPhongMaterial({ color: edition.id === 2 ? 0x398eaf : 0x272931, shininess: 18, side: THREE.DoubleSide });
  const backing = new THREE.Mesh(geometry, backingMaterial); backing.position.z = -.055; rig.add(backing);
  const tool = new THREE.Group(); rig.add(tool);
  const housingMaterial = new THREE.MeshPhongMaterial({ color: edition.id === 2 ? 0x8fd3f4 : 0x272931, specular: 0x52545d, shininess: 48 });
  const housing = new THREE.Mesh(new THREE.BoxGeometry(.72, 2.62, .16), housingMaterial); tool.add(housing);
  const feltMaterial = new THREE.MeshPhongMaterial({ color: 0x111218, shininess: 2 });
  const felt = new THREE.Mesh(new THREE.BoxGeometry(.13, 2.7, .13), feltMaterial); felt.position.set(-.39, 0, -.02); tool.add(felt);
  const gripGeometry = new THREE.BufferGeometry();
  const ribPositions: number[] = [], ribNormals: number[] = [];
  for (let j = 0; j < 5; j++) {
    const box = new THREE.BoxGeometry(.36, .024, .025).toNonIndexed(); box.translate(0, (j - 2) * .16, .105);
    ribPositions.push(...box.attributes.position.array); ribNormals.push(...box.attributes.normal.array); box.dispose();
  }
  gripGeometry.setAttribute("position", new THREE.Float32BufferAttribute(ribPositions, 3)); gripGeometry.setAttribute("normal", new THREE.Float32BufferAttribute(ribNormals, 3));
  const gripMaterial = new THREE.MeshPhongMaterial({ color: 0x8fd3f4, shininess: 90 }); tool.add(new THREE.Mesh(gripGeometry, gripMaterial));
  if (edition.id === 2) { fill.color.set(0x8fd3f4); gripMaterial.color.set(0x17141d); vinyl.specular.set(0xb5dcec); }
  const scratch = new THREE.Vector3();
  let disposed = false, frame = 0, timer: ReturnType<typeof setTimeout> | undefined, visible = true, age = 0, last = 0, lastRendered = 0, lastSweep = -1, lastWrinkle = -1, lastPressure = -1, frames = 0, slow = 0, fps = lean ? 30 : 45;
  let pointerX = 0, pointerY = 0, followX = 0, followY = 0, revealBlend = 0, lastReveal = controls.current.reveal, replay = controls.current.replay;
  let logo: HTMLImageElement | undefined;
  const reduced = matchMedia("(prefers-reduced-motion:reduce)");
  function paint() {
    const w = surface.width, h = surface.height;
    ctx.fillStyle = edition.film; ctx.fillRect(0, 0, w, h);
    if (edition.id === 3 || edition.id === 5 || controls.current.reveal) {
      ctx.fillStyle = "#ff9a9e"; ctx.beginPath(); ctx.moveTo(w * .77, 0); ctx.lineTo(w, 0); ctx.lineTo(w * .58, h); ctx.lineTo(w * .35, h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = edition.print; ctx.globalAlpha = .18;
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(w * .82 + i * 16, 0); ctx.lineTo(w * .83 + i * 16, 0); ctx.lineTo(w * .44 + i * 16, h); ctx.lineTo(w * .43 + i * 16, h); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    if (logo) {
      const stamp = document.createElement("canvas"); stamp.width = 768; stamp.height = 256;
      const stampCtx = stamp.getContext("2d")!; stampCtx.drawImage(logo, 0, 0, 768, 256); stampCtx.globalCompositeOperation = "source-in"; stampCtx.fillStyle = edition.print; stampCtx.fillRect(0, 0, 768, 256);
      ctx.drawImage(stamp, w * .13, h * .32, w * .74, h * .37);
    }
    ctx.strokeStyle = edition.print; ctx.globalAlpha = .18; ctx.lineWidth = 1; ctx.strokeRect(w * .035, h * .045, w * .93, h * .91); ctx.globalAlpha = 1;
    map.needsUpdate = true;
  }
  paint();
  const image = new Image(); image.onload = () => { if (!disposed) { logo = image; paint(); schedule(); } }; image.src = "/design-preview/hero-editions/wordmark.webp";
  function schedule() { if (timer) { clearTimeout(timer); timer = undefined; } if (!disposed && !frame && visible && !document.hidden) frame = requestAnimationFrame(draw); }
  let ratio = lean ? Math.min(devicePixelRatio, 1) : Math.min(devicePixelRatio, 1.4);
  function resize() {
    if (disposed) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(ratio, Math.sqrt((lean ? 600000 : 1400000) / (w * h)))); renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.position.z = Math.max(5.25, 6.6 / camera.aspect) / (2 * Math.tan(THREE.MathUtils.degToRad(17.5))); camera.updateProjectionMatrix(); schedule();
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas); resize();
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { last = 0; schedule(); } else stop(); }); intersection.observe(canvas);
  function stop() { cancelAnimationFrame(frame); frame = 0; if (timer) clearTimeout(timer); timer = undefined; last = 0; }
  const wake = () => { last = 0; schedule(); };
  const visibility = () => { if (document.hidden) stop(); else wake(); };
  const move = (event: PointerEvent) => { if (event.pointerType === "touch" || reduced.matches || controls.current.paused) return; const rect = canvas.getBoundingClientRect(); pointerX = (event.clientX - rect.left) / rect.width * 2 - 1; pointerY = (event.clientY - rect.top) / rect.height * 2 - 1; schedule(); };
  const leave = () => { pointerX = pointerY = 0; schedule(); };
  const lost = (event: Event) => { event.preventDefault(); stop(); fallback(); };
  canvas.addEventListener("pointermove", move, { passive: true }); canvas.addEventListener("pointerleave", leave); canvas.addEventListener("he-update", wake); canvas.addEventListener("webglcontextlost", lost); document.addEventListener("visibilitychange", visibility); reduced.addEventListener("change", wake);
  function draw(now: number) {
    frame = 0; if (disposed || !visible || document.hidden) return;
    if (now - lastRendered < 1000 / fps - 1) { schedule(); return; }
    const rawDelta = last ? (now - last) / 1000 : 1 / fps, dt = Math.min(rawDelta, .08); last = now; lastRendered = now;
    const quiet = controls.current.paused || reduced.matches;
    if (replay !== controls.current.replay) { replay = controls.current.replay; age = 0; }
    if (!quiet) age += rawDelta;
    const phase = reduced.matches ? 7 : age % 10;
    const sweep = phase < 4.5 ? ease((phase - .55) / 2.8) : 1;
    const park = phase < 4.5 ? ease((phase - 3.35) / .9) : 1;
    const wrinkles = phase < 4.5 ? 1 : 0;
    const pressure = edition.id === 2 && phase < 4.5 ? Math.sin(Math.PI * THREE.MathUtils.clamp((phase - .15) / 4.35, 0, 1)) : 0;
    if (sweep !== lastSweep || wrinkles !== lastWrinkle || pressure !== lastPressure) {
      const pos = geometry.attributes.position, uv = geometry.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const u = uv.getX(i), v = 1 - uv.getY(i);
        filmPoint(u, v, sweep, scratch, wrinkles, 1.7);
        if (edition.id === 2) {
          const corner = ease((u - .74) / .26) * ease((v - .6) / .4);
          scratch.z += corner * pressure * .24;
          scratch.y += corner * pressure * .04;
        }
        pos.setXYZ(i, scratch.x, scratch.y, scratch.z);
      }
      pos.needsUpdate = true; geometry.computeVertexNormals(); lastSweep = sweep; lastWrinkle = wrinkles; lastPressure = pressure;
    }
    const blend = 1 - Math.exp(-dt * 7);
    followX += ((quiet ? 0 : pointerX) - followX) * blend; followY += ((quiet ? 0 : pointerY) - followY) * blend;
    revealBlend += ((controls.current.reveal ? 1 : 0) - revealBlend) * (reduced.matches ? 1 : blend);
    if (lastReveal !== controls.current.reveal) { lastReveal = controls.current.reveal; paint(); }
    backing.position.set(-revealBlend * .17, -revealBlend * .25, -.055 - revealBlend * .4 - pressure * .045);
    rig.rotation.set(.09 + followY * .055 - pressure * .035, -.2 + followX * .09 + pressure * .075, (edition.id === 3 ? -.15 : edition.id === 4 ? .11 : edition.id === 5 ? -.26 : -.1) - pressure * .018);
    rig.position.set(edition.id === 2 ? (mobile ? -.1 : -.4) : 0, .2 + pressure * .035, 0);
    rig.scale.setScalar(edition.id === 2 ? 1.08 : edition.id === 3 ? .9 : edition.id === 4 ? .88 : .94);
    const toolX = THREE.MathUtils.lerp(-2.8, 2.9, sweep);
    tool.visible = edition.id < 3 || phase < 4.4;
    tool.position.set(THREE.MathUtils.lerp(toolX, 1.6, park), THREE.MathUtils.lerp(.02, edition.id === 2 ? -1.45 : -2.05, park), THREE.MathUtils.lerp(.15, .3, park)); tool.rotation.set(0, -.12, THREE.MathUtils.lerp(-.04, -1.08, park));
    key.position.x = phase < 4.5 ? THREE.MathUtils.lerp(-4, 3.5, sweep) : 3.5;
    if (edition.id === 2) { key.position.z = 5 + pressure * .45; vinyl.shininess = 100 + pressure * 30; }
    fill.intensity = controls.current.dark ? .9 : .5;
    renderer.render(scene, camera); frames++; canvas.dataset.frames = String(frames); canvas.dataset.fpsCap = String(fps); canvas.dataset.pixelRatio = String(renderer.getPixelRatio()); canvas.dataset.pass = phase < 4.5 ? "applying" : "rest";
    if (frames === 1) { canvas.dataset.drawCalls = String(renderer.info.render.calls); canvas.dataset.triangles = String(renderer.info.render.triangles); }
    if (edition.id === 2) canvas.dataset.pressure = pressure.toFixed(3);
    if (phase < 4.5 && rawDelta > .085) slow++;
    if (frames % 60 === 0 && slow > 20) { ratio = Math.max(.7, ratio * .85); fps = 20; resize(); slow = 0; }
    const moving = Math.abs(pointerX - followX) + Math.abs(pointerY - followY) > .002 && !quiet;
    const resolving = Math.abs((controls.current.reveal ? 1 : 0) - revealBlend) > .002;
    if ((!quiet && phase < 4.5) || moving || resolving) schedule();
    else if (!quiet) timer = setTimeout(schedule, Math.max(50, (10 - phase) * 1000));
  }
  schedule();
  return () => {
    disposed = true; stop(); observer.disconnect(); intersection.disconnect(); image.onload = null;
    canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerleave", leave); canvas.removeEventListener("he-update", wake); canvas.removeEventListener("webglcontextlost", lost); document.removeEventListener("visibilitychange", visibility); reduced.removeEventListener("change", wake);
    const geos = new Set<THREE.BufferGeometry>(), mats = new Set<THREE.Material>();
    scene.traverse(object => { const mesh = object as THREE.Mesh; if (mesh.geometry) geos.add(mesh.geometry); if (mesh.material) for (const mat of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) mats.add(mat); });
    geos.forEach(item => item.dispose()); mats.forEach(item => item.dispose()); map.dispose(); renderer.dispose();
  };
}
