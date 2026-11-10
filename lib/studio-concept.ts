import type {Design,Sticker} from '../components/experience/design';
import type {StudioVehicle} from '../components/vehiclePaint';
import type {FinishType} from './studio-finishes';
import {STUDIO_LIBRARY} from './studio-library';
import {VEHICLE_PANELS} from './studio-panels';
import {validateStudioAsset} from './studio-assets';
export const STUDIO_CONCEPT_KEY='zan-studio-concept-v1';
export type StudioConcept={vehicle:StudioVehicle;color:string;finish:FinishType;design:Design};
export const newStudioDesign=():Design=>({pattern:'none',accent:'#8fd3f4',scale:100,opacity:100,panel:'Seluruh bodi',stickers:[]});
const finite=(v:unknown,min:number,max:number)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
const vector=(v:unknown)=>Array.isArray(v)&&v.length===3&&v.every(n=>finite(n,-10,10));
export function validateStudioConcept(input:unknown):StudioConcept{
 if(!input||typeof input!=='object')throw new Error('Konsep studio tidak valid.');
 const s=input as StudioConcept,d=s.design;
 if(!['car','ducati'].includes(s.vehicle)||!/^#[0-9a-f]{6}$/i.test(s.color)||!['Glossy','Matte','Satin','Metallic'].includes(s.finish)||!d||!Array.isArray(d.stickers)||d.stickers.length>40)throw new Error('Konfigurasi studio tidak valid.');
 if(!/^#[0-9a-f]{6}$/i.test(d.accent)||!finite(d.scale,50,250)||!finite(d.opacity,0,100)||!['none','upload',...STUDIO_LIBRARY.filter(a=>a.kind==='livery').map(a=>a.pattern)].includes(d.pattern))throw new Error('Pengaturan livery tidak valid.');
 if(d.pattern==='upload')validateStudioAsset({id:'saved-livery',name:'Livery',kind:'livery',published:false,vehicle:s.vehicle,pattern:'upload',image:d.image});
 const stickers=d.stickers.map((sticker:Sticker)=>{
  if(!sticker||typeof sticker.id!=='string'||sticker.id.length>100||typeof sticker.name!=='string'||!sticker.name.trim()||sticker.name.length>80||!finite(sticker.x,0,100)||!finite(sticker.y,0,100)||!finite(sticker.size,15,150)||!finite(sticker.rotation,-180,180))throw new Error('Stiker tersimpan tidak valid.');
  if(sticker.point){if(!vector(sticker.point)||!vector(sticker.normal)||!sticker.normal!.some(n=>Math.abs(n)>.001)||typeof sticker.surfaceMesh!=='string'||!sticker.surfaceMesh||sticker.surfaceMesh.length>300)throw new Error('Titik stiker tidak valid.');}
  else if(!VEHICLE_PANELS[s.vehicle].some(p=>p.id===sticker.panel))throw new Error('Bagian kendaraan tidak sesuai.');
  if(sticker.image)validateStudioAsset({id:'saved-sticker',name:sticker.name,kind:'sticker',published:false,vehicle:s.vehicle,image:sticker.image});
  return {...sticker};
 });
 if(new Set(stickers.map(s=>s.id)).size!==stickers.length)throw new Error('ID stiker harus unik.');
 return {vehicle:s.vehicle,color:s.color,finish:s.finish,design:{pattern:d.pattern,...(d.image?{image:d.image}:{}),accent:d.accent,scale:d.scale,opacity:d.opacity,panel:'Seluruh bodi',stickers}};
}
