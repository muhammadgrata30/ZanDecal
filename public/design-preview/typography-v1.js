const themeButton=document.getElementById('theme');
themeButton.addEventListener('click',()=>{const dark=document.body.dataset.theme!=='dark';document.body.dataset.theme=dark?'dark':'light';themeButton.setAttribute('aria-pressed',String(dark));themeButton.textContent=dark?'Light mode':'Dark mode';});
document.querySelectorAll('.finishes button').forEach((button,index)=>button.addEventListener('click',()=>{document.querySelectorAll('.finishes button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));document.getElementById('finish-label').textContent=`0${index+1} / ${button.textContent.toUpperCase()} FINISH`;}));
document.getElementById('sample-form').addEventListener('submit',event=>{event.preventDefault();document.getElementById('form-status').textContent='CONTOH FORM SELESAI / DATA TIDAK DIKIRIM';});
let toastTimer;document.querySelectorAll('[data-demo]').forEach(button=>button.addEventListener('click',()=>{const toast=document.getElementById('toast');toast.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.hidden=true,2600);}));
Promise.all([document.fonts.load('900 condensed 32px Archivo'),document.fonts.load('400 20px Chivo'),document.fonts.load('500 14px "IBM Plex Mono"')]).then(fonts=>{document.getElementById('font-status').textContent=fonts.every(face=>face.length)?'3 KELUARGA FONT ASLI / DIMUAT DARI LOCALHOST':'FONT BELUM LENGKAP — COBA MUAT ULANG';}).catch(()=>{document.getElementById('font-status').textContent='FONT GAGAL DIMUAT — COBA MUAT ULANG';});
document.getElementById('load-preview').addEventListener('click',event=>{
 const button=event.currentTarget,host=document.getElementById('preview-host');
 if(host.firstChild){host.replaceChildren();button.textContent='Buka preview website dengan font ini ↗';return;}
 const frame=document.createElement('iframe');frame.title='Website Zan Decal dengan usulan Archivo, Chivo dan IBM Plex Mono';
 frame.addEventListener('load',()=>{
  const doc=frame.contentDocument;if(!doc)return;
  const fontLink=doc.createElement('link');fontLink.rel='stylesheet';fontLink.href='/fonts/type-study/fonts.css';doc.head.append(fontLink);
  const style=doc.createElement('style');style.textContent=`body{--font-geist-sans:Chivo,sans-serif!important;--font-display:Archivo,sans-serif!important;--font-editorial:Archivo,sans-serif!important;--font-geist-mono:'IBM Plex Mono',monospace!important;font-family:Chivo,sans-serif!important}button,input,textarea,select{font-family:Chivo,sans-serif}h1,h2,h3,h4{font-family:Archivo,sans-serif!important;font-stretch:condensed;font-weight:900!important;font-style:normal!important}.racing-label{font:600 17px/1.3 Chivo,sans-serif!important;text-transform:none;letter-spacing:0}.racing-consult{font:600 17px/1.3 Chivo,sans-serif!important}.racing-theme button{font:600 14px/1.3 Chivo,sans-serif!important}.apply-home .perfect-apply[data-typography='11'] h1{font-stretch:condensed}.motor-studio-heading h2 em,.atelier-site em{font-family:Archivo,sans-serif!important;font-style:normal!important;font-weight:900!important}.hero-detail-label,.hero-detail-edition,.racing-index{font-family:'IBM Plex Mono',monospace!important}`;doc.head.append(style);
 });
 frame.src='/';host.append(frame);button.textContent='Tutup preview website';
});
