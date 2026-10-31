import React from "react";
import { Vec3 } from "../core/math";
import { palette } from "../core/palette";
import { terrainHeight } from "./terrain";

type RockSpec = {
  readonly x: number;
  readonly z: number;
  readonly scale: number;
  readonly rotation: Vec3;
  readonly color: string;
  readonly moss?: boolean;
};

const ROCKS: readonly RockSpec[] = [
  { x: -3.4, z: 2.5, scale: 1.0, rotation: [0.1, 0.4, 0.15], color: palette.rock },
  { x: 3.6, z: -0.4, scale: 1.2, rotation: [0.15, 0.9, -0.1], color: palette.rockDark, moss: true },
  { x: -2.3, z: -1.8, scale: 0.7, rotation: [0.3, 0.2, 0.2], color: palette.rockLight },
  { x: 5.1, z: 3.4, scale: 0.85, rotation: [0.1, 1.4, 0.1], color: palette.rock },
  { x: -6.4, z: 3.1, scale: 1.35, rotation: [0.2, 0.7, 0.12], color: palette.rockDark, moss: true },
  { x: 1.9, z: 4.5, scale: 0.55, rotation: [0.4, 0.3, 0.2], color: palette.rockLight },
  { x: -8.5, z: -1.4, scale: 0.95, rotation: [0.1, 1.1, 0.05], color: palette.rock },
  { x: 7.8, z: -0.5, scale: 0.65, rotation: [0.25, 0.6, 0.15], color: palette.rockDark },
  { x: -1.4, z: 6.2, scale: 0.5, rotation: [0.2, 0.8, 0.3], color: palette.rockLight },
  { x: 4.2, z: -4.2, scale: 0.8, rotation: [0.12, 0.4, 0.1], color: palette.rock },
  { x: -4.8, z: -4.8, scale: 0.6, rotation: [0.2, 1.5, 0.2], color: palette.rockLight },
  { x: 9.4, z: 3.8, scale: 1.1, rotation: [0.1, 0.9, 0.12], color: palette.rockDark },
];

const Rock: React.FC<{ readonly spec: RockSpec }> = ({ spec }) => {
  const baseY = terrainHeight(spec.x, spec.z) + spec.scale * 0.34;

  return (
    <group
      position={[spec.x, baseY, spec.z]}
      rotation={spec.rotation}
      scale={[spec.scale * 1.2, spec.scale * 0.8, spec.scale]}
    >
      <mesh castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={spec.color}
          flatShading
          roughness={1}
          metalness={0}
        />
      </mesh>
      {spec.moss ? (
        <mesh position={[0.05, 0.52, 0]} scale={[0.62, 0.18, 0.52]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={palette.moss} flatShading />
        </mesh>
      ) : null}
    </group>
  );
};

export const Rocks: React.FC = () => {
  return (
    <group>
      {ROCKS.map((spec, index) => (
        <Rock key={`rock-${index}`} spec={spec} />
      ))}
    </group>
  );
};
