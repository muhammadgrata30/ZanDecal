'use strict';
const film='/videos/gallery-showcase-web.mp4';
const filmPoster='/videos/gallery-showcase-poster.jpg';
const projects=[
 {id:'001',title:'Ferrari 488 GTB',edition:'Magenta Edition',category:'mobil',finish:'Gloss / Magenta',material:'Oracal 970RA',image:'/images/gallery-ferrari-magenta.lossless.webp',description:'Magenta yang berani, dipertemukan dengan detail hitam. Ekspresi yang terasa dari jauh, dan makin kuat saat didekati.'},
 {id:'002',title:'Ford F-150 Raptor',edition:'Stealth Edition',category:'mobil',finish:'Matte / Sky Blue',material:'TeckWrap Satin',image:'/images/gallery-raptor-black.lossless.webp',description:'Siluet besar dengan karakter tenang. Hitam satin dan aksen biru memberi ritme di setiap sisi bodi.'},
 {id:'003',title:'KTM Super Duke R',edition:'Street Edition',category:'motor',finish:'Satin / Lavender',material:'Maxdecal 9700',image:'/images/gallery-ktm-black.lossless.webp',description:'Garis yang mengikuti bentuk, bukan sekadar menutup permukaan. Grafis presisi untuk karakter jalanan yang tajam.'},
 {id:'004',title:'Yamaha YZF-R1',edition:'Sky Edition',category:'motor',finish:'Gloss / Sky Blue',material:'Oracal 970RA',image:'/images/gallery-yamaha-r1-blue.lossless.webp',description:'Biru ringan dengan detail yang tegas. Satu bahasa visual dari fairing depan sampai ekor.'},
].map(project=>({...project,media:[
 {id:`${project.id}-hero`,type:'photo',src:project.image,caption:'Karakter dari sudut utama',stage:'Hasil akhir',date:'2026-11-11'},
 {id:`${project.id}-archive`,type:'photo',src:({'001':'/images/sticker-ferrari-pink.png','002':'/images/gallery-raptor.png','003':'/images/gallery-ktm.png','004':'/images/sticker-r6-blue.png'})[project.id],caption:'Dokumentasi arsip / visual contoh',stage:'',date:'2024-08-19'},
 {id:`${project.id}-process`,type:'photo',src:'/images/workflow-install.lossless.webp',caption:'Proses aplikasi vinyl · ilustrasi studio',stage:'Proses pengerjaan',date:'2026-11-10'},
 {id:`${project.id}-film`,type:'video',src:film,poster:filmPoster,caption:'Film dari studio · video contoh',stage:'Proses pengerjaan',date:'2026-11-10'},
].map(item=>({...item,published:true}))}));


projects.forEach(project=>{project.coverId=project.media[0].id;project.draftOrder=null;project.draftCoverId=null;});
