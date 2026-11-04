import type { Material } from "./content-types";

export type PreviewFinish = "Gloss" | "Satin" | "Matte";
export function materialDefaultFinish(material?: Pick<Material, "name" | "type">): PreviewFinish {
  const description = `${material?.name || ""} ${material?.type || ""}`.toLowerCase();
  // Only use finish words actually present in the material label, never brand IDs.
  if (/matte|\bmat\b|\bdof\b/.test(description)) return "Matte";
  if (/gloss/.test(description)) return "Gloss";
  return "Satin";
}
export function materialSurface(material: Pick<Material, "name" | "type"> | undefined, finish: PreviewFinish) {
  const label = `${material?.name || ""} ${material?.type || ""}`.toLowerCase();
  const chrome = /\bchrome\b|\bkrom\b/.test(label);
  const metallic = /\bmetallic\b|\bmetalik\b/.test(label);
  // Artistic PBR preview values, not measured manufacturer specifications.
  return {
    roughness: { Gloss: .14, Satin: .36, Matte: .75 }[finish],
    metalness: chrome ? .92 : metallic ? .65 : .08,
    clearcoat: finish === "Matte" ? .1 : .85,
    grain: finish === "Gloss" ? .015 : finish === "Satin" ? .04 : .055,
  };
}
