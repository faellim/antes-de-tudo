import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionCue } from "./types";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const getTransitionDarkness = (
  frame: number,
  transitions: readonly TransitionCue[],
): number => {
  let darkness = 0;
  for (let index = 0; index < transitions.length; index += 1) {
    const transition = transitions[index];
    const local = frame - transition.from;
    if (local < 0 || local >= transition.durationInFrames) {
      continue;
    }
    const progress = local / Math.max(1, transition.durationInFrames);

    if (transition.kind === "fadeIn") {
      const value = 1 - interpolate(progress, [0, 1], [0, 1], clamp);
      darkness = Math.max(darkness, value);
    } else if (transition.kind === "fadeOut") {
      const value = interpolate(progress, [0, 1], [0, 1], clamp);
      darkness = Math.max(darkness, value);
    } else if (transition.kind === "dipToBlack") {
      const value =
        progress < 0.5
          ? interpolate(progress, [0, 0.5], [0, 1], clamp)
          : interpolate(progress, [0.5, 1], [1, 0], clamp);
      darkness = Math.max(darkness, value);
    }
  }
  return Math.min(1, darkness);
};

export const TransitionOverlay: React.FC<{
  readonly transitions: readonly TransitionCue[];
  readonly frame?: number;
}> = ({ transitions, frame }) => {
  const currentFrame = frame ?? 0;
  const darkness = getTransitionDarkness(currentFrame, transitions);
  if (darkness <= 0.001) {
    return null;
  }
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundColor: "#050807",
        opacity: darkness,
      }}
    />
  );
};
