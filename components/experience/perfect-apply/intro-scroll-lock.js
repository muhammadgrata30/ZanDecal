const locks=new WeakMap();
const scrollKeys=new Set(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' ','Spacebar']);

/** Reference-counted page lock, restored on completion, failure, or unmount. */
export function acquireIntroScrollLock(stage){
 const doc=stage.ownerDocument,win=doc.defaultView;
 let state=locks.get(doc);
 if(!state){
  const html=doc.documentElement,body=doc.body;
  const properties=[[html,'overflow'],[body,'overflow'],[body,'position'],[body,'top'],[body,'left'],[body,'right'],[body,'width']];
  const saved=properties.map(([element,name])=>[element,name,element.style.getPropertyValue(name),element.style.getPropertyPriority(name)]);
  const x=win.scrollX,y=win.scrollY;
  const prevent=event=>{if(event.cancelable&&!event.ctrlKey&&!(event.touches?.length>1))event.preventDefault();};
  const keydown=event=>{if(scrollKeys.has(event.key)&&!event.target?.closest?.('button,input,textarea,select,[contenteditable="true"]'))prevent(event);};
  state={owners:new Set(),restore:()=>{
   doc.removeEventListener('wheel',prevent,true);doc.removeEventListener('touchmove',prevent,true);doc.removeEventListener('keydown',keydown,true);
   for(const [element,name,value,priority] of saved){if(value)element.style.setProperty(name,value,priority);else element.style.removeProperty(name);}
   html.classList.remove('zan-intro-locked');
   win.scrollTo({left:x,top:y,behavior:'instant'});
   doc.dispatchEvent(new win.Event('zan-intro-lock-change'));
  }};
  locks.set(doc,state);
  html.classList.add('zan-intro-locked');
  html.style.setProperty('overflow','hidden');body.style.setProperty('overflow','hidden');
  body.style.setProperty('position','fixed');body.style.setProperty('top',`${-y}px`);body.style.setProperty('left','0');body.style.setProperty('right','0');body.style.setProperty('width','100%');
  doc.addEventListener('wheel',prevent,{passive:false,capture:true});doc.addEventListener('touchmove',prevent,{passive:false,capture:true});doc.addEventListener('keydown',keydown,true);
  doc.dispatchEvent(new win.Event('zan-intro-lock-change'));
 }
 const token={};state.owners.add(token);
 let released=false;
 return ()=>{
  if(released)return;released=true;state.owners.delete(token);
  if(!state.owners.size){locks.delete(doc);state.restore();}
 };
}
