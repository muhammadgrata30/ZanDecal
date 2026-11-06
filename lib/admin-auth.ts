import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DATA_DIR } from "./content-store";
import { AppError } from "./content-validation";
import type { AdminSession } from "./admin-types";
import { assertWritableStorage, cloudConfigured, cloudRequired, createCloudAdmin, readCloudAdmin } from "./supabase-server";

interface Account {username:string;salt:string;passwordHash:string;secret:string}
const FILE=path.join(DATA_DIR,"admin.json");
export const COOKIE="zan_admin_session";
const MAX_AGE=8*60*60;
const attempts=new Map<string,{count:number;until:number}>();
export async function account():Promise<Account|null>{if(cloudConfigured())return readCloudAdmin();if(cloudRequired())return null;try{return JSON.parse(await readFile(FILE,"utf8"));}catch(e){if((e as NodeJS.ErrnoException).code==="ENOENT")return null;throw e;}}
function webOrigin(value:string|undefined){
  if(!value)return null;
  try{const url=new URL(value);return ["http:","https:"].includes(url.protocol)&&!url.username&&!url.password?url.origin:null;}catch{return null;}
}
export function sameOrigin(request:Request){
  if(request.headers.get("sec-fetch-site")==="cross-site")throw new AppError("Permintaan lintas situs ditolak.",403);
  const supplied=request.headers.get("origin");
  if(!supplied)return;
  const origin=webOrigin(supplied);
  if(!origin||origin!==supplied)throw new AppError("Origin permintaan tidak valid.",403);
  // Match exact deployment origins, not every tenant under *.netlify.app.
  // A proxy's internal Request URL need not match the public browser URL.
  const allowed=new Set([new URL(request.url).origin]);
  for(const value of [process.env.ZAN_SITE_URL,process.env.URL,process.env.DEPLOY_URL,process.env.DEPLOY_PRIME_URL,...(process.env.ZAN_ALLOWED_ORIGINS||"").split(",")]){
    const site=webOrigin(value?.trim());if(site)allowed.add(site);
  }
  // Host is the requested public host on Netlify. Do not trust a client-supplied
  // X-Forwarded-Host as an additional allowed origin.
  if(process.env.NETLIFY==="true"){
    const host=request.headers.get("host");
    if(host&&/^[a-zA-Z0-9.-]+(?::\d+)?$/.test(host)){
      const site=webOrigin(`https://${host}`);if(site)allowed.add(site);
    }
  }
  if(!allowed.has(origin))throw new AppError("Permintaan lintas situs ditolak.",403);
}
export function errorResponse(error:unknown){if(error instanceof AppError)return Response.json({error:error.message},{status:error.status,headers:{"Cache-Control":"no-store"}});console.error("Admin request failed",error);return Response.json({error:"Permintaan belum bisa diproses. Coba lagi."},{status:500});}
export async function jsonBody(request:Request){
  if(!request.headers.get("content-type")?.includes("application/json"))throw new AppError("Gunakan data JSON.");
  if(Number(request.headers.get("content-length"))>2_000_000)throw new AppError("Data terlalu besar.",413);
  const reader=request.body?.getReader();if(!reader)throw new AppError("Data kosong.");let size=0;const chunks:Uint8Array[]=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>2_000_000){await reader.cancel();throw new AppError("Data terlalu besar.",413);}chunks.push(value);}
  try{return JSON.parse(Buffer.concat(chunks).toString("utf8"));}catch{throw new AppError("Data JSON tidak valid.");}
}
export async function setup(request:Request,username:unknown,password:unknown){
  assertWritableStorage();
  if(await account())throw new AppError("Akun admin sudah dibuat.",409);
  const host=new URL(request.url).hostname;
  const configuredToken=process.env.ADMIN_SETUP_TOKEN;
  const localDevelopment=process.env.NODE_ENV!=="production"&&["localhost","127.0.0.1","[::1]"].includes(host);
  if(!localDevelopment&&(!configuredToken||request.headers.get("x-setup-token")!==configuredToken))throw new AppError("Buat akun pertama dari localhost development atau gunakan ADMIN_SETUP_TOKEN.",403);
  if(typeof username!=="string"||!/^[a-zA-Z0-9_.-]{3,50}$/.test(username))throw new AppError("Username 3–50 karakter: huruf, angka, titik, garis atau underscore.");
  if(typeof password!=="string"||password.length<12||password.length>200)throw new AppError("Password minimal 12 karakter dan maksimal 200 karakter.");
  const salt=randomBytes(24).toString("hex");
  const user:Account={username,salt,passwordHash:scryptSync(password,salt,64).toString("hex"),secret:randomBytes(48).toString("hex")};
  if(cloudConfigured()){if(!await createCloudAdmin(user))throw new AppError("Akun admin sudah dibuat.",409);return user;}
  await mkdir(DATA_DIR,{recursive:true});
  try{await writeFile(FILE,JSON.stringify(user),{flag:"wx",mode:0o600});}catch(e){if((e as NodeJS.ErrnoException).code==="EEXIST")throw new AppError("Akun admin sudah dibuat.",409);throw e;}
  return user;
}
export async function login(request:Request,username:unknown,password:unknown){
  const key=request.headers.get("x-forwarded-for")?.split(",")[0]||"local";
  const now=Date.now();const attempt=attempts.get(key);
  if(attempt&&attempt.until>now&&attempt.count>=6)throw new AppError("Terlalu banyak percobaan. Coba lagi dalam 15 menit.",429);
  const user=await account();
  if(!user)throw new AppError("Buat akun admin terlebih dahulu.",409);
  if(typeof password!=="string"||password.length>200||typeof username!=="string")throw new AppError("Username atau password salah.",401);
  const hash=scryptSync(password,user.salt,64);
  if(username!==user.username||!timingSafeEqual(hash,Buffer.from(user.passwordHash,"hex"))){attempts.set(key,{count:attempt&&attempt.until>now?attempt.count+1:1,until:now+15*60*1000});throw new AppError("Username atau password salah.",401);}
  attempts.delete(key);return user;
}
function signature(value:string,secret:string){return createHmac("sha256",secret).update(value).digest("base64url");}
export function sessionCookie(user:Account){const payload=Buffer.from(JSON.stringify({user:user.username,expires:Date.now()+MAX_AGE*1000})).toString("base64url");const value=payload+"."+signature(payload,user.secret);return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${MAX_AGE}${process.env.NODE_ENV==="production"?"; Secure":""}`;}
export async function requireAdmin(request:Request){
  const token=request.headers.get("cookie")?.split(";").map(p=>p.trim()).find(p=>p.startsWith(COOKIE+"="))?.slice(COOKIE.length+1);
  const user=await account();
  if(!token||!user)throw new AppError("Silakan masuk sebagai admin.",401);
  try{const[payload,sig]=token.split(".");const expected=signature(payload,user.secret);const a=Buffer.from(sig||"");const b=Buffer.from(expected);if(a.length!==b.length||!timingSafeEqual(a,b))throw Error();const data=JSON.parse(Buffer.from(payload,"base64url").toString());if(data.user!==user.username||data.expires<Date.now())throw Error();return user.username;}catch{throw new AppError("Sesi habis. Silakan masuk kembali.",401);}
}

export async function getAdminSession(cookieHeader=""):Promise<AdminSession>{
  const storage=cloudConfigured()?"cloud":cloudRequired()?"unconfigured":"local";
  if(storage==="unconfigured")return {setupRequired:true,username:null,role:null,storage,storageError:"Hubungkan database Supabase pada environment hosting sebelum membuat akun admin."};
  try{
    const configured=Boolean(await account());
    if(!configured)return {setupRequired:true,username:null,role:null,storage};
    try{return {setupRequired:false,username:await requireAdmin(new Request("http://localhost/admin",{headers:{Cookie:cookieHeader}})),role:"admin",storage};}
    catch(error){if(error instanceof AppError&&error.status===401)return {setupRequired:false,username:null,role:null,storage};throw error;}
  }catch(error){if(storage==="cloud"&&error instanceof AppError)return {setupRequired:false,username:null,role:null,storage:"unavailable",storageError:error.message};throw error;}
}
