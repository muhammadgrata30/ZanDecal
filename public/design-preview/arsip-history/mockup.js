'use strict';

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const icon=name=>`icons/${name}.svg`;
const film='/videos/gallery-showcase-web.mp4';
const filmPoster='/videos/gallery-showcase-poster.jpg';
const projects=[
 {id:'001',title:'Ferrari 488 GTB',edition:'Magenta Edition',category:'mobil',finish:'Gloss / Magenta',material:'Oracal 970RA',image:'/images/gallery-ferrari-magenta.lossless.webp',description:'Magenta yang berani, dipertemukan dengan detail hitam. Ekspresi yang terasa dari jauh, dan makin kuat saat didekati.'},
 {id:'002',title:'Ford F-150 Raptor',edition:'Stealth Edition',category:'mobil',finish:'Matte / Sky Blue',material:'TeckWrap Satin',image:'/images/gallery-raptor-black.lossless.webp',description:'Siluet besar dengan karakter tenang. Hitam satin dan aksen biru memberi ritme di setiap sisi bodi.'},
 {id:'003',title:'KTM Super Duke R',edition:'Street Edition',category:'motor',finish:'Satin / Lavender',material:'Maxdecal 9700',image:'/images/gallery-ktm-black.lossless.webp',description:'Garis yang mengikuti bentuk, bukan sekadar menutup permukaan. Grafis presisi untuk karakter jalanan yang tajam.'},
 {id:'004',title:'Yamaha YZF-R1',edition:'Sky Edition',category:'motor',finish:'Gloss / Sky Blue',material:'Oracal 970RA',image:'/images/gallery-yamaha-r1-blue.lossless.webp',description:'Biru ringan dengan detail yang tegas. Satu bahasa visual dari fairing depan sampai ekor.'},
].map(project=>({...project,media:[
 {id:`${project.id}-hero`,type:'photo',src:project.image,caption:'Karakter dari sudut utama',stage:'Hasil akhir',date:'2026-11-11'},
 {id:`${project.id}-detail`,type:'photo',src:project.image,caption:'Detail finishing · crop foto utama',stage:'Hasil akhir',date:'2026-11-11',crop:true},
 {id:`${project.id}-process`,type:'photo',src:'/images/workflow-install.lossless.webp',caption:'Proses aplikasi vinyl · ilustrasi studio',stage:'Proses pengerjaan',date:'2026-11-10'},
 {id:`${project.id}-film`,type:'video',src:film,poster:filmPoster,caption:'Film dari studio · video contoh',stage:'Proses pengerjaan',date:'2026-11-10'},
]}));
let filter='all',query='',selected=null,slide=0,detailTab='gallery',pending=[],processing=false,uploadGeneration=0;
let toastTimer;
const temporaryURLs=new Set();
const detail=$('#detail'),uploadDialog=$('#upload-dialog');
const formatDate=value=>new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(`${value}T12:00:00`));
const today=()=>{const date=new Date();return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;};
const count=value=>String(value).padStart(2,'0');

function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
function image(src,alt='',className=''){const node=element('img',className);node.src=src;node.alt=alt;return node;}
function mediaPreview(item){return item.type==='video'?(item.poster||icon('film')):item.src;}
function button(label,callback,className=''){const node=element('button',className,label);node.type='button';node.addEventListener('click',callback);return node;}
function notify(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4500);}
function pauseMedia(){detail.querySelectorAll('video').forEach(video=>video.pause());}

function renderArchive(){
 const grid=$('#archive-grid');grid.replaceChildren();
 const list=projects.filter(project=>(filter==='all'||project.category===filter)&&`${project.title} ${project.edition}`.toLowerCase().includes(query.toLowerCase()));
 $('#result-count').textContent=`${count(list.length)} KARAKTER / FOTO & VIDEO`;
 for(const project of list){
  const card=button('',()=>openProject(project),'project');card.setAttribute('aria-label',`Lihat katalog ${project.title} / ${project.edition}`);
  const top=element('small');top.append(element('span','',project.category.toUpperCase()),element('span','',`ZD—${project.id}`));
  const visual=element('span','project-visual');const cover=image(project.image,`${project.title} / ${project.edition}`);cover.loading='lazy';visual.append(cover);
  const badges=element('span','project-badges');
  for(const [type,name,iconName] of [['photo','foto','image'],['video','video','film']]){const badge=element('span');badge.append(image(icon(iconName)),document.createTextNode(`${project.media.filter(item=>item.type===type).length} ${name}`));badges.append(badge);}
  visual.append(badges);
  const meta=element('div','project-meta'),copy=element('div');copy.append(element('h3','',project.title),element('p','',project.edition));meta.append(copy,element('span','',project.finish.toUpperCase()));card.append(top,visual,meta);grid.append(card);
 }
 if(!list.length)grid.append(element('p','empty-state','Belum ada karakter yang cocok. Coba kata pencarian lain.'));
}

function openProject(project,history=false){selected=project;slide=0;detailTab=history?'history':'gallery';renderDetail();if(!detail.open)detail.showModal();}
function showSlide(index){pauseMedia();slide=(index+selected.media.length)%selected.media.length;renderViewer();renderPanel();}
function renderViewer(){
 const current=selected.media[slide],viewer=$('#viewer');pauseMedia();viewer.replaceChildren();
 if(current.type==='video'){
  const video=element('video');video.src=current.src;if(current.poster)video.poster=current.poster;video.controls=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label',current.caption);
  video.addEventListener('timeupdate',()=>{if(video.currentTime>=30){video.pause();video.currentTime=0;}});
  viewer.append(video);
 }else{
  const photo=image(current.src,current.caption);if(current.crop){photo.style.objectFit='cover';photo.style.transform='scale(1.55)';photo.style.objectPosition='65% 70%';}viewer.append(photo);
 }
 viewer.append(element('span','stage-badge',current.stage));$('#slide-caption').textContent=current.caption;$('#slide-count').textContent=`${count(slide+1)} / ${count(selected.media.length)}`;
  const thumbnails=$('#thumbnails');thumbnails.replaceChildren();
 selected.media.forEach((item,index)=>{const thumb=button('',()=>showSlide(index),'thumbnail');thumb.setAttribute('aria-label',`${index+1}. ${item.caption}`);thumb.setAttribute('aria-pressed',String(index===slide));thumb.append(image(mediaPreview(item)));if(item.type==='video')thumb.append(image(icon('play'),'','thumb-play'));thumbnails.append(thumb);});
}
function renderDetail(){
 $('#detail-code').textContent=`ZD / ${selected.id}`;$('#detail-category').textContent=`${selected.category.toUpperCase()} / SELECTED CHARACTER`;
 $('#detail-title').textContent=`${selected.title} / ${selected.edition}`;$('#detail-description').textContent=selected.description;$('#detail-material').textContent=selected.material;$('#detail-finish').textContent=selected.finish;$('#media-count').textContent=count(selected.media.length);$('#history-count').textContent=count(new Set(['Kondisi awal',...selected.media.map(item=>item.stage)]).size);
 renderViewer();renderPanel();
}
function renderPanel(){
 $$('[data-detail-tab]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab.dataset.detailTab===detailTab)));
 const panel=$('#detail-panel');panel.replaceChildren();
 if(detailTab==='gallery'){
  const heading=element('div','detail-panel-title');heading.append(document.createTextNode('Satu karakter, setiap sudut.'),element('span','',`${selected.media.length} media`));panel.append(heading);
  const list=element('div','media-list');selected.media.forEach((item,index)=>{const row=button('',()=>showSlide(index));row.append(image(mediaPreview(item)));const copy=element('span');copy.append(element('b','',item.caption),element('small','',item.stage));row.append(copy,element('span','',item.type==='video'?'VIDEO':count(index+1)));if(index===slide)row.setAttribute('aria-current','true');list.append(row);});panel.append(list);
 }else{
  const list=element('ol','history-list');
  for(const stage of ['Kondisi awal','Proses pengerjaan','Hasil akhir']){
   const media=selected.media.filter(item=>item.stage===stage),entry=element('li'),date=media.length?media.map(item=>item.date).sort().at(-1):'2026-11-09';
   entry.append(element('span','history-date',formatDate(date)),element('h3','',stage),element('p','',stage==='Kondisi awal'?(media.length?'Dokumentasi awal sebelum pengerjaan.':'Brief dan arah desain disiapkan. Foto kondisi awal bisa ditambahkan di sini.'):stage==='Proses pengerjaan'?'Catatan aplikasi, detail pemasangan, dan cuplikan dari studio.':'Karakter baru, siap ke jalan. Lihat hasil dan detail finishing.'));
   const previews=element('div','history-images');media.forEach(item=>{const preview=button('',()=>showSlide(selected.media.indexOf(item)));preview.setAttribute('aria-label',`Lihat ${item.caption}`);preview.append(image(mediaPreview(item),item.caption));if(item.type==='video')preview.append(image(icon('play'),'','history-play'));previews.append(preview);});entry.append(previews);list.append(entry);
  }
  panel.append(list);
 }
}

function renderPending(){
 const list=$('#pending-files');list.replaceChildren();
 pending.forEach((item,index)=>{const row=element('div','pending-file');row.append(image(item.type==='photo'?item.src:icon('film')));const copy=element('span');copy.append(element('strong','',item.name),element('small','',`${item.type==='photo'?'FOTO':`VIDEO · ${Math.ceil(item.duration)} detik`} / ${(item.size/1024/1024).toFixed(1)} MB`));const remove=button('',()=>{temporaryURLs.delete(item.src);URL.revokeObjectURL(item.src);pending.splice(index,1);renderPending();});remove.setAttribute('aria-label',`Hapus berkas ${item.name}`);remove.append(image(icon('trash')));row.append(copy,remove);list.append(row);});
 $('#save-upload').disabled=pending.length===0||processing;
}
function openUpload(project=selected||projects[0]){
 if(uploadDialog.open)return;pauseMedia();pending=[];uploadGeneration++;$('#upload-form').reset();$('#upload-project').value=project.id;$('#upload-date').value=today();$('#upload-caption').value='';$('#upload-error').textContent='';renderPending();uploadDialog.showModal();
}
function cleanupPending(){uploadGeneration++;for(const item of pending){URL.revokeObjectURL(item.src);temporaryURLs.delete(item.src);}pending=[];processing=false;}
function readMedia(file){
 return new Promise((resolve,reject)=>{
  const photo=['image/jpeg','image/png','image/webp'].includes(file.type),video=['video/mp4','video/webm'].includes(file.type);
  if(!photo&&!video){reject(new Error(`${file.name}: gunakan JPG, PNG, WebP, MP4, atau WebM.`));return;}
  if(file.size>(photo?10:20)*1024*1024){reject(new Error(`${file.name}: ukuran maksimal ${photo?10:20} MB.`));return;}
  const src=URL.createObjectURL(file),node=photo?new Image():document.createElement('video');
  const timeout=setTimeout(()=>fail('Berkas tidak dapat dibaca.'),12000);
  function release(){clearTimeout(timeout);node.onload=null;node.onerror=null;node.onloadedmetadata=null;if(video){node.removeAttribute('src');node.load();}}
  function fail(message){release();URL.revokeObjectURL(src);reject(new Error(`${file.name}: ${message}`));}
  const ready=()=>{const duration=video?node.duration:0;if(video&&(!Number.isFinite(duration)||duration>30)){fail('durasi video maksimal 30 detik.');return;}release();resolve({id:crypto.randomUUID(),type:photo?'photo':'video',name:file.name,size:file.size,src,duration});};
  if(photo)node.onload=ready;else{node.preload='metadata';node.onloadedmetadata=ready;}
  node.onerror=()=>fail('format gambar atau video tidak dapat diputar.');node.src=src;
 });
}
async function addFiles(files){
 if(processing)return;processing=true;renderPending();const generation=uploadGeneration,errors=[];
 for(const file of files){
  if(generation!==uploadGeneration)break;
  if(pending.length>=10){errors.push('Maksimal 10 berkas untuk satu unggahan.');break;}
  try{const item=await readMedia(file);if(generation!==uploadGeneration){URL.revokeObjectURL(item.src);continue;}pending.push(item);temporaryURLs.add(item.src);}catch(error){errors.push(error.message);}
 }
 if(generation!==uploadGeneration)return;processing=false;$('#upload-error').textContent=errors.join('\n');renderPending();$('#files').value='';
}

$$('[data-filter]').forEach(tab=>tab.addEventListener('click',()=>{filter=tab.dataset.filter;$$('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===tab)));renderArchive();}));
$('#search').addEventListener('input',event=>{query=event.target.value;renderArchive();});
$('#theme').addEventListener('click',()=>{const dark=document.documentElement.classList.toggle('dark');$('#theme').setAttribute('aria-label',dark?'Aktifkan tema terang':'Aktifkan tema gelap');$('#theme img').src=icon(dark?'sun':'moon');});
$('#previous').addEventListener('click',()=>showSlide(slide-1));$('#next').addEventListener('click',()=>showSlide(slide+1));
let swipeStart=null;
$('#viewer').addEventListener('touchstart',event=>{if(event.target.tagName==='VIDEO')return;const touch=event.touches[0];swipeStart={x:touch.clientX,y:touch.clientY};},{passive:true});
$('#viewer').addEventListener('touchend',event=>{if(!swipeStart)return;const touch=event.changedTouches[0],dx=touch.clientX-swipeStart.x,dy=touch.clientY-swipeStart.y;swipeStart=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.25)showSlide(slide+(dx<0?1:-1));},{passive:true});
$('#close-detail').addEventListener('click',()=>detail.close());detail.addEventListener('close',pauseMedia);
detail.addEventListener('click',event=>{if(event.target!==detail)return;const rect=detail.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)detail.close();});
detail.addEventListener('keydown',event=>{if(uploadDialog.open||['INPUT','SELECT','VIDEO'].includes(event.target.tagName))return;if(event.key==='ArrowRight'){event.preventDefault();showSlide(slide+1);}if(event.key==='ArrowLeft'){event.preventDefault();showSlide(slide-1);}});
$$('[data-detail-tab]').forEach(tab=>tab.addEventListener('click',()=>{detailTab=tab.dataset.detailTab;renderPanel();}));
$('#open-history').addEventListener('click',()=>openProject(projects[0],true));
$$('[data-upload]').forEach(control=>control.addEventListener('click',()=>openUpload()));
$('#add-to-project').addEventListener('click',()=>openUpload(selected));
for(const project of projects){const option=element('option','',`${project.title} / ${project.edition}`);option.value=project.id;$('#upload-project').append(option);}
$('#close-upload').addEventListener('click',()=>uploadDialog.close());uploadDialog.addEventListener('close',cleanupPending);
$('#files').addEventListener('change',event=>addFiles([...event.target.files]));
const dropzone=$('#dropzone');dropzone.addEventListener('dragover',event=>{event.preventDefault();dropzone.classList.add('dragging');});dropzone.addEventListener('dragleave',()=>dropzone.classList.remove('dragging'));dropzone.addEventListener('drop',event=>{event.preventDefault();dropzone.classList.remove('dragging');addFiles([...event.dataTransfer.files]);});
$('#upload-form').addEventListener('submit',event=>{
 event.preventDefault();if(!pending.length||processing)return;const project=projects.find(item=>item.id===$('#upload-project').value),stage=$('#upload-stage').value,date=$('#upload-date').value,caption=$('#upload-caption').value.trim();
 const additions=pending.map(item=>({...item,stage,date,caption:caption||item.name,...(item.type==='video'?{poster:undefined}:{})}));project.media.push(...additions);pending=[];uploadDialog.close();renderArchive();
 if(detail.open){selected=project;detailTab='history';slide=project.media.length-additions.length;renderDetail();}else openProject(project,true);
 notify(`${additions.length} dokumentasi ditambahkan ke history preview.`);
});
window.addEventListener('beforeunload',()=>{temporaryURLs.forEach(url=>URL.revokeObjectURL(url));});
renderArchive();
