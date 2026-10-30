export type StudioVehicle = "car" | "ducati";

/** Match the Ducati's red body panels, never its frame or mechanical parts. */
export function isVehiclePaint(vehicle: StudioVehicle, meshName: string, materialName: string) {
  if (vehicle === "ducati") return /^MAT_Ducati_StreetFighter_V4S_Carpaint_Red(?:\.|$)/.test(materialName);
  const name = `${meshName} ${materialName}`.toLowerCase();
  return /body|paint|car|shell|coat/.test(name) &&
    !/glass|window|tire|wheel|rim|light|interior|black/.test(name);
}
