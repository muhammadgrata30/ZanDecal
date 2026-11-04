"use client";
import { createContext, useContext, useEffect, useState } from "react";
import defaults from "../lib/content-defaults.json";
import type { SiteContent } from "../lib/content-types";
const Context=createContext<SiteContent>(defaults as SiteContent);
export function SiteContentProvider({initial,children}:{initial:SiteContent;children:React.ReactNode}){
  const [content,setContent]=useState(initial);
  useEffect(()=>{
    const controller=new AbortController();
    let pending=false;
    const refresh=()=>{
      if(document.hidden||pending)return;
      pending=true;
      void fetch("/api/content",{cache:"no-store",signal:controller.signal}).then(r=>r.ok?r.json():null).then(data=>{if(data)setContent(current=>current.revision===data.revision?current:data);}).catch(()=>{}).finally(()=>{pending=false;});
    };
    const storage=(event:StorageEvent)=>{if(event.key==="zan-content-revision")refresh();};
    const interval=setInterval(refresh,30000);
    window.addEventListener("focus",refresh);document.addEventListener("visibilitychange",refresh);window.addEventListener("storage",storage);window.addEventListener("zan-content-updated",refresh);
    return()=>{controller.abort();clearInterval(interval);window.removeEventListener("focus",refresh);document.removeEventListener("visibilitychange",refresh);window.removeEventListener("storage",storage);window.removeEventListener("zan-content-updated",refresh);};
  },[]);
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export const useSiteContent=()=>useContext(Context);
