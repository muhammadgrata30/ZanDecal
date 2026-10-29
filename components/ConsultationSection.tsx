"use client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, Clock, MapPin, Phone, ShieldCheck } from "lucide-react";
import { MotionHead, ScrollStage } from "./ScrollStage";
const VEHICLES = ["Mobil Sport / Coupe", "Superbike / Motor Sport", "Sedan / Hatchback", "SUV / Crossover", "Armada Bisnis / Fleet", "Lainnya"];
const SERVICES = ["Full Wrap Livery", "Custom Striping & Racing Decal", "Precision Die-Cut Cutting Sticker", "Paint Protection Film (PPF)"];
const FINISHES = ["Signature Chameleon", "Ultra High-Gloss", "Satin Stealth Matte", "Prismatic Holo"];
export function ConsultationSection() {
  const [vehicleType, setVehicleType] = useState(VEHICLES[0]);
  const [services, setServices] = useState([SERVICES[0]]);
  const [finishType, setFinishType] = useState(FINISHES[0]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!services.length) return;
    const message = ["Halo Studio Zan Decal, saya ingin konsultasi custom decal:",
      `- Tipe Kendaraan: ${vehicleType}`, `- Merek / Model / Tahun: ${[make, model, year].filter(Boolean).join(" / ") || "Belum ditentukan"}`,
      `- Layanan: ${services.join(", ")}`, `- Finishing: ${finishType}`, `- Catatan: ${notes || "Belum ada catatan khusus"}`].join("\n");
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setIsSubmitted(true);
  };
  return <section id="konsultasi" className="editorial-consultation">
    <ScrollStage distance={.55} className="consultation-stage"><div className="consultation-hero">
      <div className="consultation-hero-copy"><span className="editorial-kicker">07 / KOMISI BARU</span>
        <MotionHead className="consultation-headline"><span>WARNA</span><span>PUNYA</span><span>SUARA<span className="headline-period">.</span></span></MotionHead>
        <p>LEBIH DARI WARNA.<br/>INI CARA ANDA DIDENGAR.</p>
      </div><div className="consultation-art"><Image src="/images/consultation-vinyl.png" alt="Lembaran vinyl lavender dengan refleksi mobil sport hitam" fill sizes="(max-width:760px) 100vw, 65vw"/></div>
      <span className="consultation-side-note">IDE<br/>MATERIAL<br/>TEKNIK<br/>KARAKTER<br/>DI JALAN.</span>
    </div></ScrollStage>
    <form onSubmit={handleSubmit} className="consultation-form">
      <div className="consultation-form-title"><span className="editorial-kicker">KONSULTASI</span><h3>MULAI<br/>PROYEK<br/>KAMU.</h3><p>Ceritakan kendaraan, pilih layanan, dan bagikan ide. Kita susun arah desainnya bersama.</p></div>
      <fieldset><legend><span>01</span> Kendaraan</legend><p className="field-hint">PILIH JENIS DAN DETAIL KENDARAAN</p>
        <label className="sr-only" htmlFor="consult-vehicle">Jenis kendaraan</label><select id="consult-vehicle" value={vehicleType} onChange={event=>{setVehicleType(event.target.value);setIsSubmitted(false);}}>{VEHICLES.map(item=><option key={item}>{item}</option>)}</select>
        <label className="sr-only" htmlFor="consult-make">Merek kendaraan</label><input id="consult-make" value={make} onChange={event=>setMake(event.target.value)} placeholder="Merek" maxLength={80}/>
        <label className="sr-only" htmlFor="consult-model">Model kendaraan</label><input id="consult-model" value={model} onChange={event=>setModel(event.target.value)} placeholder="Model" maxLength={80}/>
        <label className="sr-only" htmlFor="consult-year">Tahun kendaraan</label><input id="consult-year" value={year} onChange={event=>setYear(event.target.value)} placeholder="Tahun" inputMode="numeric" pattern="[0-9]{4}" title="Masukkan tahun dalam empat angka" maxLength={4}/>
      </fieldset>
      <fieldset><legend><span>02</span> Layanan</legend><p className="field-hint">PILIH LAYANAN YANG DIINGINKAN</p>
        {SERVICES.map(item=><label className="service-checkbox" key={item}><input type="checkbox" checked={services.includes(item)} onChange={event=>{setServices(current=>event.target.checked?[...current,item]:current.filter(service=>service!==item));setIsSubmitted(false);}}/>{item}</label>)}
        <label className="finish-label" htmlFor="consult-finish">Karakter finishing</label><select id="consult-finish" value={finishType} onChange={event=>setFinishType(event.target.value)}>{FINISHES.map(item=><option key={item}>{item}</option>)}</select>
        {!services.length&&<p className="field-error" role="status">Pilih minimal satu layanan.</p>}
      </fieldset>
      <fieldset className="consultation-notes"><legend><span>03</span> Ceritakan ide</legend><label className="field-hint" htmlFor="consult-notes">JELASKAN KONSEP, REFERENSI, ATAU PERTANYAAN</label>
        <textarea id="consult-notes" value={notes} onChange={event=>{setNotes(event.target.value);setIsSubmitted(false);}} placeholder="Tulis ide, gaya, referensi, atau pertanyaan kamu di sini…" rows={5} maxLength={1000}/><small className="note-count">{notes.length}/1000</small>
        <button type="submit" disabled={!services.length} className="consultation-submit">MULAI PROYEK <ArrowUpRight size={24}/></button><p className="submit-caption">Brief dibuka di WhatsApp. Kirim setelah Anda meninjaunya.</p>
        {isSubmitted&&<p className="submit-status" role="status"><CheckCircle2 size={16}/> Tautan konsultasi WhatsApp telah dibuka.</p>}
      </fieldset>
    </form>
    <details className="consultation-studio"><summary>Informasi studio & standar pengerjaan <ArrowUpRight size={16}/></summary><div>
      <p><MapPin size={18}/><span><strong>Studio & Clean Room</strong>Jl. Otomotif Raya No. 88, Kawasan Modifikasi Terpadu, Jakarta / Tangerang</span></p>
      <p><Clock size={18}/><span><strong>Jam operasional</strong>Senin–Sabtu, 09:00–18:00 WIB. Instalasi berdasarkan reservasi.</span></p>
      <p><Phone size={18}/><span><strong>Direct contact</strong><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">+62 812-3456-7890</a><br/><a href="mailto:studio@zandecal.id">studio@zandecal.id</a></span></p>
      <p><ShieldCheck size={18}/><span><strong>Standar keamanan & mutu</strong>Ruang instalasi tertutup ber-AC, teknik knifeless tape untuk menjaga cat, dan heat gun thermal profiling pada lekukan panel.</span></p>
    </div></details>
  </section>;
}
