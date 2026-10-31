import { Audio } from "@remotion/media";
import React from "react";
import {
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {
  BackgroundMusicCue,
  NarrationCue,
  SoundEffectCue,
} from "./types";

type StoryAudioProps = {
  readonly narration: readonly NarrationCue[];
  readonly soundEffects: readonly SoundEffectCue[];
  readonly backgroundMusic: readonly BackgroundMusicCue[];
};

const renderNarration = (cue: NarrationCue) => {
  if (!cue.available || !cue.src) {
    return null;
  }
  return (
    <Sequence key={cue.id} from={cue.from} durationInFrames={cue.durationInFrames}>
      <Audio src={staticFile(cue.src)} volume={0.9} />
    </Sequence>
  );
};

const renderSoundEffect = (cue: SoundEffectCue) => {
  if (!cue.available || !cue.src) {
    return null;
  }
  return (
    <Sequence key={cue.id} from={cue.from} durationInFrames={cue.durationInFrames}>
      <Audio src={staticFile(cue.src)} volume={cue.volume} />
    </Sequence>
  );
};

export const StoryAudio: React.FC<StoryAudioProps> = ({
  narration,
  soundEffects,
  backgroundMusic,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // De-duplicate music cues by id so a shared score declared per scene is
  // rendered only once.
  const uniqueMusic: BackgroundMusicCue[] = [];
  for (let index = 0; index < backgroundMusic.length; index += 1) {
    const cue = backgroundMusic[index];
    if (!uniqueMusic.some((item) => item.id === cue.id)) {
      uniqueMusic.push(cue);
    }
  }

  const narrationActive = narration.some(
    (cue) =>
      cue.available &&
      frame >= cue.from &&
      frame < cue.from + cue.durationInFrames,
  );

  const musicVolume = (cue: BackgroundMusicCue): number => {
    let volume = cue.volume;
    if (cue.fadeInFrames > 0) {
      const progress = Math.min(
        1,
        Math.max(0, (frame - cue.from) / cue.fadeInFrames),
      );
      volume *= progress;
    }
    if (cue.fadeOutFrames > 0) {
      const end = cue.from + cue.durationInFrames;
      const progress = Math.min(
        1,
        Math.max(0, (end - frame) / cue.fadeOutFrames),
      );
      volume *= progress;
    }
    if (cue.duckDuringNarration && narrationActive) {
      volume *= cue.duckTo;
    }
    return volume;
  };

  return (
    <>
      {narration.map(renderNarration)}
      {soundEffects.map(renderSoundEffect)}
      {uniqueMusic.map((cue) => {
        if (!cue.available || !cue.src) {
          return null;
        }
        const duration = cue.durationInFrames || durationInFrames - cue.from;
        return (
          <Sequence
            key={cue.id}
            from={cue.from}
            durationInFrames={duration}
          >
            <Audio src={staticFile(cue.src)} volume={musicVolume(cue)} />
          </Sequence>
        );
      })}
    </>
  );
};
