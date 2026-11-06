import "server-only";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { AppError } from "./content-validation";
import { cloudConfig, cloudFetch, publicMediaUrl } from "./supabase-server";
import { detectMedia, MAX_MEDIA_BYTES, MEDIA_NAME } from "./media-format";

interface Ticket {filename:string;size:number;mime:string;type:"photo"|"video";expires:number}
function sign(value:string,secret:string){return createHmac("sha256",secret).update("zan-upload:"+value).digest("base64url");}
export async function prepareCloudUpload(input:Record<string,unknown>,secret:string){
  if(!Number.isSafeInteger(input.size)||Number(input.size)<=0||Number(input.size)>MAX_MEDIA_BYTES)throw new AppError("Ukuran file maksimal 50 MB.");
  if(typeof input.prefix!=="string"||input.prefix.length>128)throw new AppError("Header file tidak valid.");
  const format=detectMedia(Buffer.from(input.prefix,"base64"));
  const filename=`${randomUUID()}.${format.ext}`;const config=cloudConfig();
  const response=await cloudFetch(`/storage/v1/object/upload/sign/${config.bucket}/${filename}`,{method:"POST",headers:{"Content-Type":"application/json","x-upsert":"false"},body:"{}"});
  const data=await response.json() as {url:string};
  const uploadUrl=new URL(config.url+"/storage/v1"+data.url);
  if(uploadUrl.origin!==config.url||!uploadUrl.searchParams.get("token"))throw new AppError("Storage belum memberikan izin upload.",503);
  const payload=Buffer.from(JSON.stringify({filename,size:Number(input.size),mime:format.mime,type:format.type,expires:Date.now()+2*60*60*1000} satisfies Ticket)).toString("base64url");
  return{uploadUrl:uploadUrl.toString(),ticket:payload+"."+sign(payload,secret),mime:format.mime};
}
export async function finishCloudUpload(input:unknown,secret:string){
  if(typeof input!=="string"||input.length>2000)throw new AppError("Tiket upload tidak valid.");
  let ticket:Ticket;
  try{
    const[payload,signature]=input.split(".");const expected=sign(payload,secret);
    const a=Buffer.from(signature||""),b=Buffer.from(expected);
    if(a.length!==b.length||!timingSafeEqual(a,b))throw Error();
    ticket=JSON.parse(Buffer.from(payload,"base64url").toString());
    if(!MEDIA_NAME.test(ticket.filename)||ticket.expires<Date.now())throw Error();
  }catch{throw new AppError("Izin upload habis atau tidak valid. Unggah ulang file.");}
  const config=cloudConfig();
  const info=await (await cloudFetch(`/storage/v1/object/info/${config.bucket}/${ticket.filename}`)).json() as {size?:number;metadata?:{size?:number;mimetype?:string};content_type?:string};
  const size=Number(info.size??info.metadata?.size);
  if(size!==ticket.size||size>MAX_MEDIA_BYTES)throw new AppError("Ukuran file di storage tidak sesuai. Unggah ulang.");
  const response=await fetch(publicMediaUrl(ticket.filename),{headers:{Range:"bytes=0-31"},cache:"no-store",signal:AbortSignal.timeout(15000)});
  if(!response.ok||!response.body)throw new AppError("File belum dapat dibaca dari storage.",503);
  const reader=response.body.getReader();const chunks:Uint8Array[]=[];let length=0;
  try{while(length<32){const {done,value}=await reader.read();if(done)break;chunks.push(value.subarray(0,32-length));length+=Math.min(value.length,32-length);}}finally{await reader.cancel();}
  const actual=detectMedia(Buffer.concat(chunks));
  if(actual.mime!==ticket.mime)throw new AppError("Isi file tidak cocok dengan format upload.");
  return{url:`/media/${ticket.filename}`,type:ticket.type,size:ticket.size};
}
