"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { acquireIntroScrollLock } from "./perfect-apply/intro-scroll-lock.js";
import { useTheme } from "../ThemeContext";
import "./perfect-apply/perfect-apply.css";
import "./perfect-apply/cut-frequency.css";

interface ApplyRuntime {
  setTheme: (theme: "light" | "dark") => void;
  dispose: () => void;
}

function HeadlineLine({ text, row }: { text: string; row: number }) {
  return <span className={`title-line ${row === 0 ? "line-one" : row === 1 ? "line-two" : "line-three"}`} data-text={text} aria-hidden="true">
    <span className="title-word">{[...text].map((letter, index) => <span className="letter" key={`${row}-${index}`} style={{ "--i": index + row * 4 } as CSSProperties}>
      <span className="glyph" data-letter={letter}>{letter === " " ? "\u00a0" : letter}</span>
    </span>)}</span>
  </span>;
}

export function PerfectApplyHero({ typography, artwork, realistic = false, backdrop }: { typography?: string; artwork?: number; realistic?: boolean; backdrop?: ReactNode } = {}) {
  const headlines: Record<string, [string, string]> = {
    "5": ["BREAK", "THE SAME."], "6": ["Bukan", "bawaan."],
    "7": ["BEYOND", "SURFACE."], "8": ["Beda.", "Berani."],
    "9": ["PEEL THE", "ORDINARY."], "10": ["Liquid", "identity."],
    "11": ["CUT TO", "STAND OUT."], "12": ["SHIFT", "REALITY."],
  };
  const headline = headlines[typography ?? ""] ?? ["Satu sapuan.", "Karakter baru."];
  const root = useRef<HTMLElement>(null);
  const runtime = useRef<ApplyRuntime | null>(null);
  const { theme } = useTheme();
  const latestTheme = useRef(theme);

  useLayoutEffect(() => {
    const element=root.current;
    if(!element)return;
    let release:undefined|(()=>void);
    const sync=()=>{
      const rect=element.getBoundingClientRect();
      const playing=!element.classList.contains("settled")&&!matchMedia("(prefers-reduced-motion:reduce)").matches;
      if(playing&&rect.top<innerHeight&&rect.bottom>0){release??=acquireIntroScrollLock(element);}
      else{release?.();release=undefined;}
    };
    const observer=new MutationObserver(sync);
    observer.observe(element,{attributes:true,attributeFilter:["class"]});
    sync();
    return()=>{observer.disconnect();release?.();};
  },[]);

  useEffect(() => {
    root.current?.dispatchEvent(new Event("zan-artwork-change"));
  }, [artwork]);

  useEffect(() => {
    latestTheme.current = theme;
    runtime.current?.setTheme(theme);
  }, [theme]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let cancelled = false;
    let mounted: ApplyRuntime | null = null;
    // Keep Three.js out of the initial UI bundle; the headline still renders on the server.
    void import("./perfect-apply/runtime.js").then(({ mountPerfectApply }) => {
      if (cancelled) return;
      mounted = mountPerfectApply(element, latestTheme.current);
      runtime.current = mounted;
    }).catch(error => {
      if (cancelled) return;
      console.error("Could not load the hero renderer:", error);
      element.classList.add("opening", "type-visible", "settled", "paused");
      const fallback = element.querySelector<HTMLElement>("#fallback");
      if (fallback) fallback.hidden = false;
    });
    return () => {
      cancelled = true;
      mounted?.dispose();
      if (runtime.current === mounted) runtime.current = null;
    };
  }, []);

  return <section ref={root} id="beranda" className="perfect-apply" data-theme={theme} data-typography={typography} data-artwork={artwork} data-realistic={realistic || undefined} aria-labelledby="apply-title">
    <div className="atmosphere" aria-hidden="true" />
    {backdrop}
    <div className="hero-drafting" aria-hidden="true">
      <div className="hero-brand-imprint" />
      <div className="hero-measure-line" />
      <div className="hero-scan-line" />
    </div>
    <canvas id="apply-canvas" aria-label="Vinyl ZAN diratakan dengan squeegee, lalu menyapu otomatis setiap tujuh detik" />
    <div className="cinema cinema-top" aria-hidden="true" /><div className="cinema cinema-bottom" aria-hidden="true" />
    <div className="apply-header">
      <div className="header-actions">
        <button type="button" id="skip" onClick={()=>{const element=root.current;if(element)element.dataset.skipRequested="true";}}>Lewati intro ↗</button>
      </div>
    </div>
    <div className="hero-type">
      <h1 id="apply-title" aria-label={headline.join(" ")}>
        <HeadlineLine text={headline[0]} row={0} />
        {typography === "11" ? <><HeadlineLine text="STAND" row={1}/><HeadlineLine text="OUT." row={2}/></> : <HeadlineLine text={headline[1]} row={1} />}
      </h1>
      <div className="hero-support"><a className="hero-cta" href="#konsultasi"><span>Buat karaktermu</span><i aria-hidden="true">↗</i></a></div>
    </div>
    <div className="apply-footer sr-only">
      <div className="chapter"><span id="chapter" role="status">01 / THE SURFACE</span><div className="timeline"><i id="timeline-fill" /></div></div>
    </div>
    <span id="surface-state" className="sr-only" role="status">A single, considered pass.</span><span id="theme-status" className="sr-only" role="status">Tema {theme}</span>
    <div id="fallback" role="status" hidden><div className="apply-static-vinyl" aria-label="Decal dengan logo ZAN"/><p>Decal & wrapping, sampai detail terakhir.</p><a href="#konsultasi">Konsultasikan konsep decal kamu ↗</a></div>
  </section>;
}
