export interface Material {
  id:string;name:string;origin:string;type:string;features:string[];badge:string;gradient:string;
  desc:string;specCode:string;elongation:string;tempRange:string;
}
export interface Portfolio {
  id:number;title:string;category:"mobil"|"motor"|"sticker";categoryLabel:string;
  mediaType:"photo"|"video";mediaSrc:string;posterSrc:string;videoDuration?:string;
  materialBrand:string;finishType:string;gradient:string;vehicleModel:string;description:string;transformationHighlights:string[];
}
export interface ColorPreset {id:string;name:string;hex:string;accent:string;desc:string;pantone:string}
export interface SiteContent {revision:number;materials:Material[];portfolio:Portfolio[];colors:ColorPreset[];showcaseVideo:string;showcasePoster:string}
