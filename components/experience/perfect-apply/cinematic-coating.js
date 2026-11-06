// One standard-material draw: roughness and colour change across the real tool edge.
export function applyCinematicCoating(material){
 const front={value:0};
 material.onBeforeCompile=shader=>{
  shader.uniforms.zanFinishFront=front;
  shader.vertexShader='varying float zanFilmU;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nzanFilmU=uv.x;');
  shader.fragmentShader='uniform float zanFinishFront;\nvarying float zanFilmU;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
float zanApplied=1.0-smoothstep(zanFinishFront-0.025,zanFinishFront+0.025,zanFilmU);
diffuseColor.rgb*=mix(vec3(0.56,0.76,0.84),vec3(1.0),zanApplied);`);
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(0.43,0.16,zanApplied);');
 };
 material.customProgramCacheKey=()=> 'zan-cinematic-coating-v1';
 return front;
}
