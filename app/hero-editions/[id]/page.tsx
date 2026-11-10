import { notFound } from "next/navigation";
import { editions } from "../../../components/hero-editions/editions";
import { EditionPreview } from "../../../components/hero-editions/EditionPreview";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const edition = editions.find(item => item.id === Number(id));
  return { title: `ZAN — ${edition?.name ?? "Hero Editions"}`, robots: { index: false, follow: false } };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const edition = editions.find(item => item.id === Number(id));
  if (!edition) notFound();
  return <EditionPreview key={edition.id} edition={edition} />;
}
