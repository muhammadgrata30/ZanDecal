"use client";
import {useEffect,useLayoutEffect,useMemo,useRef,useState} from 'react';
import Image from 'next/image';
import {ArrowLeft,ArrowRight,ArrowUpRight,Film,Play,X} from 'lucide-react';
import gsap from 'gsap';
import type {Portfolio} from '../lib/content-types';
import {documentationDate,historyGroups,portfolioMedia,STAGE_LABELS} from '../lib/portfolio';
import {publicImage} from '../lib/public-images';

export function PortfolioAlbum({item,onClose}:{item:Portfolio;onClose:()=>void}){
 const files=useMemo(()=>portfolioMedia(item),[item]),dialog=useRef<HTMLDialogElement>(null),track=useRef<HTMLDivElement>(null),first=useRef(true),swipe=useRef<{x:number;y:number}|null>(null);
 const [index,setIndex]=useState(()=>Math.max(0,files.findIndex(file=>file.id===item.coverId))),[tab,setTab]=useState<'album'|'history'>('album'),[groupBy,setGroupBy]=useState<'date'|'stage'>('date');
 const active=files[index],groups=useMemo(()=>historyGroups(files,groupBy),[files,groupBy]);
 useLayoutEffect(()=>{
  const node=dialog.current;if(!node)return;
  const focused=document.activeElement,overflow=document.body.style.overflow;document.body.style.overflow='hidden';node.showModal();
  const tween=matchMedia('(prefers-reduced-motion: reduce)').matches?null:gsap.fromTo(node,{autoAlpha:0,y:28,scale:.98},{autoAlpha:1,y:0,scale:1,duration:.5,ease:'power3.out',clearProps:'transform,opacity,visibility'});
  return()=>{tween?.kill();node.querySelectorAll('video').forEach(video=>video.pause());node.close();document.body.style.overflow=overflow;if(focused instanceof HTMLElement&&focused.isConnected)focused.focus();};
 },[]);
 useLayoutEffect(()=>{
  const instant=first.current||matchMedia('(prefers-reduced-motion: reduce)').matches;first.current=false;
  const tween=gsap.to(track.current,{xPercent:-index*100,duration:instant?0:.65,ease:'power3.inOut',overwrite:true});return()=>{tween.kill();};
 },[index]);
 useEffect(()=>{dialog.current?.querySelectorAll('video').forEach(video=>video.pause());},[index]);
 const move=(direction:number)=>setIndex(value=>(value+direction+files.length)%files.length);
 if(!active)return null;
 return <dialog ref={dialog} className="archive-album" aria-labelledby={`album-title-${item.id}`} data-lenis-prevent onCancel={onClose} onClick={event=>{if(event.target!==event.currentTarget)return;const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)onClose();}} onKeyDown={event=>{if((event.target as HTMLElement).closest('input,select,textarea,video'))return;if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}if(event.key==='ArrowRight'){event.preventDefault();move(1);}}}>
  <header className="archive-album-header"><span>ZD / {String(item.id).padStart(3,'0')}</span><span>THE CHARACTER ARCHIVE</span><button type="button" aria-label="Tutup album" onClick={onClose}><X size={20}/></button></header>
  <div className="archive-album-body"><div className="archive-album-media"><div className="archive-viewer" onTouchStart={event=>{if((event.target as HTMLElement).closest('video'))return;const t=event.touches[0];swipe.current={x:t.clientX,y:t.clientY};}} onTouchEnd={event=>{if(!swipe.current)return;const t=event.changedTouches[0],dx=t.clientX-swipe.current.x,dy=t.clientY-swipe.current.y;swipe.current=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.25)move(dx<0?1:-1);}}><div ref={track} className="archive-slider-track">{files.map((file,i)=><div className="archive-slide" key={file.id} aria-hidden={i!==index}>{file.type==='photo'?Math.abs(i-index)<=1&&<Image src={publicImage(file.src)} alt={file.caption||item.title} width={1536} height={1024} sizes="(max-width:760px) 95vw,650px" unoptimized/>:i===index?<video src={file.src} poster={file.posterSrc||undefined} controls playsInline preload="metadata" aria-label={file.caption||'Video dokumentasi'} onTimeUpdate={event=>{if(event.currentTarget.currentTime>30){event.currentTarget.pause();event.currentTarget.currentTime=0;}}}/>:file.posterSrc?<Image src={publicImage(file.posterSrc)} alt="" width={650} height={450} unoptimized/>:<Film size={38}/>}</div>)}</div><span className="archive-stage-badge">{STAGE_LABELS[active.stage]}</span></div>
   <div className="archive-slide-controls"><span>{active.caption||item.title}</span><div><button type="button" onClick={()=>move(-1)} disabled={files.length<2} aria-label="Media sebelumnya"><ArrowLeft size={18}/></button><span aria-live="polite">{String(index+1).padStart(2,'0')} / {String(files.length).padStart(2,'0')}</span><button type="button" onClick={()=>move(1)} disabled={files.length<2} aria-label="Media berikutnya"><ArrowRight size={18}/></button></div></div>
   <div className="archive-thumbnails" aria-label="Pilih foto atau video">{files.map((file,i)=><button key={file.id} type="button" aria-label={`Media ${i+1}: ${file.caption||file.type}`} aria-pressed={index===i} onClick={()=>setIndex(i)}>{file.type==='photo'||file.posterSrc?<Image src={publicImage(file.type==='photo'?file.src:file.posterSrc)} alt="" width={100} height={70} unoptimized/>:<Film size={24}/>} {file.type==='video'&&<Play size={15} className="archive-thumb-play"/>}</button>)}</div><p className="archive-slider-hint">Geser foto, gunakan panah, atau pilih thumbnail untuk menjelajahi album.</p>
  </div><div className="archive-album-copy"><span className="archive-kicker">{item.categoryLabel} / {item.vehicleModel}</span><h2 id={`album-title-${item.id}`}>{item.title}</h2><p>{item.description}</p><dl><div><dt>MATERIAL</dt><dd>{item.materialBrand||'—'}</dd></div><div><dt>FINISH</dt><dd>{item.finishType||'—'}</dd></div></dl>
   <div className="archive-tabs" role="group" aria-label="Tampilan dokumentasi"><button type="button" aria-pressed={tab==='album'} onClick={()=>setTab('album')}>Album <sup>{files.length}</sup></button><button type="button" aria-pressed={tab==='history'} onClick={()=>setTab('history')}>History dokumentasi</button></div>
   {tab==='album'?<div className="archive-album-list">{files.map((file,i)=><button type="button" key={file.id} aria-current={i===index?'true':undefined} onClick={()=>setIndex(i)}><span>{String(i+1).padStart(2,'0')}</span><span><strong>{file.caption||STAGE_LABELS[file.stage]}</strong><small>{documentationDate(file.date)} / {STAGE_LABELS[file.stage]}</small></span>{file.type==='video'?<Film size={16}/>:<ArrowUpRight size={16}/>}</button>)}</div>:<><label className="archive-history-sort">Kelompokkan history<select value={groupBy} onChange={event=>setGroupBy(event.target.value as 'date'|'stage')}><option value="date">Tanggal dokumentasi</option><option value="stage">Tahap pengerjaan</option></select></label><ol className="archive-history">{groups.map(group=><li key={group.key}><h3>{group.label}</h3>{group.files.map(file=><button key={file.id} type="button" onClick={()=>setIndex(files.indexOf(file))}><span>{groupBy==='date'?STAGE_LABELS[file.stage]:documentationDate(file.date)}</span>{file.caption||item.title}{file.type==='video'&&<Film size={14}/>}</button>)}</li>)}</ol></>}
   <a className="archive-consult" href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Zan Decal, saya ingin konsultasi konsep seperti ${item.title}.`)}`} target="_blank" rel="noopener noreferrer">Konsultasikan karaktermu <ArrowUpRight size={21}/></a>
  </div></div>
 </dialog>;
}
