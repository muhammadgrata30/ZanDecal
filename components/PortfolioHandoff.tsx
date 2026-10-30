"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Keep the final gallery row in view while the order section slides over it. */
export function PortfolioHandoff({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const gallery = root?.querySelector<HTMLElement>(".editorial-gallery");
    const workflow = root?.querySelector<HTMLElement>(".editorial-workflow");
    if (!root || !gallery || !workflow) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const progress = reduced.matches ? 0 : Math.max(0, Math.min(1,
        (viewport - workflow.getBoundingClientRect().top) / Math.max(1, viewport - 88)));
      root.style.setProperty("--handoff-progress", String(progress));
      root.style.setProperty("--gallery-pin-top", `${Math.min(88, viewport - gallery.offsetHeight)}px`);
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    intersection.observe(root);
    const resize = new ResizeObserver(update);
    resize.observe(gallery);
    resize.observe(workflow);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", update);
    reduced.addEventListener("change", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      intersection.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return <div ref={ref} className="portfolio-handoff">{children}</div>;
}
