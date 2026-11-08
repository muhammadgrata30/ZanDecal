import type { CSSProperties } from "react";
import { PerfectApplyHero } from "./PerfectApplyHero";
import "./perfect-apply/apex-livery.css";

function ApexLiveryBackdrop() {
  return <div className="apex-livery-backdrop" aria-hidden="true">
    <svg viewBox="0 0 1440 1000" preserveAspectRatio="none" className="apex-livery-art">
      <g className="apex-livery-bands">{Array.from({length:7},(_,i)=><path key={i}
        className={`apex-livery-band apex-ink-${i%3}`}
        style={{"--i":i} as CSSProperties}
        d={`M${720+i*104} -140C${300+i*104} 190 ${1110+i*60} 550 ${100+i*155} 1140L${120+i*155} 1140C${1130+i*60} 550 ${320+i*104} 190 ${740+i*104} -140Z`}/>)}</g>
      <g className="apex-livery-trails">{Array.from({length:7},(_,i)=><path key={i} pathLength="1"
        style={{"--i":i} as CSSProperties}
        d={`M${730+i*104} -140C${310+i*104} 190 ${1120+i*60} 550 ${110+i*155} 1140`}/>)}</g>
    </svg>
  </div>;
}

export function ApexLiveryHero() {
  return <PerfectApplyHero typography="11" realistic backdrop={<ApexLiveryBackdrop/>}/>;
}
