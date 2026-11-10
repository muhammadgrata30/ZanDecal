import type {Asset} from '../components/experience/design';
import {STUDIO_LIBRARY} from './studio-library';

export const STUDIO_ASSETS_KEY='zan-studio-assets-v1';
export const STUDIO_ASSETS_EVENT='zan-studio-assets-updated';
export type StudioLibrarySnapshot={revision:number;assets:Asset[]};
const patterns=new Set(STUDIO_LIBRARY.filter(a=>a.pattern).map(a=>a.pattern));
const hex=/^#[0-9a-f]{6}$/i;
export function validateStudioAsset(value:unknown):Asset{
 if(!value||typeof value!=='object')throw new Error('Data aset studio tidak valid.');
 const a=value as Record<string,unknown>;
 if(typeof a.id!=='string'||!a.id||a.id.length>100||typeof a.name!=='string'||!a.name.trim()||a.name.length>80||!['livery','sticker'].includes(String(a.kind))||!['all','car','ducati'].includes(String(a.vehicle))||typeof a.published!=='boolean')throw new Error('Nama, jenis, atau kendaraan aset tidak valid.');
 if(a.image!==undefined&&(typeof a.image!=='string'||a.image.length>2_850_000||!(/^\/stickers\/[a-z0-9-]+\.svg$/.test(a.image)||/^data:image\/(?:png|webp|jpeg);base64,[a-z0-9+/=]+$/i.test(a.image))))throw new Error('Gunakan gambar PNG, WebP, atau JPG maksimal 2 MB.');
 if(a.kind==='sticker'&&typeof a.image==='string'&&a.image.startsWith('data:image/jpeg'))throw new Error('Stiker harus PNG / WebP dengan transparansi.');
 if(a.kind==='livery'&&!(typeof a.pattern==='string'&&(patterns.has(a.pattern)||(a.pattern==='upload'&&a.image))))throw new Error('Jenis livery tidak didukung.');
 if(a.kind==='sticker'&&!a.image)throw new Error('Gambar stiker wajib diisi.');
 for(const field of ['base','accent'])if(a[field]!==undefined&&(typeof a[field]!=='string'||!hex.test(a[field] as string)))throw new Error('Warna aset tidak valid.');
 for(const field of ['category','description'])if(a[field]!==undefined&&(typeof a[field]!=='string'||(a[field] as string).length>300))throw new Error('Keterangan aset terlalu panjang.');
 return {id:a.id,name:a.name.trim(),kind:a.kind as Asset['kind'],vehicle:a.vehicle as string,published:a.published,...(a.image?{image:a.image as string}:{}),...(a.pattern?{pattern:a.pattern as string}:{}),...(a.base?{base:a.base as string}:{}),...(a.accent?{accent:a.accent as string}:{}),...(a.category?{category:a.category as string}:{}),...(a.description?{description:a.description as string}:{})};
}
export function defaultStudioAssets():StudioLibrarySnapshot{return {revision:0,assets:STUDIO_LIBRARY.map(a=>({...a}))};}
export function readStudioAssets():StudioLibrarySnapshot{
 const raw=localStorage.getItem(STUDIO_ASSETS_KEY);if(!raw)return defaultStudioAssets();
 const parsed=JSON.parse(raw);
 if(!Number.isSafeInteger(parsed?.revision)||parsed.revision<0||!Array.isArray(parsed.assets)||parsed.assets.length>80)throw new Error('Library Studio tersimpan tidak valid.');
 const assets=parsed.assets.map(validateStudioAsset);
 if(new Set(assets.map((a:Asset)=>a.id)).size!==assets.length)throw new Error('ID aset studio harus unik.');
 return {revision:parsed.revision,assets};
}
export function saveStudioAssets(candidate:StudioLibrarySnapshot):StudioLibrarySnapshot{
 const current=readStudioAssets();if(current.revision!==candidate.revision)throw new Error('Library berubah di tab lain. Muat ulang library sebelum menyimpan.');
 if(candidate.assets.length>80)throw new Error('Library Studio maksimal 80 aset.');
 const assets=candidate.assets.map(validateStudioAsset);
 if(new Set(assets.map(a=>a.id)).size!==assets.length)throw new Error('ID aset studio harus unik.');
 const saved={revision:current.revision+1,assets};
 try{localStorage.setItem(STUDIO_ASSETS_KEY,JSON.stringify(saved));}catch{throw new Error('Penyimpanan browser penuh atau tidak tersedia. Kurangi gambar dan coba lagi.');}
 window.dispatchEvent(new Event(STUDIO_ASSETS_EVENT));return saved;
}
