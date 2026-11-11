import type {Portfolio,PortfolioMedia,DocumentationStage} from './content-types';
export const STAGE_LABELS:Record<DocumentationStage,string>={archive:'Arsip dokumentasi',before:'Kondisi awal',process:'Proses pengerjaan',after:'Hasil akhir'};
/** Old single-image catalogs remain valid until an album is edited. */
export function portfolioMedia(item:Portfolio,includeDraft=false):PortfolioMedia[]{
 const media=item.media??(item.mediaSrc?[{id:`legacy-${item.id}`,type:item.mediaType,src:item.mediaSrc,posterSrc:item.posterSrc,caption:item.title,date:'',stage:'archive',published:true}]:[]);
 return includeDraft?media:media.filter(file=>file.published);
}
export function portfolioCover(item:Portfolio){const files=portfolioMedia(item);return files.find(file=>file.id===item.coverId)||files.find(file=>file.type==='photo')||files[0];}
export function visiblePortfolio(items:Portfolio[]){return items.filter(item=>portfolioMedia(item).length>0);}
export function updatePortfolioMedia(item:Portfolio,media:PortfolioMedia[],coverId=item.coverId):Portfolio{
 const cover=media.find(file=>file.id===coverId)||media.find(file=>file.type==='photo')||media[0];
 return {...item,media,coverId:cover?.id,...(cover?{mediaSrc:cover.src,mediaType:cover.type,posterSrc:cover.posterSrc}:{})};
}
export function documentationDate(value:string){return value?new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(`${value}T12:00:00`)):'Tanggal belum dicatat';}
export function historyGroups(files:PortfolioMedia[],by:'date'|'stage'){
 const sorted=[...files].sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999'));
 const keys=by==='date'?[...new Set(sorted.map(file=>file.date))]:(['archive','before','process','after'] as const).filter(stage=>sorted.some(file=>file.stage===stage));
 return keys.map(key=>({key,label:by==='date'?documentationDate(key):STAGE_LABELS[key as DocumentationStage],files:sorted.filter(file=>(by==='date'?file.date:file.stage)===key)}));
}
