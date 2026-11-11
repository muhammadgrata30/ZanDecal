import type { SiteContent,PortfolioMedia,DocumentationStage } from "./content-types";

export class AppError extends Error { constructor(message:string,public status=400){super(message);} }
function object(value:unknown):Record<string,unknown>{if(!value||typeof value!=="object"||Array.isArray(value))throw new AppError("Format data tidak valid.");return value as Record<string,unknown>;}
function text(value:unknown,label:string,max=1000,required=false){if(typeof value!=="string"||value.length>max||(required&&!value.trim()))throw new AppError(`${label} tidak valid.`);return value.trim();}
function list(value:unknown,label:string,max=100){if(!Array.isArray(value)||value.length>max)throw new AppError(`${label} tidak valid.`);return value;}
function strings(value:unknown){return list(value,"Daftar detail",20).filter(v=>typeof v!=="string"||v.trim()).map(v=>text(v,"Detail",250,true));}
export function mediaUrl(value:unknown,required=false,inline=false){if(inline&&typeof value==="string"&&/^data:(image\/(jpeg|png|webp|gif)|video\/(mp4|webm));base64,[A-Za-z0-9+/=]+$/.test(value)&&value.length<3000000)return value;const url=text(value,"Alamat media",250,required);if(url&&!/^\/(?:images|videos|media)\/[a-zA-Z0-9_./-]+$/.test(url))throw new AppError("Gunakan media yang diunggah ke website.");if(url.includes(".."))throw new AppError("Alamat media tidak valid.");return url;}
function unique(ids:(string|number)[]){if(new Set(ids).size!==ids.length)throw new AppError("ID data tidak boleh sama.");}
function album(value:Record<string,unknown>,inline:boolean){
 if(value.media===undefined)return {};
 const media:PortfolioMedia[]=list(value.media,'Album dokumentasi',60).map(raw=>{
  const file=object(raw);
  if(!['photo','video'].includes(String(file.type))||!['archive','before','process','after'].includes(String(file.stage))||typeof file.published!=='boolean')throw new AppError('Jenis, tahap atau status dokumentasi tidak valid.');
  const date=text(file.date,'Tanggal dokumentasi',10);
  if(date&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(`${date}T12:00:00Z`))||new Date(`${date}T12:00:00Z`).toISOString().slice(0,10)!==date))throw new AppError('Tanggal dokumentasi tidak valid.');
  const duration=file.duration;
  const legacyVideo=duration===undefined&&file.id===`legacy-${value.id}`&&file.src===value.mediaSrc;
  if(file.type==='video'&&!legacyVideo&&(typeof duration!=='number'||!Number.isFinite(duration)||duration<=0||duration>30))throw new AppError('Video dokumentasi maksimal 30 detik dan harus memiliki durasi yang valid.');
  return {id:text(file.id,'ID dokumentasi',80,true),type:file.type as 'photo'|'video',src:mediaUrl(file.src,true,inline),posterSrc:mediaUrl(file.posterSrc??'',false,inline),caption:text(file.caption,'Caption dokumentasi',180),date,stage:file.stage as DocumentationStage,published:file.published,...(file.type==='video'&&!legacyVideo?{duration:Number(duration)}:{})};
 });
 unique(media.map(file=>file.id));
 const coverId=value.coverId===undefined?undefined:text(value.coverId,'Foto cover',80);
 if(coverId&&!media.some(file=>file.id===coverId))throw new AppError('Cover harus berasal dari album proyek ini.');
 return {media,...(coverId?{coverId}:{})};
}
export function validateContent(input:unknown,inline=false):SiteContent{
  const data=object(input);
  if(!Number.isInteger(data.revision)||Number(data.revision)<0)throw new AppError("Versi data tidak valid.");
  const materials=list(data.materials,"Bahan",80).map(raw=>{const v=object(raw);return {id:text(v.id,"ID bahan",80,true),name:text(v.name,"Nama bahan",150,true),origin:text(v.origin,"Asal bahan",150),type:text(v.type,"Jenis bahan",150),features:strings(v.features),badge:text(v.badge,"Label",100),gradient:"from-[#A18CD1] to-[#8FD3F4]",desc:text(v.desc,"Deskripsi bahan",2000),specCode:text(v.specCode,"Kode",100),elongation:text(v.elongation,"Elastisitas",100),tempRange:text(v.tempRange,"Suhu",100)};});
  const colors=list(data.colors,"Warna",40).map(raw=>{const v=object(raw);const hex=text(v.hex,"Kode warna",7,true);if(!/^#[0-9a-f]{6}$/i.test(hex))throw new AppError("Warna harus berupa kode hex 6 digit.");return{id:text(v.id,"ID warna",80,true),name:text(v.name,"Nama warna",100,true),hex,desc:text(v.desc,"Deskripsi warna",300),accent:"",pantone:text(v.pantone,"Kode warna bahan",100)};});
  if(!colors.length)throw new AppError("Minimal satu preset warna diperlukan.");
  const portfolio=list(data.portfolio,"Portofolio",300).map(raw=>{const v=object(raw);if(!Number.isSafeInteger(v.id)||Number(v.id)<1)throw new AppError("ID portofolio tidak valid.");if(!["mobil","motor","sticker"].includes(String(v.category))||!["photo","video"].includes(String(v.mediaType)))throw new AppError("Kategori atau jenis media tidak valid.");return{id:Number(v.id),title:text(v.title,"Judul portofolio",150,true),category:v.category as "mobil"|"motor"|"sticker",categoryLabel:({mobil:"Mobil",motor:"Motor",sticker:"Custom Sticker"})[v.category as "mobil"|"motor"|"sticker"],mediaType:v.mediaType as "photo"|"video",mediaSrc:mediaUrl(v.mediaSrc,true,inline),posterSrc:mediaUrl(v.posterSrc,false,inline),materialBrand:text(v.materialBrand,"Bahan portofolio",150),finishType:text(v.finishType,"Finishing",150),gradient:"",vehicleModel:text(v.vehicleModel,"Kendaraan",150,true),description:text(v.description,"Deskripsi portofolio",3000),transformationHighlights:strings(v.transformationHighlights),...album(v,inline)};});
  unique(materials.map(v=>v.id));unique(colors.map(v=>v.id));unique(portfolio.map(v=>v.id));
  return{revision:Number(data.revision),materials,portfolio,colors,showcaseVideo:mediaUrl(data.showcaseVideo,false,inline),showcasePoster:mediaUrl(data.showcasePoster,false,inline)};
}
