export type Vec3 = [number, number, number];

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

export const clamp01 = (value: number): number => {
  return clamp(value, 0, 1);
};

export const lerp = (from: number, to: number, progress: number): number => {
  return from + (to - from) * progress;
};

export const lerpVec3 = (from: Vec3, to: Vec3, progress: number): Vec3 => {
  return [
    lerp(from[0], to[0], progress),
    lerp(from[1], to[1], progress),
    lerp(from[2], to[2], progress),
  ];
};

export const smoothstep = (progress: number): number => {
  const t = clamp01(progress);
  return t * t * (3 - 2 * t);
};

/** Deterministic pseudo-random value in [0, 1) - safe to call during render. */
export const hash01 = (index: number, seed = 0): number => {
  const value = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

/** Returns 0 -> 1 -> 0 inside a frame window, used for one-shot gestures. */
export const pulse = (frame: number, start: number, end: number): number => {
  if (frame <= start || frame >= end) {
    return 0;
  }
  return Math.sin(((frame - start) / (end - start)) * Math.PI);
};
