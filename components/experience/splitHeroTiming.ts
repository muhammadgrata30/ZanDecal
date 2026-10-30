export const HERO_HOLD_MS = 3000;
export const HERO_TRANSITION_MS = 1000;
export const HERO_SLOT_MS = HERO_HOLD_MS + HERO_TRANSITION_MS;

export function splitHeroOpacity(progress: number, incoming: boolean) {
  const t = incoming ? Math.max(0, Math.min(1, (progress - .5) * 2)) : Math.max(0, Math.min(1, progress * 2));
  const eased = t * t * (3 - 2 * t);
  return incoming ? eased : 1 - eased;
}

/** Every image has 3s fully visible followed by a 1s transition to its successor. */
export function splitHeroFrame(elapsedMs: number) {
  const time = Math.max(0, elapsedMs);
  const slot = Math.floor(time / HERO_SLOT_MS);
  const within = time % HERO_SLOT_MS;
  return { current: slot % 2, next: (slot + 1) % 2,
    progress: Math.max(0, Math.min(1, (within - HERO_HOLD_MS) / HERO_TRANSITION_MS)) };
}
