import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { account, errorResponse, jsonBody, requireAdmin, sameOrigin } from "../../../../lib/admin-auth";
import { AppError } from "../../../../lib/content-validation";
import { UPLOAD_DIR } from "../../../../lib/content-store";
import { assertWritableStorage, cloudConfigured } from "../../../../lib/supabase-server";
import { finishCloudUpload, prepareCloudUpload } from "../../../../lib/cloud-media";
import { detectMedia, MAX_MEDIA_BYTES } from "../../../../lib/media-format";
export const runtime="nodejs";
const MAX=MAX_MEDIA_BYTES;
export async function GET(request:Request){try{await requireAdmin(request);assertWritableStorage();return Response.json({mode:cloudConfigured()?"direct":"local"},{headers:{"Cache-Control":"no-store"}});}catch(error){return errorResponse(error);}}
export async function POST(request:Request){
  try{
    sameOrigin(request);await requireAdmin(request);
    assertWritableStorage();
    if(request.headers.get("content-type")?.includes("application/json")){
      if(!cloudConfigured())throw new AppError("Upload langsung hanya tersedia saat storage terhubung.");
      const user=await account();if(!user)throw new AppError("Silakan masuk kembali.",401);
      const input=await jsonBody(request);
      if(input.action==="prepare")return Response.json(await prepareCloudUpload(input,user.secret),{headers:{"Cache-Control":"no-store"}});
      if(input.action==="complete")return Response.json(await finishCloudUpload(input.ticket,user.secret),{headers:{"Cache-Control":"no-store"}});
      throw new AppError("Aksi upload tidak valid.");
    }
    if(cloudConfigured())throw new AppError("Gunakan upload langsung ke storage. Muat ulang halaman admin.");
    if(!request.headers.get("content-type")?.startsWith("multipart/form-data"))throw new AppError("Pilih file untuk diunggah.");
    if(Number(request.headers.get("content-length"))>MAX+1024*1024)throw new AppError("Ukuran file maksimal 50 MB.",413);
    const reader=request.body?.getReader();if(!reader)throw new AppError("File kosong.");
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX+1024*1024){await reader.cancel();throw new AppError("Ukuran file maksimal 50 MB.",413);}chunks.push(value);}
    const form=await new Response(Buffer.concat(chunks),{headers:{"Content-Type":request.headers.get("content-type")!}}).formData();
    const file=form.get("file");if(!(file instanceof File)||!file.size)throw new AppError("Pilih file yang valid.");if(file.size>MAX)throw new AppError("Ukuran file maksimal 50 MB.",413);
    const bytes=Buffer.from(await file.arrayBuffer());
    const {ext,type}=detectMedia(bytes);
    if(type==="photo"){try{const meta=await sharp(bytes).metadata();if(!meta.width||!meta.height||meta.width>16000||meta.height>16000)throw Error();}catch{throw new AppError("Foto rusak atau dimensinya melebihi 16.000 piksel.");}}
    await mkdir(UPLOAD_DIR,{recursive:true});const filename=`${randomUUID()}.${ext}`;await writeFile(path.join(/* turbopackIgnore: true */ UPLOAD_DIR,filename),bytes,{flag:"wx",mode:0o600});
    return Response.json({url:`/media/${filename}`,type,name:file.name,size:file.size},{headers:{"Cache-Control":"no-store"}});
  }catch(error){return errorResponse(error);}
}
