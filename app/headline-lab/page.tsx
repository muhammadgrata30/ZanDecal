import { HeadlineLab } from "./preview";

export const metadata = { title: "Headline Lab — ZAN Decal" };

export default async function Page({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  return <HeadlineLab initial={type ?? "1"} />;
}
