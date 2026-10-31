import React, { useMemo } from "react";
import { BufferAttribute, Color, PlaneGeometry } from "three";
import { palette } from "../core/palette";
import { TERRAIN_SIZE, terrainHeight } from "./terrain";

const SEGMENTS = 56;

export const Terrain: React.FC = () => {
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      SEGMENTS,
      SEGMENTS,
    );
    geo.rotateX(-Math.PI / 2);

    const positions = geo.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    const grass = new Color(palette.grass);
    const dry = new Color(palette.grassDry);
    const dirt = new Color(palette.dirt);
    const color = new Color();

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const z = positions.getZ(index);
      const height = terrainHeight(x, z);
      positions.setY(index, height);

      const variation =
        0.5 +
        0.5 *
          Math.sin(x * 0.55 + z * 0.7) *
          Math.cos(z * 0.31 - x * 0.2);

      color.copy(grass).lerp(dry, variation * 0.5);
      if (height < -0.02) {
        color.lerp(dirt, Math.min(0.55, -height * 1.4));
      }

      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    geo.setAttribute("color", new BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        vertexColors
        flatShading
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
};
