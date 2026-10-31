import React from "react";
import { terrainHeight } from "./terrain";

type MountainSpec = {
  readonly x: number;
  readonly z: number;
  readonly radius: number;
  readonly height: number;
  readonly segments: number;
  readonly color: string;
  readonly snow?: boolean;
};

const MOUNTAINS: readonly MountainSpec[] = [
  {
    x: -34,
    z: -40,
    radius: 15,
    height: 23,
    segments: 7,
    color: "#718b7d",
    snow: true,
  },
  {
    x: -18,
    z: -44,
    radius: 13,
    height: 18,
    segments: 6,
    color: "#7d9182",
  },
  {
    x: -2,
    z: -42,
    radius: 17,
    height: 26,
    segments: 7,
    color: "#668178",
    snow: true,
  },
  {
    x: 16,
    z: -45,
    radius: 12,
    height: 17,
    segments: 6,
    color: "#829385",
  },
  {
    x: 33,
    z: -40,
    radius: 16,
    height: 21,
    segments: 7,
    color: "#738b7d",
  },
  {
    x: -28,
    z: -25,
    radius: 10,
    height: 13,
    segments: 6,
    color: "#7a9082",
  },
  {
    x: -11,
    z: -27,
    radius: 9,
    height: 12,
    segments: 5,
    color: "#85988a",
  },
  {
    x: 9,
    z: -29,
    radius: 11,
    height: 15,
    segments: 6,
    color: "#778d7f",
  },
  {
    x: 26,
    z: -25,
    radius: 9,
    height: 11,
    segments: 5,
    color: "#8b9a88",
  },
  {
    x: -21,
    z: -12,
    radius: 6,
    height: 7,
    segments: 5,
    color: "#8f9b7b",
  },
  {
    x: 19,
    z: -13,
    radius: 7,
    height: 8,
    segments: 5,
    color: "#87977f",
  },
];

const Mountain: React.FC<{ readonly spec: MountainSpec }> = ({ spec }) => {
  const ground = terrainHeight(spec.x, spec.z);
  const baseY = ground + spec.height / 2 - 1.2;

  return (
    <group position={[spec.x, baseY, spec.z]}>
      <mesh castShadow={false}>
        <coneGeometry args={[spec.radius, spec.height, spec.segments]} />
        <meshStandardMaterial
          color={spec.color}
          flatShading
          roughness={1}
          metalness={0}
        />
      </mesh>
      {spec.snow ? (
        <mesh position={[0, spec.height * 0.34, 0]} scale={0.76}>
          <coneGeometry
            args={[spec.radius * 0.3, spec.height * 0.3, spec.segments]}
          />
          <meshStandardMaterial
            color="#dce5dc"
            flatShading
            roughness={1}
          />
        </mesh>
      ) : null}
    </group>
  );
};

export const MountainRange: React.FC = () => {
  return (
    <group>
      {MOUNTAINS.map((spec, index) => (
        <Mountain key={`mountain-${index}`} spec={spec} />
      ))}
    </group>
  );
};
