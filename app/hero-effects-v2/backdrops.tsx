import type { CSSProperties } from "react";

// Flat print graphics: broad ink shapes, contour strokes and cutting paths.
// Motion stays on the page plane; no perspective, extrusion or depth effects.
export function PrintBackdrop({ option }: { option: number }) {
  return <div className={`print-backdrop print-backdrop-${option}`} aria-hidden="true">
    <svg viewBox="0 0 1440 1000" preserveAspectRatio={option === 4 ? "none" : "xMidYMid slice"} className="print-composition">
      <defs>
        <pattern id="print-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(32)"><path d="M0 0V14" className="print-hatch-line"/></pattern>
        <clipPath id="print-right"><path d="M680 120H1440V1000H510L660 630Z"/></clipPath>
      </defs>
      {option === 1 && <>
        <path className="print-tint" d="M930 120C1220 80 1510 320 1490 620S1220 1040 930 940S530 530 670 310Q750 160 930 120Z"/>
        <g className="print-contours">{Array.from({length:19},(_,i)=><path key={i} className={i%4===0?"print-contour strong":"print-contour"} style={{"--i":i} as CSSProperties} d={`M${690-i*12} ${260-i*7}C${920-i*7} ${65-i*4} ${1410+i*8} ${230-i*4} ${1360+i*9} ${610+i*9}S${750-i*10} ${1030+i*6} ${660-i*13} ${670+i*5}Q${610-i*10} ${430+i*2} ${690-i*12} ${260-i*7}Z`}/>)}</g>
        <path className="print-ribbon print-cyan" d="M-80 865Q170 630 430 840T850 830L850 855Q630 1000 420 870T-80 910Z"/>
        <path className="print-lavender print-solid-orbit" d="M1100 134A330 330 0 0 1 1430 464H1370A270 270 0 0 0 1100 194Z"/>
      </>}
      {option === 2 && <>
        <path className="print-tint" d="M800 0H1440V1000H1070L665 510Z"/>
        <g className="print-cut-panels"><path className="print-lavender" d="M920 130L1380 245L1180 440L720 325Z"/><path className="print-hatched" d="M920 130L1380 245L1180 440L720 325Z"/><path className="print-cyan" d="M1260 485L1490 542L1150 880L920 823Z"/><path className="print-ink" d="M850 820L1030 865L875 1020L695 975Z"/></g>
        <path className="print-guide" d="M840 60L1450 210L1250 445L1510 510L1150 940L580 795L875 485L640 425Z"/>
        <path className="print-trace" pathLength="1" d="M840 60L1450 210L1250 445L1510 510L1150 940L580 795L875 485L640 425Z"/>
        <path className="print-ribbon print-lavender" d="M-30 854L160 805L465 880L655 830V846L468 905L160 830L-30 882Z"/>
      </>}
      {option === 3 && <>
        <path className="print-tint" d="M1050-50L1550 320L1170 1050L620 680Z"/>
        <g className="print-die-frames">{Array.from({length:12},(_,i)=><rect key={i} x={790-i*23} y={220-i*19} width={330+i*46} height={430+i*38} rx={72+i*4} className={i%3===0?"print-frame strong":"print-frame"} style={{"--i":i} as CSSProperties}/>)}</g>
        <path className="print-cyan print-corner-mark" d="M1230 100H1370V240H1334V136H1230Z"/>
        <path className="print-lavender print-corner-mark second" d="M670 740H706V844H810V880H670Z"/>
        <path className="print-ribbon print-ink" d="M-20 865H180L220 825H420L475 880H640V896H465L410 841H230L190 881H-20Z"/>
      </>}
      {option === 4 && <>
        <g className="print-speed-bands">{Array.from({length:7},(_,i)=><path key={i} className={i%3===0?"print-band print-cyan":i%3===1?"print-band print-lavender":"print-band print-ink"} style={{"--i":i} as CSSProperties} d={`M${720+i*104} -140C${300+i*104} 190 ${1110+i*60} 550 ${100+i*155} 1140L${120+i*155} 1140C${1130+i*60} 550 ${320+i*104} 190 ${740+i*104} -140Z`}/>)}</g>
        <g className="print-speed-lines">{Array.from({length:7},(_,i)=><path key={i} pathLength="1" style={{"--i":i} as CSSProperties} d={`M${730+i*104} -140C${310+i*104} 190 ${1120+i*60} 550 ${110+i*155} 1140`}/>)}</g>
      </>}
      {option === 5 && <>
        <path className="print-tint" d="M1080 90L1540 380L1180 1040L660 730Z"/>
        <g clipPath="url(#print-right)"><g className="print-hybrid-contours">{Array.from({length:18},(_,i)=><ellipse key={i} cx="1040" cy="530" rx={160+i*27} ry={100+i*19} className={i%4===0?"print-contour strong":"print-contour"} transform="rotate(-28 1040 530)"/>)}</g></g>
        <path className="print-cyan print-signature-shard" d="M1180 95L1435 235L1360 365L1104 223Z"/>
        <path className="print-lavender print-signature-tab" d="M746 720L940 827L866 955L672 849Z"/>
        <path className="print-guide" d="M1180 65L1465 225L1060 940L650 715L975 135Z"/>
        <path className="print-trace" pathLength="1" d="M1180 65L1465 225L1060 940L650 715L975 135Z"/>
        <path className="print-ribbon print-lavender" d="M-30 888Q170 740 360 868L470 910L640 850V871L470 934L350 894Q160 768-30 915Z"/>
      </>}
      <g className="print-registration"><path d="M646 160H678M662 144V176M1320 840H1352M1336 824V856"/><circle cx="662" cy="160" r="9"/><circle cx="1336" cy="840" r="9"/></g>
    </svg>
    <div className="print-edition"><span>0{option} / ZAN — CUT & COLOUR</span><span>FLAT GRAPHICS / LIVE MOTION</span></div>
  </div>;
}
