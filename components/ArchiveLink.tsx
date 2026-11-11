"use client";
import {useEffect,useRef,type ReactNode,type MouseEvent} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import gsap from 'gsap';

export function ArchiveLink({children,className}:{children:ReactNode;className?:string}){
 const router=useRouter(),curtain=useRef<HTMLDivElement>(null),timeline=useRef<gsap.core.Timeline|null>(null);
 useEffect(()=>()=>{timeline.current?.kill();curtain.current?.remove();},[]);
 const open=(event:MouseEvent<HTMLAnchorElement>)=>{
  if(event.button||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();if(timeline.current)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){router.push('/gallery');return;}
  const node=document.createElement('div'),label=document.createElement('span');node.className='archive-route-curtain';node.setAttribute('aria-hidden','true');label.textContent='ZAN / MASUK KE ARSIP';node.append(label);document.body.append(node);curtain.current=node;
  timeline.current=gsap.timeline().set(node,{visibility:'visible',yPercent:100}).to(node,{yPercent:0,duration:.45,ease:'power3.inOut'}).call(()=>router.push('/gallery'));
 };
 return <Link href="/gallery" className={className} onClick={open}>{children}</Link>;
}
