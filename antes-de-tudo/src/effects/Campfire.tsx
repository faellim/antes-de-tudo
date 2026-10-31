import React from "react";
import { palette } from "../core/palette";
import { terrainHeight } from "../environments/terrain";
import { ParticleField } from "./Particles";

const LOG_ANGLES = [0, 1.55, 2.45, 3.35];
const STONES = Array.from({ length: 9 }, (_, index) => {
  const angle = (index / 9) * Math.PI * 2 + 0.2;
  return {
    x: Math.cos(angle) * 0.72,
    z: Math.sin(angle) * 0.72,
    scale: 0.13 + (index % 3) * 0.025,
    rotation: angle * 1.7,
  };
});

type CampfireProps = {
  readonly frame: number;
  readonly x: number;
  readonly z: number;
  readonly scale?: number;
  readonly intensity?: number;
};

export const Campfire: React.FC<CampfireProps> = ({
  frame,
  x,
  z,
  scale = 1,
  intensity = 1,
}) => {
  const flicker =
    1 +
    Math.sin(frame * 0.7) * 0.12 +
    Math.sin(frame * 0.23 + 1.2) * 0.06;
  const lean = Math.sin(frame * 0.37) * 0.08;
  const lightPulse = 2.6 + Math.sin(frame * 0.8) * 0.35;
  const strength = Math.min(1.2, Math.max(0, intensity));
  const flameScale = 0.62 + strength * 0.5;
  const flameOpacity = Math.min(1, strength * 1.15);

  return (
    <group position={[x, terrainHeight(x, z), z]} scale={scale}>
      {LOG_ANGLES.map((angle, index) => (
        <group key={`log-${index}`} rotation={[0, angle, 0]}>
          <mesh
            position={[0.24, 0.12, 0]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.075, 0.09, 0.85, 5]} />
            <meshStandardMaterial color={palette.trunkDark} flatShading />
          </mesh>
        </group>
      ))}

      {STONES.map((stone, index) => (
        <mesh
          key={`stone-${index}`}
          position={[stone.x, 0.09, stone.z]}
          scale={[stone.scale, stone.scale * 0.7, stone.scale]}
          rotation={[0.2, stone.rotation, 0.1]}
          castShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={palette.rock} flatShading />
        </mesh>
      ))}

      <mesh position={[0, 0.04, 0]} scale={[0.42, 0.03, 0.42]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#2b2119" flatShading />
      </mesh>

      <group
        rotation={[0, frame * 0.03, 0]}
        scale={[flameScale, flameScale, flameScale]}
        visible={strength > 0.04}
      >
        <mesh
          position={[lean * 0.4, 0.68, 0]}
          scale={[flicker, 1, flicker]}
        >
          <coneGeometry args={[0.31, 0.95, 6]} />
          <meshBasicMaterial
            color={palette.fire}
            transparent
            opacity={0.92 * flameOpacity}
            toneMapped={false}
          />
        </mesh>
        <mesh
          position={[-lean * 0.3, 0.57, 0.03]}
          scale={[flicker * 0.62, 1.08, flicker * 0.62]}
        >
          <coneGeometry args={[0.19, 0.68, 6]} />
          <meshBasicMaterial
            color={palette.fireCore}
            transparent
            opacity={0.95 * flameOpacity}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.38, 0]} scale={[flicker * 0.9, 1, flicker * 0.9]}>
          <coneGeometry args={[0.25, 0.5, 6]} />
          <meshBasicMaterial
            color="#ff5f21"
            transparent
            opacity={0.75 * flameOpacity}
            toneMapped={false}
          />
        </mesh>
      </group>

      <pointLight
        position={[0, 0.85, 0]}
        color={palette.fire}
        intensity={lightPulse * strength}
        distance={8}
        decay={2}
      />

      <group position={[0, 0.18, 0]}>
        <ParticleField
          frame={frame}
          count={14}
          color={palette.ember}
          height={1.9}
          spread={0.22}
          speed={0.014}
          sizeFrom={0.022}
          sizeTo={0.055}
          opacity={0.95 * Math.min(1, strength)}
          seed={4}
          drift={0.28}
          additive
        />
        <ParticleField
          frame={frame}
          count={8}
          color={palette.smoke}
          height={3.1}
          spread={0.32}
          speed={0.005}
          sizeFrom={0.08}
          sizeTo={0.17}
          opacity={0.24 * Math.min(1, strength + 0.1)}
          seed={11}
          drift={0.45}
        />
      </group>
    </group>
  );
};
