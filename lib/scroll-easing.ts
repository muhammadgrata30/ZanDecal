export function wheelTarget(current:number,delta:number,mode:number,viewport:number,maximum:number){
  const pixels=delta*(mode===1?16:mode===2?viewport:1);
  return Math.max(0,Math.min(maximum,current+Math.max(-240,Math.min(240,pixels))*.68));
}
export function advanceScroll(current:number,target:number,elapsed:number){
  return current+(target-current)*(1-Math.exp(-Math.min(.05,Math.max(0,elapsed))*9));
}
