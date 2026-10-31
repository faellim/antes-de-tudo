import React from "react";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const Tree: React.FC<{ x: number; z: number; scale?: number }> = ({
  x,
  z,
  scale = 1,
}) => (
  <group position={[x, -0.8, z]} scale={scale}>
    <mesh position={[0, 0.8, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.2, 1.6, 6]} />
      <meshStandardMaterial color="#765037" flatShading />
    </mesh>
    <mesh position={[0, 1.9, 0]} castShadow>
      <coneGeometry args={[0.8, 1.8, 7]} />
      <meshStandardMaterial color="#39734a" flatShading />
    </mesh>
    <mesh position={[0, 2.5, 0]} castShadow>
      <coneGeometry args={[0.58, 1.4, 7]} />
      <meshStandardMaterial color="#568b4c" flatShading />
    </mesh>
  </group>
);

const Rock: React.FC<{ x: number; z: number; scale: number }> = ({
  x,
  z,
  scale,
}) => (
  <mesh
    position={[x, -0.65 + scale * 0.3, z]}
    scale={[scale * 1.2, scale * 0.8, scale]}
    rotation={[0.1, 0.4, 0.15]}
    castShadow
  >
    <dodecahedronGeometry args={[0.7, 0]} />
    <meshStandardMaterial color="#77776d" flatShading />
  </mesh>
);

const Caveman: React.FC<{ frame: number }> = ({ frame }) => {
  const breathing = Math.sin(frame / 9) * 0.025;
  const armSwing = Math.sin(frame / 12) * 0.18;

  return (
    <group position={[0, -0.75, 0]} rotation={[0, 0, 0]}>
      {/* Corpo */}
      <mesh position={[0, 1.15, 0]} scale={[0.48, 0.7, 0.32]} castShadow>
        <sphereGeometry args={[1, 8, 7]} />
        <meshStandardMaterial color="#b97848" flatShading />
      </mesh>

      {/* Roupa de pele */}
      <mesh position={[0, 1.12, 0.02]} scale={[0.49, 0.43, 0.34]}>
        <coneGeometry args={[0.8, 1.1, 5]} />
        <meshStandardMaterial color="#66503b" flatShading />
      </mesh>

      {/* Cabeça */}
      <group position={[0, 2.05 + breathing, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.43, 9, 8]} />
          <meshStandardMaterial color="#c98758" flatShading />
        </mesh>

        {/* Cabelo */}
        <mesh position={[0, 0.23, -0.03]}>
          <sphereGeometry args={[0.43, 8, 6]} />
          <meshStandardMaterial color="#38251c" flatShading />
        </mesh>

        {/* Olhos */}
        <mesh position={[-0.15, 0.02, 0.37]}>
          <sphereGeometry args={[0.045, 6, 6]} />
          <meshBasicMaterial color="#241811" />
        </mesh>
        <mesh position={[0.15, 0.02, 0.37]}>
          <sphereGeometry args={[0.045, 6, 6]} />
          <meshBasicMaterial color="#241811" />
        </mesh>
      </group>

      {/* Braços */}
      <mesh
        position={[-0.52, 1.25, 0]}
        rotation={[0, 0, armSwing - 0.25]}
        castShadow
      >
        <capsuleGeometry args={[0.13, 0.65, 4, 6]} />
        <meshStandardMaterial color="#b97848" flatShading />
      </mesh>
      <mesh
        position={[0.52, 1.25, 0]}
        rotation={[0, 0, -armSwing + 0.25]}
        castShadow
      >
        <capsuleGeometry args={[0.13, 0.65, 4, 6]} />
        <meshStandardMaterial color="#b97848" flatShading />
      </mesh>

      {/* Pernas */}
      <mesh position={[-0.22, 0.28, 0]}>
        <capsuleGeometry args={[0.16, 0.48, 4, 6]} />
        <meshStandardMaterial color="#9e6543" flatShading />
      </mesh>
      <mesh position={[0.22, 0.28, 0]}>
        <capsuleGeometry args={[0.16, 0.48, 4, 6]} />
        <meshStandardMaterial color="#9e6543" flatShading />
      </mesh>
    </group>
  );
};

const Campfire: React.FC<{ frame: number }> = ({ frame }) => {
  const flicker = 1 + Math.sin(frame * 0.45) * 0.12;

  return (
    <group position={[1.8, -0.7, 0.5]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.08, 0]} rotation={[0, i * 1.05, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.9, 5]} />
          <meshStandardMaterial color="#65412a" flatShading />
        </mesh>
      ))}

      <mesh position={[0, 0.43, 0]} scale={[flicker, 1, flicker]}>
        <coneGeometry args={[0.3, 0.85 * flicker, 6]} />
        <meshBasicMaterial color="#ff922e" />
      </mesh>

      <mesh position={[0, 0.35, 0.01]}>
        <coneGeometry args={[0.17, 0.55 * flicker, 6]} />
        <meshBasicMaterial color="#ffe28a" />
      </mesh>

      <pointLight position={[0, 0.5, 0]} color="#ff8a32" intensity={3} distance={5} />
    </group>
  );
};

const World: React.FC<{ frame: number }> = ({ frame }) => {
  const cameraZ = interpolate(frame, [0, 180, 420, 900], [14, 12, 10, 9], clamp);
  const cameraX = interpolate(frame, [0, 900], [1.5, 0.4], clamp);

  return (
    <ThreeCanvas
      width={720}
      height={1280}
      camera={{
        fov: 42,
        position: [cameraX, 4.1, cameraZ],
      }}
      style={{ backgroundColor: "#a8d1df" }}
      shadows
    >
      <ambientLight intensity={1.3} />
      <directionalLight
        position={[-5, 10, 6]}
        intensity={2.2}
        castShadow
      />

      {/* Solo */}
      <mesh
        position={[0, -0.85, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#9aab68" flatShading />
      </mesh>

      {/* Montanhas */}
      {[-7, -3, 2, 7].map((x, i) => (
        <mesh
          key={i}
          position={[x, 1.7 + (i % 2), -9]}
          scale={[3, 3 + (i % 2), 2]}
        >
          <coneGeometry args={[1, 2.5, 5]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#718b7d" : "#8c9b88"}
            flatShading
          />
        </mesh>
      ))}

      {/* Caverna */}
      <group position={[-3.2, -0.7, -2]}>
        <mesh position={[0, 1.3, 0]} scale={[2.2, 2.1, 1.3]}>
          <dodecahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#74685b" flatShading />
        </mesh>
        <mesh position={[0, 0.15, 1.12]} scale={[0.75, 1, 0.12]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#292722" />
        </mesh>
      </group>

      {/* Árvores */}
      <Tree x={-5} z={-1} scale={1.3} />
      <Tree x={-5.7} z={-4} scale={0.9} />
      <Tree x={4.5} z={-3} scale={1.1} />
      <Tree x={5.5} z={0} scale={1.3} />
      <Tree x={-7} z={1} scale={0.8} />

      {/* Rochas */}
      <Rock x={-1.8} z={1} scale={0.8} />
      <Rock x={3.2} z={-1} scale={1.1} />
      <Rock x={-4.2} z={1} scale={0.65} />

      <Caveman frame={frame} />
      <Campfire frame={frame} />
    </ThreeCanvas>
  );
};

export const PrehistoricScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20, 95, 125], [0, 1, 1, 0], clamp);
  const subtitleOpacity = interpolate(frame, [115, 145, 230, 260], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#a8d1df" }}>
      <World frame={frame} />

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: height * 0.09,
          paddingLeft: width * 0.07,
          paddingRight: width * 0.07,
          background:
            "linear-gradient(180deg, rgba(20,35,39,0.35), transparent 32%, transparent 75%, rgba(20,35,39,0.22))",
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            color: "white",
            fontSize: 48,
            fontWeight: 900,
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            textShadow: "0 4px 12px rgba(0,0,0,0.65)",
            lineHeight: 1.1,
          }}
        >
          VOCÊ ACORDOU
          <br />
          HÁ 100 MIL ANOS
        </div>

        <div
          style={{
            opacity: subtitleOpacity,
            marginTop: 22,
            padding: "12px 20px",
            borderRadius: 12,
            color: "white",
            backgroundColor: "rgba(35,48,37,0.82)",
            fontSize: 24,
            fontWeight: 700,
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Você sobreviveria?
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
