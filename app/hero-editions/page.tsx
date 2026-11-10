import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { editions } from "../../components/hero-editions/editions";

export const metadata = { title: "ZAN — Five Hero Editions", robots: { index: false, follow: false } };

export default function Page() {
  return <main className="he-gallery"><header><Link href="/" aria-label="ZAN beranda"><Image src="/design-preview/hero-editions/wordmark.webp" width={900} height={300} alt="ZAN" unoptimized /></Link><span>FIVE HERO EDITIONS</span><Link href="/hero-editions/1">Mulai eksplorasi <ArrowUpRight size={17} /></Link></header>
    <section className="he-gallery-intro"><p>DECAL / WRAPPING / VISUAL IDENTITY</p><h1>Lima cara<br />untuk <em>menonjol.</em></h1><div><p>Lima komposisi baru untuk ZAN. Tipografi, detail bahan, dan gerak punya arah masing-masing, dalam warna dan karakter proyek.</p><p>Dirancang untuk mayoritas pengguna mobile: aset WebP, tanpa video latar, tanpa HDR, dan satu renderer ringan yang beristirahat di antara sapuan.</p></div><nav className="he-gallery-jump" aria-label="Buka opsi langsung">{editions.map(edition => <Link href={`/hero-editions/${edition.id}`} key={edition.id} prefetch={false}><span>0{edition.id}</span>{edition.name}<ArrowUpRight size={14} /></Link>)}</nav></section>
    <section className="he-gallery-grid" aria-label="Lima opsi hero">{editions.map(edition => <article key={edition.id}><Link className={`he-gallery-image he-gallery-image-${edition.id}`} href={`/hero-editions/${edition.id}`} prefetch={false}><Image src={`/design-preview/hero-editions/preview-${edition.id}.webp`} alt={`Mockup hero ${edition.name}`} width={1440} height={1000} sizes="(max-width: 760px) 90vw, 44vw" unoptimized /><span>Buka animasi <ArrowUpRight size={18} /></span></Link><div className="he-gallery-heading"><span>0{edition.id}</span><h2>{edition.name}</h2><span>{edition.theme.toUpperCase()}</span></div><p>{edition.description}</p><div className="he-gallery-reference">Referensi <a href={edition.referenceUrl} target="_blank" rel="noreferrer">{edition.reference} ↗</a></div></article>)}</section>
    <footer><p>Referensi memberi dasar komposisi dan interaksi. Warna, aset, dan konteks tetap ZAN.</p><Link href="/">Kembali ke website <ArrowUpRight size={16} /></Link></footer>
  </main>;
}
