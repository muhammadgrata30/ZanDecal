"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import styles from "./ConsultationSection.module.css";

const VEHICLES = ["Mobil", "Motor", "Armada"];
const SERVICES = ["Custom decal & livery", "Full body wrap", "Cutting sticker", "Paint Protection Film (PPF)", "Belum tahu, diskusikan dulu"];
const FINISHES = ["Gloss", "Satin", "Matte"];
const QUESTIONS = [
  ["Belum punya desain. Bisa mulai?", "Bisa. Bawa foto kendaraan dan referensi yang kamu suka, atau ceritakan kesan yang kamu cari. Arah desain, warna, dan finishing dibahas bersama."],
  ["Bisa lihat mockup sebelum produksi?", "Ya. Mockup dibahas dan disepakati terlebih dahulu sebelum masuk ke tahap produksi. Detail revisi mengikuti lingkup proyek yang dikonfirmasi saat konsultasi."],
  ["Berapa biaya dan waktu pengerjaannya?", "Biaya dan jadwal mengikuti model kendaraan, luas area aplikasi, kompleksitas desain, pilihan material, dan ketersediaan studio. Tim mengonfirmasi setelah brief ditinjau."],
  ["Apa yang perlu disiapkan?", "Foto kendaraan dari beberapa sisi, model kendaraan, referensi visual jika ada, dan pilihan warna atau finishing yang menarik buatmu. Tidak perlu lengkap untuk memulai."],
];

export function ConsultationSection() {
  const root = useRef<HTMLElement>(null);
  const review = useRef<HTMLDivElement>(null);
  const vehicleInput = useRef<HTMLInputElement>(null);
  const previousReviewing = useRef(false);
  const faqHoverTimer = useRef<number | null>(null);
  const refreshMotion = useRef<() => void>(() => {});
  const [vehicleType, setVehicleType] = useState(VEHICLES[0]);
  const [vehicle, setVehicle] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [finish, setFinish] = useState(FINISHES[0]);
  const [notes, setNotes] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => () => {
    if (faqHoverTimer.current !== null) window.clearTimeout(faqHoverTimer.current);
  }, []);

  useEffect(() => { refreshMotion.current(); }, [activeFaq]);

  const cancelFaqHover = () => {
    if (faqHoverTimer.current !== null) window.clearTimeout(faqHoverTimer.current);
    faqHoverTimer.current = null;
  };

  useEffect(() => {
    const section = root.current;
    if (!section) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    async function mount() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia(section!);
      media.add("(prefers-reduced-motion: no-preference)", () => {
        section!.querySelectorAll<HTMLElement>("[data-consult-title]").forEach(heading => {
          gsap.fromTo(heading.querySelectorAll("[data-consult-word]"), { yPercent: 115 }, {
            yPercent: 0, stagger: .1, ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 94%", end: "top 45%", scrub: .7 },
          });
        });
        const visual = section!.querySelector(`.${styles.visual}`);
        gsap.fromTo(visual, { clipPath: "inset(8% 10% 8% 0%)" }, {
          clipPath: "inset(0% 0% 0% 0%)", ease: "none",
          scrollTrigger: { trigger: visual, start: "top 95%", end: "top 35%", scrub: .8 },
        });
        gsap.fromTo(section!.querySelector(`.${styles.photo}`), { scale: 1.12, yPercent: -4 }, {
          scale: 1.03, yPercent: 4, ease: "none",
          scrollTrigger: { trigger: visual, start: "top bottom", end: "bottom top", scrub: .7 },
        });
        section!.querySelectorAll("fieldset").forEach(field => gsap.from(field, {
          y: 25, duration: .7, ease: "power3.out", scrollTrigger: { trigger: field, start: "top 92%", once: true },
        }));
      });
      let frame = 0;
      const refresh = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); });
      };
      refreshMotion.current = refresh;
      section!.addEventListener("load", refresh, true);
      cleanup = () => { cancelAnimationFrame(frame); section!.removeEventListener("load", refresh, true); media.revert(); };
      await document.fonts.ready;
      if (!disposed) refresh();
    }
    void mount().catch(error => console.warn("Consultation motion unavailable", error));
    return () => { disposed = true; refreshMotion.current = () => {}; cleanup?.(); };
  }, []);

  useEffect(() => {
    refreshMotion.current();
    if (reviewing) review.current?.focus({ preventScroll: true });
    else if (previousReviewing.current) vehicleInput.current?.focus({ preventScroll: true });
    previousReviewing.current = reviewing;
  }, [reviewing]);

  const message = [
    "Halo Studio Zan Decal, saya ingin konsultasi custom decal:",
    `- Jenis kendaraan: ${vehicleType}`, `- Merek & model: ${vehicle.trim()}`,
    `- Layanan: ${service}`, `- Finishing: ${finish}`,
    `- Catatan: ${notes.trim() || "Belum ada catatan khusus"}`,
  ].join("\n");
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setReviewing(true); };

  return <section ref={root} id="konsultasi" className={styles.section} aria-labelledby="manifesto-title">
    <div className={styles.consult}>
      <div className={styles.lead} id="komisi-visual">
        <span className={styles.eyebrow}>KONSULTASI CUSTOM</span>
        <h2 id="manifesto-title" className={styles.title} data-consult-title>
          <span className={styles.wordClip}><span data-consult-word>PUNYA IDE?</span></span>
          <span className={styles.wordClip}><em data-consult-word>Keluarkan.</em></span>
        </h2>
        <p className={styles.intro}>Mulai dari kendaraanmu, lalu kita cari karakter yang terasa milikmu.</p>
        <figure className={styles.visual}>
          <Image className={styles.photo} src="/images/consultation-panamera.webp" alt="Porsche Panamera hitam di jalan sebagai referensi visual konsultasi custom" fill sizes="(max-width:900px) 86vw, 40vw"/>
          <span className={styles.photoType}>BUKAN SEKADAR<br/>GANTI WARNA.</span>
          <figcaption className={styles.photoCaption}>Ilustrasi visual, bukan portofolio studio.</figcaption>
        </figure>
      </div>
      <div className={styles.paper}>
        <div className={styles.paperHeading}><strong>ZAN / BRIEF</strong><span>KONSULTASI CUSTOM</span></div>
        <form onSubmit={handleSubmit} hidden={reviewing} className={styles.form}>
          <fieldset><legend><span>01</span> Kendaraanmu</legend>
            <div className={styles.vehicleOptions} role="group" aria-label="Jenis kendaraan">{VEHICLES.map(item => <button type="button" key={item} aria-pressed={vehicleType === item} onClick={() => setVehicleType(item)}>{item}<ArrowUpRight size={16} aria-hidden="true"/></button>)}</div>
            <label className={styles.field} htmlFor="consult-model">Merek & model<input ref={vehicleInput} id="consult-model" name="vehicle" value={vehicle} onChange={event => setVehicle(event.target.value)} placeholder="Contoh: Honda Civic, Yamaha R25" maxLength={100} required/></label>
          </fieldset>
          <fieldset><legend><span>02</span> Arah yang kamu cari</legend>
            <label className={styles.field} htmlFor="consult-service">Layanan<select id="consult-service" value={service} onChange={event => setService(event.target.value)}>{SERVICES.map(item => <option key={item}>{item}</option>)}</select></label>
            <div className={styles.finishOptions} role="group" aria-label="Finishing">{FINISHES.map(item => <button type="button" key={item} aria-pressed={finish === item} onClick={() => setFinish(item)}>{item}</button>)}</div>
          </fieldset>
          <fieldset><legend><span>03</span> Sedikit tentang idemu</legend>
            <label className={styles.field} htmlFor="consult-notes">Referensi, warna, atau kesan yang kamu inginkan<textarea id="consult-notes" value={notes} onChange={event => setNotes(event.target.value)} rows={3} maxLength={1000} placeholder="Gaya, referensi, atau pertanyaan kamu…"/></label>
          </fieldset>
          <button type="submit" className={styles.submit}>TINJAU BRIEF <ArrowUpRight size={24} aria-hidden="true"/></button>
          <p className={styles.formNote}>Periksa brief sebelum melanjutkan ke WhatsApp.</p>
        </form>
        <div ref={review} className={styles.review} hidden={!reviewing} tabIndex={-1} aria-labelledby="consult-review-title">
          <span className={styles.eyebrow}>BRIEF SIAP DITINJAU</span><h3 id="consult-review-title">Awal yang bagus.</h3>
          <dl><dt>Kendaraan</dt><dd>{vehicleType} / {vehicle}</dd><dt>Layanan</dt><dd>{service}</dd><dt>Finishing</dt><dd>{finish}</dd><dt>Catatan</dt><dd>{notes.trim() || "Dibahas bersama studio."}</dd></dl>
          <a href={`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className={styles.submit}>BUKA WHATSAPP <ArrowUpRight size={22} aria-hidden="true"/></a>
          <p className={styles.formNote}>Kirim pesan setelah kamu meninjaunya di WhatsApp.</p>
          <button type="button" className={styles.edit} onClick={() => setReviewing(false)}>Kembali edit ↗</button>
        </div>
      </div>
    </div>
    <div className={styles.faq} id="biar-jelas" aria-labelledby="clarity-title">
      <span className={styles.eyebrow}>SEBELUM KAMU BERTANYA</span>
      <h2 id="clarity-title" className={styles.faqTitle} data-consult-title><span className={styles.wordClip}><span data-consult-word>Biar&nbsp;</span></span><span className={styles.wordClip}><em data-consult-word>jelas.</em></span></h2>
      <div className={styles.faqList}>{QUESTIONS.map(([question, answer], index) => {
        const open = activeFaq === index;
        return <div key={question} className={styles.faqItem} data-open={open}
          onPointerEnter={event => {
            if (event.pointerType !== "mouse" || !matchMedia("(hover:hover) and (pointer:fine)").matches) return;
            cancelFaqHover();
            faqHoverTimer.current = window.setTimeout(() => { setActiveFaq(index); faqHoverTimer.current = null; }, 70);
          }}
          onPointerLeave={event => {
            if (event.pointerType !== "mouse") return;
            cancelFaqHover();
            const item = event.currentTarget;
            faqHoverTimer.current = window.setTimeout(() => {
              if (!item.contains(document.activeElement)) setActiveFaq(current => current === index ? null : current);
              faqHoverTimer.current = null;
            }, 160);
          }}>
          <h3 className={styles.faqQuestion}><button type="button" className={styles.faqTrigger} id={`consult-faq-trigger-${index}`} aria-expanded={open} aria-controls={`consult-faq-answer-${index}`} onClick={() => { cancelFaqHover(); setActiveFaq(current => current === index ? null : index); }}>
            <span className={styles.faqNumber}>0{index + 1}</span><span className={styles.faqQuestionLabel}>{question}</span><Plus size={24} aria-hidden="true"/>
          </button></h3>
          <div className={styles.faqAnswer} id={`consult-faq-answer-${index}`} role="region" aria-labelledby={`consult-faq-trigger-${index}`} aria-hidden={!open} inert={!open} onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === "grid-template-rows") refreshMotion.current(); }}>
            <div className={styles.faqAnswerInner}><p>{answer}</p></div>
          </div>
        </div>;
      })}</div>
    </div>
  </section>;
}
