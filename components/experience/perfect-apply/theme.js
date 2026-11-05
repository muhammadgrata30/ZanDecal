export const THEME_KEY='zan-decal-theme';
export const THEMES={
 light:{film:0x29262f,ink:0xffffff,housing:0x77717e,liner:0x69636e,rim:0xf3f0ed,fill:0xdfe5e9,exposure:1.03,background:'#f5f3ef'},
 dark:{film:0xffffff,ink:0x242129,housing:0xa5a1ae,liner:0xd3cfd8,rim:0xf4f1f7,fill:0xe4eaf0,exposure:1.08,background:'#17141d'}
};
export function normalizeTheme(value){return value==='dark'?'dark':'light';}
export function readTheme(storage){try{return normalizeTheme(storage.getItem(THEME_KEY));}catch{return 'light';}}
export function persistTheme(storage,value){try{storage.setItem(THEME_KEY,normalizeTheme(value));return true;}catch{return false;}}
export function pixelRatio(width,height,deviceRatio,low=false){return Math.max(1,Math.min(Math.min(Math.max(deviceRatio||1,1),2),Math.sqrt((low?4_000_000:6_000_000)/Math.max(1,width*height))));}
