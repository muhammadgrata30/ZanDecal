"use client";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
export function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrapper = ref.current;
    if (!wrapper) return;
    const footer = wrapper.firstElementChild as HTMLElement;
    const measure = () => {
      wrapper.style.setProperty("--footer-height", `${footer.offsetHeight}px`);
      wrapper.classList.toggle("curtain-enabled", footer.offsetHeight < window.innerHeight - 20);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  return <div ref={ref} className="footer-curtain" data-arrival="footer"><footer className="editorial-footer">
    <div className="footer-wordmark" aria-label="Zan Decal">ZAN DECAL</div>
    <div className="footer-columns">
      <div className="footer-statement"><span>AUTOMOTIVE WRAP STUDIO<br/>INDONESIA</span><p>Warna punya suara.<br/>Kami bantu mengucapkannya.</p><p>Decal, full wrap, livery motor sport,<br/>dan cutting sticker presisi.</p></div>
      <nav aria-label="Eksplorasi footer"><h3>Eksplorasi</h3>{[["3D Studio","3d-studio"],["Material","material"],["Custom Sticker","custom-sticker"],["Galeri","galeri"],["Cara Order","cara-order"],["Konsultasi","konsultasi"]].map(([name,id])=><a href={`#${id}`} key={id}>{name}</a>)}</nav>
      <div className="footer-social"><h3>Terhubung</h3><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={14}/></a><a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube <ArrowUpRight size={14}/></a><a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={14}/></a><a href="mailto:studio@zandecal.id">Email <ArrowUpRight size={14}/></a></div>
      <div className="footer-contact"><a className="footer-top" href="#beranda">Kembali ke atas <ArrowUpRight size={22}/></a><p>ZAN DECAL<br/>Jakarta / Tangerang<br/>Indonesia</p><a href="mailto:studio@zandecal.id">studio@zandecal.id</a></div>
    </div>
    <div className="footer-guarantees"><p><strong>100% Paint-Safe Formula.</strong> Vinyl otomotif untuk menjaga kondisi cat pabrikan.</p><p><strong>Clean Room Studio Installation.</strong> Pengerjaan dalam ruang tertutup berfilter udara.</p></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} ZAN DECAL. HAK CIPTA DILINDUNGI.</span><span>WRAP. PERSONAL EXPRESSION.</span>
      {/* A document navigation avoids sharing the departing WebGL root with admin. */}
      <a href="/admin" className="footer-admin-link">Masuk Admin <ArrowUpRight size={14}/></a>
    </div>
  </footer></div>;
}
