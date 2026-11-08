export function heroQuality({cores=8,memory=8,saveData=false,mobile=false}={}){
 const low=saveData||cores<=4||memory<=4;
 const medium=!low&&(mobile||cores<=6||memory<=6);
 return {tier:low?'low':medium?'medium':'high',lean:low||medium,
  fps:low?30:60,shadows:!low&&!medium,hdri:!saveData&&!low,
  maxRatio:low?1:medium?1.25:1.5,pixels:low?700_000:medium?1_250_000:2_000_000,
  textureScale:low?.5:medium?1:2};
}
export function heroPixelRatio(width,height,deviceRatio,quality){
 return Math.max(.65,Math.min(deviceRatio||1,quality.maxRatio,Math.sqrt(quality.pixels/Math.max(1,width*height))));
}
