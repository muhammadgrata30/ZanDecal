'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {Plus,Eye,Trash2,Upload,X,Check,Pencil,RefreshCw} from 'lucide-react';
import {useStudioLibrary} from '../experience/useStudioLibrary';
import {saveStudioAssets} from '../../lib/studio-assets';
import type {Asset} from '../experience/design';
import {AdminUploadGuide,UploadHint} from '../AdminUploadGuide';
import {LiverySwatch} from '../StudioControls';
import '../studio-livery.css';

export function StudioLibraryManager(){
 const {library,error:loadError,refresh}=useStudioLibrary();
 const [filter,setFilter]=useState('all'),[search,setSearch]=useState(''),[message,setMessage]=useState(''),[error,setError]=useState('');
 const [open,setOpen]=useState(false),[editing,setEditing]=useState<Asset|null>(null),[kind,setKind]=useState<Asset['kind']>('sticker'),[name,setName]=useState(''),[image,setImage]=useState(''),[vehicle,setVehicle]=useState('all'),[changedImage,setChangedImage]=useState(false),[reading,setReading]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null),uploadVersion=useRef(0),editRevision=useRef(0);
 useEffect(()=>{if(open){dialog.current?.showModal();}else if(dialog.current?.open)dialog.current.close();},[open]);
 useEffect(()=>()=>{uploadVersion.current++},[]);
 const save=(assets:Asset[],notice:string)=>{try{saveStudioAssets({...library,assets});setMessage(notice);setError('');return true}catch(e){setError((e as Error).message);return false}};
 const edit=(asset?:Asset)=>{uploadVersion.current++;editRevision.current=library.revision;setReading(false);setEditing(asset||null);setKind(asset?.kind||'sticker');setName(asset?.name||'');setImage(asset?.image||'');setVehicle(asset?.vehicle||'all');setChangedImage(false);setError('');setOpen(true)};
 const close=()=>{uploadVersion.current++;setReading(false);setOpen(false);};
 async function upload(file?:File){
  if(!file)return;const version=++uploadVersion.current;setError('');
  const types=kind==='sticker'?['image/png','image/webp']:['image/png','image/webp','image/jpeg'];
  if(!types.includes(file.type)){setError(kind==='sticker'?'Pilih PNG / WebP transparan.':'Pilih PNG, WebP, atau JPG.');return}
  if(file.size>2*1024*1024){setError('Gambar maksimal 2 MB.');return}
  setReading(true);
  try{const value=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Gambar gagal dibaca.'));reader.readAsDataURL(file)});if(version!==uploadVersion.current)return;setImage(value);setChangedImage(true);if(!name)setName(file.name.replace(/\.[^.]+$/,'').slice(0,80));}
  catch(e){if(version===uploadVersion.current)setError((e as Error).message)}finally{if(version===uploadVersion.current)setReading(false)}
 }
 function submit(event:FormEvent){
  event.preventDefault();if(reading)return;if(editRevision.current!==library.revision){setError('Library berubah di tab lain. Tutup form, lalu buka kembali aset terbaru.');return;}
  const asset:Asset={...(editing||{}),id:editing?.id||crypto.randomUUID(),name:name.trim(),kind,vehicle,published:editing?.published??false,...(image?{image}:{}),...(kind==='livery'?{pattern:changedImage||!editing?'upload':editing.pattern,category:editing?.category||'Custom'}:{})};
  if(save(editing?library.assets.map(a=>a.id===editing.id?asset:a):[...library.assets,asset],editing?'Aset diperbarui.':'Aset disimpan sebagai draft. Uji pada model sebelum publikasi.'))close();
 }
 const visible=library.assets.filter(a=>(filter==='all'||a.kind===filter)&&a.name.toLowerCase().includes(search.toLowerCase()));
 return <section className="studio-library" aria-label="Library livery dan stiker">
  <div className="studio-library-top"><p>Kelola livery dan stiker untuk Interactive Studio. Setiap tindakan disimpan langsung; aset berstatus Published tersedia untuk pengguna.</p><div><button type="button" className="secondary" onClick={refresh}><RefreshCw size={14}/> Muat ulang library</button><button type="button" className="primary" disabled={library.assets.length>=80} onClick={()=>edit()}><Plus size={16}/> Tambah aset</button></div></div>
  <p className="micro">Mengikuti mode admin saat ini: data tersimpan pada browser dan origin yang sama, termasuk tab lain.</p>
  <AdminUploadGuide/>
  <div className="studio-library-stats"><span><b>{library.assets.length}</b>Total aset</span><span><b>{library.assets.filter(a=>a.published).length}</b>Published</span><span><b>{library.assets.filter(a=>!a.published).length}</b>Draft</span></div>
  {(loadError||error)&&!open&&<p className="admin-error" role="alert">{error||loadError}</p>}{message&&<p className="admin-success" role="status"><Check size={15}/>{message}</p>}
  <div className="studio-library-filters"><div className="category-tabs">{[['all','Semua'],['livery','Livery'],['sticker','Stiker']].map(([id,label])=><button type="button" key={id} aria-pressed={filter===id} onClick={()=>setFilter(id)}>{label}</button>)}</div><input aria-label="Cari aset studio" placeholder="Cari nama aset…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
  <div className="studio-library-grid">{visible.map(a=><article className="studio-asset-card" key={a.id}><div className={'studio-asset-art '+a.kind}>{a.kind==='livery'?<LiverySwatch asset={a}/>:<img src={a.image} alt={a.name}/>}<span>{a.published?'Published':'Draft'}</span></div><div className="studio-asset-body"><small>{a.kind==='livery'?'LIVERY':'STIKER'} / {a.vehicle==='all'?'DUCATI & BYD SEAL':a.vehicle==='car'?'BYD SEAL':'DUCATI'}</small><h3>{a.name}</h3><div className="studio-asset-actions"><a href={'/?studioAsset='+encodeURIComponent(a.id)+'#3d-studio'}><Eye size={14}/> Uji 3D</a><button type="button" onClick={()=>edit(a)} aria-label={'Edit '+a.name}><Pencil size={14}/> Edit</button><button type="button" onClick={()=>save(library.assets.map(b=>b.id===a.id?{...b,published:!b.published}:b),a.published?'Aset ditarik ke draft.':'Aset dipublikasikan ke Interactive Studio.')}>{a.published?'Tarik draft':'Publikasikan'}</button><button type="button" className="studio-delete" aria-label={'Hapus '+a.name} onClick={()=>{if(confirm('Hapus '+a.name+' dari Library Studio?'))save(library.assets.filter(b=>b.id!==a.id),'Aset dihapus dari library.')}}><Trash2 size={14}/></button></div></div></article>)}</div>
  {!visible.length&&<p className="empty">Tidak ada aset yang cocok. Tambahkan aset atau ubah pencarian.</p>}
  <dialog ref={dialog} className="studio-asset-dialog" onCancel={close} onClose={()=>setOpen(false)}><form onSubmit={submit}><button type="button" className="studio-dialog-close" aria-label="Tutup form aset" onClick={close}><X size={20}/></button><span className="admin-kicker">LIBRARY STUDIO</span><h2>{editing?'Edit aset':'Tambah aset studio'}</h2><div className="category-tabs">{(['sticker','livery'] as const).map(k=><button type="button" key={k} disabled={!!editing||reading} aria-pressed={kind===k} onClick={()=>{setKind(k);setImage('');setError('')}}>{k==='sticker'?'Stiker / logo':'Livery / motif'}</button>)}</div><UploadHint kind={kind}/><label className="studio-asset-drop">{image?<img src={image} alt="Preview gambar aset"/>:<><Upload size={26}/><span>{editing?.pattern&&editing.pattern!=='upload'?'Paket desain bawaan; gambar pengganti bersifat opsional.':'Pilih gambar aset'}</span></>}<input aria-label="Pilih gambar aset studio" type="file" disabled={reading} accept={kind==='sticker'?'image/png,image/webp':'image/png,image/webp,image/jpeg'} onChange={e=>{void upload(e.target.files?.[0]);e.target.value=''}}/></label>{reading&&<p className="micro" role="status">Membaca gambar…</p>}{error&&<p className="admin-error" role="alert">{error}</p>}<label className="form-label">Nama aset<input required maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="Contoh: Woodland Olive"/></label><label className="form-label">Kendaraan yang kompatibel<select value={vehicle} onChange={e=>setVehicle(e.target.value)}><option value="all">Ducati & BYD Seal</option><option value="ducati">Ducati V4 S</option><option value="car">BYD Seal</option></select></label><button type="submit" className="primary full" disabled={reading||!name.trim()||(!image&&(!editing||editing.pattern==='upload'))}>{editing?'Simpan perubahan':'Simpan sebagai draft'}</button></form></dialog>
 </section>;
}
