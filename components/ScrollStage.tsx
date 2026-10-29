"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Native sticky stages: scroll is never intercepted, and tall panels remain reachable. */
export function ScrollStage({ children, className = "", distance = 0.35, id }: {
  children: ReactNode; className?: string; distance?: number; id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const panel = element.firstElementChild as HTMLElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let active = false;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const smoothstep = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const height = panel.offsetHeight;
      const travel = Math.max(1, element.offsetHeight - height);
      const top = Number.parseFloat(element.style.getPropertyValue("--stage-top")) || 0;
      const progress = clamp((top - rect.top) / travel);
      element.style.setProperty("--stage-progress", String(progress));
      // Hold, depart, hand over, arrive, hold. Vehicles never blink between thresholds.
      const runway = element.querySelector<HTMLElement>(".vehicle-runway");
      const motor = element.querySelector<HTMLElement>(".vehicle-motor");
      const car = element.querySelector<HTMLElement>(".vehicle-car");
      if (runway && motor && car) {
        const exit = runway.clientWidth - motor.offsetLeft + 48;
        const start = -(car.offsetLeft + car.offsetWidth + 48);
        element.style.setProperty("--motor-x", `${smoothstep((progress - .12) / .5) * exit}px`);
        element.style.setProperty("--car-x", `${(1 - smoothstep((progress - .25) / .6)) * start}px`);
        motor.style.visibility = progress >= .62 ? "hidden" : "visible";
      }
    };
    const schedule = () => { if (active && !frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      const enabled = !reduced.matches;
      const height = panel.offsetHeight;
      const mobileScale = window.innerWidth <= 760 ? .8 : 1;
      const space = enabled ? window.innerHeight * distance * mobileScale : 0;
      // Sticky needs real parent content height, not trailing padding: otherwise it
      // releases immediately and leaves the animation's scroll distance empty.
      element.style.setProperty("--stage-height", `${height + space}px`);
      const inset = element.classList.contains("hero-stage") || element.classList.contains("vehicle-stage") ? 0 : 88;
      element.style.setProperty("--stage-top", `${Math.min(inset, window.innerHeight - height)}px`);
      update();
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) schedule();
    }, { rootMargin: "100px" });
    observer.observe(element);
    const resize = new ResizeObserver(measure);
    resize.observe(panel);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    reduced.addEventListener("change", measure);
    measure();
    return () => {
      observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", measure);
    };
  }, [distance]);
  return <div ref={ref} id={id} className={`scroll-stage ${className}`}><div className="scroll-stage-panel">{children}</div></div>;
}

export function MotionHead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`motion-heading ${className}`}>{children}</h2>;
}

export function MotionObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add("motion-visible"); observer.unobserve(entry.target); }
      }
    }, { threshold: .12 });
    document.querySelectorAll(".motion-heading, .motion-reveal").forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return null;
}
