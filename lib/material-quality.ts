export type MaterialQuality = "desktop" | "mobile" | "lite";
export const MATERIAL_QUALITY = {
  desktop: { columns: 64, rows: 22, dpr: 1.5, fps: 60, shadows: true, environment: 128, portals: 7 },
  mobile: { columns: 32, rows: 10, dpr: 1.25, fps: 30, shadows: false, environment: 64, portals: 5 },
  lite: { columns: 20, rows: 8, dpr: 1, fps: 30, shadows: false, environment: 32, portals: 4 },
} as const;
export function initialMaterialQuality(mobile: boolean, cores?: number, memory?: number, saveData?: boolean): MaterialQuality {
  if (saveData || (cores !== undefined && cores <= 4) || (memory !== undefined && memory <= 4)) return "lite";
  return mobile ? "mobile" : "desktop";
}
export function lowerMaterialQuality(quality: MaterialQuality): MaterialQuality {
  return quality === "desktop" ? "mobile" : "lite";
}
export function effectiveMaterialQuality(initial: MaterialQuality, limited: MaterialQuality): MaterialQuality {
  const order: MaterialQuality[] = ["desktop", "mobile", "lite"];
  return order[Math.max(order.indexOf(initial), order.indexOf(limited))];
}
