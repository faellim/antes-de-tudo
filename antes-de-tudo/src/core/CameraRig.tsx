import { useThree } from "@react-three/fiber";
import React, { useLayoutEffect } from "react";
import { useCurrentFrame } from "remotion";
import { PerspectiveCamera } from "three";
import { CameraScene, CameraShake, getCameraState } from "./camera";

export const CameraRig: React.FC<{
  readonly scenes: readonly CameraScene[];
  readonly characterPosition: readonly [number, number, number];
  readonly shakes?: readonly CameraShake[];
}> = ({ scenes, characterPosition, shakes = [] }) => {
  const frame = useCurrentFrame();
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);

  useLayoutEffect(() => {
    const state = getCameraState(
      frame,
      scenes,
      characterPosition as [number, number, number],
      shakes,
    );
    camera.position.set(
      state.position[0],
      state.position[1],
      state.position[2],
    );
    camera.lookAt(state.target[0], state.target[1], state.target[2]);
    camera.up.set(0, 1, 0);

    if (camera instanceof PerspectiveCamera) {
      camera.fov = state.fov;
      camera.updateProjectionMatrix();
    }

    invalidate();
  }, [camera, frame, invalidate, scenes, characterPosition, shakes]);

  return null;
};
