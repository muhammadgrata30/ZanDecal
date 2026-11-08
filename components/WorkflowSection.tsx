"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import styles from "./WorkflowTypeMotion.module.css";

const STEPS = [
  ["Eksplorasi.", "Temukan bahasa visualmu.", "Bawa foto kendaraan, referensi, atau satu kesan yang ingin kamu tampilkan. Kita mulai dari sana."],
  ["Lihat dulu.", "Mockup sebelum produksi.", "Warna, komposisi, dan area aplikasi dibahas di mockup. Arah desain disepakati bersama sebelum dibuat."],
  ["Buat presisi.", "Dari layar ke material.", "Desain yang disetujui masuk ke persiapan file, pemotongan, dan produksi sesuai pilihan material."],
  ["Ke jalan.", "Sentuhan terakhir. Karaktermu.", "Aplikasi mengikuti bentuk panel, dilanjutkan pengecekan detail dan panduan perawatan."],
];

export function WorkflowSection() {
  const root = useRef<HTMLElement>(null);
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
        const intro = section!.querySelector(`.${styles.opening}`);
        section!.querySelectorAll<HTMLElement>("[data-workflow-drift]").forEach(line => {
          const distance = Number(line.dataset.workflowDrift);
          gsap.fromTo(line, { xPercent: -distance / 2 }, {
            xPercent: distance, ease: "none",
            scrollTrigger: { trigger: intro, start: "top bottom", end: "bottom top", scrub: .8 },
          });
        });
        const visual = section!.querySelector(`.${styles.visual}`);
        gsap.fromTo(section!.querySelector(`.${styles.photo}`), { scale: 1.12, yPercent: -5 }, {
          scale: 1.03, yPercent: 5, ease: "none",
          scrollTrigger: { trigger: visual, start: "top bottom", end: "bottom top", scrub: .7 },
        });
        section!.querySelectorAll<HTMLElement>("[data-workflow-step]").forEach(title => gsap.fromTo(title, { yPercent: 110 }, {
          yPercent: 0, duration: .8, ease: "power3.out",
          scrollTrigger: { trigger: title.parentElement, start: "top 94%", once: true },
        }));
      });
      let frame = 0;
      const refresh = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); }); };
      section!.addEventListener("load", refresh, true);
      cleanup = () => { cancelAnimationFrame(frame); section!.removeEventListener("load", refresh, true); media.revert(); };
      await document.fonts.ready;
      if (!disposed) refresh();
    }
    void mount().catch(error => console.warn("Workflow motion unavailable", error));
    return () => { disposed = true; cleanup?.(); };
  }, []);

  return <section ref={root} id="cara-order" className={styles.section} aria-labelledby="order-title">
    <div className={styles.opening}>
      <h2 id="order-title" className={styles.title}><span className={styles.kineticRow} data-workflow-drift="-12">DARI IDE.</span><span className={`${styles.kineticRow} ${styles.outline}`} data-workflow-drift="12">KE JALAN.</span></h2>
      <div className={styles.visual}><Image className={styles.photo} src="/images/workflow-type-motion.webp" alt="Detail bodi mobil sebagai ilustrasi arah desain decal" fill sizes="(max-width:900px) 65vw, 40vw"/><span>DETAIL<br/>IS THE<br/>DIFFERENCE.</span></div>
      <p className={styles.caption}>Ide liar.<br/>Detail sadar.</p>
      <a className={styles.processLink} href="#order-stations">Lihat prosesnya ↓</a>
    </div>
    <div className={styles.process} id="order-stations">{STEPS.map(([title, subtitle, description], index) => <article key={title} className={styles.step}>
      <div className={styles.stepHeading}><span>0{index + 1}</span><div className={styles.stepTitleClip}><h3 data-workflow-step>{title}</h3></div><ArrowDownRight aria-hidden="true"/></div>
      <div className={styles.stepDetail}><h4>{subtitle}</h4><p>{description}</p></div>
    </article>)}</div>
  </section>;
}
