"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MATERIAL_QUALITY, type MaterialQuality } from "../../lib/material-quality";

export function StudioFrameBudget({ active, running, progress, appearance, quality, onSlow }: {
  active: boolean; running: boolean; progress: { current: number }; appearance: string;
  quality: MaterialQuality; onSlow: () => void;
}) {
  const invalidate = useThree(state => state.invalidate);
  const setDpr = useThree(state => state.setDpr);
  const samples = useRef({ time: 0, frames: 0, warmup: 0 });
  const budget = MATERIAL_QUALITY[quality];
  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio || 1, budget.dpr, 1.35));
    samples.current = { time: 0, frames: 0, warmup: 0 };
  }, [budget.dpr, setDpr]);
  useEffect(() => {
    if (!active) return;
    let frame = 0, last = -Infinity, previousProgress = -1;
    const settleUntil = performance.now() + 1800;
    const tick = (now: number) => {
      if (now - last >= 1000 / budget.fps - .5 && (running || now < settleUntil || progress.current !== previousProgress)) {
        previousProgress = progress.current; last = now; invalidate();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, running, appearance, budget.fps, progress, invalidate]);
  useFrame((state, delta) => {
    const transmissionScale = quality === "desktop" ? 1 : quality === "mobile" ? .5 : .25;
    if (state.gl.transmissionResolutionScale !== transmissionScale) state.gl.transmissionResolutionScale = transmissionScale;
    if (!running || !active || delta > .25) return;
    samples.current.warmup += delta;
    if (samples.current.warmup < 2) return;
    samples.current.time += delta; samples.current.frames++;
    if (samples.current.time >= 3) {
      if (samples.current.time / samples.current.frames > 1 / (budget.fps * .7)) onSlow();
      samples.current.time = 0; samples.current.frames = 0;
    }
  });
  return null;
}
