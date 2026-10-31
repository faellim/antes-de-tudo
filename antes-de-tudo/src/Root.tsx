import React from "react";
import { Composition } from "remotion";
import { LEGACY_VIDEO, STORYBOARD } from "./core/config";
import { Episode001 } from "./episodes/episode-001/Episode001";
import { Episode001Storyboard } from "./episodes/episode-001/Storyboard";
import { episode001 } from "./episodes/episode-001/episode";
import { PrehistoricScene } from "./PrehistoricScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={episode001.id}
        component={Episode001}
        durationInFrames={episode001.durationInFrames}
        fps={episode001.fps}
        width={episode001.width}
        height={episode001.height}
      />
      <Composition
        id="Episodio01Storyboard"
        component={Episode001Storyboard}
        durationInFrames={STORYBOARD.durationInFrames}
        fps={STORYBOARD.fps}
        width={STORYBOARD.width}
        height={STORYBOARD.height}
      />
      <Composition
        id="Episodio01Legacy"
        component={PrehistoricScene}
        durationInFrames={LEGACY_VIDEO.durationInFrames}
        fps={LEGACY_VIDEO.fps}
        width={LEGACY_VIDEO.width}
        height={LEGACY_VIDEO.height}
      />
    </>
  );
};
