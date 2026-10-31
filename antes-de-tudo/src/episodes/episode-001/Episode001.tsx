import { ThreeCanvas } from "@remotion/three";
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PrehistoricCharacter } from "../../characters/PrehistoricCharacter";
import { getCharacterState } from "../../characters/rig";
import { Vignette } from "../../components/Vignette";
import { CameraRig } from "../../core/CameraRig";
import { getCameraState } from "../../core/camera";
// remove palette import
import { SceneLighting } from "../../core/SceneLighting";
import { terrainHeight } from "../../environments/terrain";
import { getEnvironmentState, keyframesFromEvents } from "../../environments/environmentState";
import { PrehistoricEnvironment } from "../../environments/PrehistoricEnvironment";
import { Subtitles } from "../../storytelling/Subtitles";
import { StoryAudio } from "../../storytelling/StoryAudio";
import { TitleOverlay } from "../../storytelling/TitleOverlay";
import { TransitionOverlay } from "../../storytelling/TransitionOverlay";
import { VisualEffects } from "../../storytelling/VisualEffects";
import { episode001 } from "./episode";
import { CHARACTER_ACTIONS } from "./character";
import { CAMPFIRE } from "./environment";

const CAMERA_SCENES = episode001.scenes.map((scene) => ({
  startFrame: scene.startFrame,
  durationInFrames: scene.durationInFrames,
  direction: {
    shot: scene.cameraShot,
    movement: scene.cameraMovement,
  },
}));

const SUBTITLES = episode001.scenes
  .map((scene) => scene.subtitle)
  .filter((cue): cue is NonNullable<typeof cue> => cue !== null);

const NARRATIONS = episode001.scenes
  .map((scene) => scene.narration)
  .filter((cue): cue is NonNullable<typeof cue> => cue !== null);

const SOUND_EFFECTS = episode001.scenes.reduce<
  (typeof episode001.scenes)[number]["soundEffects"][number][]
>((all, scene) => {
  return all.concat(scene.soundEffects);
}, []);

const BACKGROUND_MUSIC = episode001.scenes.reduce<
  (typeof episode001.scenes)[number]["backgroundMusic"][number][]
>((all, scene) => {
  return all.concat(scene.backgroundMusic);
}, []);

const TRANSITIONS = episode001.scenes.reduce<
  (typeof episode001.scenes)[number]["transitions"][number][]
>((all, scene) => {
  return all.concat(scene.transitions);
}, []);

const VISUAL_EVENTS = episode001.scenes.reduce<
  (typeof episode001.scenes)[number]["visualEvents"][number][]
>((all, scene) => {
  return all.concat(scene.visualEvents);
}, []);

const ENVIRONMENT_EVENTS = episode001.scenes.reduce<
  (typeof episode001.scenes)[number]["environmentEvents"][number][]
>((all, scene) => {
  return all.concat(scene.environmentEvents);
}, []);

const CAMERA_SHAKES = VISUAL_EVENTS.filter(
  (event) => event.kind === "shake",
).map((event) => ({
  from: event.from,
  durationInFrames: event.durationInFrames,
  intensity: event.intensity,
}));

export const Episode001: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const environment = getEnvironmentState(
    frame,
    keyframesFromEvents(ENVIRONMENT_EVENTS),
  );

  const characterState = getCharacterState(
    frame,
    CHARACTER_ACTIONS,
    episode001.initialCharacter,
  );

  const groundY = terrainHeight(
    characterState.position[0],
    characterState.position[2],
  );
  const characterWorldPosition: [number, number, number] = [
    characterState.position[0],
    groundY + characterState.position[1],
    characterState.position[2],
  ];

  const cameraState = getCameraState(
    frame,
    CAMERA_SCENES,
    characterWorldPosition,
    CAMERA_SHAKES,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: environment.skyHorizon }}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        camera={{
          fov: cameraState.fov,
          near: 0.1,
          far: 200,
          position: cameraState.position,
        }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={[environment.skyHorizon]} />
        <fog
          attach="fog"
          args={[environment.fogColor, environment.fogNear, environment.fogFar]}
        />

        <CameraRig
          scenes={CAMERA_SCENES}
          characterPosition={characterWorldPosition}
          shakes={CAMERA_SHAKES}
        />
        <SceneLighting state={environment} />
        <PrehistoricEnvironment
          frame={frame}
          state={environment}
          campfire={{
            x: CAMPFIRE.x,
            z: CAMPFIRE.z,
            scale: CAMPFIRE.scale,
          }}
        />
        <PrehistoricCharacter
          state={{
            ...characterState,
            position: characterWorldPosition,
          }}
          scale={episode001.initialCharacter.scale}
        />
      </ThreeCanvas>

      <Vignette />
      <TitleOverlay cues={episode001.titleCues} frame={frame} />
      <Subtitles cues={SUBTITLES} frame={frame} />
      <TransitionOverlay transitions={TRANSITIONS} frame={frame} />
      <VisualEffects events={VISUAL_EVENTS} frame={frame} />
      <StoryAudio
        narration={NARRATIONS}
        soundEffects={SOUND_EFFECTS}
        backgroundMusic={BACKGROUND_MUSIC}
      />
    </AbsoluteFill>
  );
};
