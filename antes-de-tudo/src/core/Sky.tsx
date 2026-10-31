import React, { useMemo } from "react";
import {
  BackSide,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
} from "three";
import { hash01 } from "./math";
import { palette } from "./palette";
import type { EnvironmentState } from "../environments/environmentState";

const vertexShader = `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform vec3 topColor;
  uniform vec3 horizonColor;
  uniform vec3 lowColor;
  varying vec3 vWorldPosition;

  void main() {
    float height = normalize(vWorldPosition).y;
    float upper = smoothstep(0.0, 0.65, height);
    float lower = smoothstep(-0.25, 0.02, height);
    vec3 color = mix(lowColor, horizonColor, lower);
    color = mix(color, topColor, upper);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const STAR_COUNT = 120;

const Cloud: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly scale: number;
  readonly opacity: number;
}> = ({ x, y, z, scale, opacity }) => {
  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh scale={[1.8, 0.52, 0.7]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial
          color={palette.cloud}
          transparent
          opacity={0.5 * opacity}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[1.1, 0.08, 0]} scale={[1.15, 0.42, 0.6]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial
          color={palette.cloud}
          transparent
          opacity={0.42 * opacity}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-1, -0.04, 0]} scale={[1.0, 0.35, 0.55]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial
          color={palette.cloud}
          transparent
          opacity={0.38 * opacity}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

const starGeometry = new BufferGeometry();
const starPositions = new Float32Array(STAR_COUNT * 3);
for (let index = 0; index < STAR_COUNT; index += 1) {
  const angle = hash01(index, 21) * Math.PI * 2;
  const radius = 70 + hash01(index, 22) * 14;
  const height = 6 + hash01(index, 23) * 48;
  starPositions[index * 3] = Math.cos(angle) * radius;
  starPositions[index * 3 + 1] = height;
  starPositions[index * 3 + 2] = Math.sin(angle) * radius;
}
starGeometry.setAttribute(
  "position",
  new Float32BufferAttribute(starPositions, 3),
);

export const Sky: React.FC<{
  readonly state: EnvironmentState;
  readonly frame: number;
}> = ({ state, frame }) => {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new Color(state.skyTop) },
      horizonColor: { value: new Color(state.skyHorizon) },
      lowColor: { value: new Color(state.skyLow) },
    }),
    // The uniforms object is created once; values are updated below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  uniforms.topColor.value.set(state.skyTop);
  uniforms.horizonColor.value.set(state.skyHorizon);
  uniforms.lowColor.value.set(state.skyLow);

  const twinkle = 0.88 + Math.sin(frame / 9) * 0.08 + Math.sin(frame / 23) * 0.04;
  const sunY = -4 + state.sunElevation * 34;

  return (
    <group>
      <mesh renderOrder={-2}>
        <sphereGeometry args={[92, 24, 16]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={BackSide}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>

      {state.starsOpacity > 0.01 ? (
        <points geometry={starGeometry} renderOrder={-1}>
          <pointsMaterial
            color="#e8eeff"
            size={1.9}
            sizeAttenuation={false}
            transparent
            opacity={state.starsOpacity * twinkle}
            depthWrite={false}
            fog={false}
            toneMapped={false}
          />
        </points>
      ) : null}

      {state.sunOpacity > 0.01 ? (
        <group position={[-26, sunY, -62]}>
          <mesh>
            <sphereGeometry args={[2.5, 16, 12]} />
            <meshBasicMaterial
              color={state.sunColor}
              transparent
              opacity={state.sunOpacity}
              fog={false}
              toneMapped={false}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[4.2, 16, 12]} />
            <meshBasicMaterial
              color={state.sunColor}
              transparent
              opacity={0.18 * state.sunOpacity}
              depthWrite={false}
              fog={false}
              toneMapped={false}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[7, 16, 12]} />
            <meshBasicMaterial
              color={state.sunColor}
              transparent
              opacity={0.06 * state.sunOpacity}
              depthWrite={false}
              fog={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ) : null}

      {state.moonOpacity > 0.01 ? (
        <group position={[26, 22, -58]}>
          <mesh>
            <sphereGeometry args={[2.1, 16, 12]} />
            <meshBasicMaterial
              color="#dfe8ff"
              transparent
              opacity={state.moonOpacity}
              fog={false}
              toneMapped={false}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[3.6, 16, 12]} />
            <meshBasicMaterial
              color="#b9c9f5"
              transparent
              opacity={0.12 * state.moonOpacity}
              depthWrite={false}
              fog={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ) : null}

      <Cloud
        x={-34}
        y={17}
        z={-54}
        scale={3.2}
        opacity={state.cloudOpacity}
      />
      <Cloud
        x={25}
        y={21}
        z={-58}
        scale={2.4}
        opacity={state.cloudOpacity}
      />
      <Cloud
        x={4}
        y={13}
        z={-64}
        scale={2.0}
        opacity={state.cloudOpacity}
      />
    </group>
  );
};
