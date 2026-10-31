export const VIDEO = {
  width: 720,
  height: 1280,
  fps: 30,
  durationInFrames: 1350,
} as const;

/** The original scene keeps its own 30s timing and is never resized with the new episode. */
export const LEGACY_VIDEO = {
  width: 720,
  height: 1280,
  fps: 30,
  durationInFrames: 900,
} as const;

export const STORYBOARD = {
  width: 1080,
  height: 3000,
  fps: 30,
  durationInFrames: 1,
} as const;
