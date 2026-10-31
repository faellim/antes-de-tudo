import React from "react";
import { palette } from "../core/palette";
import { ArmPose, CharacterState, LegPose } from "./rig";

const FUR_TUFTS = Array.from({ length: 9 }, (_, index) => {
  const angle = (index / 9) * Math.PI * 2;
  return {
    x: Math.cos(angle) * 0.5,
    z: Math.sin(angle) * 0.5,
    rotationY: -angle,
  };
});

const NECKLACE_BEADS = [-0.2, -0.1, 0, 0.1, 0.2];

const Arm: React.FC<{
  readonly side: -1 | 1;
  readonly pose: ArmPose;
  readonly withSpear?: boolean;
}> = ({ side, pose, withSpear = false }) => {
  return (
    <group
      position={[side * 0.47, 0.52, 0]}
      rotation={[pose.shoulderX, 0, pose.shoulderZ]}
    >
      <mesh position={[0, -0.23, 0]} castShadow>
        <capsuleGeometry args={[0.115, 0.32, 4, 6]} />
        <meshStandardMaterial color={palette.characterSkin} flatShading />
      </mesh>

      <group position={[0, -0.45, 0]} rotation={[pose.elbow, 0, 0]}>
        <mesh position={[0, -0.21, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.26, 4, 6]} />
          <meshStandardMaterial
            color={palette.characterSkinDark}
            flatShading
          />
        </mesh>
        <mesh position={[0, -0.43, 0]} castShadow>
          <sphereGeometry args={[0.12, 6, 5]} />
          <meshStandardMaterial color={palette.characterSkin} flatShading />
        </mesh>

        {withSpear ? (
          <group position={[0, -0.43, 0.03]} rotation={[0.08, 0, -0.26]}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.032, 2, 5]} />
              <meshStandardMaterial color={palette.trunkDark} flatShading />
            </mesh>
            <mesh position={[0, 1.43, 0]} castShadow>
              <coneGeometry args={[0.08, 0.24, 5]} />
              <meshStandardMaterial color={palette.rockLight} flatShading />
            </mesh>
            <mesh position={[0, 0.93, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.09, 5]} />
              <meshStandardMaterial color={palette.furLight} flatShading />
            </mesh>
          </group>
        ) : null}
      </group>
    </group>
  );
};

const Leg: React.FC<{
  readonly side: -1 | 1;
  readonly pose: LegPose;
}> = ({ side, pose }) => {
  return (
    <group
      position={[side * 0.22, 1.06, 0]}
      rotation={[pose.hip, 0, 0]}
    >
      <mesh position={[0, -0.28, 0]} castShadow>
        <capsuleGeometry args={[0.145, 0.36, 4, 6]} />
        <meshStandardMaterial color={palette.characterSkin} flatShading />
      </mesh>

      <group position={[0, -0.58, 0]} rotation={[pose.knee, 0, 0]}>
        <mesh position={[0, -0.23, 0]} castShadow>
          <capsuleGeometry args={[0.115, 0.3, 4, 6]} />
          <meshStandardMaterial
            color={palette.characterSkinDark}
            flatShading
          />
        </mesh>
        <mesh position={[0, -0.46, 0.08]} castShadow>
          <boxGeometry args={[0.23, 0.12, 0.34]} />
          <meshStandardMaterial color={palette.characterSkinDark} flatShading />
        </mesh>
        <mesh position={[0, -0.38, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.15, 0.13, 6]} />
          <meshStandardMaterial color={palette.fur} flatShading />
        </mesh>
      </group>
    </group>
  );
};

export const PrehistoricCharacter: React.FC<{
  readonly state: CharacterState;
  readonly scale?: number;
}> = ({ state, scale = 1 }) => {
  const pose = state.pose;

  return (
    <group
      position={state.position}
      rotation={[0, state.rotationY, 0]}
      scale={scale}
    >
      <group
        position={[0, pose.root.y, 0]}
        rotation={[pose.root.pitch, 0, pose.root.roll]}
      >
        <Leg side={-1} pose={pose.leftLeg} />
        <Leg side={1} pose={pose.rightLeg} />

        <group
          position={[0, 1.02, 0]}
          rotation={[pose.torso.lean, pose.torso.twist, 0]}
        >
        <group position={[0, pose.torso.bob, 0]}>
          {/* Torso and fur tunic */}
          <mesh position={[0, 0.4, 0]} scale={[0.46, 0.56, 0.3]} castShadow>
            <sphereGeometry args={[1, 8, 7]} />
            <meshStandardMaterial
              color={palette.characterSkin}
              flatShading
            />
          </mesh>

          <mesh position={[0, 0.24, 0]} castShadow>
            <cylinderGeometry args={[0.44, 0.58, 0.82, 6]} />
            <meshStandardMaterial color={palette.fur} flatShading />
          </mesh>

          <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.47, 0.035, 4, 12]} />
            <meshStandardMaterial color={palette.furLight} flatShading />
          </mesh>

          {FUR_TUFTS.map((tuft, index) => (
            <mesh
              key={`tuft-${index}`}
              position={[tuft.x, -0.18, tuft.z]}
              rotation={[0, tuft.rotationY, Math.PI]}
            >
              <coneGeometry args={[0.12, 0.24, 3]} />
              <meshStandardMaterial color={palette.furLight} flatShading />
            </mesh>
          ))}

          {/* Shoulder fur pads */}
          <mesh position={[-0.43, 0.57, 0]} scale={[0.2, 0.14, 0.2]}>
            <sphereGeometry args={[1, 6, 5]} />
            <meshStandardMaterial color={palette.furLight} flatShading />
          </mesh>
          <mesh position={[0.43, 0.57, 0]} scale={[0.2, 0.14, 0.2]}>
            <sphereGeometry args={[1, 6, 5]} />
            <meshStandardMaterial color={palette.furLight} flatShading />
          </mesh>

          {NECKLACE_BEADS.map((x, index) => (
            <mesh
              key={`bead-${index}`}
              position={[x, 0.56 - Math.abs(x) * 0.18, 0.28]}
            >
              <sphereGeometry args={[0.042, 5, 4]} />
              <meshStandardMaterial color={palette.bone} flatShading />
            </mesh>
          ))}

          <Arm side={-1} pose={pose.leftArm} />
          <Arm side={1} pose={pose.rightArm} withSpear />

          {/* Head */}
          <group
            position={[0, 0.9, 0]}
            rotation={[pose.head.pitch, pose.head.yaw, pose.head.tilt]}
          >
            <mesh position={[0, -0.03, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.17, 0.18, 6]} />
              <meshStandardMaterial
                color={palette.characterSkinDark}
                flatShading
              />
            </mesh>

            <mesh
              position={[0, 0.24, 0]}
              scale={[1, 1.07, 0.96]}
              castShadow
            >
              <sphereGeometry args={[0.4, 9, 8]} />
              <meshStandardMaterial
                color={palette.characterSkin}
                flatShading
              />
            </mesh>

            {/* Hair cap and back hair */}
            <mesh position={[0, 0.37, -0.02]} scale={[1.03, 0.56, 1]}>
              <sphereGeometry args={[0.4, 8, 6]} />
              <meshStandardMaterial color={palette.hair} flatShading />
            </mesh>
            <mesh position={[0, 0.22, -0.25]} scale={[0.38, 0.42, 0.2]}>
              <sphereGeometry args={[1, 7, 5]} />
              <meshStandardMaterial color={palette.hair} flatShading />
            </mesh>

            {/* Brow, eyes, nose, mouth, ears */}
            <mesh position={[0, 0.36, 0.35]} castShadow>
              <boxGeometry args={[0.48, 0.075, 0.12]} />
              <meshStandardMaterial color={palette.hair} flatShading />
            </mesh>
            <mesh position={[-0.14, 0.25, 0.37]}>
              <sphereGeometry args={[0.037, 6, 5]} />
              <meshBasicMaterial color={palette.eye} />
            </mesh>
            <mesh position={[0.14, 0.25, 0.37]}>
              <sphereGeometry args={[0.037, 6, 5]} />
              <meshBasicMaterial color={palette.eye} />
            </mesh>
            <mesh position={[0, 0.18, 0.41]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.075, 0.19, 4]} />
              <meshStandardMaterial
                color={palette.characterSkinDark}
                flatShading
              />
            </mesh>
            <mesh position={[0, 0.07, 0.375]}>
              <boxGeometry args={[0.17, 0.028, 0.04]} />
              <meshStandardMaterial color="#6b3d2c" flatShading />
            </mesh>
            <mesh position={[0, 0.035, 0.29]} scale={[0.22, 0.12, 0.13]}>
              <sphereGeometry args={[1, 6, 5]} />
              <meshStandardMaterial color={palette.hair} flatShading />
            </mesh>
            <mesh position={[-0.4, 0.24, 0]} scale={[0.55, 1, 0.7]}>
              <sphereGeometry args={[0.1, 6, 5]} />
              <meshStandardMaterial
                color={palette.characterSkinDark}
                flatShading
              />
            </mesh>
            <mesh position={[0.4, 0.24, 0]} scale={[0.55, 1, 0.7]}>
              <sphereGeometry args={[0.1, 6, 5]} />
              <meshStandardMaterial
                color={palette.characterSkinDark}
                flatShading
              />
            </mesh>

            {/* Bone ornament tucked into the hair */}
            <mesh position={[0.2, 0.53, -0.04]} rotation={[0.2, 0, 0.5]}>
              <cylinderGeometry args={[0.025, 0.025, 0.34, 5]} />
              <meshStandardMaterial color={palette.bone} flatShading />
            </mesh>
          </group>
        </group>
      </group>
      </group>
    </group>
  );
};
