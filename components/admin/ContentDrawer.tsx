"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import type { CreationDraft } from "../../lib/admin-draft";
import type { SiteContent } from "../../lib/content-types";

type UploadControl=(label:string,apply:(url:string,type:"photo"|"video")=>void,expected?:"photo"|"video")=>ReactNode;
function Input({label,value,onChange,required=false,maxLength=150,multiline=false}:{label:string;value:string;onChange:(value:string)=>void;required?:boolean;maxLength?:number;multiline?:boolean}){
  return <label className="admin-field"><span>{label}{required?" *":""}</span>{multiline?<textarea rows={4} value={value} maxLength={maxLength} onChange={event=>onChange(event.target.value)}/>:<input required={required} value={value} maxLength={maxLength} onChange={event=>onChange(event.target.value)}/>}</label>;
}

export function ContentDrawer({draft,onChange,onClose,onSubmit,uploadControl,content,busy,uploading,error,hasOtherChanges}:{draft:CreationDraft;onChange:(draft:CreationDraft)=>void;onClose:()=>void;onSubmit:()=>void;uploadControl:UploadControl;content:SiteContent;busy:boolean;uploading:boolean;error:string;hasOtherChanges:boolean}){
  const dialog=useRef<HTMLDialogElement>(null);
  const locked=busy||uploading;
  useEffect(()=>{
    const element=dialog.current;
    const previouslyFocused=document.activeElement;
    const overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    element?.showModal();
    return()=>{element?.close();document.body.style.overflow=overflow;if(previouslyFocused instanceof HTMLElement&&previouslyFocused.isConnected)previouslyFocused.focus();};
  },[]);
  const title=draft.kind==="materials"?"Tambah bahan":draft.kind==="portfolio"?"Tambah portofolio":"Tambah warna";
  return <dialog ref={dialog} className="admin-drawer" aria-labelledby="admin-drawer-title" aria-describedby="admin-drawer-description" onCancel={event=>{event.preventDefault();if(!locked)onClose();}}>
    <form onSubmit={event=>{event.preventDefault();if(!locked)onSubmit();}}>
      <header className="admin-drawer-header"><div><span className="admin-kicker">ZAN DECAL / KONTEN BARU</span><h2 id="admin-drawer-title">{title}</h2><p id="admin-drawer-description">Lengkapi data, lalu terbitkan ke halaman pengunjung.</p></div><button type="button" className="admin-drawer-close" aria-label="Tutup panel penambahan" disabled={locked} onClick={onClose}><X size={20}/></button></header>
      <div className="admin-drawer-body">
        <fieldset className="admin-editors" disabled={locked}>
          {draft.kind==="materials"&&<div className="admin-fields">
            <Input label="Nama bahan" value={draft.value.name} required onChange={name=>onChange({...draft,value:{...draft.value,name}})}/>
            <Input label="Jenis / seri" value={draft.value.type} onChange={type=>onChange({...draft,value:{...draft.value,type}})}/>
            <Input label="Asal / produsen" value={draft.value.origin} onChange={origin=>onChange({...draft,value:{...draft.value,origin}})}/>
            <Input label="Label singkat" value={draft.value.badge} maxLength={100} onChange={badge=>onChange({...draft,value:{...draft.value,badge}})}/>
            <Input label="Deskripsi" value={draft.value.desc} maxLength={2000} multiline onChange={desc=>onChange({...draft,value:{...draft.value,desc}})}/>
            <Input label="Keunggulan (satu per baris)" value={draft.value.features.join("\n")} maxLength={5000} multiline onChange={value=>onChange({...draft,value:{...draft.value,features:value.split("\n")}})}/>
            <Input label="Kode spesifikasi" value={draft.value.specCode} maxLength={100} onChange={specCode=>onChange({...draft,value:{...draft.value,specCode}})}/>
            <Input label="Elastisitas" value={draft.value.elongation} maxLength={100} onChange={elongation=>onChange({...draft,value:{...draft.value,elongation}})}/>
            <Input label="Rentang suhu" value={draft.value.tempRange} maxLength={100} onChange={tempRange=>onChange({...draft,value:{...draft.value,tempRange}})}/>
          </div>}
          {draft.kind==="portfolio"&&<>
            <div className="admin-drawer-media"><div className="admin-media-preview">{draft.value.mediaSrc?draft.value.mediaType==="video"?<video src={draft.value.mediaSrc} poster={draft.value.posterSrc||undefined} controls preload="metadata"/>:<Image src={draft.value.mediaSrc} alt={draft.value.title||"Pratinjau portofolio"} width={900} height={600} unoptimized/>:<span>Unggah foto atau video customer untuk galeri.</span>}</div><div className="admin-media-actions">{uploadControl(draft.value.mediaSrc?"Ganti foto / video":"Unggah foto / video",(mediaSrc,mediaType)=>onChange({...draft,value:{...draft.value,mediaSrc,mediaType,posterSrc:""}}))}{draft.value.mediaType==="video"&&uploadControl("Unggah poster video",posterSrc=>onChange({...draft,value:{...draft.value,posterSrc}}),"photo")}</div><small>JPG, PNG, WebP, GIF, MP4 atau WebM · Maksimal 50 MB.</small></div>
            <div className="admin-fields">
              <Input label="Judul proyek" value={draft.value.title} required onChange={title=>onChange({...draft,value:{...draft.value,title}})}/>
              <Input label="Model kendaraan" value={draft.value.vehicleModel} required onChange={vehicleModel=>onChange({...draft,value:{...draft.value,vehicleModel}})}/>
              <label className="admin-field"><span>Kategori</span><select value={draft.value.category} onChange={event=>onChange({...draft,value:{...draft.value,category:event.target.value as "mobil"|"motor"|"sticker"}})}><option value="mobil">Mobil</option><option value="motor">Motor</option><option value="sticker">Custom Sticker</option></select></label>
              <label className="admin-field"><span>Bahan</span><input list="drawer-material-names" maxLength={150} value={draft.value.materialBrand} onChange={event=>onChange({...draft,value:{...draft.value,materialBrand:event.target.value}})}/></label>
              <Input label="Warna / finishing" value={draft.value.finishType} onChange={finishType=>onChange({...draft,value:{...draft.value,finishType}})}/>
              <Input label="Deskripsi proyek" value={draft.value.description} multiline maxLength={3000} onChange={description=>onChange({...draft,value:{...draft.value,description}})}/>
              <Input label="Detail pengerjaan (satu per baris)" value={draft.value.transformationHighlights.join("\n")} multiline maxLength={5000} onChange={value=>onChange({...draft,value:{...draft.value,transformationHighlights:value.split("\n")}})}/>
            </div><datalist id="drawer-material-names">{content.materials.map(item=><option key={item.id} value={item.name}/>)}</datalist>
          </>}
          {draft.kind==="colors"&&<>
            <label className="admin-drawer-swatch" style={{backgroundColor:/^#[0-9a-f]{6}$/i.test(draft.value.hex)?draft.value.hex:"#a18cd1"}}><input type="color" aria-label="Pilih warna bodi" value={/^#[0-9a-f]{6}$/i.test(draft.value.hex)?draft.value.hex:"#a18cd1"} onChange={event=>onChange({...draft,value:{...draft.value,hex:event.target.value}})}/><span>Klik untuk memilih warna bodi</span></label>
            <div className="admin-fields">
              <Input label="Nama warna" required maxLength={100} value={draft.value.name} onChange={name=>onChange({...draft,value:{...draft.value,name}})}/>
              <Input label="Kode hex (#RRGGBB)" required maxLength={7} value={draft.value.hex} onChange={hex=>onChange({...draft,value:{...draft.value,hex}})}/>
              <Input label="Catatan / karakter" value={draft.value.desc} multiline maxLength={300} onChange={desc=>onChange({...draft,value:{...draft.value,desc}})}/>
              <Input label="Kode bahan / Pantone" value={draft.value.pantone} maxLength={100} onChange={pantone=>onChange({...draft,value:{...draft.value,pantone}})}/>
            </div>
          </>}
        </fieldset>
      </div>
      <footer className="admin-drawer-footer"><div aria-live="polite">{error&&<p className="admin-error" role="alert">{error}</p>}{uploading?<p className="admin-progress" role="status">Mengunggah media. Tunggu hingga selesai…</p>:<p className="admin-drawer-hint">{hasOtherChanges?"Perubahan lain yang belum tersimpan juga akan diterbitkan.":draft.kind==="portfolio"?"Hasilnya tampil di galeri pengunjung.":draft.kind==="colors"?"Warna langsung tersedia di studio 3D.":"Bahan tampil pada informasi bahan di website."}</p>}</div><div className="admin-drawer-actions"><button className="admin-secondary" type="button" disabled={locked} onClick={onClose}>Batal</button><button className="admin-primary" type="submit" disabled={locked}>{busy?"Menerbitkan…":"Simpan & terbitkan"}<ArrowUpRight size={16}/></button></div></footer>
    </form>
  </dialog>;
}
