import {ImageLoader,Texture,TextureLoader,TextureSource} from 'three';

// A GLB may contain dozens of images. Decode two at a time rather than
// creating all ImageBitmaps simultaneously and exhausting browser memory.
const queue:Array<()=>void>=[];
let decoding=0;
function drain(){while(decoding<2&&queue.length){decoding++;queue.shift()!();}}
function enqueue(task:(done:()=>void)=>void){
 queue.push(()=>{let finished=false;task(()=>{if(finished)return;finished=true;decoding--;drain();});});drain();
}
export class StudioTextureLoader extends TextureLoader{
 override load(url:string,onLoad?:(texture:Texture<HTMLImageElement>)=>void,onProgress?:(event:ProgressEvent)=>void,onError?:(error:unknown)=>void):Texture<HTMLImageElement>{
  const texture=new Texture<HTMLImageElement>();
  enqueue(done=>{
   const fail=(error:unknown)=>{texture.dispose();if(url.startsWith('blob:'))URL.revokeObjectURL(url);done();onError?.(error);};
   const loader=new ImageLoader(this.manager).setCrossOrigin(this.crossOrigin).setPath(this.path);
   try{loader.load(url,image=>{
    try{
     const scale=Math.min(1,512/Math.max(image.width,image.height));
     if(scale<1){
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
      const context=canvas.getContext('2d');if(!context)throw new Error('Memori gambar tidak tersedia.');
      context.drawImage(image,0,0,canvas.width,canvas.height);
      // Three accepts canvas sources; TextureLoader's declarations restrict
      // its image generic to HTMLImageElement even though both are uploadable.
      texture.source=new TextureSource(canvas) as unknown as TextureSource<HTMLImageElement>;
     }else texture.image=image;
     texture.needsUpdate=true;
    }catch(error){fail(error);return;}
    done();onLoad?.(texture);
   },onProgress,fail);}catch(error){fail(error);}
  });
  return texture;
 }
}
