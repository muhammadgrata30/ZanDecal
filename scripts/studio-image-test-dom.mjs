import sharp from 'sharp';

// Only the DOM image/canvas boundary is supplied here. Fetch, image decoding,
// queueing, GLTF parsing and texture configuration use their real implementations.
export function installImageDOM(){
 const previous=globalThis.document;
 const stats={decoding:0,peak:0,images:0,originalPixels:0};
 class ImageElement{
  listeners=new Map();width=0;height=0;complete=false;
  addEventListener(name,callback){this.listeners.set(name,callback);}
  removeEventListener(name){this.listeners.delete(name);}
  set src(url){
   stats.decoding++;stats.peak=Math.max(stats.peak,stats.decoding);
   void (async()=>{
    try{
     const response=await fetch(url);if(!response.ok)throw new Error(`Image HTTP ${response.status}`);
     const bytes=Buffer.from(await response.arrayBuffer()),metadata=await sharp(bytes).metadata();
     await sharp(bytes).resize({width:16,height:16,fit:'inside'}).raw().toBuffer();
     this.width=metadata.width;this.height=metadata.height;this.complete=true;
     stats.images++;stats.originalPixels+=this.width*this.height;stats.decoding--;
     this.listeners.get('load')?.call(this);
    }catch(error){stats.decoding--;this.listeners.get('error')?.call(this,error);}
   })();
  }
 }
 globalThis.document={
  createElementNS:(_namespace,name)=>{if(name!=='img')throw new Error(name);return new ImageElement();},
  createElement:name=>{if(name!=='canvas')throw new Error(name);return {width:0,height:0,getContext:()=>({drawImage(){}})};},
 };
 return {stats,restore(){globalThis.document=previous;}};
}
