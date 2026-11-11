import { FileLoader, LoaderUtils } from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { decodeModelBytes } from "../../lib/model-transport";
import { StudioTextureLoader } from "./StudioTextureLoader";

export class PortableModelLoader extends GLTFLoader {
  constructor(...args:ConstructorParameters<typeof GLTFLoader>){
    super(...args);
    this.register(parser=>{
      parser.textureLoader=new StudioTextureLoader(this.manager).setCrossOrigin(this.crossOrigin);
      return {name:'ZAN_STUDIO_TEXTURES',afterRoot:async()=>{
        const textures=await parser.getDependencies('texture');
        if(textures.some(texture=>!texture))throw new Error('Tekstur kendaraan gagal dimuat. Muat ulang preview 3D.');
      }};
    });
  }
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
