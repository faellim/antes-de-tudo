import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { palette } from "../core/palette";
import type { TitleCue } from "./types";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const TitleOverlay: React.FC<{
  readonly cues: readonly TitleCue[];
  readonly frame?: number;
}> = ({ cues, frame }) => {
  const currentFrame = frame ?? 0;
  const top = cues.filter((cue) => cue.placement === "top");
  const bottom = cues.filter((cue) => cue.placement === "bottom");

  const renderCue = (cue: TitleCue) => {
    const local = currentFrame - cue.from;
    if (local < 0 || local >= cue.durationInFrames) {
      return null;
    }
    const fadeIn = interpolate(local, [0, cue.kind === "title" ? 24 : 14], [0, 1], clamp);
    const fadeOut = interpolate(
      local,
      [cue.durationInFrames - 18, cue.durationInFrames],
      [1, 0],
      clamp,
    );
    const opacity = Math.min(fadeIn, fadeOut);
    const offset = interpolate(fadeIn, [0, 1], [18, 0], clamp);

    if (cue.kind === "kicker") {
      return (
        <div
          key={cue.id}
          style={{
            opacity,
            transform: `translateY(${offset}px)`,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 4.4,
            textTransform: "uppercase",
            color: "rgba(255, 247, 227, 0.86)",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.55)",
          }}
        >
          {cue.text}
        </div>
      );
    }

    if (cue.kind === "title") {
      return (
        <div
          key={cue.id}
          style={{
            opacity,
            transform: `translateY(${offset}px)`,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 46,
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: -1.5,
            color: palette.text,
            textAlign: "center",
            whiteSpace: "pre-line",
            textShadow: "0 5px 22px rgba(0, 0, 0, 0.58)",
          }}
        >
          {cue.text}
        </div>
      );
    }

    return (
      <div
        key={cue.id}
        style={{
          opacity,
          transform: `translateY(${offset}px)`,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 12,
          fontWeight: 700,
          color: "rgba(255, 247, 227, 0.72)",
          textAlign: "center",
          lineHeight: 1.4,
          textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
          maxWidth: 560,
        }}
      >
        {cue.text}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 86,
          left: 52,
          right: 52,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {top.map(renderCue)}
      </div>

      <div
        style={{
          position: "absolute",
          left: 46,
          right: 46,
          bottom: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        {bottom.map(renderCue)}
      </div>
    </AbsoluteFill>
  );
};
