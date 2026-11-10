import type {StudioVehicle} from '../components/vehiclePaint';
export type Panel = {id:string;label:string;group:string;axis:'x'|'y'|'z';sign:1|-1;point:[number,number,number];width:number;height:number;camera:string;radius:number};
const panel=(id:string,label:string,group:string,axis:Panel['axis'],sign:1|-1,point:Panel['point'],width:number,height:number,camera:string,radius=.16):Panel=>({id,label,group,axis,sign,point,width,height,camera,radius});
export const VEHICLE_PANELS:Record<StudioVehicle,Panel[]>={
 car:[
  panel('hood','Kap mesin','Atas','y',1,[1.18,.9,0],.8,.65,'hood',.22),
  panel('roof','Atap','Atas','y',1,[-.45,1.32,0],.85,.65,'top',.2),
  panel('trunk','Bagasi','Atas','y',1,[-1.86,1.0,0],.45,.4,'rear-top',.2),
  ...(['left','right'] as const).flatMap(side=>{const sign=side==='left'?1:-1,label=side==='left'?'kiri':'kanan',view=side==='left'?'side':'right';return [
   panel(`front-door-${side}`,`Pintu depan ${label}`,'Pintu','z',sign,[.12,.59,sign*.8],.68,.35,view,.15),
   panel(`rear-door-${side}`,`Pintu belakang ${label}`,'Pintu','z',sign,[-.73,.59,sign*.8],.62,.35,view,.15),
   panel(`front-fender-${side}`,`Fender depan ${label}`,'Samping','z',sign,[1.35,.73,sign*.75],.35,.2,view,.12),
   panel(`rear-fender-${side}`,`Fender belakang ${label}`,'Samping','z',sign,[-1.44,.74,sign*.75],.35,.22,view,.12),
   panel(`skirt-${side}`,`Side skirt ${label}`,'Samping','z',sign,[-.15,.27,sign*.77],.8,.1,view,.08),
   panel(`mirror-${side}`,`Spion ${label}`,'Detail','z',sign,[.62,.96,sign*.94],.15,.08,view,.06),
  ];}),
  panel('front-bumper','Bumper depan','Depan / belakang','x',1,[2.05,.46,.4],.42,.2,'front',.15),
  panel('rear-bumper','Bumper belakang','Depan / belakang','x',-1,[-2.05,.46,.4],.42,.2,'rear',.15),
 ],
 ducati:[
  panel('tank-top','Atas tangki','Tangki','y',1,[.05,1.96,0],.48,.36,'tank-top',.15),
  panel('tank-left','Tangki kiri','Tangki','z',1,[.05,1.73,.43],.55,.25,'side',.16),
  panel('tank-right','Tangki kanan','Tangki','z',-1,[.05,1.73,-.43],.55,.25,'right',.16),
  panel('shroud-left','Panel samping kiri','Panel bodi','z',1,[.6,1.6,.39],.28,.18,'side',.15),
  panel('shroud-right','Panel samping kanan','Panel bodi','z',-1,[.6,1.6,-.39],.28,.18,'right',.15),
  panel('tail-left','Ekor kiri','Ekor','z',1,[-1.13,1.7,.26],.36,.14,'side',.18),
  panel('tail-right','Ekor kanan','Ekor','z',-1,[-1.13,1.7,-.26],.36,.14,'right',.18),
  panel('tail-top','Cover atas ekor','Ekor','y',1,[-1.45,1.94,.15],.2,.18,'tail-top',.12),
  panel('front-cowl','Cover depan','Depan','x',1,[1.5,1.65,0],.3,.22,'front',.13),
  panel('front-fender','Spakbor depan','Depan','y',1,[1.53,1.25,0],.28,.3,'fender',.2),
  panel('belly-left','Under cowl kiri','Panel bodi','z',1,[.3,.48,.3],.3,.16,'side',.2),
  panel('belly-right','Under cowl kanan','Panel bodi','z',-1,[.3,.48,-.3],.3,.16,'right',.2),
 ],
};
export function findPanel(vehicle:StudioVehicle,id?:string){return VEHICLE_PANELS[vehicle].find(p=>p.id===id)||VEHICLE_PANELS[vehicle][vehicle==='car'?3:1];}
