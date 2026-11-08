export function stageLayout(height:number,viewport:number,inset:number,distance:number,mobileScale:number,reduced:boolean){
  const sticky=!reduced&&height<=viewport-inset;
  return {sticky,top:sticky?inset:0,height:height+(sticky?viewport*distance*mobileScale:0)};
}

/** Normal-flow panels animate across their full passage through the viewport. */
export function stageProgress(rectTop:number,height:number,totalHeight:number,viewport:number,inset:number,sticky:boolean,reduced:boolean){
  if(reduced)return 1;
  const travel=sticky?Math.max(1,totalHeight-height):height+viewport;
  return Math.max(0,Math.min(1,((sticky?inset:viewport)-rectTop)/travel));
}
