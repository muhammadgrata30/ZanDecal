"use client";

import { ArrowUpRight } from "lucide-react";
import { ScrollStage } from "./ScrollStage";
import { Scissors, Trophy, Truck, Sparkles } from "lucide-react";
import studio from "./StudioSections.module.css";
import cinema from "./StickerCinema.module.css";

const STICKER_SERVICES = [
  {
    icon: Scissors,
    title: "Precision Die-Cut Decal",
    badge: "Vector Cutting CNC",
    specCode: "TOLERANCE // Â±0.1MM",
    description:
      "Stiker potongan presisi tanpa background transparan. Sangat cocok untuk logo sponsor, tipografi custom, striping velg, dan nomor start balap.",
    gradient: "from-[#FF9A9E] to-[#A18CD1]",
    points: [
      "Toleransi pemotongan akurat hingga 0.1 mm",
      "Termasuk masking tape transfer siap tempel",
      "Pilihan material: Gloss, Matte, Chrome, Reflective",
    ],
  },
  {
    icon: Trophy,
    title: "Motorsport & Livery Balap",
    badge: "Track & Circuit Grade",
    specCode: "CIRCUIT SPEC // FIA-READY",
    description:
      "Desain grafis livery lengkap untuk mobil balap turing, drift, drag, dan motor sport sirkuit dengan penempatan sponsor aerodinamis.",
    gradient: "from-[#A18CD1] to-[#8FD3F4]",
    points: [
      "Layout disesuaikan regulasi nomor & sponsor kejuaraan",
      "Stiker tahan terhadap oli mesin & suhu panas knalpot",
      "Proses pengerjaan cepat untuk jadwal seri balap",
    ],
  },
  {
    icon: Truck,
    title: "Commercial Fleet Branding",
    badge: "Armada Bisnis",
    specCode: "FLEET SPEC // HEAVY DUTY",
    description:
      "Transformasi visual armada niaga (van, truk box, mobil operasional kantor) menjadi media promosi berjalan yang menarik perhatian publik.",
    gradient: "from-[#8FD3F4] to-[#FF9A9E]",
    points: [
      "Standarisasi identitas visual merk di seluruh armada",
      "Menggunakan cast vinyl tahan cuaca jangka panjang",
      "Layanan pemasangan massal di lokasi pool kendaraan",
    ],
  },
  {
    icon: Sparkles,
    title: "Full Body Wrap",
    badge: "Full Coverage",
    specCode: "WRAP // BODY MAPPING",
    description:
      "Wrapping seluruh bodi mobil dan motor dengan warna pilihan, mengikuti lekukan panel dan karakter kendaraan.",
    gradient: "from-[#FF9A9E] via-[#A18CD1] to-[#8FD3F4]",
    points: [
      "Vinyl elastis mengikuti lekukan panel kendaraan",
      "Lapisan finishing gloss kristal atau ultra-matte",
      "Perlindungan tambahan terhadap benturan kerikil kecil",
    ],
  },
];

export function CustomStickerSection() {
  return <section id="custom-sticker" className={`${studio.custom} ${cinema.section} editorial-custom`} aria-labelledby="sticker-title">
    <ScrollStage className={cinema.scroll} distance={1.4}>
      <div className={cinema.scene}>
        <div className={cinema.lightSweep} aria-hidden="true"/>
        <div className={cinema.orbit} aria-hidden="true"><span/><span/><span/></div>
        <div className={cinema.topline}><span>04 / CUSTOM STICKER</span><span>ZAN DECAL — INDEPENDENT BY DESIGN</span><span className={cinema.registration} aria-hidden="true">＋</span></div>
        <svg className={cinema.contours} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1">{Array.from({length:12},(_,i)=><path key={i} d={`M ${-100+i*28} 950 C ${540+i*22} 600, ${-200+i*45} 260, ${580+i*50} -100 S 1300 0, 1500 280`}/>)}</g></svg>
        <div className={cinema.intro}>
          <span className={cinema.eyebrow}><i/> IDEMU. POTONGANMU. IDENTITASMU.</span>
          <h2 id="sticker-title" className={cinema.headline}><span>BUAT</span><span className={cinema.vinylWord}>JEJAK<span className={cinema.period}>.</span></span></h2>
          <p>Dari satu logo sampai satu set livery.<br/>Kami potong, cetak, dan bentuk<br/>karakter yang cuma punya kamu.</p>
          <a href="#konsultasi" className={cinema.cta}>Rancang stiker kamu <ArrowUpRight size={21}/></a>
        </div>
        <div className={cinema.art} role="img" aria-label="Lembar konsep stiker Zan: nomor balap 27, wordmark Zan, emblem orisinal, dan striping presisi dengan ujung vinyl terkelupas">
          <div className={cinema.sheet}>
            <div className={cinema.sheetHeader}><span>Z/D® — GRAPHIC DEPT.</span><span>COLLECTION 01</span></div>
            <div className={cinema.sheetGrid}>
              <div className={cinema.number}><span>RACE NUMBER / PERSONAL SERIES</span><strong>27</strong><small>MAKE YOUR OWN LINE ↗</small></div>
              <div className={cinema.emblem}><span className={cinema.star}>Z</span><small>ORIGINAL<br/>BY ZAN DECAL</small></div>
              <div className={cinema.wordmark}><strong>ZAN<span>®</span></strong><small>STICK WITH YOUR INSTINCT.</small><i className={cinema.peel}/></div>
              <div className={cinema.stripes}><i/><i/><i/><span>PRECISION / CUT TO FIT</span></div>
              <div className={cinema.oval}><strong>one of one.</strong><span>CUSTOM MADE / NEVER THE SAME</span></div>
              <div className={cinema.mini}><span>YOUR<br/>NEXT<br/><b>MARK.</b></span><ArrowUpRight size={36}/></div>
            </div>
            <div className={cinema.sheetFooter}><span>＋</span><span>DESIGNED TO BE YOURS.</span><span>＋</span></div>
          </div>
          <div className={cinema.artCaption}><div className={cinema.chapter}><span>01 — THE STICKER SHEET</span><span>02 — BREAK THE OUTLINE</span></div><span>DIE-CUT / LETTERING / STRIPING</span></div>
        </div>
        <div className={cinema.sceneFooter}><a href="#sticker-services">SCROLL UNTUK EKSPLORASI <span>↓</span></a><span>ORIGINAL GRAPHICS.<br/>PERSONAL EXPRESSION.</span></div>
        <div className={cinema.progress} aria-hidden="true"><i/></div>
      </div>
    </ScrollStage>
    <div className={cinema.typeBand} aria-hidden="true"><span>YOUR STYLE.</span><span>YOUR <i>SIGNATURE.</i> ↗</span></div>
    <div className="custom-services" id="sticker-services"><div className={studio.serviceIntro}><span className="editorial-kicker">DARI DETAIL SAMPAI TOTAL.</span><h2>Empat cara.<br/><em>Satu karakter.</em></h2><p>Pilih ruang ekspresimu. Kami kerjakan sampai ke detail terakhir.</p></div>
      {STICKER_SERVICES.map((service,index)=><details key={service.title} className="service-item motion-reveal">
        <summary><span>0{index+1}</span><h3>{["Cutting Sticker","Custom Livery","Branding Armada","Full Wrap"][index]}</h3><ArrowUpRight size={18}/></summary>
        <div><p>{service.description}</p><ul>{service.points.map(point=><li key={point}>{point}</li>)}</ul><a className="editorial-link" href="#konsultasi">Konsultasikan kebutuhan ini <ArrowUpRight size={16}/></a></div>
      </details>)}
    </div>
  </section>;
}
