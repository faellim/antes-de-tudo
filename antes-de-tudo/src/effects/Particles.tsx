import React, { useMemo } from "react";
import {
  AdditiveBlending,
  NormalBlending,
  SphereGeometry,
} from "three";
import { hash01, lerp } from "../core/math";

export type ParticleFieldProps = {
  readonly frame: number;
  readonly count: number;
  readonly color: string;
  readonly height: number;
  readonly spread: number;
  readonly speed: number;
  readonly sizeFrom: number;
  readonly sizeTo: number;
  readonly opacity?: number;
  readonly seed?: number;
  readonly drift?: number;
  readonly additive?: boolean;
};

type ParticleSeed = {
  readonly offset: number;
  readonly angle: number;
  readonly radius: number;
  readonly size: number;
  readonly phase: number;
  readonly driftX: number;
  readonly driftZ: number;
};

/** Generic frame-controlled particle field. No clocks, timers or randomness at render time. */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  frame,
  count,
  color,
  height,
  spread,
  speed,
  sizeFrom,
  sizeTo,
  opacity = 0.8,
  seed = 1,
  drift = 0.15,
  additive = false,
}) => {
  const geometry = useMemo(() => new SphereGeometry(1, 5, 4), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, index): ParticleSeed => {
      return {
        offset: hash01(index, seed),
        angle: hash01(index, seed + 1) * Math.PI * 2,
        radius: Math.sqrt(hash01(index, seed + 2)) * spread,
        size: lerp(sizeFrom, sizeTo, hash01(index, seed + 3)),
        phase: hash01(index, seed + 4) * Math.PI * 2,
        driftX: (hash01(index, seed + 5) - 0.5) * drift,
        driftZ: (hash01(index, seed + 6) - 0.5) * drift,
      };
    });
  }, [count, drift, seed, sizeFrom, sizeTo, spread]);

  return (
    <group>
      {particles.map((particle, index) => {
        const progress =
          (((frame * speed + particle.offset) % 1) + 1) % 1;
        const sway =
          Math.sin(frame * 0.05 + particle.phase) * 0.07 * progress;
        const x =
          Math.cos(particle.angle) * particle.radius +
          particle.driftX * progress +
          sway;
        const z =
          Math.sin(particle.angle) * particle.radius +
          particle.driftZ * progress;
        const y = progress * height;
        const scale = particle.size * (0.5 + progress * 1.3);
        const particleOpacity = opacity * (1 - progress);

        return (
          <mesh
            key={`particle-${index}`}
            geometry={geometry}
            position={[x, y, z]}
            scale={scale}
          >
            <meshBasicMaterial
              color={color}
              transparent
              opacity={particleOpacity}
              depthWrite={false}
              blending={additive ? AdditiveBlending : NormalBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
};
