import { clamp01, lerp, lerpVec3, smoothstep, Vec3 } from "./math";

export type CameraEasing = "linear" | "easeInOut" | "easeOut";

export type CameraShotKind =
  | "establishing"
  | "closeUp"
  | "medium"
  | "tracking"
  | "pan"
  | "dollyIn"
  | "dollyOut"
  | "reaction";

export type CameraAnchor = "world" | "character";

export type CameraMovementKind =
  | "static"
  | "dollyIn"
  | "dollyOut"
  | "track"
  | "pan"
  | "tilt"
  | "crane";

/** Declarative shot label used by the story engine and the storyboard. */
export type CameraShot = {
  readonly kind: CameraShotKind;
  readonly anchor: CameraAnchor;
  readonly description: string;
};

/**
 * A movement is expressed as offsets. With anchor="character" the offsets are
 * relative to the character's ground position, so tracking shots follow him
 * automatically without duplicating coordinates.
 */
export type CameraMovement = {
  readonly kind: CameraMovementKind;
  readonly fromPosition: Vec3;
  readonly toPosition: Vec3;
  readonly fromTarget: Vec3;
  readonly toTarget: Vec3;
  readonly fromFov?: number;
  readonly toFov?: number;
  readonly easing?: CameraEasing;
};

export type CameraDirection = {
  readonly shot: CameraShot;
  readonly movement: CameraMovement;
};

export type CameraState = {
  readonly position: Vec3;
  readonly target: Vec3;
  readonly fov: number;
};

export type CameraScene = {
  readonly startFrame: number;
  readonly durationInFrames: number;
  readonly direction: CameraDirection;
};

/** One-shot camera shake, usually driven by a narration-synced visual event. */
export type CameraShake = {
  readonly from: number;
  readonly durationInFrames: number;
  readonly intensity: number;
};

const ease = (progress: number, easing: CameraEasing): number => {
  const t = clamp01(progress);
  if (easing === "linear") {
    return t;
  }
  if (easing === "easeOut") {
    return 1 - (1 - t) * (1 - t) * (1 - t);
  }
  return smoothstep(t);
};

const addVec3 = (a: Vec3, b: Vec3): Vec3 => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
];

const getShakeOffset = (
  frame: number,
  shakes: readonly CameraShake[],
): Vec3 => {
  let x = 0;
  let y = 0;
  for (let index = 0; index < shakes.length; index += 1) {
    const shake = shakes[index];
    const local = frame - shake.from;
    if (local < 0 || local >= shake.durationInFrames) {
      continue;
    }
    const decay = 1 - local / Math.max(1, shake.durationInFrames);
    const amplitude = shake.intensity * decay;
    x += Math.sin(frame * 3.1 + index) * 0.12 * amplitude;
    y += Math.cos(frame * 2.3 + index) * 0.09 * amplitude;
  }
  return [x, y, 0];
};


/**
 * Resolves the active camera. The `cameraShot.anchor` decides whether the
 * movement offsets are absolute world coordinates or character-relative ones.
 */
export const getCameraState = (
  frame: number,
  scenes: readonly CameraScene[],
  characterPosition: Vec3,
  shakes: readonly CameraShake[] = [],
): CameraState => {
  if (scenes.length === 0) {
    throw new Error("At least one camera scene is required");
  }

  const active =
    scenes.find(
      (scene) =>
        frame >= scene.startFrame &&
        frame < scene.startFrame + scene.durationInFrames,
    ) ??
    (frame < scenes[0].startFrame ? scenes[0] : scenes[scenes.length - 1]);

  const progress =
    (frame - active.startFrame) / Math.max(1, active.durationInFrames);
  const movement = active.direction.movement;
  const t = ease(progress, movement.easing ?? "easeInOut");
  const fromFov = movement.fromFov ?? 40;

  const rawPosition = lerpVec3(
    movement.fromPosition,
    movement.toPosition,
    t,
  );
  const rawTarget = lerpVec3(movement.fromTarget, movement.toTarget, t);
  const anchoredPosition =
    active.direction.shot.anchor === "character"
      ? addVec3(characterPosition, rawPosition)
      : rawPosition;
  const shake = getShakeOffset(frame, shakes);

  return {
    position: addVec3(anchoredPosition, shake),
    target:
      active.direction.shot.anchor === "character"
        ? addVec3(characterPosition, rawTarget)
        : rawTarget,
    fov: lerp(fromFov, movement.toFov ?? fromFov, t),
  };
};
