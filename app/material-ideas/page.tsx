import type { Metadata } from "next";
import MaterialIdeas from "../../components/material-ideas/MaterialIdeas";
import "./material-ideas.css";

export const metadata: Metadata = { title: "5 Ide Jenis Bahan Tanpa 3D / Zan Decal", robots: { index: false, follow: false } };
export default async function MaterialIdeasPage({ searchParams }: { searchParams: Promise<{ option?: string }> }) {
  const { option } = await searchParams;
  const value = Number(option);
  return <MaterialIdeas initialOption={value >= 1 && value <= 5 && Number.isInteger(value) ? value : 1} />;
}
