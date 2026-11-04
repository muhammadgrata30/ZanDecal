"use client";
import type { ReactNode } from "react";
import styles from "./HoverDetails.module.css";

/** Mouse disclosure, with native tap and keyboard behavior retained. */
export function HoverDetails({children,className="",group}:{children:ReactNode;className?:string;group?:string}){
  return <details className={`${styles.root} ${className}`} name={group} data-hover-group={group}
    onPointerEnter={event=>{
      if(event.pointerType!=="mouse"||!matchMedia("(hover:hover) and (pointer:fine)").matches)return;
      const current=event.currentTarget;
      if(group)current.parentElement?.querySelectorAll<HTMLDetailsElement>("details[data-hover-group]").forEach(sibling=>{if(sibling!==current&&sibling.dataset.hoverGroup===group&&!sibling.contains(document.activeElement))sibling.open=false;});
      current.open=true;
    }}
    onPointerLeave={event=>{if(event.pointerType==="mouse"&&!event.currentTarget.contains(document.activeElement))event.currentTarget.open=false;}}>
    {children}
  </details>;
}
