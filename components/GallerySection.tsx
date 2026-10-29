
"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MotionHead, ScrollStage } from "./ScrollStage";

import { ArrowUpRight, X, CheckCircle2, Send } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  category: "mobil" | "motor" | "sticker";
  categoryLabel: string;
  mediaType: "video" | "photo";
  videoDuration?: string;
  materialBrand: string;
  finishType: string;
  gradient: string;
  vehicleModel: string;
  description: string;
  transformationHighlights: string[];
}

const ALL_ITEMS: PortfolioItem[] = [
{ id:1,title:"Ferrari 488 GTB / Magenta Edition",category:"mobil",categoryLabel:"Mobil",mediaType:"photo",materialBrand:"Premium Cast Vinyl",finishType:"Cyber Magenta & Stealth Black",gradient:"",vehicleModel:"Ferrari 488 GTB",description:"Eksplorasi cyber magenta dengan detail hitam pada bodi Ferrari.",transformationHighlights:["Wrapping panel bodi","Aksen hitam pada detail kendaraan"] },
{ id:2,title:"Ford F-150 Raptor / Stealth Edition",category:"mobil",categoryLabel:"Mobil",mediaType:"photo",materialBrand:"Premium Cast Vinyl",finishType:"Matte Black & Sky Blue",gradient:"",vehicleModel:"Ford F-150 Raptor",description:"Matte black dengan aksen sky blue untuk karakter pickup yang tegas.",transformationHighlights:["Wrapping panel pickup","Grafis sky blue pada sisi bodi"] },
{ id:3,title:"KTM 1290 Super Duke R / Street Edition",category:"motor",categoryLabel:"Motor",mediaType:"photo",materialBrand:"Premium Cast Vinyl",finishType:"Stealth Black & Lavender",gradient:"",vehicleModel:"KTM 1290 Super Duke R",description:"Panel hitam dan detail lavender berpadu dengan rangka oranye KTM.",transformationHighlights:["Custom decal panel tangki","Aksen lavender pada panel hitam"] },
{ id:4,title:"Yamaha YZF-R1 / Sky Edition",category:"motor",categoryLabel:"Motor",mediaType:"photo",materialBrand:"Premium Cast Vinyl",finishType:"Sky Blue & Soft Pink",gradient:"",vehicleModel:"Yamaha YZF-R1",description:"Fairing sky blue dengan garis soft pink untuk tampilan R1 yang berbeda.",transformationHighlights:["Custom livery fairing","Striping soft pink"] }
];
const GALLERY_IMAGES: Record<number,string>={1:"/images/gallery-ferrari-magenta.png",2:"/images/gallery-raptor-black.png",3:"/images/gallery-ktm-black.png",4:"/images/gallery-yamaha-r1-blue.png"};

export function GallerySection() {
  const [activeFilter,setActiveFilter]=useState<"semua"|"mobil"|"motor"|"sticker">("semua");
  const [selectedItem,setSelectedItem]=useState<PortfolioItem|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const modal=dialog.current;
    if(selectedItem && modal && !modal.open) modal.showModal();
    if(!selectedItem && modal?.open) modal.close();
    if(!selectedItem) return;
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return ()=>{document.body.style.overflow=previous;};
  },[selectedItem]);
  const filtered=activeFilter==="semua"?ALL_ITEMS:ALL_ITEMS.filter(item=>activeFilter==="sticker" ? item.category==="motor" : item.category===activeFilter);
  const handleOrderSimilar=(item:PortfolioItem)=>{
    const text=[
      'Halo Studio Zan Decal, saya tertarik dengan arah desain "'+item.title+'".',
      'Kendaraan: '+item.vehicleModel, 'Bahan: '+item.materialBrand, 'Finishing: '+item.finishType,
      'Saya ingin konsultasi rancangan decal serupa untuk kendaraan saya.'
    ].join("\n");
    window.open('https://wa.me/6281234567890?text='+encodeURIComponent(text),'_blank','noopener,noreferrer');
  };
  return <section id="galeri" className="editorial-gallery">
    <ScrollStage distance={.55} className="gallery-stage"><div className="gallery-masthead">
      <div className="gallery-masthead-copy"><span className="editorial-kicker">05 / GALERI</span><MotionHead><span>BUILT TO</span><span><em>STAND OUT.</em></span></MotionHead><p>Setiap kendaraan punya cerita.<br/>Setiap detail mencerminkan karakter.</p><a href="#gallery-collection" className="editorial-link">Jelajahi karya <ArrowUpRight size={18}/></a></div>
    </div></ScrollStage>
    <div className="gallery-collection" id="gallery-collection">
      <div className="gallery-toolbar"><span className="editorial-kicker">SELECTED DIRECTIONS / 01–04</span><div role="group" aria-label="Filter galeri">{([["semua","Semua"],["mobil","Mobil"],["motor","Motor"],["sticker","Custom Sticker"]] as const).map(([id,label])=><button type="button" key={id} aria-pressed={activeFilter===id} onClick={()=>setActiveFilter(id)}>{label}</button>)}</div></div>
      <div className="gallery-editorial-grid">{filtered.map((item,index)=><button type="button" key={item.id} onClick={()=>setSelectedItem(item)} className={"gallery-project project-"+(index%4)} aria-label={"Lihat detail "+item.title}>
        <div className="gallery-project-image"><Image src={GALLERY_IMAGES[item.id]} alt={item.vehicleModel+" â€” inspirasi "+item.finishType} fill sizes="(max-width:760px) 100vw, 60vw"/><span className="project-open"><ArrowUpRight size={24}/></span></div>
        <div className="gallery-project-meta"><div><small>{String(item.id).padStart(2,"0")} / {item.categoryLabel}</small><h3>{item.title}</h3></div><span>{item.finishType}</span></div>
      </button>)}</div><p className="gallery-disclosure">Visual merupakan inspirasi desain. Detail material dan pengerjaan dapat dibahas saat konsultasi.</p>
    </div>
    <dialog ref={dialog} className="gallery-dialog" onCancel={()=>setSelectedItem(null)} onClose={()=>setSelectedItem(null)} onClick={event=>{if(event.target===event.currentTarget)setSelectedItem(null);}} aria-labelledby="gallery-dialog-title">
      {selectedItem&&<div className="gallery-dialog-content"><button type="button" className="gallery-dialog-close" aria-label="Tutup detail" onClick={()=>setSelectedItem(null)}><X size={24}/></button>
        <div className="gallery-dialog-image"><Image src={GALLERY_IMAGES[selectedItem.id]} alt={selectedItem.vehicleModel} fill sizes="800px"/></div>
        <span className="editorial-kicker">{selectedItem.categoryLabel} / {selectedItem.vehicleModel}</span><h3 id="gallery-dialog-title">{selectedItem.title}</h3>
        <dl><div><dt>Material</dt><dd>{selectedItem.materialBrand}</dd></div><div><dt>Finishing</dt><dd>{selectedItem.finishType}</dd></div></dl><p>{selectedItem.description}</p><ul>{selectedItem.transformationHighlights.map(item=><li key={item}><CheckCircle2 size={16}/>{item}</li>)}</ul>
        <button type="button" className="consultation-submit" onClick={()=>handleOrderSimilar(selectedItem)}>Konsultasikan desain serupa <Send size={18}/></button>
      </div>}
    </dialog>
  </section>;
}
