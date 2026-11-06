export const storyClamp = (value: number) => Math.max(0, Math.min(1, value));
export function storyProgress(top: number, height: number, viewport: number) { return storyClamp(-top / Math.max(1, height - viewport)); }
export function storyPose(progress: number, index: number, count: number, variant: number) {
  const cursor = storyClamp(progress) * Math.max(0, count - 1), distance = index - cursor;
  let x = 0, y = distance * 112, rotate = 0, scale = 1, opacity = Math.max(.18, 1 - Math.abs(distance) * .5), clip = 0;
  if (variant === 2) { x = distance * 112; y = 0; rotate = distance * -3; opacity = Math.max(.35, 1 - Math.abs(distance) * .25); }
  if (variant === 3) { x = distance < 0 ? distance * 120 : distance * 9; y = distance < 0 ? distance * 28 : distance * 5; rotate = distance * 8; scale = Math.max(.8, 1 - Math.max(0, distance) * .055); opacity = storyClamp(1 + Math.min(0, distance)); }
  if (variant === 4) { x = 0; y = 0; scale = 1 + storyClamp(-distance) * .08; clip = storyClamp(distance); opacity = 1; }
  if (variant === 5) { x = distance * 10; y = distance * 108; rotate = distance * -5; scale = 1; }
  return { x, y, rotate, scale, opacity, clip, active: index === Math.round(cursor), textOpacity: storyClamp(1 - Math.abs(distance) * 2), grayscale: storyClamp(Math.abs(distance)), cursor };
}
