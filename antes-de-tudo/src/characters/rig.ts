import { clamp01, lerp, smoothstep, Vec3 } from "../core/math";

export type CharacterActionKind =
  | "idle"
  | "walk"
  | "run"
  | "look"
  | "point"
  | "react"
  | "crouch"
  | "pickUp"
  | "interact"
  | "wake"
  | "shiver";

/**
 * A declarative action. Movement actions carry `position`/`toPosition` and
 * rotate smoothly; pose actions only reshape the rig. Absolute frames keep the
 * whole episode deterministic and easy to inspect in the storyboard.
 */
export type CharacterAction = {
  readonly id: string;
  readonly kind: CharacterActionKind;
  readonly from: number;
  readonly durationInFrames: number;
  readonly transitionInFrames?: number;
  readonly position?: Vec3;
  readonly toPosition?: Vec3;
  readonly rotationY?: number;
  readonly toRotationY?: number;
  readonly headYaw?: number;
  readonly headPitch?: number;
  readonly intensity?: number;
};

export type CharacterPlacement = {
  readonly id: string;
  readonly position: Vec3;
  readonly rotationY: number;
  readonly scale: number;
};

export type ArmPose = {
  readonly shoulderX: number;
  readonly shoulderZ: number;
  readonly elbow: number;
};

export type LegPose = {
  readonly hip: number;
  readonly knee: number;
};

export type CharacterPose = {
  readonly root: {
    readonly y: number;
    readonly pitch: number;
    readonly roll: number;
  };
  readonly torso: {
    readonly lean: number;
    readonly twist: number;
    readonly bob: number;
  };
  readonly head: {
    readonly pitch: number;
    readonly yaw: number;
    readonly tilt: number;
  };
  readonly leftArm: ArmPose;
  readonly rightArm: ArmPose;
  readonly leftLeg: LegPose;
  readonly rightLeg: LegPose;
};

export type CharacterState = {
  readonly position: Vec3;
  readonly rotationY: number;
  readonly pose: CharacterPose;
  readonly actionId: string;
};

const idlePose = (frame: number): CharacterPose => {
  const breath = Math.sin(frame / 18) * 0.018;
  const sway = Math.sin(frame / 24) * 0.045;
  const headDrift = Math.sin(frame / 42) * 0.12;
  const weightShift = Math.sin(frame / 30) * 0.018;

  return {
    root: { y: 0, pitch: 0, roll: 0 },
    torso: {
      lean: 0.02 + breath * 0.4,
      twist: Math.sin(frame / 50) * 0.012,
      bob: breath,
    },
    head: {
      pitch: -0.02 + Math.sin(frame / 36) * 0.025,
      yaw: headDrift,
      tilt: Math.sin(frame / 55) * 0.025,
    },
    leftArm: {
      shoulderX: sway,
      shoulderZ: -0.08,
      elbow: 0.12,
    },
    rightArm: {
      shoulderX: -sway,
      shoulderZ: 0.1,
      elbow: 0.2,
    },
    leftLeg: {
      hip: weightShift,
      knee: 0.04,
    },
    rightLeg: {
      hip: -weightShift,
      knee: 0.04,
    },
  };
};

const locomotionPose = (
  frame: number,
  local: number,
  running: boolean,
): CharacterPose => {
  const phase = local * (running ? 0.62 : 0.38);
  const swing = Math.sin(phase) * (running ? 0.95 : 0.55);
  const lift = Math.abs(Math.sin(phase));
  const amplitude = running ? 1 : 0.72;

  return {
    root: {
      y: lift * (running ? 0.06 : 0.035),
      pitch: running ? 0.05 : 0,
      roll: Math.sin(phase * 0.5) * 0.015 * amplitude,
    },
    torso: {
      lean: running ? 0.3 : 0.08,
      twist: Math.sin(phase) * 0.06,
      bob: -lift * 0.025,
    },
    head: {
      pitch: running ? 0.08 : -0.02,
      yaw: Math.sin(phase * 0.5) * 0.04,
      tilt: Math.sin(phase) * 0.025,
    },
    leftArm: {
      shoulderX: -swing * 0.75,
      shoulderZ: -0.08,
      elbow: 0.18 + Math.abs(swing) * 0.25,
    },
    rightArm: {
      shoulderX: swing * 0.75,
      shoulderZ: 0.1,
      elbow: 0.2 + Math.abs(swing) * 0.25,
    },
    leftLeg: {
      hip: swing,
      knee: Math.max(0, -swing) * 1.05 + 0.05,
    },
    rightLeg: {
      hip: -swing,
      knee: Math.max(0, swing) * 1.05 + 0.05,
    },
  };
};

const lookPose = (
  frame: number,
  action: CharacterAction,
): CharacterPose => {
  const base = idlePose(frame);
  const yaw = action.headYaw ?? -0.5;
  const pitch = action.headPitch ?? -0.02;

  return {
    ...base,
    torso: {
      ...base.torso,
      twist: yaw * 0.16,
      lean: base.torso.lean + 0.02,
    },
    head: {
      pitch,
      yaw,
      tilt: Math.sin(frame / 50) * 0.03,
    },
  };
};

const pointPose = (
  frame: number,
  local: number,
  action: CharacterAction,
): CharacterPose => {
  const base = idlePose(frame);
  const emphasis = 0.92 + Math.sin(local * 0.16) * 0.08;
  const yaw = action.headYaw ?? -0.22;

  return {
    ...base,
    torso: {
      ...base.torso,
      twist: yaw * 0.3,
      lean: 0.06,
    },
    head: {
      pitch: action.headPitch ?? -0.05,
      yaw,
      tilt: -0.04,
    },
    rightArm: {
      shoulderX: -1.22 * emphasis,
      shoulderZ: 0.42,
      elbow: 0.08,
    },
    leftArm: {
      ...base.leftArm,
      shoulderZ: -0.16,
    },
  };
};

const reactPose = (
  frame: number,
  local: number,
  action: CharacterAction,
): CharacterPose => {
  const base = idlePose(frame);
  const intensity = action.intensity ?? 1;
  const shock = 1 + Math.sin(local * 1.5) * 0.09 * intensity;

  return {
    ...base,
    root: {
      y: 0.03 * intensity,
      pitch: -0.04 * intensity,
      roll: 0.03 * intensity,
    },
    torso: {
      lean: -0.3 * intensity * shock,
      twist: 0.13 * intensity,
      bob: 0,
    },
    head: {
      pitch: -0.25 * intensity,
      yaw: -0.16 * intensity,
      tilt: 0.08 * intensity,
    },
    leftArm: {
      shoulderX: -0.5 * intensity,
      shoulderZ: -0.95 * intensity,
      elbow: 0.55 * intensity,
    },
    rightArm: {
      shoulderX: -0.3 * intensity,
      shoulderZ: 0.9 * intensity,
      elbow: 0.5 * intensity,
    },
    leftLeg: {
      hip: 0.26 * intensity,
      knee: 0.2 * intensity,
    },
    rightLeg: {
      hip: -0.26 * intensity,
      knee: 0.2 * intensity,
    },
  };
};

const crouchPose = (
  frame: number,
  intensity: number,
): CharacterPose => {
  const base = idlePose(frame);

  return {
    ...base,
    root: {
      y: -0.22 * intensity,
      pitch: 0.04 * intensity,
      roll: 0,
    },
    torso: {
      lean: 0.34 * intensity,
      twist: 0.02,
      bob: -0.02 * intensity,
    },
    head: {
      pitch: 0.13 * intensity,
      yaw: Math.sin(frame / 52) * 0.08,
      tilt: -0.02,
    },
    leftArm: {
      shoulderX: -0.28 * intensity,
      shoulderZ: -0.12,
      elbow: 0.58 * intensity,
    },
    rightArm: {
      shoulderX: -0.18 * intensity,
      shoulderZ: 0.14,
      elbow: 0.64 * intensity,
    },
    leftLeg: {
      hip: -0.9 * intensity,
      knee: 1.65 * intensity,
    },
    rightLeg: {
      hip: -0.9 * intensity,
      knee: 1.65 * intensity,
    },
  };
};

const pickUpPose = (
  frame: number,
  action: CharacterAction,
): CharacterPose => {
  const base = crouchPose(frame, action.intensity ?? 0.9);

  return {
    ...base,
    torso: {
      ...base.torso,
      lean: 0.45,
      twist: 0.16,
    },
    head: {
      ...base.head,
      pitch: 0.35,
      yaw: 0.12,
    },
    rightArm: {
      shoulderX: -0.82,
      shoulderZ: 0.22,
      elbow: 0.86,
    },
  };
};

const interactPose = (
  frame: number,
  local: number,
  action: CharacterAction,
): CharacterPose => {
  const base = crouchPose(frame, (action.intensity ?? 1) * 0.46);
  const poke = Math.sin(local * 0.24) * 0.08;

  return {
    ...base,
    torso: {
      ...base.torso,
      lean: 0.24,
      twist: 0.12,
    },
    head: {
      ...base.head,
      pitch: 0.18,
      yaw: 0.1,
    },
    rightArm: {
      shoulderX: -1.2 + poke,
      shoulderZ: 0.18,
      elbow: 0.3,
    },
    leftArm: {
      shoulderX: -0.15,
      shoulderZ: -0.1,
      elbow: 0.5,
    },
  };
};

const wakePose = (
  frame: number,
  local: number,
  durationInFrames: number,
): CharacterPose => {
  const base = idlePose(frame);
  const progress = smoothstep(clamp01(local / Math.max(1, durationInFrames)));
  const settled = 1 - progress;

  return {
    ...base,
    root: {
      y: lerp(0.34, 0, progress),
      pitch: lerp(-1.34, 0, progress),
      roll: 0.08 * settled,
    },
    torso: {
      ...base.torso,
      lean: lerp(0.42, base.torso.lean, progress),
    },
    head: {
      ...base.head,
      pitch: lerp(0.4, base.head.pitch, progress),
      yaw: lerp(-0.2, base.head.yaw, progress),
    },
  };
};

const shiverPose = (
  frame: number,
  local: number,
  action: CharacterAction,
): CharacterPose => {
  const base = crouchPose(frame, (action.intensity ?? 0.8) * 0.68);
  const tremble = Math.sin(local * 1.8) * 0.025 * (action.intensity ?? 0.8);

  return {
    ...base,
    root: {
      ...base.root,
      y: base.root.y + tremble * 0.3,
    },
    torso: {
      ...base.torso,
      twist: tremble * 2,
    },
    head: {
      ...base.head,
      tilt: tremble * 3,
      pitch: base.head.pitch + 0.05,
    },
    leftArm: {
      shoulderX: 0.4,
      shoulderZ: -0.56,
      elbow: 1.02,
    },
    rightArm: {
      shoulderX: 0.4,
      shoulderZ: 0.56,
      elbow: 1.02,
    },
  };
};

const getActionPose = (
  action: CharacterAction,
  frame: number,
  local: number,
): CharacterPose => {
  switch (action.kind) {
    case "idle":
      return idlePose(frame);
    case "walk":
      return locomotionPose(frame, local, false);
    case "run":
      return locomotionPose(frame, local, true);
    case "look":
      return lookPose(frame, action);
    case "point":
      return pointPose(frame, local, action);
    case "react":
      return reactPose(frame, local, action);
    case "crouch":
      return crouchPose(frame, action.intensity ?? 1);
    case "pickUp":
      return pickUpPose(frame, action);
    case "interact":
      return interactPose(frame, local, action);
    case "wake":
      return wakePose(frame, local, action.durationInFrames);
    case "shiver":
      return shiverPose(frame, local, action);
    default:
      return idlePose(frame);
  }
};

const blend = (from: number, to: number, progress: number): number =>
  lerp(from, to, progress);

const blendPose = (
  from: CharacterPose,
  to: CharacterPose,
  progress: number,
): CharacterPose => ({
  root: {
    y: blend(from.root.y, to.root.y, progress),
    pitch: blend(from.root.pitch, to.root.pitch, progress),
    roll: blend(from.root.roll, to.root.roll, progress),
  },
  torso: {
    lean: blend(from.torso.lean, to.torso.lean, progress),
    twist: blend(from.torso.twist, to.torso.twist, progress),
    bob: blend(from.torso.bob, to.torso.bob, progress),
  },
  head: {
    pitch: blend(from.head.pitch, to.head.pitch, progress),
    yaw: blend(from.head.yaw, to.head.yaw, progress),
    tilt: blend(from.head.tilt, to.head.tilt, progress),
  },
  leftArm: {
    shoulderX: blend(
      from.leftArm.shoulderX,
      to.leftArm.shoulderX,
      progress,
    ),
    shoulderZ: blend(
      from.leftArm.shoulderZ,
      to.leftArm.shoulderZ,
      progress,
    ),
    elbow: blend(from.leftArm.elbow, to.leftArm.elbow, progress),
  },
  rightArm: {
    shoulderX: blend(
      from.rightArm.shoulderX,
      to.rightArm.shoulderX,
      progress,
    ),
    shoulderZ: blend(
      from.rightArm.shoulderZ,
      to.rightArm.shoulderZ,
      progress,
    ),
    elbow: blend(from.rightArm.elbow, to.rightArm.elbow, progress),
  },
  leftLeg: {
    hip: blend(from.leftLeg.hip, to.leftLeg.hip, progress),
    knee: blend(from.leftLeg.knee, to.leftLeg.knee, progress),
  },
  rightLeg: {
    hip: blend(from.rightLeg.hip, to.rightLeg.hip, progress),
    knee: blend(from.rightLeg.knee, to.rightLeg.knee, progress),
  },
});

export const getCharacterState = (
  frame: number,
  actions: readonly CharacterAction[],
  initial: CharacterPlacement,
): CharacterState => {
  if (actions.length === 0) {
    return {
      position: initial.position,
      rotationY: initial.rotationY,
      pose: idlePose(frame),
      actionId: "idle",
    };
  }

  let activeIndex = 0;
  for (let index = 0; index < actions.length; index += 1) {
    if (frame >= actions[index].from) {
      activeIndex = index;
    } else {
      break;
    }
  }

  const action = actions[activeIndex];
  const local = frame - action.from;
  const clampedLocal = Math.max(0, local);
  let pose = getActionPose(
    action,
    frame,
    Math.min(clampedLocal, action.durationInFrames),
  );

  const transition = action.transitionInFrames ?? 0;
  if (activeIndex > 0 && transition > 0 && local < transition) {
    const previous = actions[activeIndex - 1];
    const previousPose = getActionPose(
      previous,
      frame,
      previous.durationInFrames,
    );
    pose = blendPose(
      previousPose,
      pose,
      smoothstep(clamp01(local / transition)),
    );
  }

  let position = initial.position;
  let rotationY = initial.rotationY;

  for (let index = 0; index < actions.length; index += 1) {
    const current = actions[index];
    if (frame < current.from) {
      break;
    }

    const progress = clamp01(
      (frame - current.from) / Math.max(1, current.durationInFrames),
    );

    if (current.position) {
      position = current.position;
    }

    if (current.toPosition) {
      const start = current.position ?? position;
      position =
        frame < current.from + current.durationInFrames
          ? [
              lerp(start[0], current.toPosition[0], smoothstep(progress)),
              lerp(start[1], current.toPosition[1], smoothstep(progress)),
              lerp(start[2], current.toPosition[2], smoothstep(progress)),
            ]
          : current.toPosition;
    }

    if (current.rotationY !== undefined) {
      rotationY = current.rotationY;
    }

    if (current.toRotationY !== undefined) {
      rotationY =
        frame < current.from + current.durationInFrames
          ? lerp(rotationY, current.toRotationY, smoothstep(progress))
          : current.toRotationY;
    }
  }

  return {
    position,
    rotationY,
    pose,
    actionId: action.id,
  };
};
