'use strict';
const $=selector=>document.querySelector(selector),$$=selector=>[...document.querySelectorAll(selector)];
const icon=name=>`icons/${name}.svg`,count=value=>String(value).padStart(2,'0');
let filter='all',query='',selected=null,slide=0,detailTab='gallery',historyMode='date',pending=[],processing=false,uploadGeneration=0,toastTimer;
let adminProject=projects[0],screen='home';
let slideBusy=false,queuedSlide=null;
const temporaryURLs=new Set(),detail=$('#detail'),uploadDialog=$('#upload-dialog');
const publicMedia=project=>project.media.filter(media=>media.published);
const formatDate=value=>new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(`${value}T12:00:00`));
const today=()=>{const date=new Date();return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;};
function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
function image(src,alt='',className=''){const node=element('img',className);node.src=src;node.alt=alt;return node;}
function mediaPreview(item){return item.type==='video'?(item.poster||icon('film')):item.src;}
function button(label,callback,className=''){const node=element('button',className,label);node.type='button';node.addEventListener('click',callback);return node;}
function notify(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('show');toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4500);}
function pauseMedia(){detail.querySelectorAll('video').forEach(video=>video.pause());}
function showScreen(value,immediate=false){
 const next=['home','gallery','admin'].includes(value)?value:'home';
 if(window.ArchiveMotion&&!immediate){window.ArchiveMotion.navigate(next,()=>showScreen(next,true));return;}
 screen=['home','gallery','admin'].includes(value)?value:'home';
 $('#home-screen').hidden=screen!=='home';$('#arsip').hidden=screen!=='gallery';$('#admin-screen').hidden=screen!=='admin';
 $$('[data-screen]').forEach(control=>control.setAttribute('aria-pressed',String(control.dataset.screen===screen)));
 document.body.classList.toggle('admin-mode',screen==='admin');
 if(screen==='admin')renderAdmin();else renderArchive();
 window.scrollTo({top:0,behavior:'instant'});
 window.ArchiveMotion?.refresh(true);
}
function projectCard(project){
 const media=publicMedia(project),cover=media.find(item=>item.id===project.coverId&&item.type==='photo')||media.find(item=>item.type==='photo');
 const card=button('',()=>openProject(project),'project');card.setAttribute('aria-label',`Lihat katalog ${project.title} / ${project.edition}`);
 const top=element('small');top.append(element('span','',project.category.toUpperCase()),element('span','',`ZD—${project.id}`));
 const visual=element('span','project-visual'),photo=image(cover?.src||project.image,`${project.title} / ${project.edition}`);photo.loading='lazy';visual.append(photo);
 const badges=element('span','project-badges');
 for(const [type,name,iconName]of [['photo','foto','image'],['video','video','film']]){const badge=element('span');badge.append(image(icon(iconName)),document.createTextNode(`${media.filter(item=>item.type===type).length} ${name}`));badges.append(badge);}
 visual.append(badges);
 const meta=element('div','project-meta'),copy=element('div');copy.append(element('h3','',project.title),element('p','',project.edition));
 const end=element('span','project-meta-end');end.append(document.createTextNode('BUKA ALBUM'),image(icon('arrow'),'','project-link-icon'));meta.append(copy,end);card.append(top,visual,meta);return card;
}
function renderArchive(){
 const visible=projects.filter(project=>publicMedia(project).length),list=visible.filter(project=>(filter==='all'||project.category===filter)&&`${project.title} ${project.edition}`.toLowerCase().includes(query.toLowerCase()));
 $('#archive-grid').replaceChildren(...list.map(projectCard));$('#home-grid').replaceChildren(...visible.slice(0,2).map(projectCard));
 $('#result-count').textContent=`${count(list.length)} KATALOG / SATU ALBUM PER PROYEK`;
 if(!list.length)$('#archive-grid').append(element('p','empty-state','Tidak ada proyek yang cocok. Coba kata pencarian lain.'));
 window.ArchiveMotion?.refresh();
}
function openProject(project){
 const media=publicMedia(project);if(!media.length){notify('Proyek ini belum memiliki dokumentasi publik.');return;}
 selected={...project,media};slide=Math.max(0,media.findIndex(item=>item.id===project.coverId));detailTab='gallery';slideBusy=false;queuedSlide=null;renderDetail();if(!detail.open)detail.showModal();window.ArchiveMotion?.openDetail(detail);
}
function showSlide(index){
 if(slideBusy){queuedSlide=index;return;}
 const next=(index+selected.media.length)%selected.media.length;if(next===slide)return;
 const direction=index===slide-1?-1:index===slide+1?1:next>slide?1:-1;
 pauseMedia();slide=next;slideBusy=true;renderViewer(direction);renderPanel();
}
function renderViewer(direction=0){
 const item=selected.media[slide],viewer=$('#viewer'),frame=element('div','media-frame');pauseMedia();
 if(item.type==='video'){
  const video=element('video');video.src=item.src;if(item.poster)video.poster=item.poster;video.controls=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label',item.caption);
  video.addEventListener('timeupdate',()=>{if(video.currentTime>=30){video.pause();video.currentTime=0;}});frame.append(video);
 }else frame.append(image(item.src,item.caption));
 const badge=element('span','stage-badge',item.stage||'Arsip dokumentasi');
 const complete=()=>{slideBusy=false;if(queuedSlide!==null){const next=queuedSlide;queuedSlide=null;showSlide(next);}};
 if(window.ArchiveMotion)window.ArchiveMotion.slide(viewer,frame,badge,direction,complete);else{frame.classList.add('is-current');viewer.replaceChildren(frame,badge);complete();}
 $('#slide-caption').textContent=item.caption;$('#slide-count').textContent=`${count(slide+1)} / ${count(selected.media.length)}`;
 $('#thumbnails').replaceChildren(...selected.media.map((media,index)=>{const node=button('',()=>showSlide(index),'thumbnail');node.setAttribute('aria-label',`${index+1}. ${media.caption}`);node.setAttribute('aria-pressed',String(index===slide));node.append(image(mediaPreview(media)));if(media.type==='video')node.append(image(icon('play'),'','thumb-play'));return node;}));
}
function renderDetail(){
 $('#detail-code').textContent=`ZD / ${selected.id}`;$('#detail-category').textContent=`${selected.category.toUpperCase()} / SATU PROYEK, SELURUH CERITA`;
 $('#detail-title').textContent=`${selected.title} / ${selected.edition}`;$('#detail-description').textContent=selected.description;$('#detail-material').textContent=selected.material;$('#detail-finish').textContent=selected.finish;
 $('#media-count').textContent=count(selected.media.length);$('#history-count').textContent=count(new Set(selected.media.map(item=>item.date)).size);renderViewer();renderPanel();
}
function renderPanel(){
 $$('[data-detail-tab]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab.dataset.detailTab===detailTab)));
 const panel=$('#detail-panel');panel.replaceChildren();
 if(detailTab==='gallery'){
  const title=element('div','detail-panel-title');title.append(document.createTextNode('Album dokumentasi'),element('span','',`${selected.media.length} media`));panel.append(title);
  const list=element('div','media-list');selected.media.forEach((item,index)=>{const row=button('',()=>showSlide(index));row.append(image(mediaPreview(item)));const copy=element('span');copy.append(element('b','',item.caption),element('small','',`${formatDate(item.date)} · ${item.stage||'Arsip lama'}`));row.append(copy,element('span','',item.type==='video'?'VIDEO':count(index+1)));if(index===slide)row.setAttribute('aria-current','true');list.append(row);});panel.append(list);return;
 }
 const tools=element('div','history-tools'),label=element('label','', 'Kelompokkan history');const select=element('select');select.setAttribute('aria-label','Pengelompokan history');for(const [value,text]of [['date','Tanggal dokumentasi'],['stage','Tahap pengerjaan']]){const option=element('option','',text);option.value=value;select.append(option);}select.value=historyMode;select.addEventListener('change',()=>{historyMode=select.value;renderPanel();});label.append(select);tools.append(label);panel.append(tools);
 const list=element('ol','history-list'),media=[...selected.media].sort((a,b)=>a.date.localeCompare(b.date));
 const groups=historyMode==='date'?[...new Set(media.map(item=>item.date))]:['Arsip dokumentasi lama','Kondisi awal','Proses pengerjaan','Hasil akhir'].filter(stage=>stage!=='Arsip dokumentasi lama'||media.some(item=>!item.stage));
 for(const group of groups){
  const items=media.filter(item=>historyMode==='date'?item.date===group:(item.stage||'Arsip dokumentasi lama')===group),entry=element('li');
  entry.append(element('span','history-date',historyMode==='date'?formatDate(group):`${items.length} dokumentasi`),element('h3','',historyMode==='date'?[...new Set(items.map(item=>item.stage||'Arsip dokumentasi lama'))].join(' / '):group));
  entry.append(element('p','',!items.length?'Dokumentasi tahap ini belum ditambahkan.':historyMode==='date'?items.map(item=>item.caption).join(' · '):`${formatDate(items[0].date)}${items.length>1?' – '+formatDate(items.at(-1).date):''}`));
  const previews=element('div','history-images');for(const item of items){const preview=button('',()=>showSlide(selected.media.indexOf(item)));preview.setAttribute('aria-label',`Lihat ${item.caption}`);preview.append(image(mediaPreview(item),item.caption));if(item.type==='video')preview.append(image(icon('play'),'','history-play'));previews.append(preview);}entry.append(previews);list.append(entry);
 }
 panel.append(list);
}
function orderedDraft(project){const order=project.draftOrder;if(!order)return [...project.media];const rank=id=>{const n=order.indexOf(id);return n<0?Infinity:n;};return [...project.media].sort((a,b)=>rank(a.id)-rank(b.id));}
function draftCount(project){return project.media.filter(item=>!item.published||item.draft).length+(project.draftOrder?1:0)+(project.draftCoverId?1:0);}
function renderAdmin(){
 $('#catalog-list').replaceChildren(...projects.map(project=>{const row=button('',()=>{adminProject=project;renderAdmin();},'catalog-row');row.setAttribute('aria-pressed',String(project===adminProject));row.append(image(project.image));const copy=element('span');copy.append(element('b','',project.title),element('small','',`${project.media.length} media · ${draftCount(project)?'ada draft':'publik'}`));row.append(copy);return row;}));
 $('#admin-code').textContent=`KATALOG / ZD—${adminProject.id}`;$('#admin-project-title').textContent=adminProject.title;$('#admin-project-count').textContent=`${publicMedia(adminProject).length} media publik · ${adminProject.media.filter(item=>!item.published).length} media draft`;
 const changes=draftCount(adminProject);$('#publishing-status').textContent=changes?`${changes} perubahan belum dipublikasikan`:'Semua dokumentasi sudah publik';$('#publish-project').disabled=!changes;
 const album=$('#admin-media');album.replaceChildren();orderedDraft(adminProject).forEach((item,index,items)=>{
  const card=element('article','admin-media-card'),visual=element('div','admin-media-visual');visual.append(image(mediaPreview(item),item.caption));visual.append(element('span','admin-media-status',item.published?'PUBLIK':'DRAFT'));card.append(visual);
  const edit=item.draft||item,body=element('div','admin-media-body');const caption=element('input');caption.type='text';caption.value=edit.caption;caption.maxLength=120;caption.setAttribute('aria-label',`Caption media ${index+1}`);caption.addEventListener('change',()=>{item.draft={...edit,caption:caption.value.trim()||item.caption};renderAdmin();});body.append(caption);
  const metadata=element('div','media-edit-meta'),date=element('input');date.type='date';date.value=edit.date;date.setAttribute('aria-label',`Tanggal dokumentasi media ${index+1}`);date.addEventListener('change',()=>{if(date.value){item.draft={...edit,date:date.value};renderAdmin();}});
  const stage=element('select');stage.setAttribute('aria-label',`Tahap media ${index+1}`);for(const value of ['','Kondisi awal','Proses pengerjaan','Hasil akhir']){const option=element('option','',value||'Arsip lama / tanpa tahap');option.value=value;stage.append(option);}stage.value=edit.stage;stage.addEventListener('change',()=>{item.draft={...edit,stage:stage.value};renderAdmin();});metadata.append(date,stage);body.append(metadata);
  const controls=element('div','media-controls');const coverId=adminProject.draftCoverId||adminProject.coverId;
  if(item.type==='photo'){const cover=button(coverId===item.id?'Foto cover':'Jadikan cover',()=>{adminProject.draftCoverId=item.id;renderAdmin();});cover.setAttribute('aria-pressed',String(coverId===item.id));controls.append(cover);}else controls.append(element('span','',`Video${item.duration?' · '+Math.ceil(item.duration)+' dtk':''}`));
  const order=element('div','order-buttons');for(const direction of [-1,1]){const move=button('',()=>{const ids=items.map(media=>media.id);[ids[index],ids[index+direction]]=[ids[index+direction],ids[index]];adminProject.draftOrder=ids;renderAdmin();});move.disabled=index+direction<0||index+direction>=items.length;move.setAttribute('aria-label',`${direction<0?'Majukan':'Mundurkan'} media ${index+1}`);move.append(image(icon(direction<0?'left':'right')));order.append(move);}controls.append(order);body.append(controls);card.append(body);album.append(card);
 });
}
function publishDraft(){
 const project=adminProject;project.media=orderedDraft(project);project.media.forEach(item=>{if(item.draft){Object.assign(item,item.draft);delete item.draft;}item.published=true;});
 if(project.draftCoverId)project.coverId=project.draftCoverId;project.draftCoverId=null;project.draftOrder=null;renderAdmin();renderArchive();notify('Draft dipublikasikan ke Gallery preview.');
}
function renderPending(){
 const list=$('#pending-files');list.replaceChildren();pending.forEach((item,index)=>{const row=element('div','pending-file');row.append(image(item.type==='photo'?item.src:icon('film')));const copy=element('span');copy.append(element('strong','',item.name),element('small','',`${item.type==='photo'?'FOTO':`VIDEO · ${Math.ceil(item.duration)} detik`} / ${(item.size/1024/1024).toFixed(1)} MB`));const remove=button('',()=>{temporaryURLs.delete(item.src);URL.revokeObjectURL(item.src);pending.splice(index,1);renderPending();});remove.setAttribute('aria-label',`Hapus berkas ${item.name}`);remove.append(image(icon('trash')));row.append(copy,remove);list.append(row);});$('#save-upload').disabled=!pending.length||processing;
}
function openUpload(){if(uploadDialog.open)return;pauseMedia();pending=[];uploadGeneration++;$('#upload-form').reset();$('#upload-project').value=adminProject.id;$('#upload-date').value=today();$('#upload-error').textContent='';renderPending();uploadDialog.showModal();}
function cleanupPending(){uploadGeneration++;pending.forEach(item=>{URL.revokeObjectURL(item.src);temporaryURLs.delete(item.src);});pending=[];processing=false;}

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

$$('[data-screen]').forEach(control=>control.addEventListener('click',()=>{location.hash=control.dataset.screen;}));
window.addEventListener('hashchange',()=>showScreen(location.hash.slice(1)));
$$('[data-filter]').forEach(tab=>tab.addEventListener('click',()=>{filter=tab.dataset.filter;$$('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===tab)));renderArchive();}));
$('#search').addEventListener('input',event=>{query=event.target.value;renderArchive();});
$('#theme').addEventListener('click',()=>{const dark=document.documentElement.classList.toggle('dark');$('#theme').setAttribute('aria-label',dark?'Aktifkan tema terang':'Aktifkan tema gelap');$('#theme img').src=icon(dark?'sun':'moon');});
$('#previous').addEventListener('click',()=>showSlide(slide-1));$('#next').addEventListener('click',()=>showSlide(slide+1));
let swipeStart=null;
$('#viewer').addEventListener('touchstart',event=>{if(event.target.tagName==='VIDEO')return;const touch=event.touches[0];swipeStart={x:touch.clientX,y:touch.clientY};},{passive:true});
$('#viewer').addEventListener('touchend',event=>{if(!swipeStart)return;const touch=event.changedTouches[0],dx=touch.clientX-swipeStart.x,dy=touch.clientY-swipeStart.y;swipeStart=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.25)showSlide(slide+(dx<0?1:-1));},{passive:true});
$('#close-detail').addEventListener('click',()=>detail.close());detail.addEventListener('close',pauseMedia);
detail.addEventListener('click',event=>{if(event.target!==detail)return;const rect=detail.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)detail.close();});
detail.addEventListener('keydown',event=>{if(['INPUT','SELECT','VIDEO'].includes(event.target.tagName))return;if(event.key==='ArrowRight'){event.preventDefault();showSlide(slide+1);}if(event.key==='ArrowLeft'){event.preventDefault();showSlide(slide-1);}});
$$('[data-detail-tab]').forEach(tab=>tab.addEventListener('click',()=>{detailTab=tab.dataset.detailTab;renderPanel();}));
$$('[data-upload]').forEach(control=>control.addEventListener('click',openUpload));
for(const project of projects){const option=element('option','',`${project.title} / ${project.edition}`);option.value=project.id;$('#upload-project').append(option);}
$('#publish-project').addEventListener('click',publishDraft);
$('#close-upload').addEventListener('click',()=>uploadDialog.close());uploadDialog.addEventListener('close',cleanupPending);
$('#files').addEventListener('change',event=>addFiles([...event.target.files]));
const dropzone=$('#dropzone');dropzone.addEventListener('dragover',event=>{event.preventDefault();dropzone.classList.add('dragging');});dropzone.addEventListener('dragleave',()=>dropzone.classList.remove('dragging'));dropzone.addEventListener('drop',event=>{event.preventDefault();dropzone.classList.remove('dragging');addFiles([...event.dataTransfer.files]);});
$('#upload-form').addEventListener('submit',event=>{
 event.preventDefault();if(!pending.length||processing)return;
 const project=projects.find(item=>item.id===$('#upload-project').value),stage=$('#upload-stage').value,date=$('#upload-date').value,caption=$('#upload-caption').value.trim();
 project.media.push(...pending.map(item=>({...item,published:false,stage,date,caption:caption||item.name})));const added=pending.length;pending=[];adminProject=project;uploadDialog.close();renderAdmin();notify(`${added} dokumentasi disimpan sebagai draft. Belum tampil di Gallery publik.`);
});
window.addEventListener('beforeunload',()=>temporaryURLs.forEach(url=>URL.revokeObjectURL(url)));
try{document.documentElement.classList.toggle('dark',localStorage.getItem('zan-decal-theme')==='dark');}catch{}
if(document.documentElement.classList.contains('dark')){$('#theme').setAttribute('aria-label','Aktifkan tema terang');$('#theme img').src=icon('sun');}
renderArchive();showScreen(location.hash.slice(1));
