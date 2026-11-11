"use client";
import {useLayoutEffect,useMemo,useRef,useState} from 'react';
import Image from 'next/image';
import {ArrowUpRight,Images,Film,Search} from 'lucide-react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {useSiteContent} from './SiteContentContext';
import {portfolioCover,portfolioMedia,visiblePortfolio} from '../lib/portfolio';
import {publicImage} from '../lib/public-images';
import type {Portfolio} from '../lib/content-types';
import {ArchiveLink} from './ArchiveLink';
import {PortfolioAlbum} from './PortfolioAlbum';
import './portfolio-archive.css';
gsap.registerPlugin(ScrollTrigger);

export function PortfolioCollection({compact=false}:{compact?:boolean}){
 const content=useSiteContent(),root=useRef<HTMLDivElement>(null);
 const [filter,setFilter]=useState('all'),[query,setQuery]=useState(''),[selected,setSelected]=useState<Portfolio|null>(null);
 const projects=useMemo(()=>visiblePortfolio(content.portfolio),[content.portfolio]);
 const items=useMemo(()=>{
  const filtered=projects.filter(item=>(filter==='all'||item.category===filter)&&`${item.title} ${item.vehicleModel}`.toLowerCase().includes(query.toLowerCase()));
  return compact?filtered.slice(0,2):filtered;
 },[projects,filter,query,compact]);
 useLayoutEffect(()=>{
  if(!root.current)return;const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const context=gsap.context(()=>{
    gsap.fromTo('.archive-collection-heading',{autoAlpha:0,y:28},{autoAlpha:1,y:0,duration:.8,ease:'power3.out'});
    root.current?.querySelectorAll('.archive-project').forEach((card,index)=>{
     gsap.fromTo(card,{autoAlpha:0,y:45},{autoAlpha:1,y:0,duration:.85,delay:index%2*.08,ease:'power3.out',clearProps:'opacity,visibility,transform',scrollTrigger:{trigger:card,start:'top 94%',once:true}});
     const photo=card.querySelector('.archive-project-image>img');
     if(photo&&matchMedia('(min-width:768px)').matches)gsap.fromTo(photo,{scale:1.1,yPercent:-4},{scale:1.1,yPercent:4,ease:'none',scrollTrigger:{trigger:card,start:'top bottom',end:'bottom top',scrub:.6}});
    });
   },root);return()=>context.revert();
  });return()=>media.revert();
 },[items]);
 return <div ref={root} className="archive-collection" id="gallery-collection">
  <div className="archive-collection-heading"><h2>{compact?<>Arsip <em>karakter.</em></>:<>Gallery<em>.</em></>}<sup>({String(projects.length).padStart(2,'0')})</sup></h2><p>{compact?<>Beberapa karakter pilihan.<br/>Seluruh dokumentasinya ada di Gallery.</>:<>Satu katalog, satu proyek.<br/>Lihat foto, video, dan history pengerjaannya.</>}</p></div>
  {!compact&&<><div className="archive-toolbar"><div role="group" aria-label="Filter kategori galeri">{[['all','Semua'],['mobil','Mobil'],['motor','Motor'],['sticker','Custom Sticker']].map(([value,label])=><button key={value} type="button" aria-pressed={filter===value} onClick={()=>setFilter(value)}>{label}<sup>{value==='all'?projects.length:projects.filter(item=>item.category===value).length}</sup></button>)}</div><label><Search size={16}/><input type="search" aria-label="Cari katalog" placeholder="Cari kendaraan atau proyek…" value={query} onChange={event=>setQuery(event.target.value)}/></label></div><p className="archive-result" role="status">{String(items.length).padStart(2,'0')} KATALOG / FOTO & VIDEO</p></>}
  <div className="archive-projects">{items.map(item=>{
   const cover=portfolioCover(item)!,files=portfolioMedia(item);
   return <button className="archive-project" key={item.id} type="button" aria-label={`Buka album ${item.title}`} onClick={()=>setSelected(item)}><span className="archive-project-label"><span>{item.categoryLabel}</span><span>ZD / {String(item.id).padStart(3,'0')}</span></span><span className="archive-project-image">{cover.type==='photo'?<Image src={publicImage(cover.src)} alt={item.title} width={1536} height={1024} sizes="(max-width:760px) 90vw,55vw" unoptimized onLoad={()=>ScrollTrigger.refresh()}/>:<video src={cover.src} poster={cover.posterSrc||undefined} muted playsInline preload="metadata"/>}<span className="archive-media-count"><span><Images size={13}/>{files.filter(file=>file.type==='photo').length} foto</span><span><Film size={13}/>{files.filter(file=>file.type==='video').length} video</span></span></span><span className="archive-project-meta"><span><strong>{item.title}</strong><small>{item.vehicleModel}</small></span><span>Buka album <ArrowUpRight size={19}/></span></span></button>;
  })}</div>
  {!items.length&&<p className="archive-empty">Belum ada katalog yang cocok. Coba kategori atau kata pencarian lain.</p>}
  {compact&&<div className="archive-all"><p>Foto, video, dan dokumentasi setiap karakter.</p><ArchiveLink>Lihat semua arsip <ArrowUpRight size={24}/></ArchiveLink></div>}
  {selected&&<PortfolioAlbum item={selected} onClose={()=>setSelected(null)}/>}
 </div>;
}
