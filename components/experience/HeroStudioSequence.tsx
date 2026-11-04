"use client";
import { SplitImageHero } from "./SplitImageHero";
import "./motor-experience.css";
export interface StudioSequence { progress:{current:number}; subscribe:(listener:()=>void)=>()=>void; }
export function HeroStudioSequence(){return <div id="beranda" className="hero-studio-sequence motor-only-sequence"><SplitImageHero embedded/></div>;}
