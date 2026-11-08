"use client";
import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, Clock, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useSelectedSectionMotion } from "./experience/useSelectedSectionMotion";
import "./experience/selected-sections.css";
import { HoverDetails } from "./HoverDetails";
const VEHICLES = ["Mobil Sport / Coupe", "Superbike / Motor Sport", "Sedan / Hatchback", "SUV / Crossover", "Armada Bisnis / Fleet", "Lainnya"];
const SERVICES = ["Full Wrap Livery", "Custom Striping & Racing Decal", "Precision Die-Cut Cutting Sticker", "Paint Protection Film (PPF)"];
const FINISHES = ["Signature Chameleon", "Ultra High-Gloss", "Satin Stealth Matte", "Prismatic Holo"];
export function ConsultationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSelectedSectionMotion(sectionRef, "commission");
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
  return <section ref={sectionRef} id="konsultasi" className="commission-live" aria-labelledby="manifesto-title">
    
    <div className="manifesto-lead" id="komisi-visual">
      <div className="manifesto-image-wrap"><Image className="manifesto-image" src="/images/consultation-vinyl.lossless.webp" alt="Lembaran vinyl lavender dengan refleksi mobil sport hitam" fill sizes="100vw"/></div>
      <div className="manifesto-copy"><h2 id="manifesto-title"><span className="selected-motion-line"><span className="selected-motion-word">WARNA PUNYA</span></span><span className="selected-motion-line"><span className="selected-motion-word">SUARA.</span></span></h2></div>
      
      
    </div>
    <div className="manifesto-process">
      <article><h3>Ceritakan kendaraan</h3><p>Model, pemakaian, dan karakter yang kamu cari.</p></article>
      <article><h3>Susun arah desain</h3><p>Layanan, bahan, warna, serta referensi visual.</p></article>
      <article><h3>Tinjau bersama</h3><p>Periksa brief sebelum menghubungi studio.</p></article>
    </div>
    <form onSubmit={handleSubmit} className="consultation-form manifesto-form">
      <div className="consultation-form-title"><h3>MULAI DARI<br/>KENDARAANMU.</h3></div>
      <fieldset><legend>Kendaraan</legend>
        <label className="form-field-label" htmlFor="consult-vehicle">Jenis kendaraan</label><select id="consult-vehicle" value={vehicleType} onChange={event=>{setVehicleType(event.target.value);setIsSubmitted(false);}}>{VEHICLES.map(item=><option key={item}>{item}</option>)}</select>
        <label className="form-field-label" htmlFor="consult-make">Merek</label><input id="consult-make" value={make} onChange={event=>{setMake(event.target.value);setIsSubmitted(false);}} placeholder="Contoh: Ducati" maxLength={80}/>
        <label className="form-field-label" htmlFor="consult-model">Model</label><input id="consult-model" value={model} onChange={event=>{setModel(event.target.value);setIsSubmitted(false);}} placeholder="Contoh: Streetfighter V4 S" maxLength={80}/>
        <label className="form-field-label" htmlFor="consult-year">Tahun <span>(opsional)</span></label><input id="consult-year" value={year} onChange={event=>{setYear(event.target.value);setIsSubmitted(false);}} placeholder="Contoh: 2024" inputMode="numeric" pattern="[0-9]{4}" title="Masukkan tahun dalam empat angka" maxLength={4}/>
      </fieldset>
      <fieldset><legend>Layanan</legend>
        {SERVICES.map(item=><label className="service-checkbox" key={item}><input type="checkbox" checked={services.includes(item)} onChange={event=>{setServices(current=>event.target.checked?[...current,item]:current.filter(service=>service!==item));setIsSubmitted(false);}}/>{item}</label>)}
        <label className="finish-label" htmlFor="consult-finish">Karakter finishing</label><select id="consult-finish" value={finishType} onChange={event=>{setFinishType(event.target.value);setIsSubmitted(false);}}>{FINISHES.map(item=><option key={item}>{item}</option>)}</select>
        {!services.length&&<p className="field-error" role="status">Pilih minimal satu layanan.</p>}
      </fieldset>
      <fieldset className="consultation-notes"><legend>Ceritakan ide</legend><label className="form-field-label" htmlFor="consult-notes">Konsep, referensi, atau pertanyaan</label><p className="field-hint">Belum punya referensi? Ceritakan kesan yang ingin kamu tampilkan.</p>
        <textarea id="consult-notes" value={notes} onChange={event=>{setNotes(event.target.value);setIsSubmitted(false);}} placeholder="Tulis ide, gaya, referensi, atau pertanyaan kamu di sini…" rows={5} maxLength={1000}/><small className="note-count">{notes.length}/1000</small>
        <button type="submit" disabled={!services.length} className="consultation-submit">MULAI PROYEK <ArrowUpRight size={24}/></button><p className="submit-caption">Brief dibuka di WhatsApp. Kirim setelah Anda meninjaunya.</p>
        {isSubmitted&&<p className="submit-status" role="status"><CheckCircle2 size={16}/> Tautan konsultasi WhatsApp telah dibuka.</p>}
      </fieldset>
      <div className="manifesto-brief-summary"><span>RINGKASAN PILIHAN</span><p><strong>{vehicleType}</strong><span>{services.length} layanan dipilih</span><span>{finishType}</span></p></div>
    </form>
    <HoverDetails className="consultation-studio"><summary>Informasi studio & standar pengerjaan <ArrowUpRight size={16}/></summary><div>
      <p><MapPin size={18}/><span><strong>Studio & Clean Room</strong>Jl. Otomotif Raya No. 88, Kawasan Modifikasi Terpadu, Jakarta / Tangerang</span></p>
      <p><Clock size={18}/><span><strong>Jam operasional</strong>Senin–Sabtu, 09:00–18:00 WIB. Instalasi berdasarkan reservasi.</span></p>
      <p><Phone size={18}/><span><strong>Direct contact</strong><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">+62 812-3456-7890</a><br/><a href="mailto:studio@zandecal.id">studio@zandecal.id</a></span></p>
      <p><ShieldCheck size={18}/><span><strong>Standar keamanan & mutu</strong>Ruang instalasi tertutup ber-AC, teknik knifeless tape untuk menjaga cat, dan heat gun thermal profiling pada lekukan panel.</span></p>
    </div></HoverDetails>
  </section>;
}
