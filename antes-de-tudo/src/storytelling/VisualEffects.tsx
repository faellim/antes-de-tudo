import React from "react";
import { AbsoluteFill } from "remotion";
import type { VisualEvent } from "./types";

export const getFlashOpacity = (frame: number, events: readonly VisualEvent[]): number => {
  let opacity = 0;
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    if (event.kind !== "flash") {
      continue;
    }
    const local = frame - event.from;
    if (local < 0 || local >= event.durationInFrames) {
      continue;
    }
    const progress = local / Math.max(1, event.durationInFrames);
    const pulse = Math.sin(Math.PI * progress);
    opacity = Math.max(opacity, event.intensity * pulse);
  }
  return Math.min(1, opacity);
};

export const VisualEffects: React.FC<{
  readonly events: readonly VisualEvent[];
  readonly frame?: number;
}> = ({ events, frame }) => {
  const currentFrame = frame ?? 0;
  const opacity = getFlashOpacity(currentFrame, events);
  const active = events.find(
    (event) =>
      event.kind === "flash" &&
      currentFrame >= event.from &&
      currentFrame < event.from + event.durationInFrames,
  );
  if (opacity <= 0.001 || !active) {
    return null;
  }

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundColor: active.color ?? "#ffd9a8",
        opacity,
        mixBlendMode: "screen",
      }}
    />
  );
};
