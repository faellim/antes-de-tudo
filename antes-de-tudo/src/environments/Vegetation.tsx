import React, { useLayoutEffect, useRef } from "react";
import {
  Color,
  InstancedMesh,
  Object3D,
} from "three";
import { hash01 } from "../core/math";
import { palette } from "../core/palette";
import { terrainHeight } from "./terrain";

type TreeSpec = {
  readonly x: number;
  readonly z: number;
  readonly scale: number;
  readonly rotation: number;
  readonly variant: 0 | 1 | 2 | 3;
};

const TREES: readonly TreeSpec[] = [
  { x: -10, z: -3, scale: 1.2, rotation: 0.4, variant: 0 },
  { x: -12.5, z: 2.5, scale: 0.9, rotation: 1.2, variant: 1 },
  { x: -9, z: -8.5, scale: 1.1, rotation: 2.4, variant: 2 },
  { x: 8.5, z: -5, scale: 1.0, rotation: 3.1, variant: 0 },
  { x: 10.5, z: 1, scale: 1.3, rotation: 4.2, variant: 1 },
  { x: 7, z: 5.5, scale: 0.85, rotation: 5.2, variant: 2 },
  { x: -11, z: 7, scale: 1.0, rotation: 5.8, variant: 0 },
  { x: 12, z: -9, scale: 1.4, rotation: 0.6, variant: 1 },
  { x: -14, z: -12, scale: 1.2, rotation: 1.7, variant: 2 },
  { x: 4.5, z: -11, scale: 0.95, rotation: 2.8, variant: 3 },
  { x: -15, z: 3, scale: 1.35, rotation: 3.6, variant: 3 },
];

const BUSHES = [
  { x: -6.5, z: 2.3, scale: 0.9 },
  { x: -3.1, z: -2.2, scale: 0.75 },
  { x: 4.4, z: 2.7, scale: 0.8 },
  { x: 6.2, z: -1.8, scale: 0.7 },
  { x: -8.4, z: 4.4, scale: 0.95 },
  { x: 5.9, z: 4.6, scale: 0.65 },
  { x: -4.2, z: 5.1, scale: 0.75 },
  { x: 8.2, z: 3.2, scale: 0.85 },
  { x: -7.2, z: -4.6, scale: 0.8 },
  { x: 2.2, z: -3.8, scale: 0.6 },
  { x: -12, z: -6, scale: 0.9 },
  { x: 10, z: -2.5, scale: 0.75 },
];

const Tree: React.FC<{ readonly spec: TreeSpec }> = ({ spec }) => {
  const y = terrainHeight(spec.x, spec.z);
  const foliage = palette.foliage[spec.variant % palette.foliage.length];

  if (spec.variant === 2) {
    return (
      <group
        position={[spec.x, y, spec.z]}
        rotation={[0, spec.rotation, 0]}
        scale={spec.scale}
      >
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.18, 1.6, 5]} />
          <meshStandardMaterial color={palette.trunk} flatShading />
        </mesh>
        <mesh position={[0, 1.9, 0]} scale={[0.95, 0.75, 0.9]} castShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={foliage} flatShading />
        </mesh>
        <mesh
          position={[0.55, 1.55, 0.15]}
          scale={[0.62, 0.5, 0.58]}
          castShadow
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={palette.foliage[2]} flatShading />
        </mesh>
        <mesh
          position={[-0.5, 1.6, -0.1]}
          scale={[0.58, 0.48, 0.55]}
          castShadow
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={palette.foliage[1]} flatShading />
        </mesh>
      </group>
    );
  }

  if (spec.variant === 3) {
    return (
      <group
        position={[spec.x, y, spec.z]}
        rotation={[0, spec.rotation, 0]}
        scale={spec.scale}
      >
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.2, 2, 5]} />
          <meshStandardMaterial color={palette.trunkDark} flatShading />
        </mesh>
        <mesh position={[0.35, 1.35, 0]} rotation={[0, 0, -0.9]} castShadow>
          <cylinderGeometry args={[0.035, 0.07, 0.9, 4]} />
          <meshStandardMaterial color={palette.trunkDark} flatShading />
        </mesh>
        <mesh
          position={[-0.3, 1.7, 0.05]}
          rotation={[0.1, 0, 0.85]}
          castShadow
        >
          <cylinderGeometry args={[0.03, 0.06, 0.8, 4]} />
          <meshStandardMaterial color={palette.trunkDark} flatShading />
        </mesh>
      </group>
    );
  }

  return (
    <group
      position={[spec.x, y, spec.z]}
      rotation={[0, spec.rotation, 0]}
      scale={spec.scale}
    >
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.16, 1.4, 5]} />
        <meshStandardMaterial color={palette.trunk} flatShading />
      </mesh>
      <mesh position={[0, 1.55, 0]} rotation={[0, 0.25, 0]} castShadow>
        <coneGeometry args={[0.9, 1.7, 6]} />
        <meshStandardMaterial color={foliage} flatShading />
      </mesh>
      <mesh position={[0, 2.15, 0]} rotation={[0, 0.7, 0]} castShadow>
        <coneGeometry args={[0.68, 1.45, 6]} />
        <meshStandardMaterial color={palette.foliage[1]} flatShading />
      </mesh>
      <mesh position={[0, 2.7, 0]} rotation={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.44, 1.15, 6]} />
        <meshStandardMaterial color={palette.foliage[3]} flatShading />
      </mesh>
    </group>
  );
};

const Bush: React.FC<{ readonly x: number; readonly z: number; readonly scale: number }> = ({
  x,
  z,
  scale,
}) => {
  const y = terrainHeight(x, z);
  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh position={[0, 0.28, 0]} scale={[0.55, 0.38, 0.5]} castShadow>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.foliage[0]} flatShading />
      </mesh>
      <mesh
        position={[0.34, 0.22, 0.12]}
        scale={[0.36, 0.28, 0.34]}
        castShadow
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.foliage[1]} flatShading />
      </mesh>
      <mesh
        position={[-0.3, 0.2, -0.1]}
        scale={[0.34, 0.26, 0.32]}
        castShadow
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.foliage[2]} flatShading />
      </mesh>
    </group>
  );
};

const GRASS_COUNT = 190;
const GRASS = Array.from({ length: GRASS_COUNT }, (_, index) => {
  const angle = hash01(index, 1) * Math.PI * 2;
  const distance = 2.6 + hash01(index, 2) * 16;
  return {
    x: Math.cos(angle) * distance,
    z: Math.sin(angle) * distance * 0.85,
    scale: 0.7 + hash01(index, 3) * 1.1,
    rotation: hash01(index, 4) * Math.PI * 2,
  };
});

const Grass: React.FC = () => {
  const ref = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) {
      return;
    }

    const dummy = new Object3D();
    const dark = new Color(palette.grassDark);
    const light = new Color(palette.grass);
    const color = new Color();

    GRASS.forEach((blade, index) => {
      dummy.position.set(
        blade.x,
        terrainHeight(blade.x, blade.z) + 0.16 * blade.scale,
        blade.z,
      );
      dummy.rotation.set(0, blade.rotation, 0);
      dummy.scale.setScalar(blade.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(
        index,
        color.copy(dark).lerp(light, hash01(index, 5)),
      );
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, []);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, GRASS_COUNT]}
      frustumCulled={false}
    >
      <coneGeometry args={[0.045, 0.34, 3]} />
      <meshStandardMaterial flatShading roughness={1} />
    </instancedMesh>
  );
};

export const Vegetation: React.FC = () => {
  return (
    <group>
      {TREES.map((spec, index) => (
        <Tree key={`tree-${index}`} spec={spec} />
      ))}
      {BUSHES.map((bush, index) => (
        <Bush key={`bush-${index}`} {...bush} />
      ))}
      <Grass />
    </group>
  );
};
