import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { errorResponse, requireAdmin, sameOrigin } from "../../../../lib/admin-auth";
import { AppError } from "../../../../lib/content-validation";
import { UPLOAD_DIR } from "../../../../lib/content-store";
export const runtime="nodejs";
const MAX=50*1024*1024;
export async function POST(request:Request){
  try{
    sameOrigin(request);await requireAdmin(request);
    if(!request.headers.get("content-type")?.startsWith("multipart/form-data"))throw new AppError("Pilih file untuk diunggah.");
    if(Number(request.headers.get("content-length"))>MAX+1024*1024)throw new AppError("Ukuran file maksimal 50 MB.",413);
    const reader=request.body?.getReader();if(!reader)throw new AppError("File kosong.");
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX+1024*1024){await reader.cancel();throw new AppError("Ukuran file maksimal 50 MB.",413);}chunks.push(value);}
    const form=await new Response(Buffer.concat(chunks),{headers:{"Content-Type":request.headers.get("content-type")!}}).formData();
    const file=form.get("file");if(!(file instanceof File)||!file.size)throw new AppError("Pilih file yang valid.");if(file.size>MAX)throw new AppError("Ukuran file maksimal 50 MB.",413);
    const bytes=Buffer.from(await file.arrayBuffer());
    let ext="",type:"photo"|"video"="photo";
    if(bytes.subarray(0,8).toString("hex")==="89504e470d0a1a0a")ext="png";
    else if(bytes.subarray(0,3).toString("hex")==="ffd8ff")ext="jpg";
    else if(["GIF87a","GIF89a"].includes(bytes.subarray(0,6).toString()))ext="gif";
    else if(bytes.subarray(0,4).toString()==="RIFF"&&bytes.subarray(8,12).toString()==="WEBP")ext="webp";
    else if(bytes.subarray(4,8).toString()==="ftyp"){ext="mp4";type="video";}
    else if(bytes.subarray(0,4).toString("hex")==="1a45dfa3"){ext="webm";type="video";}
    else throw new AppError("Format didukung: JPG, PNG, WebP, GIF, MP4 dan WebM.");
    if(type==="photo"){try{const meta=await sharp(bytes).metadata();if(!meta.width||!meta.height||meta.width>16000||meta.height>16000)throw Error();}catch{throw new AppError("Foto rusak atau dimensinya melebihi 16.000 piksel.");}}
    await mkdir(UPLOAD_DIR,{recursive:true});const filename=`${randomUUID()}.${ext}`;await writeFile(path.join(UPLOAD_DIR,filename),bytes,{flag:"wx",mode:0o600});
    return Response.json({url:`/media/${filename}`,type,name:file.name,size:file.size},{headers:{"Cache-Control":"no-store"}});
  }catch(error){return errorResponse(error);}
}
