import React from "react";
import { BackSide } from "three";
import { palette } from "../core/palette";
import { terrainHeight } from "./terrain";

type CaveProps = {
  readonly x: number;
  readonly z: number;
  readonly scale?: number;
};

export const Cave: React.FC<CaveProps> = ({ x, z, scale = 1.35 }) => {
  return (
    <group
      position={[x, terrainHeight(x, z), z]}
      scale={scale}
      rotation={[0, 0.12, 0]}
    >
      {/* Dark interior: a recessed black shell plus a short tunnel. */}
      <mesh
        position={[0, 1.5, -1.15]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[1.3, 1.5, 3.8, 10, 1, true]} />
        <meshBasicMaterial
          color={palette.caveDark}
          side={BackSide}
          fog={false}
        />
      </mesh>
      <mesh position={[0, 1.6, 0.72]} scale={[1.45, 1.7, 0.34]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial color={palette.caveDark} fog={false} />
      </mesh>

      {/* Rock mass that frames the opening. */}
      <mesh
        position={[-2.12, 1.55, -0.32]}
        scale={[1.48, 2.15, 1.5]}
        rotation={[0.08, 0.2, -0.05]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={palette.rockDark}
          flatShading
          roughness={1}
        />
      </mesh>
      <mesh
        position={[2.12, 1.55, -0.32]}
        scale={[1.48, 2.15, 1.5]}
        rotation={[-0.06, -0.25, 0.04]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={palette.rockDark}
          flatShading
          roughness={1}
        />
      </mesh>
      <mesh
        position={[0, 3.48, -0.35]}
        scale={[2.25, 1.05, 1.5]}
        rotation={[0.04, 0.1, 0]}
        castShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={palette.rock}
          flatShading
          roughness={1}
        />
      </mesh>
      <mesh
        position={[0.15, 3.95, -0.8]}
        scale={[1.55, 0.72, 1.2]}
        rotation={[0, -0.2, 0.08]}
        castShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={palette.rockDark}
          flatShading
          roughness={1}
        />
      </mesh>

      {/* Irregular rim boulders around the mouth. */}
      <mesh position={[0, 3.1, 0.82]} scale={[1.1, 0.46, 0.52]} castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.rockLight} flatShading />
      </mesh>
      <mesh
        position={[-1.6, 1.7, 0.82]}
        scale={[0.52, 0.95, 0.46]}
        rotation={[0, 0.3, -0.18]}
        castShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.rock} flatShading />
      </mesh>
      <mesh
        position={[1.6, 1.7, 0.82]}
        scale={[0.52, 0.95, 0.46]}
        rotation={[0, -0.2, 0.15]}
        castShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.rock} flatShading />
      </mesh>
      <mesh
        position={[-1.15, 0.35, 0.82]}
        scale={[0.82, 0.5, 0.48]}
        rotation={[0, 0.2, 0.1]}
        castShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.rockDark} flatShading />
      </mesh>
      <mesh
        position={[1.15, 0.35, 0.82]}
        scale={[0.82, 0.5, 0.48]}
        rotation={[0, -0.2, -0.1]}
        castShadow
      >
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.rockDark} flatShading />
      </mesh>

      {/* Moss and loose stones add scale around the entrance. */}
      <mesh position={[-1.7, 3.05, 0.35]} scale={[0.66, 0.14, 0.5]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.moss} flatShading />
      </mesh>
      <mesh position={[2.1, 2.8, 0.42]} scale={[0.42, 0.12, 0.34]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.moss} flatShading />
      </mesh>
      <mesh position={[-2.9, 0.25, 1.25]} scale={[0.34, 0.28, 0.32]} castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.rock} flatShading />
      </mesh>
      <mesh position={[2.65, 0.2, 1.35]} scale={[0.28, 0.24, 0.3]} castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={palette.rockLight} flatShading />
      </mesh>
    </group>
  );
};
