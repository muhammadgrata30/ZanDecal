/** Fit a bounding sphere at any orbit angle, leaving room for preview controls. */
export function studioCameraLimits(radius,aspect,fov=36,height=560){
 const verticalSpace=Math.max(.52,Math.min(.82,(height-140)/height));
 const halfVertical=fov*Math.PI/360;
 const halfHorizontal=Math.atan(Math.tan(halfVertical)*Math.max(.1,aspect)*.88);
 const halfSafeVertical=Math.atan(Math.tan(halfVertical)*verticalSpace);
 const minimum=Math.max(.5,radius)*1.04/Math.sin(Math.min(halfHorizontal,halfSafeVertical));
 return {minimum,initial:minimum*1.45,maximum:minimum*2.4,verticalSpace};
}

/** Tight perspective fit of the model's box in the current viewing direction. */
export function studioBoxFit(halfSize,direction,aspect,fov=36,height=560){
 const length=Math.hypot(...direction)||1;
 const [x,y,z]=direction.map(value=>value/length);
 const horizontal=Math.hypot(x,z)||1;
 const right=[z/horizontal,0,-x/horizontal];
 const up=[y*right[2],z*right[0]-x*right[2],-y*right[0]];
 const space=Math.max(.52,Math.min(.82,(height-140)/height));
 const tangent=Math.tan(fov*Math.PI/360);
 let distance=.5;
 for(const a of [-1,1])for(const b of [-1,1])for(const c of [-1,1]){
  const point=[a*halfSize[0],b*halfSize[1],c*halfSize[2]];
  const depth=point[0]*x+point[1]*y+point[2]*z;
  const width=Math.abs(point[0]*right[0]+point[2]*right[2]);
  const vertical=Math.abs(point[0]*up[0]+point[1]*up[1]+point[2]*up[2]);
  distance=Math.max(distance,depth+width/(tangent*Math.max(.1,aspect)*.92),depth+vertical/(tangent*space));
 }
 return distance*1.04;
}
