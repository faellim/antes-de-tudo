import { clamp01, smoothstep } from "../core/math";

/**
 * A single lighting/sky look. Every value is numeric or a CSS hex color so the
 * whole environment can be interpolated deterministically between keyframes.
 */
export type EnvironmentLook = {
  readonly skyTop: string;
  readonly skyHorizon: string;
  readonly skyLow: string;
  readonly fogColor: string;
  readonly sunColor: string;
  readonly sunIntensity: number;
  readonly ambientIntensity: number;
  readonly hemisphereIntensity: number;
  readonly fogNear: number;
  readonly fogFar: number;
  readonly sunOpacity: number;
  readonly sunElevation: number;
  readonly moonOpacity: number;
  readonly starsOpacity: number;
  readonly cloudOpacity: number;
  readonly fireIntensity: number;
};

export type EnvironmentKeyframe = EnvironmentLook & {
  readonly frame: number;
  readonly label: string;
};

/** Declarative environment beat owned by a scene and shown in the storyboard. */
export type EnvironmentEvent = {
  readonly id: string;
  readonly kind: "sky";
  readonly keyframe: EnvironmentKeyframe;
};

export type EnvironmentState = EnvironmentLook;

const parseHex = (hex: string): [number, number, number] => {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? `${value[0]}${value[0]}${value[1]}${value[1]}${value[2]}${value[2]}`
      : value;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
};

const toHex = (channels: readonly [number, number, number]): string => {
  return `#${channels
    .map((channel) => {
      const hex = Math.round(Math.min(255, Math.max(0, channel))).toString(16);
      return hex.length < 2 ? `0${hex}` : hex;
    })
    .join("")}`;
};

export const lerpColor = (from: string, to: string, progress: number): string => {
  const t = clamp01(progress);
  const a = parseHex(from);
  const b = parseHex(to);
  return toHex([
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]);
};

const lerpNumber = (from: number, to: number, progress: number): number =>
  from + (to - from) * progress;

const mixLook = (
  from: EnvironmentLook,
  to: EnvironmentLook,
  progress: number,
): EnvironmentState => {
  const t = smoothstep(clamp01(progress));
  return {
    skyTop: lerpColor(from.skyTop, to.skyTop, t),
    skyHorizon: lerpColor(from.skyHorizon, to.skyHorizon, t),
    skyLow: lerpColor(from.skyLow, to.skyLow, t),
    fogColor: lerpColor(from.fogColor, to.fogColor, t),
    sunColor: lerpColor(from.sunColor, to.sunColor, t),
    sunIntensity: lerpNumber(from.sunIntensity, to.sunIntensity, t),
    ambientIntensity: lerpNumber(
      from.ambientIntensity,
      to.ambientIntensity,
      t,
    ),
    hemisphereIntensity: lerpNumber(
      from.hemisphereIntensity,
      to.hemisphereIntensity,
      t,
    ),
    fogNear: lerpNumber(from.fogNear, to.fogNear, t),
    fogFar: lerpNumber(from.fogFar, to.fogFar, t),
    sunOpacity: lerpNumber(from.sunOpacity, to.sunOpacity, t),
    sunElevation: lerpNumber(from.sunElevation, to.sunElevation, t),
    moonOpacity: lerpNumber(from.moonOpacity, to.moonOpacity, t),
    starsOpacity: lerpNumber(from.starsOpacity, to.starsOpacity, t),
    cloudOpacity: lerpNumber(from.cloudOpacity, to.cloudOpacity, t),
    fireIntensity: lerpNumber(from.fireIntensity, to.fireIntensity, t),
  };
};

export const keyframesFromEvents = (
  events: readonly EnvironmentEvent[],
): readonly EnvironmentKeyframe[] => events.map((event) => event.keyframe);

/** Pure function of the frame; no clocks, timers or randomness. */
export const getEnvironmentState = (
  frame: number,
  keyframes: readonly EnvironmentKeyframe[],
): EnvironmentState => {
  if (keyframes.length === 0) {
    throw new Error("At least one environment keyframe is required");
  }

  const first = keyframes[0];
  if (frame <= first.frame) {
    return first;
  }

  for (let index = 0; index < keyframes.length - 1; index += 1) {
    const current = keyframes[index];
    const next = keyframes[index + 1];
    if (frame >= current.frame && frame < next.frame) {
      const span = Math.max(1, next.frame - current.frame);
      return mixLook(current, next, (frame - current.frame) / span);
    }
  }

  return keyframes[keyframes.length - 1];
};
