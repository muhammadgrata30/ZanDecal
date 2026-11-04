import { FileLoader, LoaderUtils } from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { decodeModelBytes } from "../../lib/model-transport";

export class PortableModelLoader extends GLTFLoader {
  override load(url:string,onLoad:(gltf:GLTF)=>void,onProgress?:(event:ProgressEvent)=>void,onError?:(error:unknown)=>void):void{
    const loader=new FileLoader(this.manager);
    loader.setResponseType("arraybuffer");
    loader.setRequestHeader(this.requestHeader);
    loader.setWithCredentials(this.withCredentials);
    const resourcePath=this.resourcePath||LoaderUtils.extractUrlBase(url);
    loader.load(url,data=>{
      void decodeModelBytes(data as ArrayBuffer).then(bytes=>this.parseAsync(bytes,resourcePath)).then(onLoad,error=>{
        if(onError)onError(error);else console.error("Model 3D gagal dimuat",error);
      });
    },onProgress,onError);
  }
}
