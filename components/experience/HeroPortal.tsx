"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import "./hero-portal.css";

/** One live destination; its normal document position is restored at the handoff. */
export function HeroPortal({ hero, children }: { hero: ReactNode; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    const layer = surface.current;
    const glyph = layer?.querySelector<HTMLElement>('[data-portal-counter]');
    if (!element || !layer || !glyph) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let disposed = false;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let runway = 0;
    let x = 0, y = 0, rx = 1, ry = 1, endScale = 1;
    const update = () => {
      frame = 0;
      const distance = Math.max(0, -element.getBoundingClientRect().top);
      const p = reduced.matches ? 0 : Math.min(1, distance / runway);
      const travel = p * p * (3 - 2 * p);
      // Exponential magnification feels like moving through space, rather than stretching type.
      const scale = Math.exp(Math.log(endScale) * travel);
      const cx = x + (innerWidth / 2 - x) * travel;
      const cy = y + (innerHeight / 2 - y) * travel;
      element.dataset.travelling = String(p > 0 && p < 1);
      layer.style.transformOrigin = `${x}px ${y}px`;
      layer.style.transform = `translate3d(${cx - x}px,${cy - y}px,0) scale(${scale})`;
      // Cut through the counter of the actual O. The mask scales with the same hero surface.
      const aperture = Math.min(1, p / .13);
      const mask = `radial-gradient(ellipse ${rx * aperture}px ${ry * aperture}px at ${x}px ${y}px, transparent 0%, transparent 96%, #000 100%)`;
      layer.style.maskImage = p > 0 ? mask : "none";
      layer.style.visibility = !reduced.matches && p >= 1 ? "hidden" : "visible";
      layer.inert = p > .08;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      // Read the untransformed glyph, including the final loaded display font.
      layer.style.transform = "none";
      const bounds = glyph.getBoundingClientRect();
      const base = layer.getBoundingClientRect();
      x = bounds.left - base.left + bounds.width * .5;
      y = bounds.top - base.top + bounds.height * .5;
      rx = bounds.width / 2;
      ry = bounds.height / 2;
      runway = innerHeight * 1.65;
      endScale = Math.hypot(innerWidth / rx, innerHeight / ry) * .65;
      element.style.setProperty("--portal-runway", `${reduced.matches ? 0 : runway}px`);
      element.dataset.portalActive = String(!reduced.matches);
      update();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(glyph);
    const heroElement = layer.querySelector(".perfect-apply");
    const introObserver = new MutationObserver(() => {
      if (heroElement?.classList.contains("settled")) {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(measure, 1100);
      }
    });
    if (heroElement) introObserver.observe(heroElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    reduced.addEventListener("change", measure);
    void document.fonts.ready.then(() => { if (!disposed) measure(); });
    measure();
    return () => {
      disposed = true;
      observer.disconnect();
      introObserver.disconnect();
      clearTimeout(settleTimer);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", measure);
    };
  }, []);

  return <div ref={root} className="hero-portal">
    <div className="hero-portal-track"><div className="hero-portal-pin"><div ref={surface} className="hero-portal-surface">{hero}</div></div></div>
    <div className="hero-portal-destination">{children}</div><div className="hero-portal-spacer" aria-hidden="true"/>
  </div>;
}
