import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const compile=(file,dependencies={})=>{
 const code=ts.transpileModule(fs.readFileSync(new URL(file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 const exports={};new Function('require','exports',code)(name=>{assert(name in dependencies,`Unexpected dependency ${name}`);return dependencies[name];},exports);return exports;
};
const defaults=JSON.parse(fs.readFileSync(new URL('../lib/content-defaults.json',import.meta.url),'utf8'));
const validation=compile('../lib/content-validation.ts');
const {portfolioMedia,portfolioCover,visiblePortfolio,updatePortfolioMedia,historyGroups}=compile('../lib/portfolio.ts');
const legacy=defaults.portfolio[0];
assert.equal(portfolioMedia(legacy).length,1,'Old catalogs retain their original photo');
assert.equal(portfolioCover(legacy).src,legacy.mediaSrc);
const files=[
 {id:'old',type:'photo',src:'/images/gallery-ferrari-magenta.png',posterSrc:'',caption:'Arsip lama',date:'2020-06-10',stage:'archive',published:true},
 {id:'before',type:'photo',src:'/images/workflow-install.png',posterSrc:'',caption:'Kondisi awal',date:'2024-01-15',stage:'before',published:true},
 {id:'video',type:'video',src:'/videos/gallery-showcase-web.mp4',posterSrc:'',caption:'Proses',date:'2024-01-16',stage:'process',published:false,duration:30},
 {id:'after',type:'photo',src:'/images/gallery-ferrari-magenta.png',posterSrc:'',caption:'Hasil',date:'',stage:'after',published:true},
];
let item=updatePortfolioMedia(legacy,files,'video');
assert.equal(portfolioMedia(item).length,3,'Draft does not appear in public album');
assert.notEqual(portfolioCover(item).id,'video','Draft cannot become a public cover');
assert.equal(portfolioMedia(item,true).length,4,'Admin retains draft media');
assert.deepEqual(historyGroups(portfolioMedia(item),'date').map(group=>group.key),['2020-06-10','2024-01-15','']);
assert.deepEqual(historyGroups(portfolioMedia(item),'stage').map(group=>group.key),['archive','before','after']);
const draft={...defaults,portfolio:[item]};
const roundtrip=validation.validateContent(JSON.parse(JSON.stringify(draft)));
assert.deepEqual(roundtrip.portfolio[0].media,files,'Saving content preserves all media, dates, stages, duration and draft status');
item=updatePortfolioMedia(item,[files[3],files[0],files[1],{...files[2],published:true}],'after');
assert.equal(portfolioCover(item).id,'after');
assert.equal(portfolioMedia(item)[0].id,'after','Slide order follows the admin album');
assert.equal(portfolioMedia(item).length,4,'Publishing reveals a draft');
assert.equal(visiblePortfolio([updatePortfolioMedia(item,[])]).length,0,'Empty albums never revive a deleted legacy photo');
const bad=files.map(file=>({...file}));bad[2].duration=30.01;
assert.throws(()=>validation.validateContent({...draft,portfolio:[{...item,media:bad}]}),/30 detik/);
for(const patch of [{date:'2024-02-30'},{date:'bad date'},{published:'yes'},{stage:'invented'},{src:'javascript:alert(1)'}]){
 const media=files.map((file,index)=>index?file:{...file,...patch});assert.throws(()=>validation.validateContent({...draft,portfolio:[{...item,media}]}));
}
assert.throws(()=>validation.validateContent({...draft,portfolio:[{...item,coverId:'another-project'}]}),/Cover/);
assert.throws(()=>validation.validateContent({...draft,portfolio:[{...item,media:[files[0],files[0]]}]}),/ID/);
// Exercise the actual existing persistence mechanism, including revision conflicts.
const stored=new Map();globalThis.localStorage={getItem:key=>stored.get(key)??null,setItem:(key,value)=>stored.set(key,value)};globalThis.window={dispatchEvent(){}};
const persistence=compile('../lib/dummy-content.ts',{'./content-defaults.json':{default:defaults},'./content-validation':validation});
const saved=persistence.saveDummyContent(draft);
assert.equal(saved.revision,1);assert.deepEqual(persistence.readDummyContent().portfolio[0].media,files);
assert.throws(()=>persistence.saveDummyContent(draft),/tab lain/);
const original=localStorage.setItem;localStorage.setItem=()=>{throw new Error('QuotaExceededError');};
assert.throws(()=>persistence.saveDummyContent(saved),/penuh/);localStorage.setItem=original;
assert.equal(persistence.readDummyContent().revision,1,'Failed writes never overwrite the saved album');
console.log('PASS: legacy migration, multi-media persistence, draft visibility, covers/order, old dates and stages, 30s videos, invalid inputs, revision conflicts and storage failures.');
