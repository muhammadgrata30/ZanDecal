"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Menu, Pause, Play, RotateCcw, X } from "lucide-react";
import { editions, type Edition } from "./editions";
import { RacingNavbar } from "../RacingNavbar";
import { useTheme } from "../ThemeContext";
import { PerfectApplyHero } from "../experience/PerfectApplyHero";
import { navigateToSection } from "../../lib/section-navigation";

type DataNavigator = Navigator & { connection?: EventTarget & { saveData?: boolean } };
const subscribeData = (callback: () => void) => { const connection = (navigator as DataNavigator).connection; connection?.addEventListener("change", callback); return () => connection?.removeEventListener("change", callback); };
const readSaveData = () => Boolean((navigator as DataNavigator).connection?.saveData);
const serverSaveData = () => false;

function Contours({ id }: { id: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const node = canvas.current;
    const ctx = node?.getContext("2d");
    if (!node || !ctx) return;
    const draw = () => {
      const w = node.clientWidth, h = node.clientHeight;
      const dpr = Math.min(devicePixelRatio, 1.25);
      node.width = w * dpr; node.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let i = 0; i < 24; i++) {
        ctx.beginPath();
        for (let j = 0; j <= 160; j++) {
          const t = j / 160 * Math.PI * 2;
          const r = 1 + i * .038;
          const x = w * .62 + Math.cos(t) * w * (.17 * r + Math.sin(t * 3) * .012);
          const y = h * .49 + Math.sin(t) * h * (.26 * r + Math.cos(t * 2) * .04);
          if (!j) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath(); ctx.strokeStyle = i % 6 === 0 ? "#ff9a9e" : "#398eaf"; ctx.globalAlpha = id === 3 ? .13 : i % 6 === 0 ? .7 : .2; ctx.lineWidth = i % 6 === 0 ? 1.25 : .65; ctx.stroke();
      }
      ctx.globalAlpha = .3; ctx.strokeStyle = "#398eaf"; ctx.lineWidth = 1;
      for (let x = 30; x < w; x += 110) for (let y = 30; y < h; y += 110) { ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.lineTo(x + 3, y); ctx.moveTo(x, y - 3); ctx.lineTo(x, y + 3); ctx.stroke(); }
    };
    draw(); const observer = new ResizeObserver(draw); observer.observe(node);
    return () => observer.disconnect();
  }, [id]);
  return <canvas className="he-contours" ref={canvas} aria-hidden="true" />;
}

function MaterialScene({ edition, dark, paused, reveal, replay, staticMode }: { edition: Edition; dark: boolean; paused: boolean; reveal: boolean; replay: number; staticMode: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const controls = useRef({ dark, paused, reveal, replay });
  const [failed, setFailed] = useState(false);
  useEffect(() => { controls.current = { dark, paused, reveal, replay }; canvas.current?.dispatchEvent(new Event("he-update")); }, [dark, paused, reveal, replay]);
  useEffect(() => {
    if (staticMode) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void import("./material-scene").then(({ mountMaterialScene }) => {
      if (disposed || !canvas.current) return;
      cleanup = mountMaterialScene(canvas.current, edition, controls, () => setFailed(true));
    }).catch(() => setFailed(true));
    return () => { disposed = true; cleanup?.(); };
  }, [edition, staticMode]);
  return <div className={`he-object${staticMode || failed ? " he-object-static" : ""}`}>
    {staticMode || failed ? <Image src={`/design-preview/hero-editions/poster-${edition.id}.webp`} alt="Decal ZAN dengan finishing vinyl" fill sizes="(max-width: 760px) 100vw, 65vw" unoptimized /> : <canvas ref={canvas} className="he-material-canvas" aria-label="Animasi decal ZAN 3D dan alat pemasangan, dengan pencahayaan studio" />}
  </div>;
}

export function EditionPreview({ edition, production = false }: { edition: Edition; production?: boolean }) {
  const globalTheme = useTheme();
  const [previewDark, setPreviewDark] = useState(edition.theme === "dark");
  const dark = production ? globalTheme.theme === "dark" : previewDark;
  const setDark = (value: boolean) => { if (production) globalTheme.setTheme(value ? "dark" : "light"); else setPreviewDark(value); };
  const [paused, setPaused] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [replay, setReplay] = useState(0);
  const [menu, setMenu] = useState(false);
  const [info, setInfo] = useState(false);
  const [forceStatic, setForceStatic] = useState(false);
  const [force3D, setForce3D] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const hold = useRef<{ timer?: ReturnType<typeof setTimeout>; completed: boolean }>({ completed: false });
  const saveData = useSyncExternalStore(subscribeData, readSaveData, serverSaveData);
  const staticMode = forceStatic || (saveData && !force3D);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const holding = hold.current;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenu(false); setInfo(false); } };
    addEventListener("keydown", close); return () => { removeEventListener("keydown", close); if (holding.timer) clearTimeout(holding.timer); };
  }, []);
  useEffect(() => {
    const node = root.current; if (!node) return;
    const observer = new IntersectionObserver(([entry]) => node.classList.toggle("he-offscreen", !entry.isIntersecting)); observer.observe(node);
    const visibility = () => node.classList.toggle("he-hidden", document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  useEffect(() => {
    const node = root.current;
    if (!production || !node) return;
    if (staticMode) return;
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "instant" });
    const original = node.querySelector(".he-original-apply");
    if (!original) return;
    // Keep intro visibility in React state so changing the theme cannot erase it.
    const sync = () => setIntroDone(original.classList.contains("settled"));
    const observer = new MutationObserver(sync);
    observer.observe(original, { attributes: true, attributeFilter: ["class"] });
    sync();
    return () => { observer.disconnect(); history.scrollRestoration = previousRestoration; };
  }, [production, staticMode]);
  const switchRendering = () => { if (staticMode) { setForceStatic(false); setForce3D(true); } else setForceStatic(true); };
  const Root = production ? "section" : "main";
  return <Root id="beranda" ref={root} aria-labelledby={production ? "home-hero-title" : undefined} className={`he-preview he-edition-${edition.id} he-${dark ? "dark" : "light"}${production ? " he-production" : ""}${production && (introDone || staticMode) ? " he-intro-done" : ""}${paused ? " he-paused" : ""}${reveal ? " he-reveal" : ""}${staticMode ? " he-static" : ""}`} style={{ "--film": edition.film } as CSSProperties}>
    <div className="he-art" aria-hidden="true">
      {(edition.id === 1 || edition.id === 3) && <Contours id={edition.id} />}
      {edition.id === 1 && <><div className="he-outline-sign">ZAN</div><div className="he-blueprint-edge" /></>}
      {edition.id === 2 && <><Image className="he-lacquer-photo" src="/design-preview/hero-editions/lacquer.webp" alt="" fill sizes="100vw" loading="eager" unoptimized /><div className="he-light-blade he-light-blade-one" /><div className="he-light-blade he-light-blade-two" /><div className="he-night-word">SURFACE.</div></>}
      {edition.id === 3 && <><div className="he-proof-block" /><div className="he-proof-strip"><span>ZAN DECAL — CUT DIFFERENT — ZAN DECAL — CUT DIFFERENT —</span></div><div className="he-proof-registration"><i /><i /><i /><i /></div></>}
      {edition.id === 4 && <><div className="he-roll-photo"><Image src="/design-preview/hero-editions/rolls.webp" alt="" fill sizes="(max-width:760px) 100vw, 65vw" unoptimized /></div><div className="he-soft-line" /><span className="he-material-word">Material matters.</span></>}
      {edition.id === 5 && <><div className="he-bureau-field"><Image src="/design-preview/hero-editions/wordmark.webp" alt="" fill sizes="70vw" unoptimized /></div><div className="he-bureau-tracks" /><div className="he-bureau-cut" /></>}
    </div>
    {!production && (edition.id === 2 ? <div className="he-project-nav" data-theme={dark ? "dark" : "light"}><RacingNavbar sectionBase="/" themeOverride={{ theme: dark ? "dark" : "light", setTheme: value => setDark(value === "dark") }} /></div> : <header className="he-nav"><Link className="he-brand" href="/" aria-label="ZAN beranda"><Image src="/design-preview/hero-editions/wordmark.webp" width={900} height={300} alt="ZAN" unoptimized /></Link>
      <nav className={menu ? "he-nav-links he-menu-open" : "he-nav-links"} aria-label="Navigasi utama"><Link href="/#material" prefetch={false}>Material</Link><Link href="/#3d-studio" prefetch={false}>3D Studio</Link><Link href="/#custom-sticker" prefetch={false}>Custom Sticker</Link><Link href="/#galeri" prefetch={false}>Galeri</Link><Link href="/#cara-order" prefetch={false}>Cara Order</Link></nav>
      <div className="he-nav-actions"><div className="he-theme" role="group" aria-label="Tema mockup"><button onClick={() => setDark(false)} aria-pressed={!dark}>Light</button><button onClick={() => setDark(true)} aria-pressed={dark}>Dark</button></div><Link className="he-nav-cta" href="/#konsultasi" prefetch={false}>Konsultasi <ArrowUpRight size={18} /></Link><button className="he-menu-button" onClick={() => setMenu(value => !value)} aria-label={menu ? "Tutup menu" : "Buka menu"} aria-expanded={menu}>{menu ? <X size={22} /> : <Menu size={22} />}</button></div>
    </header>)}
    <div className="he-kicker"><span>DECAL & AUTOMOTIVE WRAPPING</span><span>Designed around you.</span></div>
    <div className="he-headline"><h1 id={production ? "home-hero-title" : undefined} aria-label="CUT TO STAND OUT."><span className="he-line he-line-one"><span>{edition.line1}</span></span><span className="he-line he-line-two"><span>{edition.line2}</span></span>{edition.line3 && <span className="he-line he-line-three"><span>{edition.line3}</span></span>}</h1></div>
    {production && !staticMode ? <><div className="he-object he-original-slot" aria-hidden="true"/><PerfectApplyHero sceneOnly typography="11" realistic /></> : <MaterialScene edition={edition} dark={dark} paused={paused} reveal={reveal} replay={replay} staticMode={staticMode} />}
    <div className="he-caption"><p>{edition.tagline}</p><Link href={production ? "#konsultasi" : "/#konsultasi"} prefetch={false} onClick={event => { if (production && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) { event.preventDefault(); navigateToSection("konsultasi"); } }}>Buat karaktermu <ArrowUpRight size={22} /></Link></div>
    <div className="he-material-label"><span />{edition.id === 4 ? "VINYL, WITH A POINT OF VIEW." : "CUSTOM LIVERY · PRECISELY APPLIED."}</div>
    {edition.id === 5 && <button className="he-reveal-button" onPointerDown={() => { hold.current.completed = false; hold.current.timer = setTimeout(() => { hold.current.completed = true; setReveal(true); }, 600); }} onPointerUp={() => { clearTimeout(hold.current.timer); }} onPointerCancel={() => { clearTimeout(hold.current.timer); }} onPointerLeave={() => { clearTimeout(hold.current.timer); }} onClick={() => { if (hold.current.completed) { hold.current.completed = false; return; } setReveal(value => !value); }} aria-pressed={reveal}><span>{reveal ? "Tutup lapisan" : "Buka identitasnya"}</span><ArrowUpRight size={18} /></button>}
    <div className="he-bottom-note"><span>Decal motor. Wrapping mobil. Karakter kamu.</span><ArrowDown size={16} /></div>
    {!production && <aside className="he-switcher" aria-label="Kontrol mockup"><Link className="he-all-editions" href="/hero-editions" prefetch={false}>Semua opsi</Link><div className="he-switcher-links">{editions.map(item => <Link key={item.id} href={`/hero-editions/${item.id}`} prefetch={false} aria-current={item.id === edition.id ? "page" : undefined} aria-label={`${item.id}. ${item.name}`}>0{item.id}</Link>)}</div><span className="he-edition-name">{edition.name}</span><div className="he-motion-controls"><button onClick={() => setPaused(value => !value)} aria-label={paused ? "Lanjutkan animasi" : "Jeda animasi"} aria-pressed={paused}>{paused ? <Play size={14} /> : <Pause size={14} />}</button><button onClick={() => { setPaused(false); setReplay(value => value + 1); }} aria-label="Ulangi animasi"><RotateCcw size={14} /></button><button onClick={switchRendering} aria-pressed={staticMode}>{staticMode ? "Aktifkan 3D" : "Hemat"}</button><button onClick={() => setInfo(value => !value)} aria-expanded={info}>Info</button></div></aside>}
    {info && <aside className="he-info" aria-label="Detail opsi"><button onClick={() => setInfo(false)} aria-label="Tutup detail"><X size={20} /></button><span>0{edition.id} / {edition.theme.toUpperCase()}</span><h2>{edition.name}</h2><p>{edition.description}</p><h3>Gerak</h3><p>{edition.motion}</p><h3>Referensi</h3><a href={edition.referenceUrl} target="_blank" rel="noreferrer">{edition.reference} — Awwwards ↗</a><Image className="he-info-reference" src={`/design-preview/hero-editions/reference-${edition.reference === "Monolith" ? "monolith" : edition.reference === "Terminal Industries" ? "terminal" : "david-whyte"}.webp`} alt={`Screenshot referensi ${edition.reference}, sumber Awwwards`} width={1200} height={900} unoptimized /><p>{edition.adaptation}</p><h3>Mobile lebih dulu</h3><p>Satu renderer, maksimal 30 fps di mobile, tanpa HDR, shadow map, video atau postprocessing. Renderer beristirahat di antara sapuan, dan berhenti saat offscreen, tab tersembunyi, atau dijeda. Hemat mematikan 3D sepenuhnya.</p></aside>}
  </Root>;
}
