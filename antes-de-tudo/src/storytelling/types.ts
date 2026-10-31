import type { CameraMovement, CameraShot } from "../core/camera";
import type { Vec3 } from "../core/math";
import type { CharacterAction } from "../characters/rig";
import type { EnvironmentEvent } from "../environments/environmentState";

export type NarrationCue = {
  readonly id: string;
  readonly text: string;
  readonly from: number;
  readonly durationInFrames: number;
  readonly src: string;
  readonly available: boolean;
  readonly voice?: string;
  readonly note?: string;
};

export type SubtitleWord = {
  readonly text: string;
  readonly from: number;
  readonly durationInFrames: number;
};

export type SubtitleCue = {
  readonly id: string;
  readonly text: string;
  readonly from: number;
  readonly durationInFrames: number;
  readonly words: readonly SubtitleWord[];
  readonly emphasis?: readonly string[];
};

export type SoundEffectCue = {
  readonly id: string;
  readonly label: string;
  readonly from: number;
  readonly durationInFrames: number;
  readonly volume: number;
  readonly src: string;
  readonly available: boolean;
  readonly note?: string;
};

export type BackgroundMusicCue = {
  readonly id: string;
  readonly label: string;
  readonly from: number;
  readonly durationInFrames: number;
  readonly volume: number;
  readonly fadeInFrames: number;
  readonly fadeOutFrames: number;
  readonly duckDuringNarration: boolean;
  readonly duckTo: number;
  readonly src: string;
  readonly available: boolean;
  readonly note?: string;
};

export type TransitionKind = "cut" | "fadeIn" | "fadeOut" | "dipToBlack";

export type TransitionCue = {
  readonly id: string;
  readonly kind: TransitionKind;
  readonly from: number;
  readonly durationInFrames: number;
};

export type VisualEventKind = "flash" | "shake";

export type VisualEvent = {
  readonly id: string;
  readonly kind: VisualEventKind;
  readonly from: number;
  readonly durationInFrames: number;
  readonly intensity: number;
  readonly color?: string;
  readonly note?: string;
};

export type EnvironmentPlacement = {
  readonly id: "prehistoric-valley";
  readonly label: string;
  readonly campfire: {
    readonly x: number;
    readonly z: number;
    readonly scale?: number;
  };
};

export type TitleCue = {
  readonly id: string;
  readonly text: string;
  readonly kind: "kicker" | "title" | "disclaimer";
  readonly from: number;
  readonly durationInFrames: number;
  readonly placement: "top" | "bottom";
};

export type SceneDefinition = {
  readonly id: string;
  readonly act: string;
  readonly startFrame: number;
  readonly durationInFrames: number;
  readonly summary: string;
  readonly narration: NarrationCue | null;
  readonly subtitle: SubtitleCue | null;
  readonly characterActions: readonly CharacterAction[];
  readonly environment: EnvironmentPlacement;
  readonly environmentEvents: readonly EnvironmentEvent[];
  readonly cameraShot: CameraShot;
  readonly cameraMovement: CameraMovement;
  readonly soundEffects: readonly SoundEffectCue[];
  readonly backgroundMusic: readonly BackgroundMusicCue[];
  readonly transitions: readonly TransitionCue[];
  readonly visualEvents: readonly VisualEvent[];
};

export type EpisodeDefinition = {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly logline: string;
  readonly historicalNote: string;
  readonly width: number;
  readonly height: number;
  readonly fps: number;
  readonly durationInFrames: number;
  readonly scenes: readonly SceneDefinition[];
  readonly titleCues: readonly TitleCue[];
  readonly initialCharacter: {
    readonly id: string;
    readonly position: Vec3;
    readonly rotationY: number;
    readonly scale: number;
  };
};
