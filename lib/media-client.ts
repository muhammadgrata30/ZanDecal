export async function videoDuration(file:File):Promise<number>{
 const url=URL.createObjectURL(file),video=document.createElement('video');
 try{return await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>finish(new Error('Video tidak dapat dibaca.')),12000);
  const finish=(error?:Error)=>{clearTimeout(timer);video.onloadedmetadata=null;video.onerror=null;if(error)reject(error);else resolve(video.duration);};
  video.preload='metadata';video.onloadedmetadata=()=>finish(!Number.isFinite(video.duration)||video.duration<=0?new Error('Durasi video tidak valid.'):video.duration>30?new Error('Video maksimal 30 detik. Potong video sebelum mengunggah.'):undefined);
  video.onerror=()=>finish(new Error('Video tidak dapat diputar. Gunakan MP4 atau WebM.'));video.src=url;
 });}finally{video.removeAttribute('src');video.load();URL.revokeObjectURL(url);}
}
export async function readAdminMedia(file:File){
 if(file.size>2*1024*1024)throw new Error('Media maksimal 2 MB per berkas pada mode penyimpanan browser.');
 if(!['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'].includes(file.type)||!file.size)throw new Error('Gunakan JPG, PNG, WebP, GIF, MP4 atau WebM.');
 const type=file.type.startsWith('video/')?'video' as const:'photo' as const;
 const duration=type==='video'?await videoDuration(file):undefined;
 const src=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Berkas gagal dibaca.'));reader.readAsDataURL(file);});
 return {src,type,duration};
}
