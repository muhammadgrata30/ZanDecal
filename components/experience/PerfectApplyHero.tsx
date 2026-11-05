"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useTheme } from "../ThemeContext";
import "./perfect-apply/perfect-apply.css";
import "./perfect-apply/cut-frequency.css";

interface ApplyRuntime {
  setTheme: (theme: "light" | "dark") => void;
  dispose: () => void;
}

function HeadlineLine({ text, row }: { text: string; row: number }) {
  return <span className={`title-line ${row === 0 ? "line-one" : "line-two"}`} data-text={text} aria-hidden="true">
    <span className="title-word">{[...text].map((letter, index) => <span className="letter" key={`${row}-${index}`} style={{ "--i": index + row * 4 } as CSSProperties}>
      <span className="glyph" data-letter={letter}>{letter === " " ? "\u00a0" : letter}</span>
    </span>)}</span>
  </span>;
}

export function PerfectApplyHero({ typography }: { typography?: string } = {}) {
  const headlines: Record<string, [string, string]> = {
    "5": ["BREAK", "THE SAME."], "6": ["Bukan", "bawaan."],
    "7": ["BEYOND", "SURFACE."], "8": ["Beda.", "Berani."],
    "9": ["PEEL THE", "ORDINARY."], "10": ["Liquid", "identity."],
    "11": ["CUT TO", "STAND OUT."], "12": ["SHIFT", "REALITY."],
  };
  const headline = headlines[typography ?? ""] ?? ["Satu sapuan.", "Karakter baru."];
  const root = useRef<HTMLElement>(null);
  const runtime = useRef<ApplyRuntime | null>(null);
  const { theme, setTheme } = useTheme();
  const latestTheme = useRef(theme);

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

  return <section ref={root} id="beranda" className="perfect-apply" data-theme={theme} data-typography={typography} aria-labelledby="apply-title">
    <div className="atmosphere" aria-hidden="true" />
    <canvas id="apply-canvas" aria-label="Vinyl ZAN diratakan dengan squeegee, lalu menyapu otomatis setiap tujuh detik" />
    <div className="cinema cinema-top" aria-hidden="true" /><div className="cinema cinema-bottom" aria-hidden="true" />
    <div className="apply-header">
      <div className="header-actions">
        <div className="theme-switch" role="group" aria-label="Tema website">
          <button type="button" data-theme-choice="light" aria-pressed={theme === "light"} aria-label="Tema terang" onClick={() => setTheme("light")}><span aria-hidden="true">☼</span><small>Light</small></button>
          <button type="button" data-theme-choice="dark" aria-pressed={theme === "dark"} aria-label="Tema gelap" onClick={() => setTheme("dark")}><span aria-hidden="true">☾</span><small>Dark</small></button>
        </div>
        <button type="button" id="motion" aria-pressed="true" aria-label="Jeda gerakan hero">Motion <span id="motion-state">on</span></button>
        <button type="button" id="skip">Lewati intro ↗</button>
        <a id="craft-nav" href="#material">Material ↗</a>
      </div>
    </div>
    <div className="intro-kicker" aria-hidden="true"><span>ZAN DECAL</span><i /><span>PRECISION IN EVERY PASS.</span></div>
    <div className="hero-type">
      <div className="eyebrow"><span>DECAL & WRAPPING STUDIO</span></div>
      <h1 id="apply-title" aria-label={headline.join(" ")}><HeadlineLine text={headline[0]} row={0} /><HeadlineLine text={headline[1]} row={1} /></h1>
      <div className="hero-support"><p>Decal & wrapping, dikerjakan<br />sampai detail terakhir.</p><a className="hero-cta" href="#konsultasi"><span>Buat karaktermu</span><i aria-hidden="true">↗</i></a></div>
    </div>
    <div className="craft-controls" id="craft-controls" aria-label="Pilihan finishing">
      <div className="finish-options" role="group" aria-label="Finishing material">
        <button type="button" data-finish="gloss" aria-pressed="true">Gloss</button><button type="button" data-finish="satin" aria-pressed="false">Satin</button><button type="button" data-finish="matte" aria-pressed="false">Matte</button>
      </div>
      <button type="button" id="replay-sweep" className="sweep-button"><span aria-hidden="true">↻</span> Ulangi sapuan</button>
    </div>
    <div className="apply-footer">
      <div className="chapter"><span id="chapter" role="status">01 / THE SURFACE</span><div className="timeline"><i id="timeline-fill" /></div></div>
      <button type="button" id="replay-intro">↻ Ulangi intro</button><a href="#material">Eksplorasi material ↗</a><span className="footer-signature">Perfectly personal.</span>
    </div>
    <span id="surface-state" className="sr-only" role="status">A single, considered pass.</span><span id="theme-status" className="sr-only" role="status">Tema {theme}</span>
    <div id="fallback" role="status" hidden>Preview 3D belum bisa ditampilkan. <a href="#konsultasi">Konsultasikan konsep decal kamu ↗</a></div>
  </section>;
}
