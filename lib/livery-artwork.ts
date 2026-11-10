export const MILITARY=['woodland','desert','digital','camo'];
const hash=(x:number,y:number)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
function noise(x:number,y:number,period=8){const a=Math.floor(x),b=Math.floor(y),u=x-a,v=y-b,s=u*u*(3-2*u),t=v*v*(3-2*v);const h=(i:number,j:number)=>hash((i%period+period)%period,(j%period+period)%period);return mix(mix(h(a,b),h(a+1,b),s),mix(h(a,b+1),h(a+1,b+1),s),t);}
function fbm(x:number,y:number){return noise(x,y)*.58+noise(x*2+7,y*2+3,16)*.27+noise(x*4,y*4,32)*.15;}
export function drawCamouflage(canvas:HTMLCanvasElement,pattern:string,accent?:string,base?:string){
 const ctx=canvas.getContext('2d')!,size=512;canvas.width=canvas.height=size;
 const colors=pattern==='desert'?['#d2bc91','#ab9169','#78664c','#e3d5b3']:pattern==='digital'?['#8a9571','#586747','#283e2e','#c4c3a3']:['#666b42','#344b32','#b09a6e','#242a22'];
 if(accent)colors[1]=accent;if(base)colors[0]=base;
 const step=pattern==='digital'?8:2;
 // Domain-warped multi-scale fields produce organic connected forms, rather than random polygons.
 for(let y=0;y<size;y+=step)for(let x=0;x<size;x+=step){const px=x/size*8,py=y/size*8,warp=fbm(px+5,py+1)*2.7;const n=fbm(px+warp,py-warp*.7),m=fbm(px+14,py+23);const index=n<.39?3:n>.59?2:m>.51?0:1;ctx.fillStyle=colors[index];ctx.fillRect(x,y,step,step);}
}
export function drawRace(canvas:HTMLCanvasElement,pattern:string,base:string,accent:string,top=false){
 canvas.width=canvas.height=1024;const c=canvas.getContext('2d')!;c.fillStyle=base;c.fillRect(0,0,1024,1024);
 const poly=(color:string,points:number[])=>{c.fillStyle=color;c.beginPath();for(let i=0;i<points.length;i+=2)c.lineTo(points[i],points[i+1]);c.closePath();c.fill();};
 if(top){
  if(pattern==='endurance'){c.fillStyle='#152830';c.fillRect(388,0,248,1024);c.fillStyle=accent;c.fillRect(402,0,220,1024);}
  else if(pattern==='gt'){['#54b6ee','#18365d',accent].forEach((color,i)=>{c.fillStyle=color;c.fillRect(345+i*100,0,100,1024);});}
  else if(pattern==='rally'){poly(accent,[0,660,1024,200,1024,380,0,840]);poly('#fff',[0,860,1024,400,1024,430,0,890]);}
  else if(pattern==='corse'){c.fillStyle=accent;c.fillRect(370,0,284,1024);c.fillStyle='#16734a';c.fillRect(370,0,55,1024);c.fillStyle='#c12032';c.fillRect(599,0,55,1024);}
  else if(pattern==='factory'){poly('#111921',[0,0,350,0,680,1024,0,1024]);poly(accent,[345,0,375,0,705,1024,675,1024]);}
  else{c.fillStyle=accent;c.fillRect(410,0,204,1024);c.fillStyle='#fff';c.fillRect(390,0,10,1024);}
 }else{
  if(pattern==='endurance'){poly('#152830',[0,680,1024,680,1024,840,0,840]);poly(accent,[0,695,1024,695,1024,820,0,820]);}
  else if(pattern==='gt'){poly('#16252f',[0,735,1024,735,1024,850,0,850]);['#54b6ee','#18365d',accent].forEach((color,i)=>poly(color,[50+i*80,735,420+i*80,500,520+i*80,500,150+i*80,735]));}
  else if(pattern==='rally'){poly(accent,[0,715,640,510,1024,540,1024,625,650,600,0,805]);poly('#fff',[0,824,650,620,1024,645,1024,658,650,635,0,839]);}
  else if(pattern==='corse'){poly('#1e252b',[0,410,1024,550,1024,690,0,520]);poly(accent,[0,330,1024,470,1024,565,0,425]);poly('#16734a',[0,325,1024,465,1024,480,0,340]);}
  else if(pattern==='factory'){poly('#121b26',[0,280,1024,410,1024,650,0,550]);poly(accent,[0,290,1024,420,1024,455,0,325]);}
  else{poly(accent,[0,300,1024,490,1024,555,0,365]);poly('#f4f4eb',[0,375,1024,565,1024,575,0,385]);}
 }
}
