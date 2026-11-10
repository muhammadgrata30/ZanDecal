import defaults from "./content-defaults.json";
import type { SiteContent } from "./content-types";
import { validateContent } from "./content-validation";
export const DUMMY_CONTENT_KEY="zan-dummy-content-v1";
export function readDummyContent():SiteContent{const raw=localStorage.getItem(DUMMY_CONTENT_KEY);return raw?validateContent(JSON.parse(raw),true):structuredClone(defaults) as SiteContent;}
export function saveDummyContent(candidate:SiteContent):SiteContent{const current=readDummyContent();if(current.revision!==candidate.revision)throw new Error("Data berubah di tab lain. Muat ulang terlebih dahulu.");const saved=validateContent({...candidate,revision:current.revision+1},true);try{localStorage.setItem(DUMMY_CONTENT_KEY,JSON.stringify(saved));}catch{throw new Error("Penyimpanan browser penuh atau tidak tersedia. Kurangi media dan coba lagi.");}window.dispatchEvent(new Event("zan-content-updated"));return saved;}
