"use client";
import { createContext,useContext,useEffect,useState } from "react";
import defaults from "../lib/content-defaults.json";
import type { SiteContent } from "../lib/content-types";
import { DUMMY_CONTENT_KEY,readDummyContent } from "../lib/dummy-content";
const Context=createContext<SiteContent>(defaults as SiteContent);
export function SiteContentProvider({initial,children}:{initial:SiteContent;children:React.ReactNode}){const [content,setContent]=useState(initial);useEffect(()=>{const refresh=()=>{try{setContent(readDummyContent());}catch{/* Defaults remain available when storage is blocked. */}};const storage=(e:StorageEvent)=>{if(e.key===DUMMY_CONTENT_KEY||e.key===null)refresh();};refresh();window.addEventListener("focus",refresh);window.addEventListener("storage",storage);window.addEventListener("zan-content-updated",refresh);return()=>{window.removeEventListener("focus",refresh);window.removeEventListener("storage",storage);window.removeEventListener("zan-content-updated",refresh);};},[]);return <Context.Provider value={content}>{children}</Context.Provider>;}
export const useSiteContent=()=>useContext(Context);
