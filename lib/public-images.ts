const losslessImages=new Set([
  "/images/gallery-ferrari-magenta.png","/images/gallery-raptor-black.png",
  "/images/gallery-ktm-black.png","/images/gallery-yamaha-r1-blue.png",
  "/images/workflow-install.png","/images/consultation-vinyl.png",
]);
/** Only bundled assets have precomputed lossless variants; admin uploads keep their original URL. */
export function publicImage(src:string){return losslessImages.has(src)?src.replace(/\.png$/,".lossless.webp"):src;}
