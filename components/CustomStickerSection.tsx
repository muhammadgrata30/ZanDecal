"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { MotionHead, ScrollStage } from "./ScrollStage";
import { Scissors, Trophy, Truck, Sparkles } from "lucide-react";

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
  return <section id="custom-sticker" className="editorial-custom">
    <ScrollStage className="vehicle-stage" distance={3.2}>
      <div className="custom-scene">
        <div className="custom-copy"><span className="editorial-kicker">04 / CUSTOM STICKER</span>
          <MotionHead><span><i>Karakter</i> baru.</span><span>Standar yang sama.</span></MotionHead>
          <p>Premium automotive wrap untuk kendaraan yang lebih personal. Pilih warna, eksplorasi desain, dan wujudkan karakter baru bersama Zan Decal.</p>
          <a href="#konsultasi" className="editorial-link">Rancang livery Anda <ArrowUpRight size={18}/></a>
        </div>
        <div className="vehicle-runway" aria-label="Eksplorasi wrapping motor dan mobil">
          <div className="vehicle-motor"><Image src="/images/sticker-r6-blue.png" alt="Yamaha YZF-R6 dengan livery sky blue dan hitam" fill sizes="94vw"/></div>
          <div className="vehicle-car"><Image src="/images/sticker-ferrari-pink.png" alt="Ferrari 488 GTB dengan wrapping soft pink dan hitam" fill sizes="94vw"/></div>
        </div><span className="scene-caption">DETAIL YANG<br/>MEMBENTUK KARAKTER.</span>
        <div className="scene-progress" aria-hidden="true"><span/></div>
      </div>
    </ScrollStage>
    <div className="custom-services"><span className="editorial-kicker">LAYANAN KAMI</span>
      {STICKER_SERVICES.map((service,index)=><details key={service.title} className="service-item motion-reveal">
        <summary><span>0{index+1}</span><h3>{["Cutting Sticker","Custom Livery","Branding Armada","Full Wrap"][index]}</h3><ArrowUpRight size={18}/></summary>
        <div><p>{service.description}</p><ul>{service.points.map(point=><li key={point}>{point}</li>)}</ul><a className="editorial-link" href="#konsultasi">Konsultasikan kebutuhan ini <ArrowUpRight size={16}/></a></div>
      </details>)}
    </div>
  </section>;
}
