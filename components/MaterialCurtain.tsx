"use client";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./MaterialCurtain.module.css";

/** The real Material section rises over the stationary studio; no overlay covers its controls. */
export function MaterialCurtain({studio,children}:{studio:ReactNode;children:ReactNode}){
  const pin=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const element=pin.current;if(!element)return;
    const measure=()=>element.style.setProperty("--studio-pin-top",`${Math.min(0,window.innerHeight-element.offsetHeight)}px`);
    const observer=new ResizeObserver(measure);observer.observe(element);
    window.addEventListener("resize",measure);measure();
    return()=>{observer.disconnect();window.removeEventListener("resize",measure);};
  },[]);
  return <div className={styles.transition}><div ref={pin} className={styles.pinned}>{studio}</div><div className={styles.material}>{children}</div></div>;
}
