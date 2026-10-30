import type { Metadata } from "next";
import { MotionLab } from "../../components/hero-motion/MotionLab";
import "./motion.css";

export const metadata: Metadata = { title: "Zan Decal / Hero Motion — 1 & 3", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ option?: string }> }) {
  const { option } = await searchParams;
  return <MotionLab key={option === "3" ? 3 : 1} option={option === "3" ? 3 : 1}/>;
}
