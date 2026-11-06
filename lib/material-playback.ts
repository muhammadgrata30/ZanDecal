export type MaterialPhase = "closed" | "opening" | "open" | "closing";
export interface MaterialPlayback { phase: MaterialPhase; progress: number; paused: boolean; visited: boolean }
export const MATERIAL_OPEN_SECONDS = 4;
export const MATERIAL_CLOSE_SECONDS = 2.6;
export const initialMaterialPlayback = (): MaterialPlayback => ({ phase: "closed", progress: 0, paused: false, visited: false });
export function moveMaterial(state: MaterialPlayback, direction: "opening" | "closing"): MaterialPlayback {
  return { ...state, phase: direction, paused: false, visited: true };
}
export function advanceMaterial(state: MaterialPlayback, delta: number): MaterialPlayback {
  if (state.paused || state.phase === "open" || state.phase === "closed") return state;
  const change = Math.max(0, Math.min(.1, delta)) / (state.phase === "opening" ? MATERIAL_OPEN_SECONDS : MATERIAL_CLOSE_SECONDS);
  const progress = Math.max(0, Math.min(1, state.progress + (state.phase === "opening" ? change : -change)));
  return { ...state, progress, phase: progress >= 1 ? "open" : progress <= 0 ? "closed" : state.phase };
}
export const finishMaterial = (state: MaterialPlayback): MaterialPlayback => ({ ...state, progress: 1, phase: "open", paused: false, visited: true });
export function isMaterialMoving(state: MaterialPlayback) { return state.phase === "opening" || state.phase === "closing"; }
