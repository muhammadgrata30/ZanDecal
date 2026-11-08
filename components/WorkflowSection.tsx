"use client";

import React, { useRef, useState, type CSSProperties } from "react";
import { Palette, MessageSquare, Printer, ShieldCheck, ArrowUpRight, Check, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import process from "./OrderProcess.module.css";
import { HoverDetails } from "./HoverDetails";

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
      "Eksplorasi warna utama dan finishing Glossy, Matte, Satin, atau Metallic pada Ducati di studio 3D. Untuk konsep pada kendaraan lain, siapkan foto kendaraan dan referensi livery yang kamu suka. Ide awal ini menjadi bahan diskusi bersama tim studio.",
    checklist: [
      "Siapkan model dan foto kendaraan yang ingin dikerjakan",
      "Pilih arah warna utama dan referensi kombinasinya",
      "Tentukan jenis finishing (Glossy, Matte, Satin)",
      "Simpan tangkapan layar warna dan finishing pilihan",
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
  const [prepared,setPrepared]=useState<number[]>([]);
  const tabs=useRef<(HTMLButtonElement|null)[]>([]);
  const stageNames=["Eksplorasi","Konsultasi & mockup","Produksi","Pemasangan"];
  const outcomes=["Arah desain & pilihan finishing","Mockup yang disepakati bersama","Decal siap untuk diaplikasikan","Hasil akhir & panduan perawatan"];
  return <section id="cara-order" className={`${process.section} editorial-workflow`} aria-labelledby="order-title">
      <div className={process.hero}>
        
        <div className={process.heroCopy}><h2 id="order-title"><span>DARI IDE.</span><span><em>Ke jalan.</em><ArrowUpRight aria-hidden="true"/></span></h2><a href="#order-stations">Lihat prosesnya <span>↓</span></a></div>
        <div className={process.heroImage}><Image src="/images/workflow-install.lossless.webp" alt="Detail pengerjaan vinyl lavender oleh teknisi studio" width={1536} height={1024} sizes="(max-width:760px) 88vw, 44vw"/></div>
        
        <div className={process.scrollLine} aria-hidden="true"><i/></div>
      </div>
    <div className={process.workspace} id="order-stations" style={{"--order-progress":activeStep/4} as CSSProperties}>
      <div className={process.workspaceHeading}><span aria-live="polite">{stageNames[activeStep-1]}</span></div>
      <div className={process.tabs} role="tablist" aria-label="Tahap pemesanan">
        {ORDER_STEPS.map((step,index)=><button ref={node=>{tabs.current[index]=node;}} key={step.id} type="button" role="tab" id={`order-tab-${step.id}`} aria-controls={`order-panel-${step.id}`} aria-selected={activeStep===step.id} tabIndex={activeStep===step.id?0:-1} onPointerEnter={event=>{if(event.pointerType==="mouse"&&matchMedia("(hover:hover) and (pointer:fine)").matches)setActiveStep(step.id);}} onClick={()=>setActiveStep(step.id)} onKeyDown={event=>{
          let next=index;
          if(event.key==="ArrowRight") next=(index+1)%4;
          else if(event.key==="ArrowLeft") next=(index+3)%4;
          else if(event.key==="Home") next=0;
          else if(event.key==="End") next=3;
          else return;
          event.preventDefault();setActiveStep(next+1);tabs.current[next]?.focus();
        }}><span><step.icon size={19}/></span><strong>{stageNames[index]}</strong><small>{["Cari karakter.","Matangkan arah.","Wujudkan detail.","Siap jadi milikmu."][index]}</small></button>)}
      </div>
      <div className={process.stationProgress} aria-hidden="true"><i/></div>
      {ORDER_STEPS.map((step,index)=><article key={step.id} role="tabpanel" id={`order-panel-${step.id}`} aria-labelledby={`order-tab-${step.id}`} hidden={activeStep!==step.id} tabIndex={0} className={process.panel}>
        <div className={process.ticket}><div className={process.ticketLabel}><span>STUDIO ROUTE</span><step.icon size={20}/></div><h3>{stageNames[index]}</h3><div className={process.output}><span>HASIL TAHAP INI</span><p>{outcomes[index]}</p></div></div>
        <div className={process.detail}><div className={process.detailTop}><span className={process.eyebrow}>{step.badge}</span><span>ESTIMASI AWAL / {step.duration}</span></div><h3>{["Temukan karaktermu.","Lihat sebelum dibuat.","Dibentuk dengan presisi.","Detail terakhir. Kesan pertama."][index]}</h3><p>{step.description}</p><ul>{step.checklist.map(item=><li key={item}><Check size={15}/><span>{item}</span></li>)}</ul><aside className={process.tip}><span>CATATAN STUDIO ↗</span><p>{step.tips}</p></aside><a href={step.ctaHref} className={process.stepCta}>{step.ctaText}<ArrowUpRight size={21}/></a></div>
      </article>)}
      <div className={process.navigation}><p>Estimasi mengikuti lingkup proyek, ketersediaan bahan, dan jadwal studio. Tim mengonfirmasi detail saat konsultasi.</p><div><button type="button" disabled={activeStep===1} onClick={()=>setActiveStep(step=>step-1)}><ChevronLeft size={18}/> Sebelumnya</button><button type="button" disabled={activeStep===4} onClick={()=>setActiveStep(step=>step+1)}>Selanjutnya <ChevronRight size={18}/></button></div></div>
    </div>
    <div className={process.preparation}>
      <div className={process.workshop}><Image src="/images/workflow-install.lossless.webp" alt="Teknisi merapikan vinyl lavender pada panel mobil menggunakan squeegee" width={1536} height={1024} sizes="(max-width:760px) 100vw, 50vw"/><div><strong>Ketelitian.<br/><em>Di setiap lapisan.</em></strong></div></div>
      <div className={process.brief}><span className={process.eyebrow}>SEBELUM MULAI / YOUR FIRST BRIEF</span><h2>Ide belum utuh?<br/><em>Tetap bisa mulai.</em></h2><p>Siapkan yang sudah ada. Tiga hal ini membantu tim memahami kebutuhanmu; sisanya bisa kita diskusikan.</p><fieldset><legend>Checklist persiapan konsultasi</legend>{["Foto kendaraan & detail modelnya","Referensi visual atau gambaran gaya","Warna & finishing yang menarik buatmu"].map((label,index)=><label key={label}><input type="checkbox" checked={prepared.includes(index)} onChange={event=>setPrepared(current=>event.target.checked?[...current,index]:current.filter(item=>item!==index))}/><span>{label}</span><Check aria-hidden="true" size={17}/></label>)}</fieldset><div className={process.briefProgress}><span role="status">{prepared.length}/3 referensi siap</span><span>CHECKLIST PRIBADI</span></div><a href="#konsultasi">Ceritakan idemu <ArrowUpRight size={24}/></a><small>Tidak perlu mencentang semuanya untuk konsultasi.</small></div>
    </div>
    <div className={process.faq}><div><span className={process.eyebrow}>SEBELUM KAMU BERTANYA</span><h2>Biar <em>jelas.</em></h2></div><div>{[
      ["Belum punya desain, bisa konsultasi?","Bisa. Bawa foto kendaraan dan referensi yang kamu suka. Tim membantu menyusun arah desain, warna, dan pilihan finishing bersama kamu."],
      ["Kapan desain mulai diproduksi?","Alurnya dimulai dari eksplorasi dan konsultasi. Mockup dibahas serta disepakati terlebih dahulu sebelum masuk ke tahap produksi."],
      ["Bagaimana menentukan biaya dan jadwal?","Sampaikan model kendaraan, jenis layanan, area yang ingin dikerjakan, dan pilihan material. Tim mengonfirmasi biaya serta jadwal berdasarkan lingkup proyek saat konsultasi."]
    ].map(([question,answer],index)=><HoverDetails key={question} group="order-faq"><summary><span>0{index+1}</span><h3>{question}</h3><Plus size={19}/></summary><p>{answer}</p></HoverDetails>)}</div></div>
  </section>;
}
