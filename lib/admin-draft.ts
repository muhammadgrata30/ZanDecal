import type { ColorPreset, Material, Portfolio, SiteContent } from "./content-types";
import { validateContent } from "./content-validation";

export type CreationKind="materials"|"portfolio"|"colors";
export type CreationDraft=
  |{kind:"materials";value:Material}
  |{kind:"portfolio";value:Portfolio}
  |{kind:"colors";value:ColorPreset};

export function createDraft(kind:CreationKind,content:SiteContent):CreationDraft{
  if(kind==="materials")return{kind,value:{id:crypto.randomUUID(),name:"",origin:"",type:"",features:[],badge:"",gradient:"",desc:"",specCode:"",elongation:"",tempRange:""}};
  if(kind==="colors")return{kind,value:{id:crypto.randomUUID(),name:"",hex:"#A18CD1",accent:"",desc:"",pantone:""}};
  return{kind,value:{id:Math.max(0,...content.portfolio.map(item=>item.id))+1,title:"",category:"mobil",categoryLabel:"Mobil",mediaType:"photo",mediaSrc:"",posterSrc:"",materialBrand:"",finishType:"",gradient:"",vehicleModel:"",description:"",transformationHighlights:[]}};
}

export function contentWithDraft(content:SiteContent,draft:CreationDraft):SiteContent{
  if(draft.kind==="materials")return validateContent({...content,materials:[draft.value,...content.materials]});
  if(draft.kind==="colors")return validateContent({...content,colors:[draft.value,...content.colors]});
  return validateContent({...content,portfolio:[draft.value,...content.portfolio]});
}
