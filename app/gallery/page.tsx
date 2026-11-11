import type {Metadata} from 'next';
import Link from 'next/link';
import {ArrowLeft} from 'lucide-react';
import {RacingNavbar} from '../../components/RacingNavbar';
import {PortfolioCollection} from '../../components/PortfolioCollection';
export const metadata:Metadata={title:'Gallery & Arsip Karakter / Zan Decal',description:'Album foto, video, arsip dokumentasi lama dan history pengerjaan setiap proyek Zan Decal.'};
export default function GalleryPage(){return <div className="archive-page"><RacingNavbar sectionBase="/"/><main><Link href="/#galeri" className="archive-back"><ArrowLeft size={16}/>Beranda / Arsip karakter</Link><PortfolioCollection/></main></div>;}
