let navigationGeneration=0;
/** Jump once, then settle short layout changes without a long scroll animation. */
export function navigateToSection(id:string){
 const section=document.getElementById(id);
 if(!section)return;
 const generation=++navigationGeneration;
 if(document.documentElement.classList.contains("zan-intro-locked"))document.querySelector<HTMLButtonElement>("#beranda #skip")?.click();
 requestAnimationFrame(()=>{
  const header=document.querySelector<HTMLElement>(".racing-nav");
  const inset=(header?.getBoundingClientRect().height??72)+12;
  const position=()=>{
   if(id==="beranda")return 0;
   let top=section.getBoundingClientRect().top+window.scrollY;
   // Sticky cover sections can be visually held below their original anchor.
   // Resolve their document position so navigation still lands at section start.
   for(let parent=section.parentElement;parent;parent=parent.parentElement){
    if(parent.classList.contains("section-curtain-outgoing")&&parent.parentElement?.dataset.curtainActive==="true"){
     top+=parent.parentElement.getBoundingClientRect().top-parent.getBoundingClientRect().top;
    }
   }
   return Math.max(0,top-inset);
  };
  const jump=()=>{const top=position();const event=new CustomEvent("zan-scroll-to",{detail:{top},cancelable:true});if(window.dispatchEvent(event))window.scrollTo({top,behavior:"instant"});};
  jump();
  let corrections=0;
  const settle=()=>{if(generation!==navigationGeneration)return;if(Math.abs(position()-window.scrollY)>2)jump();if(++corrections<3)requestAnimationFrame(settle);};
  requestAnimationFrame(settle);
  const url=new URL(location.href);url.hash=id;
  if(location.hash!==url.hash)history.pushState(history.state,"",url);
 });
}
