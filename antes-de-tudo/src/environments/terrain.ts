import { Vec3 } from "../core/math";

export const TERRAIN_SIZE = 90;

/**
 * Deterministic height field shared by the terrain mesh and object placement.
 * The area around the camp is flattened so the character and fire sit naturally.
 */
export const terrainHeight = (x: number, z: number): number => {
  const rolling =
    Math.sin(x * 0.22 + 0.4) * Math.cos(z * 0.18) * 0.32 +
    Math.sin((x - z) * 0.41) * 0.12 +
    Math.cos(x * 0.09 - z * 0.13) * 0.22;

  const centerFlatten = Math.exp(-(x * x + (z + 1) * (z + 1)) / 44);
  const edgeLift =
    Math.max(0, (Math.abs(x) - 10) / 20) +
    Math.max(0, (Math.abs(z) - 12) / 22);

  return rolling * (1 - 0.82 * centerFlatten) + edgeLift * 0.5;
};

export const groundPoint = (x: number, z: number, offset = 0): Vec3 => {
  return [x, terrainHeight(x, z) + offset, z];
};
