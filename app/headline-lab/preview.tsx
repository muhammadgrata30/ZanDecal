"use client";

import { useState } from "react";
import { PerfectApplyHero } from "../../components/experience/PerfectApplyHero";
import "./preview.css";
import "./kinetic.css";

const options = [
  { id: "9", name: "Peel Reality", font: "Geist 900 / vinyl peel motion", note: "PEEL THE ORDINARY. Setiap huruf terangkat dan terlipat bergantian seperti vinyl dikupas. Siklus 7 detik dengan jeda agar tetap terbaca." },
  { id: "10", name: "Liquid Signal", font: "Instrument Serif Italic / elastic wave", note: "Liquid identity. Huruf mengalir naik-turun sambil meregang. Bentuk editorial yang berubah menjadi gelombang, dipadukan label teknis monospace." },
  { id: "11", name: "Cut Frequency", font: "Barlow Condensed 800 / cinematic cut", note: "CUT TO STAND OUT. Headline diperbesar sekitar 30%. Potongan terangkat dalam perspektif, berhenti sesaat, lalu menyatu bertahap dengan sapuan kilau. Siklus 7 detik." },
  { id: "12", name: "Orbit Type", font: "Geist 900 / dimensional echoes", note: "SHIFT REALITY. Huruf berputar bergantian pada sumbu 3D, sementara dua lapisan outline melayang mengitari headline. Paling dramatis." },
  { id: "5", name: "Cut / Shift", font: "Geist Black 900 · sliced type", note: "BREAK THE SAME. Huruf terbelah horizontal dan bergeser seperti potongan vinyl. Brutal, grafis, dan paling eksperimental." },
  { id: "6", name: "Off Grid", font: "Barlow Condensed 800 · staggered type", note: "Bukan bawaan. Huruf naik-turun, baris kedua meleset dari grid. Energi custom yang terasa lebih liar." },
  { id: "7", name: "Ghost Layer", font: "Geist Black 900 · outline echoes", note: "BEYOND SURFACE. Headline solid bertumpuk dengan dua jejak outline yang bergerak pelan, seperti lapisan material." },
  { id: "8", name: "Type Sculpture", font: "Barlow Condensed 800 · rotated composition", note: "Beda. Berani. Komposisi tinggi dengan dua baris berlawanan arah, garis vertikal, dan counter angka. Seperti poster eksperimental." },
  { id: "1", name: "Bold Studio", font: "Geist · Black 900", note: "Tebal, rapat, tegas. Pilihan utama gua untuk ZAN: modern dan tetap memberi ruang buat 3D." },
  { id: "2", name: "Race Department", font: "Barlow Condensed · ExtraBold 800", note: "Huruf tinggi, padat, uppercase. Lebih agresif dan dekat dengan karakter livery otomotif." },
  { id: "3", name: "Precision Type", font: "Geist Mono · Bold 700", note: "Monospace dengan ritme mekanis. Terasa teknis, presisi, dan cocok dengan gerakan squeegee." },
  { id: "4", name: "Signature Atelier", font: "Geist 800 + Instrument Serif Italic", note: "Baris pertama tegas, baris kedua mengalir. Lebih artistik untuk arah studio wrapping premium." },
];

export function HeadlineLab({ initial }: { initial: string }) {
  const [selected, setSelected] = useState(options.some(option => option.id === initial) ? initial : "1");
  const option = options.find(item => item.id === selected)!;
  function choose(id: string) {
    setSelected(id);
    window.history.replaceState(null, "", `?type=${id}`);
  }
  return <main className="headline-lab">
    <header className="headline-lab-nav"><a href="/">ZAN<span> / HEADLINE LAB</span></a><span>12 TYPE DIRECTIONS</span></header>
    <PerfectApplyHero typography={selected} />
    <aside className="headline-picker" aria-label="Pilih desain headline">
      <div className="headline-picker-options" role="group" aria-label="Opsi font">
        {options.map(item => <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => choose(item.id)}><small>{item.id.padStart(2, "0")}</small>{item.name}</button>)}
      </div>
      <div className="headline-picker-detail" aria-live="polite"><strong>{option.font}</strong><p>{option.note}</p><span>Ganti opsi langsung tanpa mengulang intro. Light / dark tersedia di hero.</span></div>
    </aside>
  </main>;
}
