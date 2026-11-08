"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { PerfectApplyHero } from "../../components/experience/PerfectApplyHero";
import { RacingNavbar } from "../../components/RacingNavbar";
import { useTheme } from "../../components/ThemeContext";
import "./preview.css";

const studies = [
  { name: "Peel / Reveal", detail: "Kulit kedua terangkat. Bayangan bergerak di bawah lipatan, lalu lapisan kembali menempel.", cue: "Arahkan kursor • perhatikan lipatan kanan", label: "01 / SECOND SKIN" },
  { name: "Print / Register", detail: "Tiga separasi cetak bergeser, mencari titik presisi, lalu mengunci jadi satu permukaan.", cue: "Gerakkan kursor • separasi mengikuti arah tangan", label: "02 / IN PERFECT REGISTER" },
  { name: "Pressure / Field", detail: "Gelombang kontur melebar di belakang vinyl. Tekanan berubah menjadi ritme ruang.", cue: "Gerakkan kursor • pusat tekanan ikut berpindah", label: "03 / LEAVE AN IMPRESSION" },
  { name: "Prism / Fold", detail: "Bidang cahaya terlipat menjadi prisma panjang. Refleksi tajam menyapu ruang di belakang objek.", cue: "Gerakkan kursor • ubah sudut refleksi", label: "04 / LIGHT HAS AN EDGE" },
  { name: "Cut / Trace", detail: "Pisau virtual menelusuri jalur decal berskala besar. Garis potong tertinggal, lalu terlepas sebagai lembar tipis.", cue: "Lihat jalur cutting • putar ulang untuk melihat urutannya", label: "05 / NOTHING OFF THE SHELF" },
];

export function HeroEffectsPreview({ initialOption }: { initialOption: number }) {
  const [hero, setHero] = useState<HTMLElement | null>(null);
  const [option, setOption] = useState(initialOption);
  const [replay, setReplay] = useState(0);
  const [paused, setPaused] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const attach = useCallback((node: HTMLDivElement | null) => {
    setHero(node?.querySelector<HTMLElement>("#beranda") ?? null);
  }, []);

  useEffect(() => {
    if (!hero) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty("--fx-x", `${(event.clientX - rect.left) / rect.width * 100}%`);
        hero.style.setProperty("--fx-y", `${(event.clientY - rect.top) / rect.height * 100}%`);
        hero.style.setProperty("--fx-tilt", `${((event.clientX - rect.left) / rect.width - .5) * 12}deg`);
      });
    };
    hero.addEventListener("pointermove", move, { passive: true });
    return () => { cancelAnimationFrame(frame); hero.removeEventListener("pointermove", move); };
  }, [hero]);

  function select(value: number) {
    setOption(value); setReplay(key => key + 1);
    const url = new URL(window.location.href); url.searchParams.set("option", String(value));
    window.history.replaceState(null, "", url);
  }

  return <div ref={attach} className={`atelier-site apply-home fx-lab fx-option-${option}${paused ? " fx-paused" : ""}`}>
    <RacingNavbar/>
    <main><PerfectApplyHero typography="11"/>
      <section className="fx-notes"><span>FIVE MOTION STUDIES / ZAN DECAL</span><h2>{studies[option - 1].name}</h2><p>{studies[option - 1].detail}</p><p>Mockup tambahan pada hero asli. Pilih opsi melalui panel di bawah.</p><Link href="/">Kembali ke website ↗</Link><a href="https://www.awwwards.com/sites/lusion-v3" target="_blank" rel="noreferrer">Referensi interaksi: Lusion v3 / Awwwards ↗</a></section>
    </main>
    {hero && createPortal(<div key={`${option}-${replay}`} className={`fx-art fx-art-${option}`} aria-hidden="true">
      {option === 1 && <><div className="fx-peel-shadow"/><div className="fx-peel"><span>ZAN</span><i/></div><div className="fx-peel-seam"/></>}
      {option === 2 && <><div className="fx-register fx-register-a"/><div className="fx-register fx-register-b"/><div className="fx-register fx-register-c"/><div className="fx-cross fx-cross-a"/><div className="fx-cross fx-cross-b"/><div className="fx-plates"><span>C</span><span>M</span><span>K</span></div></>}
      {option === 3 && <div className="fx-field">{Array.from({length: 18}, (_, i) => <i key={i} style={{"--n": i} as CSSProperties}/>)}</div>}
      {option === 4 && <><div className="fx-prism fx-prism-a"/><div className="fx-prism fx-prism-b"/><div className="fx-prism fx-prism-c"/><div className="fx-caustic"/></>}
      {option === 5 && <><svg className="fx-cut" viewBox="0 0 1200 1000" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="cut-ink"><stop stopColor="#8d7599"/><stop offset=".5" stopColor="#65cce5"/><stop offset="1" stopColor="#c7a7dc"/></linearGradient></defs><path className="fx-cut-ghost" d="M630 90 L1110 175 L1010 670 L650 900 L500 665 L735 520 L630 90Z"/><path className="fx-cut-path" pathLength="1" d="M630 90 L1110 175 L1010 670 L650 900 L500 665 L735 520 L630 90Z"/><path className="fx-cut-inner" pathLength="1" d="M715 225 L975 270 L905 565 L705 700 L650 645 L830 510 L715 225Z"/></svg><div className="fx-blade"><i/><span>CUTTING / 01</span></div><div className="fx-offcut"/></>}
      <div className="fx-edition"><span>{studies[option - 1].label}</span><span>{studies[option - 1].cue}</span></div>
    </div>, hero)}
    <aside className="fx-controls" aria-label="Pilihan mockup hero"><div className="fx-controls-title"><b>ZAN / MOTION LAB</b><span>HERO ASLI + EFEK</span></div><div className="fx-options">{studies.map((study, i) => <button type="button" key={study.name} aria-pressed={option === i + 1} onClick={() => select(i + 1)}><small>0{i + 1}</small>{study.name}</button>)}</div><div className="fx-actions"><button type="button" onClick={() => {setReplay(key => key + 1);hero?.dispatchEvent(new Event("zan-replay-intro"));window.scrollTo({top:0,behavior:"instant"});}}>↻ Intro</button><button type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "▶ Efek" : "Ⅱ Efek"}</button><button type="button" onClick={toggleTheme}>{theme === "dark" ? "Light" : "Dark"} ↗</button></div></aside>
  </div>;
}
