"use client";

import { useEffect } from "react";
import { storyClamp, storyPose, storyProgress } from "../../lib/scroll-story";

/** One event-driven RAF, batched layout reads, no React updates on scroll. */
export default function ScrollDirector({ variant }: { variant: number }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".sl-lower");
    if (!root) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const visible = new Set<HTMLElement>();
    const elements = [...root.querySelectorAll<HTMLElement>("[data-scroll-story], [data-reveal]")];
    const cache = new Map<HTMLElement, { pin: HTMLElement | null; frames: HTMLElement[]; text: HTMLElement[]; counter: HTMLElement | null; fill: HTMLElement | null }>();
    elements.filter(element => element.hasAttribute("data-scroll-story")).forEach(element => cache.set(element, { pin: element.querySelector(".sl-story-pin"), frames: [...element.querySelectorAll<HTMLElement>("[data-story-frame]")], text: [...element.querySelectorAll<HTMLElement>("[data-story-text]")], counter: element.querySelector("[data-story-counter]"), fill: element.querySelector("[data-story-fill]") }));
    let frame = 0;
    const paint = () => {
      frame = 0;
      root.classList.toggle("is-motion-ready", !media.matches);
      if (media.matches) cache.forEach(data => data.text.forEach(text => { text.inert = false; text.removeAttribute("aria-hidden"); }));
      if (document.hidden) return;
      const vh = window.innerHeight;
      const reads = [...visible].map(element => ({ element, rect: element.getBoundingClientRect(), pinHeight: cache.get(element)?.pin?.offsetHeight || vh }));
      for (const { element, rect, pinHeight } of reads) {
        if (element.hasAttribute("data-scroll-story")) {
          if (media.matches) continue;
          const data = cache.get(element)!;
          const p = storyProgress(rect.top, rect.height, pinHeight);
          element.style.setProperty("--story", String(p));
          data.frames.forEach((photo, index) => {
            const pose = storyPose(p, index, data.frames.length, variant);
            photo.style.setProperty("--tx", String(pose.x)); photo.style.setProperty("--ty", String(pose.y));
            photo.style.setProperty("--turn", String(pose.rotate)); photo.style.setProperty("--scale", String(pose.scale));
            photo.style.setProperty("--alpha", String(pose.opacity)); photo.style.setProperty("--gray", String(pose.grayscale)); photo.style.setProperty("--crop", String(pose.clip));
            photo.classList.toggle("is-current", pose.active);
            const text = data.text[index];
            if (text) { text.style.setProperty("--text-opacity", String(pose.textOpacity)); text.inert = !pose.active; text.setAttribute("aria-hidden", String(!pose.active)); }
          });
          if (data.counter) data.counter.textContent = `${String(Math.round(p * Math.max(0, data.frames.length - 1)) + 1).padStart(2, "0")} / ${String(data.frames.length).padStart(2, "0")}`;
          if (data.fill) data.fill.style.transform = `scaleX(${p})`;
        } else {
          const amount = media.matches ? 1 : storyClamp((vh - rect.top) / (vh * .72));
          element.style.setProperty("--reveal", String(amount));
        }
      }
    };
    const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(paint); };
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) visible.add(entry.target as HTMLElement); else visible.delete(entry.target as HTMLElement); }); schedule(); }, { rootMargin: "15% 0px" });
    elements.forEach(element => observer.observe(element));
    const resize = new ResizeObserver(schedule); resize.observe(root);
    addEventListener("scroll", schedule, { passive: true }); addEventListener("resize", schedule); document.addEventListener("visibilitychange", schedule); media.addEventListener("change", schedule); schedule();
    return () => { observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); document.removeEventListener("visibilitychange", schedule); media.removeEventListener("change", schedule); root.classList.remove("is-motion-ready"); elements.forEach(element => element.inert = false); };
  }, [variant]);
  return null;
}
