import type { Metadata } from "next";
import MaterialMotion from "../../components/material-motion/MaterialMotion";
import "./material-motion.css";

export const metadata: Metadata = { title: "5 Live Material Mockups / Zan Decal", robots: { index: false, follow: false } };

export default async function MaterialMotionPage({ searchParams }: { searchParams: Promise<{ option?: string; study?: string }> }) {
  const { option, study } = await searchParams;
  const parsed = Number(option);
  return <MaterialMotion initialOption={study === "wrap" ? 5 : Number.isInteger(parsed) && parsed >= 1 && parsed <= 5 ? parsed : 1} wrapStudy={study === "wrap"} />;
}
