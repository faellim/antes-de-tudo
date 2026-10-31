import React from "react";
import { Sky } from "../core/Sky";
import { Campfire } from "../effects/Campfire";
import type { EnvironmentState } from "./environmentState";
import { Cave } from "./Cave";
import { MountainRange } from "./Mountains";
import { Rocks } from "./Rocks";
import { Terrain } from "./Terrain";
import { Vegetation } from "./Vegetation";

type CampfirePlacement = {
  readonly x: number;
  readonly z: number;
  readonly scale?: number;
};

export const PrehistoricEnvironment: React.FC<{
  readonly frame: number;
  readonly state: EnvironmentState;
  readonly campfire?: CampfirePlacement;
}> = ({
  frame,
  state,
  campfire = { x: 1.1, z: -0.4, scale: 1 },
}) => {
  return (
    <group>
      <Sky state={state} frame={frame} />
      <Terrain />
      <MountainRange />
      <Cave x={-5.6} z={-6.4} scale={1.35} />
      <Rocks />
      <Vegetation />
      <Campfire
        frame={frame}
        x={campfire.x}
        z={campfire.z}
        scale={campfire.scale ?? 1}
        intensity={state.fireIntensity}
      />
    </group>
  );
};
