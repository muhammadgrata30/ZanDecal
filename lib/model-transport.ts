/** Static hosts may serve .gz as an archive instead of an encoded HTTP response. */
export async function decodeModelBytes(input:ArrayBuffer):Promise<ArrayBuffer>{
  let data=input;
  const header=new Uint8Array(data);
  if(header[0]===0x1f&&header[1]===0x8b){
    if(typeof DecompressionStream!=="undefined"){
      data=await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
    }else{
      const {gunzipSync}=await import("three/examples/jsm/libs/fflate.module.js");
      const decoded=gunzipSync(header);
      data=decoded.slice().buffer as ArrayBuffer;
    }
  }
  const magic=new Uint8Array(data,0,Math.min(4,data.byteLength));
  if(magic.length!==4||magic[0]!==0x67||magic[1]!==0x6c||magic[2]!==0x54||magic[3]!==0x46){
    throw new Error("File model 3D tidak valid. Respons server bukan GLB.");
  }
  return data;
}
