"use client";

import { memo, useEffect, useId, useRef } from "react";
import type { PreviewFinish } from "../../lib/material-preview";

// A lightweight vector image: one animated outline shared by the color and light layers.
const shapes = [
  "M80 100 C260 55 400 155 570 100 S850 55 940 110 L940 470 C760 415 650 515 470 465 S220 420 80 470 Z",
  "M80 100 C260 155 400 55 570 110 S850 155 940 85 L940 445 C760 510 650 410 470 475 S220 510 80 470 Z",
  "M80 100 C260 55 400 155 570 100 S850 55 940 110 L940 470 C760 415 650 515 470 465 S220 420 80 470 Z",
];

export default memo(function DecalImage({ color, colorName, finish, paused, reduced }: {
  color: string; colorName: string; finish: PreviewFinish; paused: boolean; reduced: boolean;
}) {
  const id = useId().replaceAll(":", "");
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (paused || reduced) svg.current?.pauseAnimations();
    else svg.current?.unpauseAnimations();
  }, [paused, reduced]);
  return <div className="hm-decal-arrival" data-finish={finish.toLowerCase()}>
    <svg ref={svg} viewBox="0 0 1020 570" role="img" aria-label={`Ilustrasi decal ${colorName}, finish ${finish}`} className="hm-decal-image">
      <defs>
        <path id={`${id}-sheet`} d={shapes[0]}>{!reduced && <animate attributeName="d" values={shapes.join(";")} dur="8s" begin="1.4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".45 0 .55 1;.45 0 .55 1" />}</path>
        <clipPath id={`${id}-clip`}><use href={`#${id}-sheet`} /></clipPath>
        <linearGradient id={`${id}-fold`} x1="0" y1=".15" x2="1" y2=".8" gradientUnits="objectBoundingBox">
          {!reduced && <animateTransform attributeName="gradientTransform" type="translate" values="-.06 0;.06 0;-.06 0" dur="8s" begin="1.4s" repeatCount="indefinite" />}
          <stop offset="0" stopColor="#000" stopOpacity=".32" /><stop offset=".18" stopColor="#fff" stopOpacity=".32" /><stop offset=".38" stopColor="#000" stopOpacity=".24" /><stop offset=".6" stopColor="#fff" stopOpacity=".35" /><stop offset=".82" stopColor="#000" stopOpacity=".19" /><stop offset="1" stopColor="#fff" stopOpacity=".18" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#fff" stopOpacity="0" /><stop offset=".42" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".7" /><stop offset=".56" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <pattern id={`${id}-grain`} width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".55" fill="#fff" fillOpacity=".25" /><circle cx="3" cy="4" r=".45" fill="#000" fillOpacity=".2" /></pattern>
      </defs>
      <use href={`#${id}-sheet`} fill={color} />
      <g clipPath={`url(#${id}-clip)`}>
        <rect width="1020" height="570" fill={`url(#${id}-fold)`} className="hm-decal-fold" />
        <rect width="1020" height="570" fill={`url(#${id}-shine)`} className="hm-decal-shine" />
        <rect width="1020" height="570" fill={`url(#${id}-grain)`} className="hm-decal-grain" />
        <path d="M80 100V470" stroke="#fff" strokeOpacity=".4" strokeWidth="2" />
      </g>
      <use href={`#${id}-sheet`} fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="1" />
    </svg>
  </div>;
});
