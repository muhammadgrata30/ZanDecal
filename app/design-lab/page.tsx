import type { Metadata } from "next";
import { HeroStudioLab } from "../../components/design-lab/HeroStudioLab";
import "./lab.css";

export const metadata: Metadata = { title: "Zan Decal / Hero & Studio — Exploration III", robots: { index: false, follow: false } };

export default async function DesignLab({ searchParams }: { searchParams: Promise<{ option?: string; mode?: string }> }) {
  const query = await searchParams;
  const option = query.option === "2" ? 2 : query.option === "3" ? 3 : 1;
  return <HeroStudioLab initialOption={option} initialMotion={query.mode === "motion"}/>;
}
