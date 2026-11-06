import { AppError } from "./content-validation";
export const MAX_MEDIA_BYTES=50*1024*1024;
export const MEDIA_NAME=/^[0-9a-f-]{36}\.(png|jpg|webp|gif|mp4|webm)$/;
export const MEDIA_TYPES:Record<string,string>={png:"image/png",jpg:"image/jpeg",gif:"image/gif",webp:"image/webp",mp4:"video/mp4",webm:"video/webm"};
export function detectMedia(bytes:Uint8Array){
  const b=Buffer.from(bytes);let ext="";
  if(b.subarray(0,8).toString("hex")==="89504e470d0a1a0a")ext="png";
  else if(b.subarray(0,3).toString("hex")==="ffd8ff")ext="jpg";
  else if(["GIF87a","GIF89a"].includes(b.subarray(0,6).toString()))ext="gif";
  else if(b.subarray(0,4).toString()==="RIFF"&&b.subarray(8,12).toString()==="WEBP")ext="webp";
  else if(b.subarray(4,8).toString()==="ftyp")ext="mp4";
  else if(b.subarray(0,4).toString("hex")==="1a45dfa3")ext="webm";
  else throw new AppError("Format didukung: JPG, PNG, WebP, GIF, MP4 dan WebM.");
  return{ext,mime:MEDIA_TYPES[ext],type:(ext==="mp4"||ext==="webm"?"video":"photo") as "photo"|"video"};
}
