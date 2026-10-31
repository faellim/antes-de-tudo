import React, { useMemo } from "react";
import { hash01 } from "../core/math";

type RainProps = {
  readonly frame: number;
  readonly count?: number;
  readonly area?: number;
  readonly height?: number;
  readonly speed?: number;
};

/** Reusable future-weather effect. Unused by episode 1, but frame-driven and deterministic. */
export const Rain: React.FC<RainProps> = ({
  frame,
  count = 55,
  area = 18,
  height = 12,
  speed = 0.028,
}) => {
  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        offset: hash01(index, 21),
        x: (hash01(index, 22) - 0.5) * area,
        z: (hash01(index, 23) - 0.5) * area,
        length: 0.22 + hash01(index, 24) * 0.3,
      })),
    [area, count],
  );

  return (
    <group>
      {drops.map((drop, index) => {
        const progress =
          (((frame * speed + drop.offset) % 1) + 1) % 1;
        const y = (1 - progress) * height;

        return (
          <mesh
            key={`rain-${index}`}
            position={[drop.x + progress * 0.8, y, drop.z]}
          >
            <boxGeometry args={[0.012, drop.length, 0.012]} />
            <meshBasicMaterial
              color="#bcd6e0"
              transparent
              opacity={0.45}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};
