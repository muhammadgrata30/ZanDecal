"use client";

import React, { useState } from "react";
import { Palette, MessageSquare, Printer, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { MotionHead, ScrollStage } from "./ScrollStage";

interface StepDetail {
  number: string;
  id: number;
  title: string;
  shortTitle: string;
  icon: React.ElementType;
  badge: string;
  stationCode: string;
  duration: string;
  description: string;
  checklist: string[];
  tips: string;
  ctaText: string;
  ctaHref: string;
}

const ORDER_STEPS: StepDetail[] = [
  {
    number: "01",
    id: 1,
    title: "Pilih / Eksplorasi Desain 3D",
    shortTitle: "Pilih Desain",
    icon: Palette,
    badge: "Tahap 1: Eksplorasi & Ideasi",
    stationCode: "STATION 01 // DIGITAL TWIN 3D MAPPING",
    duration: "Instan di Website",
    description:
      "Gunakan fitur 3D Visualizer interaktif Zan Decal untuk memutar siluet mobil BYD Seal 6 atau Motor Sport. Eksplorasi perpaduan warna gradien unik atau solid, serta tentukan karakter finishing Glossy, Matte, atau Satin. Anda juga dapat membawa konsep sketsa livery sendiri.",
    checklist: [
      "Pilih model kendaraan (Mobil / Motor / Custom)",
      "Pilih tema warna gradien atau solid",
      "Tentukan jenis finishing (Glossy, Matte, Satin)",
      "Simpan tangkapan layar atau kode preset 3D",
    ],
    tips: "Gunakan pencahayaan studio di 3D visualizer untuk melihat karakter pantulan cat dari berbagai sudut.",
    ctaText: "Buka 3D Visualizer",
    ctaHref: "#3d-studio",
  },
  {
    number: "02",
    id: 2,
    title: "Konsultasi WhatsApp & Mockup 3D",
    shortTitle: "Konsultasi WA",
    icon: MessageSquare,
    badge: "Tahap 2: Diskusi 1-on-1",
    stationCode: "STATION 02 // 1-ON-1 ATELIER DESK",
    duration: "1 - 2 Jam Respon Cepat",
    description:
      "Kirimkan hasil rancangan 3D atau ide livery Anda langsung ke tim WhatsApp Studio Zan Decal. Tim desainer profesional kami akan memverifikasi lekukan bodi kendaraan nyata Anda, merekomendasikan bahan terbaik (Oracal, Maxdecal, TeckWrap), dan menerbitkan digital mockup final sebelum diproduksi.",
    checklist: [
      "Diskusi 1-on-1 bersama lead automotive designer",
      "Kirim foto detail kondisi kendaraan saat ini",
      "Persetujuan digital mockup proporsional skala 1:1",
      "Penjadwalan hari instalasi di studio",
    ],
    tips: "Konsultasikan juga jika ada bagian kendaraan yang memerlukan perlindungan ekstra seperti PPF pada spion atau kap mesin.",
    ctaText: "Mulai Chat Konsultasi WA",
    ctaHref: "#konsultasi",
  },
  {
    number: "03",
    id: 3,
    title: "Produksi Presisi & Quality Check",
    shortTitle: "Produksi CNC",
    icon: Printer,
    badge: "Tahap 3: Pemotongan & Cetak",
    stationCode: "STATION 03 // CNC PLOTTER ±0.1MM",
    duration: "1 - 2 Hari Kerja",
    description:
      "Desain yang telah disetujui diproses menggunakan mesin cutting plotter CNC presisi tinggi dengan toleransi mikron dan mesin cetak tinta UV outdoor yang tahan cuaca tropis. Setiap lembar stiker dilapisi transfer tape khusus untuk memastikan peletakan garis decal yang lurus sempurna.",
    checklist: [
      "Pemotongan pisau CNC computer-guided tanpa cacat",
      "Pencetakan tinta outdoor solvent tahan cuaca & UV",
      "Pemeriksaan ketajaman kontur dan kelenturan bahan",
      "Pemberian lapisan transfer masking tape siap pasang",
    ],
    tips: "Setiap batch produksi melewati 3 tahapan inspeksi visual di bawah lampu inspeksi permukaan otomotif.",
    ctaText: "Pelajari Material Bahan",
    ctaHref: "#material",
  },
  {
    number: "04",
    id: 4,
    title: "Pemasangan Profesional di Clean Room",
    shortTitle: "Pemasangan Studio",
    icon: ShieldCheck,
    badge: "Tahap 4: Instalasi & Garansi",
    stationCode: "STATION 04 // VIP CLEAN ROOM ATELIER",
    duration: "1 Hari Pengerjaan",
    description:
      "Kendaraan Anda ditangani di Clean Room Studio ber-AC yang bebas debu dan terkontrol suhunya. Teknisi berlisensi kami menerapkan teknik knifeless tape (tanpa pisau pada cat mobil) dan heat-gun thermal profile agar stiker mengunci sempurna di lekukan tajam, diakhiri dengan serah terima kartu garansi resmi.",
    checklist: [
      "Pembersihan bodi deep-cleansing & clay bar",
      "Aplikasi di Clean Room berfilter partikel mikro",
      "Teknik Knifeless Tape 100% aman bagi cat orisinil",
      "Penerbitan kartu garansi resmi studio Zan Decal",
    ],
    tips: "Setelah pemasangan, teknisi kami akan memberikan panduan perawatan mudah agar kilap stiker awet bertahun-tahun.",
    ctaText: "Lihat Galeri Hasil Pemasangan",
    ctaHref: "#galeri",
  },
];

export function WorkflowSection() {
  const [activeStep,setActiveStep]=useState(1);
  const current=ORDER_STEPS[activeStep-1];
  return <section id="cara-order" className="editorial-workflow">
    <ScrollStage distance={.95} className="workflow-stage">
      <div className="workflow-layout">
        <div className="workflow-copy"><span className="editorial-kicker">06 / CARA ORDER</span>
          <MotionHead><span><i>Dirancang</i> bersama.</span><span>Dikerjakan presisi.</span></MotionHead>
          <p>Dari ide sederhana hingga hasil akhir yang menonjol. Kami mendampingi setiap proses dengan detail dan standar kerja yang konsisten.</p>
          <div className="workflow-counter" aria-hidden="true"><span>0{activeStep}</span><small>/ 04<br/>TAHAP PENGERJAAN</small></div>
        </div>
        <div className="workflow-steps">
          {ORDER_STEPS.map((step,index)=><div className={activeStep===step.id?"workflow-row is-active":"workflow-row"} key={step.id}>
            <button type="button" onClick={()=>setActiveStep(step.id)} aria-expanded={activeStep===step.id} aria-controls={"order-panel-"+step.id}>
              <span>{step.number}</span><div><h3>{["Konsultasi & eksplorasi","Mockup","Produksi","Pemasangan"][index]}</h3><p>{["Diskusikan ide, kebutuhan, dan referensi Anda.","Visualisasi desain sebelum diproduksi.","Pengerjaan presisi dengan material premium.","Hasil rapi oleh tim berpengalaman."][index]}</p></div><ArrowRight size={20}/>
            </button>
            {activeStep===step.id&&<div className="workflow-panel" id={"order-panel-"+step.id}>
              <p>{current.description}</p><ul>{current.checklist.map(item=><li key={item}>{item}</li>)}</ul>
              <p className="workflow-tip"><strong>Tips studio.</strong> {current.tips}</p><small>Estimasi: {current.duration}</small>
              <a href={current.ctaHref} className="editorial-link">{current.ctaText}<ArrowRight size={16}/></a>
            </div>}
          </div>)}
          <div className="workflow-nav"><button type="button" disabled={activeStep===1} onClick={()=>setActiveStep(step=>step-1)}><ChevronLeft size={16}/> Sebelumnya</button><button type="button" disabled={activeStep===4} onClick={()=>setActiveStep(step=>step+1)}>Selanjutnya <ChevronRight size={16}/></button></div>
        </div>
      </div>
    </ScrollStage>
    <div className="workflow-image motion-reveal"><Image src="/images/workflow-install.png" alt="Teknisi merapikan vinyl lavender pada panel mobil menggunakan squeegee" fill sizes="100vw"/><span>KETELITIAN<br/>DI SETIAP LAPISAN.</span></div>
  </section>;
}
