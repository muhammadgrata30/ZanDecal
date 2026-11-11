"use client";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight, Check, Palette, Layers, Sticker as StickerIcon, Save, Download } from "lucide-react";
import { useSiteContent } from "../SiteContentContext";
import { FINISH_SPECS, type FinishType } from "../../lib/studio-finishes";
import { useTheme } from "../ThemeContext";
import type { StudioVehicle } from "../vehiclePaint";
import { STUDIO_VEHICLES } from "../../lib/studio-vehicles";
import { useStudioMotion } from "./useStudioMotion";
import {LiveryControls,StickerControls} from '../StudioControls';
import {useStudioLibrary} from './useStudioLibrary';
import type {Asset,Design,Sticker} from './design';
import {findPanel} from '../../lib/studio-panels';
import {readStudioAssets} from '../../lib/studio-assets';
import {newStudioDesign,validateStudioConcept,STUDIO_CONCEPT_KEY} from '../../lib/studio-concept';
import '../studio-livery.css';
import "./motor-experience.css";
import "./motor-studio-brand.css";
const Scene=dynamic(()=>import("./MotorStudioScene"),{ssr:false,loading:()=>null});
class MotorBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onFailure();}
  render(){return this.state.failed?<div className="motor-loading"><p>Preview 3D belum dapat dimuat.</p><a href="#konsultasi">Konsultasikan konsep <ArrowUpRight size={16}/></a></div>:this.props.children;}
}
export function MotorStudio(){
  const root=useRef<HTMLElement>(null);
  const [mounted,setMounted]=useState(false);
  const [active,setActive]=useState(false);
  const [entered,setEntered]=useState(false);
  const entranceProgress=useRef(0);
  const directPreview=useRef(false);
  const setEntranceProgress=useCallback((progress:number)=>{entranceProgress.current=directPreview.current?1:progress;window.dispatchEvent(new Event("zan-studio-progress"));},[]);
  const [ready,setReady]=useState(false);
  const [colorId,setColorId]=useState("");
  const [customColor,setCustomColor]=useState('');
  const [tab,setTab]=useState('warna');
  const [design,setDesign]=useState<Design>(newStudioDesign);
  const [pending,setPending]=useState<Asset|null>(null),[panel,setPanel]=useState('tank-left'),[selected,setSelected]=useState('');
  const [picking,setPicking]=useState(false),[placement,setPlacement]=useState<Record<string,boolean>>({}),[notice,setNotice]=useState('');
  const noticeTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const notify=useCallback((message:string)=>{setNotice(message);if(noticeTimer.current)clearTimeout(noticeTimer.current);noticeTimer.current=setTimeout(()=>setNotice(''),4500)},[]);
  useEffect(()=>()=>{if(noticeTimer.current)clearTimeout(noticeTimer.current)},[]);
  const {library,error:libraryError}=useStudioLibrary();
  const onPlacement=useCallback((id:string,status:boolean)=>setPlacement(previous=>previous[id]===status?previous:{...previous,[id]:status}),[]);
  const [finish,setFinish]=useState<FinishType>("Glossy");
  const [view,setView]=useState("orbit");
  const [grid,setGrid]=useState(true);
  const [resetKey,setResetKey]=useState(0);

  const [vehicle,setVehicle]=useState<StudioVehicle>("ducati");
  const selectedVehicle=STUDIO_VEHICLES[vehicle];
  const {colors}=useSiteContent();
  const color=colors.find(item=>item.id===colorId)||colors[1]||colors[0];
  const baseColor=customColor||color?.hex||'#A18CD1';
  const colorName=customColor?(colors.find(c=>c.hex.toLowerCase()===customColor.toLowerCase())?.name||'Custom '+customColor):(color?.name||'Lavender');
  const available=library.assets.filter(a=>a.published&&(a.vehicle==='all'||a.vehicle===vehicle));
  const activeLivery=library.assets.find(a=>a.pattern===design.pattern&&a.image===design.image)?.name||(design.pattern==='none'?'Tanpa livery':'Motif custom');
  const update=(patch:Partial<Design>)=>setDesign(current=>({...current,...patch}));
  const applyLivery=(asset:Asset,kit=true,target:StudioVehicle=vehicle)=>{
    if(asset.base)setCustomColor(asset.base);
    const stickers:Sticker[]=[];
    if(kit&&asset.category!=='Militer'&&asset.pattern&&asset.pattern!=='upload'){
      (target==='car'?['front-door-left','front-door-right']:['tank-left','tank-right']).forEach((id,i)=>stickers.push({id:'kit-'+crypto.randomUUID(),name:'Nomor 27',image:'/stickers/number-27.svg',panel:id,x:50,y:50,size:target==='car'?90:80,rotation:0,side:i?'Kanan':'Kiri'}));
      stickers.push({id:'kit-'+crypto.randomUUID(),name:'ZAN Racing',image:'/stickers/zan-racing.svg',panel:target==='car'?'hood':'front-cowl',x:50,y:50,size:90,rotation:0,side:'Kiri'});
    }
    setDesign(current=>({...current,pattern:asset.pattern||'upload',image:asset.image,accent:asset.accent||current.accent,scale:100,opacity:100,stickers:[...current.stickers.filter(s=>!s.id.startsWith('kit-')).slice(0,40-stickers.length),...stickers]}));
    setTab('livery');setPicking(false);setView('orbit');notify(asset.name+' diterapkan');
  };
  const install=(asset=pending,target:StudioVehicle=vehicle,part=panel)=>{
    if(!asset)return;if(design.stickers.length>=40){notify('Maksimal 40 stiker per konsep. Hapus satu lapisan terlebih dahulu.');return;}
    const p=findPanel(target,part),id=crypto.randomUUID();
    setDesign(current=>({...current,stickers:[...current.stickers,{id,name:asset.name,text:asset.name,image:asset.image,panel:p.id,x:50,y:50,size:100,rotation:0,side:p.sign<0?'Kanan':'Kiri'}]}));
    setSelected(id);setView(p.camera);setPicking(false);setTab('stiker');notify('Menempelkan '+asset.name+' di '+p.label.toLowerCase());
  };
  const pickSurface=(point:[number,number,number],normal:[number,number,number],surfaceMesh:string)=>{
    if(!pending)return;if(design.stickers.length>=40){notify('Maksimal 40 stiker per konsep.');setPicking(false);return;}
    const id=crypto.randomUUID();setDesign(current=>({...current,stickers:[...current.stickers,{id,name:pending.name,text:pending.name,image:pending.image,panel:'custom',point,normal,surfaceMesh,x:50,y:50,size:100,rotation:0,side:'Kiri'}]}));setSelected(id);setPicking(false);notify('Stiker dipasang di titik pilihanmu');
  };
  const saveConcept=()=>{try{const saved=validateStudioConcept({vehicle,color:baseColor,finish,design});localStorage.setItem(STUDIO_CONCEPT_KEY,JSON.stringify(saved));notify('Konsep disimpan di browser ini.')}catch(e){notify(e instanceof DOMException?'Penyimpanan penuh atau tidak tersedia. Kurangi gambar lalu coba lagi.':(e as Error).message)}};
  const download=()=>{const canvas=root.current?.querySelector<HTMLCanvasElement>('.motor-canvas canvas');if(!canvas||!ready){notify('Tunggu preview 3D selesai dimuat.');return;}try{const a=document.createElement('a');a.download='zan-konsep-'+vehicle+'.png';a.href=canvas.toDataURL('image/png');a.click();}catch{notify('Preview belum dapat diunduh. Coba muat ulang model.')}};
  useEffect(()=>{const frame=requestAnimationFrame(()=>{
    try{const raw=localStorage.getItem(STUDIO_CONCEPT_KEY);if(raw){const saved=validateStudioConcept(JSON.parse(raw));setVehicle(saved.vehicle);setCustomColor(saved.color);setFinish(saved.finish);setDesign(saved.design);setPanel(findPanel(saved.vehicle).id);}}
    catch{notify('Konsep tersimpan tidak dapat dimuat. Kamu bisa memulai konsep baru.');}
    const id=new URLSearchParams(location.search).get('studioAsset');if(!id)return;
    try{const asset=readStudioAssets().assets.find(a=>a.id===id);if(!asset||(!asset.published&&sessionStorage.getItem('zan-dummy-session')!=='zandecal'))return;
      const target:StudioVehicle=asset.vehicle==='car'?'car':'ducati';setVehicle(target);setPanel(findPanel(target).id);setDesign(newStudioDesign());directPreview.current=true;entranceProgress.current=1;setEntered(true);
      if(asset.kind==='livery')applyLivery(asset,true,target);else install(asset,target,findPanel(target).id);
    }catch{notify('Aset preview tidak dapat dimuat.');}
  });return()=>cancelAnimationFrame(frame)},[]);
  const {theme}=useTheme();
  const onReady=useCallback(()=>setReady(true),[]);
  const beginEntrance=useCallback(()=>setEntered(true),[]);
  useStudioMotion(root,beginEntrance,setEntranceProgress);
  useEffect(()=>{
    const element=root.current;if(!element)return;
    let visible=false;
    const update=()=>setActive(visible&&!document.hidden);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)setMounted(true);update();},{rootMargin:"180px"});
    observer.observe(element);document.addEventListener("visibilitychange",update);
    return()=>{observer.disconnect();document.removeEventListener("visibilitychange",update);};
  },[]);
  const consult=()=>{
    const message=`Halo Zan Decal, saya ingin konsultasi konsep 3D:\nKendaraan: ${selectedVehicle.name}\nWarna cat utama: ${colorName} (${baseColor})\nFinishing: ${finish}\nLivery: ${activeLivery}\nStiker: ${design.stickers.length?design.stickers.map(s=>s.name+" / "+(s.point?"Titik custom":findPanel(vehicle,s.panel).label)).join(", "):"Tanpa stiker"}`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
  };
  return <div className="motor-studio-runway"><section ref={root} id="3d-studio" className="motor-studio studio-livery" data-nav-align="viewport" data-entered={entered} aria-labelledby="motor-studio-title">
    <header className="motor-studio-heading"><div><h2 id="motor-studio-title"><span>Detailnya</span><br/>bicara sendiri.</h2><div className="motor-gallery-rule" aria-hidden="true"/></div></header>
    <div className="motor-workspace">
      <div className="motor-preview" role="group" aria-label={`Preview 3D ${selectedVehicle.name}`}>
        <div className="motor-view-buttons" role="group" aria-label="Sudut kamera studio">{[["orbit","Perspektif"],["front","Depan"],["side","Kiri"],["right","Kanan"],["top","Atas"]].map(([id,label])=><button type="button" key={id} aria-pressed={view===id} onClick={()=>setView(id)}>{label}</button>)}</div>
        <div className="motor-canvas" data-picking={picking}>{!ready&&<p className="motor-loading" role="status">Menyiapkan {selectedVehicle.label}…</p>}<MotorBoundary key={vehicle} onFailure={onReady}>{mounted&&<Scene vehicle={vehicle} color={baseColor} finish={finish} dark={theme==="dark"} active={active} view={view} grid={grid} resetKey={resetKey} enter={entered} entranceProgress={entranceProgress} background={theme==="dark"?"#17141d":"#f5f3ef"} gridTone={theme==="dark"?"#7193b0":"#86abc8"} onReady={onReady} design={design} picking={picking} onSurfacePick={pickSurface} onPlacement={onPlacement} onLiveryError={notify}/>}</MotorBoundary></div>
        {picking&&<div className="pick-banner"><span>Klik permukaan model untuk menempelkan {pending?.name}</span><button type="button" onClick={()=>setPicking(false)}>Batal</button></div>}
        <div className="motor-preview-tools"><div><button type="button" aria-pressed={grid} onClick={()=>setGrid(value=>!value)}>Grid {grid?"aktif":"nonaktif"}</button><button type="button" onClick={()=>setResetKey(value=>value+1)} disabled={!ready}>Pas ke layar ↗</button></div><button type="button" aria-label="Unduh preview kendaraan" disabled={!ready} onClick={download}><Download size={16}/></button></div>
        <p className="motor-interaction-hint">Cubit dua jari atau Ctrl + scroll untuk zoom. Geser untuk memutar.</p>
      </div>
      <aside className="motor-settings">
        <div className="motor-vehicle-select" role="group" aria-label="Pilih kendaraan studio">{(Object.keys(STUDIO_VEHICLES) as StudioVehicle[]).map(id=><button type="button" key={id} aria-pressed={vehicle===id} onClick={()=>{if(vehicle!==id){setReady(false);setView('orbit');setVehicle(id);setPending(null);setSelected('');setPicking(false);setPlacement({});setPanel(findPanel(id).id);setDesign(newStudioDesign());}}}>{STUDIO_VEHICLES[id].label}</button>)}</div>
        <span className="motor-model-label">{selectedVehicle.name}</span>
        <div className="editor-tabs" role="group" aria-label="Pengaturan desain">{[{id:'warna',label:'Warna',Icon:Palette},{id:'livery',label:'Livery',Icon:Layers},{id:'stiker',label:'Stiker',Icon:StickerIcon}].map(({id,label,Icon})=><button type="button" key={id} aria-pressed={tab===id} onClick={()=>{setTab(id);setPicking(false)}}><Icon size={15}/>{label}</button>)}</div>
        {libraryError&&<p className="micro" role="status">Library tersimpan belum dapat dibaca. Koleksi awal tetap tersedia.</p>}
        <div className="control-scroll">
          {tab==='warna'&&<><fieldset><legend>Warna utama <strong>{colorName}</strong></legend><div className="motor-palette">{colors.map(item=><button type="button" key={item.id} aria-label={'Cat utama '+item.name} title={item.name} aria-pressed={baseColor.toLowerCase()===item.hex.toLowerCase()} style={{backgroundColor:item.hex}} onClick={()=>{setColorId(item.id);setCustomColor('')}}>{baseColor.toLowerCase()===item.hex.toLowerCase()&&<Check size={17}/>}</button>)}</div></fieldset><fieldset><legend>Finishing</legend><div className="motor-finishes">{(Object.keys(FINISH_SPECS) as FinishType[]).map(item=><button type="button" key={item} aria-pressed={finish===item} onClick={()=>setFinish(item)}>{item}</button>)}</div></fieldset><p className="tip">Mulai dengan warna dasar. Pilih paket livery, lalu tempel logo atau nomor dari tab Stiker.</p></>}
          {tab==='livery'&&<LiveryControls key={vehicle} vehicle={vehicle} assets={available} design={design} onApply={applyLivery} onChange={update}/>}
          {tab==='stiker'&&<StickerControls key={vehicle} vehicle={vehicle} assets={available} design={design} selected={selected} setSelected={setSelected} pending={pending} setPending={setPending} panel={panel} setPanel={setPanel} onInstall={()=>install()} onChange={patch=>{if(patch.stickers&&patch.stickers.length>40){notify('Maksimal 40 stiker per konsep.');return;}update(patch)}} onView={setView} status={placement} notify={notify} picking={picking} onPick={()=>{setPicking(!picking);if(!picking){setView('orbit');root.current?.querySelector('.motor-preview')?.scrollIntoView({behavior:'smooth',block:'center'})}}}/>}
        </div>
        <div className="design-summary"><span>KONSEPMU</span><p>{colorName} / {finish}<br/><b>{activeLivery}</b> · {design.stickers.length} stiker</p></div>
        <div className="save-row"><button type="button" onClick={saveConcept}><Save size={15}/> Simpan konsep</button><button type="button" onClick={()=>{if(confirm('Reset desain kendaraan ini?')){setDesign(newStudioDesign());setCustomColor('');setPicking(false);setSelected('');setFinish('Glossy');notify('Konsep direset.')}}}>Reset</button></div>
        <p className="studio-notice" role="status" aria-live="polite">{notice}</p>
        <button type="button" className="motor-consult" onClick={consult}>Konsultasikan konsep <ArrowUpRight size={19}/></button>
        <small>Warna dan livery di layar merupakan simulasi. Konfirmasi desain final, file cetak, dan material bersama tim studio.</small>
      </aside>
    </div>
    <p className="motor-credit">Model {vehicle==="ducati"?"Ducati":"BYD Seal"} oleh <a href={vehicle==="ducati"?"https://sketchfab.com/3d-models/2024-ducati-streetfighter-v4-s-c501252f8af64c559bf91dc306c3a550":"https://sketchfab.com/3d-models/2024-byd-seal-2e82d2aaaa3d47debf39b1160d3fe376"} target="_blank" rel="noopener noreferrer">{vehicle==="ducati"?"OUTPISTON":"Ddiaz Design"}</a> · CC BY-NC-SA 4.0 · Warna preview disesuaikan.</p>
  </section></div>;
}
