import React from "react";
import type { EnvironmentState } from "../environments/environmentState";

/**
 * Frame-driven lighting. The sun keeps readable low-poly facets during the day;
 * moonlight and the campfire take over at night.
 */
export const SceneLighting: React.FC<{
  readonly state: EnvironmentState;
}> = ({ state }) => {
  return (
    <group>
      <ambientLight color="#d8e8ff" intensity={state.ambientIntensity} />
      <hemisphereLight
        args={[state.skyHorizon, "#4d4b38", state.hemisphereIntensity]}
      />
      <directionalLight
        color={state.sunColor}
        intensity={state.sunIntensity}
        position={[-12, 18, 10]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-near={1}
        shadow-camera-far={55}
        shadow-bias={-0.0005}
        target-position={[0, 0, 0]}
      />
      <directionalLight
        color="#9fb7ff"
        intensity={state.moonOpacity * 0.55}
        position={[10, 16, -8]}
      />
    </group>
  );
};
