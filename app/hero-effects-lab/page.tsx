import { HeroEffectsPreview } from "./preview";

export const metadata = { title: "5 Hero Motion Studies — Zan Decal" };

export default async function Page({ searchParams }: { searchParams: Promise<{ option?: string }> }) {
  const value = Number((await searchParams).option);
  return <HeroEffectsPreview initialOption={value >= 1 && value <= 5 ? value : 1}/>;
}
