import type { Metadata } from "next";
import ScrollPreview from "../../components/scroll-lab/ScrollPreview";
import "./scroll-lab.css";

export const metadata: Metadata = { title: "5 Scroll Stories / Zan Decal", robots: { index: false, follow: false } };
export default async function ScrollLabPage({ searchParams }: { searchParams: Promise<{ option?: string }> }) {
  const query = await searchParams;
  const number = Number(query.option);
  const option = Number.isInteger(number) && number >= 1 && number <= 5 ? number : 1;
  return <ScrollPreview key={option} option={option} />;
}
