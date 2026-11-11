import * as T from 'three';

/** One shader and one set of live uniforms for the lifetime of a vehicle.
 * Reusing a previously compiled program must never revive its old colors/maps.
 */
export function bindLiveryMaterial(paint:Set<T.MeshStandardMaterial>,side:T.Texture,top:T.Texture){
 const uniforms={
  studioSide:{value:side},studioTop:{value:top},studioEnabled:{value:0},
  studioTriplanar:{value:0},studioScale:{value:1},studioOpacity:{value:1},
  studioBase:{value:new T.Color('#ffffff')},
 };
 const previous=new Map([...paint].map(material=>[material,{
  hook:material.onBeforeCompile,cache:material.customProgramCacheKey,color:material.color.clone(),
 }]));
 paint.forEach(material=>{
  const old=previous.get(material)!;
  material.onBeforeCompile=(shader,renderer)=>{
   old.hook.call(material,shader,renderer);
   Object.assign(shader.uniforms,uniforms);
   shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 studioPosition;varying vec3 studioNormal;').replace('#include <begin_vertex>','#include <begin_vertex>\nstudioPosition=position;studioNormal=normal;');
   shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
    varying vec3 studioPosition;varying vec3 studioNormal;
    uniform sampler2D studioSide;uniform sampler2D studioTop;
    uniform float studioEnabled;uniform float studioTriplanar;
    uniform float studioScale;uniform float studioOpacity;uniform vec3 studioBase;
   `).replace('#include <map_fragment>',`#include <map_fragment>
    if(studioEnabled>.5){
     vec4 art;
     if(studioTriplanar>.5){
      vec3 blend=pow(abs(normalize(studioNormal)),vec3(6.));blend/=max(blend.x+blend.y+blend.z,.001);
      vec3 pos=studioPosition*studioScale*.65;
      art=texture2D(studioSide,pos.zy)*blend.x+texture2D(studioSide,pos.xz)*blend.y+texture2D(studioSide,pos.xy)*blend.z;
     }else{
      vec2 sideUV=vec2((studioPosition.x+2.2)/4.4,studioPosition.y/2.5);
      vec2 topUV=vec2(studioPosition.z/1.95+.5,(studioPosition.x+2.2)/4.4);
      float upBlend=smoothstep(.5,.85,abs(normalize(studioNormal).y));
      art=mix(texture2D(studioSide,sideUV),texture2D(studioTop,topUV),upBlend);
     }
     diffuseColor.rgb=mix(studioBase,art.rgb,studioOpacity*art.a);
    }
   `);
  };
  material.customProgramCacheKey=()=>`${old.cache.call(material)}-zan-livery-v4`;
  material.needsUpdate=true;
 });
 return {
  update({enabled,triplanar,scale,opacity,color}:{enabled:boolean;triplanar:boolean;scale:number;opacity:number;color:string}){
   uniforms.studioEnabled.value=enabled?1:0;
   uniforms.studioTriplanar.value=triplanar?1:0;
   uniforms.studioScale.value=scale/100;
   uniforms.studioOpacity.value=opacity/100;
   uniforms.studioBase.value.set(color);
   paint.forEach(material=>material.color.set(enabled?'#ffffff':color));
  },
  dispose(){previous.forEach((old,material)=>{
   material.onBeforeCompile=old.hook;material.customProgramCacheKey=old.cache;
   material.color.copy(old.color);material.needsUpdate=true;
  });},
 };
}
