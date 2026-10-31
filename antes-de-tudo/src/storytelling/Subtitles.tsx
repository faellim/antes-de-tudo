import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { palette } from "../core/palette";
import type { SubtitleCue } from "./types";
import { findActiveSubtitle } from "./subtitles";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const Subtitles: React.FC<{
  readonly cues: readonly SubtitleCue[];
  readonly frame?: number;
}> = ({ cues, frame }) => {
  const currentFrameHook = useCurrentFrame();
  const currentFrame = frame ?? currentFrameHook;
  const cue = findActiveSubtitle(currentFrame, cues);
  if (!cue) {
    return null;
  }

  const local = currentFrame - cue.from;
  const fadeIn = interpolate(local, [0, 7], [0, 1], clamp);
  const fadeOut = interpolate(
    local,
    [cue.durationInFrames - 8, cue.durationInFrames],
    [1, 0],
    clamp,
  );
  const opacity = Math.min(fadeIn, fadeOut);
  const translateY = interpolate(fadeIn, [0, 1], [16, 0], clamp) +
    interpolate(fadeOut, [0, 1], [0, 8], clamp);

  let activeWord = -1;
  for (let index = cue.words.length - 1; index >= 0; index -= 1) {
    if (currentFrame >= cue.words[index].from) {
      activeWord = index;
      break;
    }
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 156,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 590,
            padding: "18px 24px",
            borderRadius: 18,
            backgroundColor: "rgba(10, 18, 15, 0.74)",
            border: "1px solid rgba(255, 247, 227, 0.16)",
            boxShadow: "0 18px 40px rgba(0, 0, 0, 0.35)",
            opacity,
            transform: `translateY(${translateY}px)`,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 33,
            fontWeight: 700,
            lineHeight: 1.38,
            letterSpacing: 0.1,
            color: palette.text,
            textAlign: "center",
          }}
        >
          {cue.words.map((word, index) => {
            const isActive = index === activeWord;
            const isPast = index < activeWord;
            const emphasis = cue.emphasis
              ? cue.emphasis.indexOf(word.text.replace(/[.,!?]/g, "")) >= 0
              : false;

            return (
              <span
                key={`${word.text}-${index}`}
                style={{
                  color: isActive
                    ? palette.ink
                    : isPast
                      ? "rgba(255, 247, 227, 0.94)"
                      : "rgba(255, 247, 227, 0.62)",
                  backgroundColor: isActive
                    ? palette.accent
                    : emphasis
                      ? "rgba(242, 179, 92, 0.18)"
                      : "transparent",
                  borderRadius: isActive ? 6 : 0,
                  padding: isActive ? "0 6px" : "0 1px",
                  fontWeight: isActive ? 900 : emphasis ? 800 : 700,
                  display: "inline-block",
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                }}
              >
                {word.text}
                {index < cue.words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
