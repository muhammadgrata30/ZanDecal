"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./PinnedScrollScene.module.css";

/** One ScrollTrigger per scene; long mobile content stays in document flow. */
export function PinnedScrollScene({ children, className = "", distance = 1 }: {
  children: ReactNode; className?: string; distance?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scene = root.current;
    const surface = panel.current;
    if (!scene || !surface) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    async function mount() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia(scene!);
      media.add("(prefers-reduced-motion: no-preference)", () => {
        let animation: ReturnType<typeof gsap.to> | undefined;
        let frame = 0;
        let geometry = "";
        const content = surface!.firstElementChild as HTMLElement;
        const measure = () => {
          frame = 0;
          if (disposed) return;
          const height = Math.ceil(content.getBoundingClientRect().height);
          const nextGeometry = `${height}:${window.innerHeight}:${window.innerWidth}`;
          if (nextGeometry === geometry) return;
          geometry = nextGeometry;
          animation?.scrollTrigger?.kill(true);
          animation?.kill();
          const fits = height <= window.innerHeight + 2;
          scene!.dataset.pinned = String(fits);
          animation = gsap.fromTo(scene, { "--stage-progress": 0 }, {
            "--stage-progress": 1, ease: "none",
            scrollTrigger: {
              trigger: scene!, start: fits ? "top top" : "top bottom",
              end: fits ? () => `+=${Math.round(window.innerHeight * distance)}` : "bottom top",
              pin: fits ? surface! : false, pinSpacing: true, scrub: .7,
              invalidateOnRefresh: true, anticipatePin: 1,
            },
          });
        };
        const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
        const resize = new ResizeObserver(schedule);
        resize.observe(content);
        window.addEventListener("resize", schedule);
        measure();
        void document.fonts.ready.then(() => { if (!disposed) schedule(); });
        return () => {
          cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener("resize", schedule);
          animation?.scrollTrigger?.kill(true); animation?.kill();
          scene!.style.setProperty("--stage-progress", "1");
          delete scene!.dataset.pinned;
        };
      });
      cleanup = () => media.revert();
    }
    void mount().catch(error => console.warn("Pinned scene unavailable; keeping normal flow", error));
    return () => { disposed = true; cleanup?.(); };
  }, [distance]);
  return <div ref={root} className={`${styles.scene} ${className}`} data-pin-scene style={{ "--stage-progress": 1 } as CSSProperties}>
    <div ref={panel} className={`${styles.panel} scroll-stage-panel`}>{children}</div>
  </div>;
}
