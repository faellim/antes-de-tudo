import React from "react";
import { AbsoluteFill } from "remotion";

/** Shared cinematic finish: softly darkened edges and a warm top light. */
export const Vignette: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at 50% 46%, transparent 42%, rgba(12, 22, 18, 0.22) 76%, rgba(8, 14, 12, 0.46) 100%)",
        boxShadow: "inset 0 0 140px rgba(8, 14, 12, 0.28)",
      }}
    />
  );
};
