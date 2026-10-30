import { clamp01, phase } from "../experience/journeyMath";

export function heroMotion(option: 1 | 3, elapsed: number, scroll: number) {
  const entry = phase(elapsed, 0, 2.6);
  const progress = clamp01(scroll);
  const drive = option === 1 ? phase(progress, .03, .8) * 4.5 : phase(progress, .06, .9) * .65;
  return { x: (option === 1 ? 1.45 : 0) - (1 - entry) * 4.5 + drive,
    distance: entry * 4.5 + drive,
    yaw: option === 1 ? -.08 : -.12 + phase(progress, .1, .95) * .22,
    reveal: phase(progress, .38, .95),
    copy: 1 - phase(progress, .12, .6), entry };
}
