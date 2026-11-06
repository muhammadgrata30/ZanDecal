import "server-only";
import { AppError } from "./content-validation";

export interface StoredAdmin {username:string;salt:string;passwordHash:string;secret:string}
export function cloudConfigured(){return Boolean(process.env.SUPABASE_URL&&(process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY));}
export function cloudRequired(){return process.env.NETLIFY==="true"||Boolean(process.env.SUPABASE_URL||process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY);}
export function assertWritableStorage(){if(cloudRequired()&&!cloudConfigured())throw new AppError("Database belum terhubung. Konfigurasikan Supabase pada environment server terlebih dahulu.",503);}
export function cloudConfig(){
  const raw=process.env.SUPABASE_URL,key=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!raw||!key)throw new AppError("Database belum terhubung. Isi SUPABASE_URL dan SUPABASE_SECRET_KEY pada server.",503);
  let url:URL;try{url=new URL(raw);}catch{throw new AppError("Alamat database belum valid.",503);}
  if(url.username||url.password||url.pathname!=="/"||url.search||url.hash||(url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname))))throw new AppError("Alamat database harus berupa origin HTTPS project Supabase.",503);
  return {url:url.origin,key,bucket:"zan-media"};
}
export async function cloudFetch(resource:string,init:RequestInit={}){
  const config=cloudConfig();
  let response:Response;
  try{response=await fetch(config.url+resource,{...init,cache:"no-store",signal:init.signal||AbortSignal.timeout(30000),headers:{apikey:config.key,...(config.key.startsWith("eyJ")?{Authorization:`Bearer ${config.key}`}:{ }),...init.headers}});}
  catch{throw new AppError("Koneksi database/storage gagal. Coba lagi sebentar.",503);}
  if(!response.ok){
    const data=await response.json().catch(()=>({}));
    if(data.code==="40001"||data.code==="23505")throw new AppError("Data sudah berubah atau akun sudah dibuat. Muat ulang halaman.",409);
    if(response.status===404||data.code==="PGRST202"||data.code==="42P01")throw new AppError("Tabel atau fungsi database belum dipasang. Jalankan migration Supabase terlebih dahulu.",503);
    throw new AppError("Database/storage belum dapat memproses permintaan. Periksa konfigurasi server.",503);
  }
  return response;
}
export async function rpc<T>(name:string,body:Record<string,unknown>={}):Promise<T>{
  return (await cloudFetch(`/rest/v1/rpc/${name}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})).json() as Promise<T>;
}
export async function readCloudAdmin():Promise<StoredAdmin|null>{
  const rows=await (await cloudFetch("/rest/v1/zan_admin?singleton=eq.true&select=account&limit=1")).json() as {account:StoredAdmin}[];
  return rows[0]?.account||null;
}
export async function createCloudAdmin(account:StoredAdmin){return rpc<boolean>("zan_create_admin",{p_account:account});}
export function publicMediaUrl(filename:string){const config=cloudConfig();return `${config.url}/storage/v1/object/public/${config.bucket}/${encodeURIComponent(filename)}`;}
