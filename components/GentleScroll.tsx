"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

/** One scroll owner. Touch, reduced motion, and admin retain native scrolling. */
export function GentleScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const fine = matchMedia("(pointer:fine)");
    const reduced = matchMedia("(prefers-reduced-motion:reduce)");
    let instance: Lenis | undefined;
    let disposed = false;
    let generation = 0;
    async function sync() {
      const current = ++generation;
      instance?.destroy(); instance = undefined;
      if (disposed || !fine.matches || reduced.matches || document.hidden || document.documentElement.classList.contains("zan-intro-locked")) return;
      const { default: Lenis } = await import("lenis");
      if (disposed || current !== generation) return;
      instance = new Lenis({
        autoRaf: true,
        lerp: 0.12,
        smoothWheel: true,
        syncTouch: false,
        allowNestedScroll: true,
        anchors: { offset: -88 },
        prevent: element => Boolean(element.closest('input,textarea,select,[contenteditable="true"],dialog,[data-native-scroll],[data-material-scroll],[data-lenis-prevent]')),
      });
    }
    const refresh = () => { void sync(); };
    const navigate=(event:Event)=>{
      if(!instance)return;
      const top=(event as CustomEvent<{top:number}>).detail.top;
      event.preventDefault();instance.scrollTo(top,{immediate:true,force:true});
    };
    refresh();
    fine.addEventListener("change", refresh);
    reduced.addEventListener("change", refresh);
    document.addEventListener("visibilitychange", refresh);
    document.addEventListener("zan-intro-lock-change", refresh);
    window.addEventListener("zan-scroll-to",navigate);
    return () => {
      disposed = true; generation++;
      instance?.destroy();
      fine.removeEventListener("change", refresh);
      reduced.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", refresh);
      document.removeEventListener("zan-intro-lock-change", refresh);
      window.removeEventListener("zan-scroll-to",navigate);
    };
  }, [pathname]);
  return null;
}
