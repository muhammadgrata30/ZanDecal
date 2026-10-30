import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { UPLOAD_DIR } from "../../../lib/content-store";
export const runtime="nodejs";
const TYPES:Record<string,string>={png:"image/png",jpg:"image/jpeg",gif:"image/gif",webp:"image/webp",mp4:"video/mp4",webm:"video/webm"};
async function serve(request:Request,params:Promise<{file:string}>,head=false){
  const {file}=await params;
  if(!/^[0-9a-f-]{36}\.(png|jpg|webp|gif|mp4|webm)$/.test(file))return new Response(null,{status:404});
  const filename=path.join(UPLOAD_DIR,file);let size:number;
  try{size=(await stat(filename)).size;}catch{return new Response(null,{status:404});}
  const headers:Record<string,string>={"Content-Type":TYPES[file.split(".").pop()!],"Accept-Ranges":"bytes","Cache-Control":"public, max-age=31536000, immutable","X-Content-Type-Options":"nosniff"};
  let start=0,end=size-1,status=200;
  const range=request.headers.get("range");
  if(range){const match=/^bytes=(\d*)-(\d*)$/.exec(range);if(!match||(!match[1]&&!match[2]))return new Response(null,{status:416,headers:{"Content-Range":`bytes */${size}`}});
    if(!match[1])start=Math.max(0,size-Number(match[2]));else{start=Number(match[1]);if(match[2])end=Math.min(size-1,Number(match[2]));}
    if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return new Response(null,{status:416,headers:{"Content-Range":`bytes */${size}`}});
    status=206;headers["Content-Range"]=`bytes ${start}-${end}/${size}`;
  }
  headers["Content-Length"]=String(end-start+1);
  return new Response(head?null:Readable.toWeb(createReadStream(filename,{start,end})) as ReadableStream,{status,headers});
}
export async function GET(request:Request,{params}:{params:Promise<{file:string}>}){return serve(request,params);}
export async function HEAD(request:Request,{params}:{params:Promise<{file:string}>}){return serve(request,params,true);}
