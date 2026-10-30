"use client";
import { useEffect } from "react";
import { clamp01 } from "./journeyMath";

/** One passive listener; only visible arrivals are measured and animated. */
export function SectionTransitions() {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("[data-arrival]")];
    const visible = new Set<HTMLElement>();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const reads = [...visible].map(section => ({ section, top: section.getBoundingClientRect().top }));
      for (const { section, top } of reads) {
        const p = reduced.matches ? 1 : clamp01((window.innerHeight - top) / (window.innerHeight * .72));
        const eased = p * p * (3 - 2 * p);
        section.style.setProperty("--arrival", String(eased));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const section = entry.target as HTMLElement;
        if (entry.isIntersecting) visible.add(section); else visible.delete(section);
      }
      schedule();
    }, { rootMargin: "80px" });
    sections.forEach(section => { section.style.setProperty("--arrival", "1"); observer.observe(section); });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); reduced.removeEventListener("change", schedule); };
  }, []);
  return null;
}

export function TransitionVeil() {
  return <div className="section-transition-veil" aria-hidden="true"><i/><i/></div>;
}
