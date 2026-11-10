"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import {navigateToSection} from "../lib/section-navigation";
import { ArrowRight, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "./ThemeContext";
import "./racing-navbar.css";

const links = [["Material", "material"], ["3D Studio", "3d-studio"], ["Custom Sticker", "custom-sticker"], ["Galeri", "galeri"], ["Cara Order", "cara-order"]] as const;

interface RacingNavbarProps {
  themeOverride?: { theme: "light" | "dark"; setTheme: (theme: "light" | "dark") => void };
  sectionBase?: string;
}

export function RacingNavbar({ themeOverride, sectionBase }: RacingNavbarProps = {}) {
  const globalTheme = useTheme();
  const { theme, setTheme } = themeOverride ?? globalTheme;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [overHero, setOverHero] = useState(true);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const sectionHref=(id:string)=>sectionBase!==undefined&&id!=="beranda"?`${sectionBase}#${id}`:`#${id}`;
  const go=(event:MouseEvent<HTMLAnchorElement>,id:string)=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;event.preventDefault();event.stopPropagation();setActive(id);setOpen(false);if(sectionBase!==undefined&&id!=="beranda")router.push(sectionHref(id));else navigateToSection(id);};

  useEffect(()=>{
    const element=header.current;if(!element)return;
    const measure=()=>document.documentElement.style.setProperty("--nav-offset",`${element.getBoundingClientRect().height+16}px`);
    const observer=new ResizeObserver(measure);observer.observe(element);measure();
    return()=>observer.disconnect();
  },[]);

  useEffect(() => {
    const hero = document.getElementById("beranda");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setOverHero(entry.isIntersecting), {
      rootMargin: "-76px 0px 0px 0px",
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-20% 0px -55% 0px" });
    const ids = ["beranda", ...links.map(([, id]) => id), "konsultasi"];
    ids.forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    const closeOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);

  return <header className="racing-nav" data-over-hero={overHero} ref={header}>
    <a className="racing-brand" href="#beranda" aria-label="Zan Decal — beranda" onClick={event=>go(event,"beranda")}>
      <Image src="/brand/zan-wordmark-v3.png" alt="ZAN" width={2048} height={683} sizes="(max-width: 600px) 104px, 118px" preload />
    </a>
    <nav className={`racing-links${open ? " is-open" : ""}`} aria-label="Navigasi utama" id="racing-navigation">
      {links.map(([label, id]) => <a key={id} href={sectionHref(id)} aria-current={active === id ? "location" : undefined} onClick={event=>go(event,id)}>
        <span className="racing-label">{label}</span>
      </a>)}
      <a className="racing-mobile-consult" href={sectionHref("konsultasi")} onClick={event=>go(event,"konsultasi")}>Konsultasi <ArrowRight size={22}/></a>
    </nav>
    <div className="racing-actions">
      <div className="racing-theme" role="group" aria-label="Tema website">
        <button type="button" aria-label="Tema terang" aria-pressed={theme === "light"} onClick={() => setTheme("light")}><Sun size={15} aria-hidden="true"/><span>Light</span></button>
        <button type="button" aria-label="Tema gelap" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}><Moon size={15} aria-hidden="true"/><span>Dark</span></button>
      </div>
    <a className="racing-consult" href={sectionHref("konsultasi")} onClick={event=>go(event,"konsultasi")}>Konsultasi <ArrowRight size={23}/></a>
    <button className="racing-toggle" ref={toggle} type="button" aria-expanded={open} aria-controls="racing-navigation" aria-label={open ? "Tutup menu" : "Buka menu"} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}<span>{open ? "Tutup" : "Menu"}</span></button>
    </div>
  </header>;
}
