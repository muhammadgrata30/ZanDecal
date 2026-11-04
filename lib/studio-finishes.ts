export type FinishType = "Glossy" | "Matte" | "Satin" | "Metallic";
export const FINISH_SPECS: Record<FinishType, { roughness: number; metalness: number; label: string; desc: string; coat: number }> = {
  Glossy: { roughness: .1, metalness: .2, label: "Glossy", desc: "Refleksi jernih cermin wet-look", coat: 1 },
  Matte: { roughness: .7, metalness: .05, label: "Matte", desc: "Doff beludru anti-silau", coat: 0 },
  Satin: { roughness: .35, metalness: .25, label: "Satin", desc: "Semi-gloss mewah sentuhan sutra", coat: .4 },
  Metallic: { roughness: .2, metalness: .85, label: "Metallic", desc: "Pendaran butiran kristal metalik", coat: .8 },
};
