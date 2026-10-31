# AGENTS.md

## Layout

- The git root is this directory, but the actual app lives in `antes-de-tudo/`. Run npm commands from there (`cd antes-de-tudo`).
- Single Remotion project (no workspaces/monorepo). Entry chain: `src/index.ts` -> `src/Root.tsx`.
- Three registered compositions:
  - `Episodio01` -> `src/episodes/episode-001/Episode001.tsx` (V2.2 story engine, 720x1280, 30fps, 1350 frames / 45s).
  - `Episodio01Storyboard` -> `src/episodes/episode-001/Storyboard.tsx` (1080x3000 still).
  - `Episodio01Legacy` -> `src/PrehistoricScene.tsx` (original scene, preserved as-is, 900 frames / 30s).
- V2 source layout:
  - `src/core/` — config, palette, deterministic math, camera interpolation/shakes, `CameraRig`, lighting, procedural sky.
  - `src/characters/` — `PrehistoricCharacter.tsx` (low-poly body parts) and `rig.ts` (frame-driven actions, poses, blending).
  - `src/environments/` — height-field `terrain.ts`/`Terrain.tsx`, `Mountains.tsx`, `Cave.tsx`, `Vegetation.tsx`, `Rocks.tsx`, `PrehistoricEnvironment.tsx` assembly, `environmentState.ts`.
  - `src/effects/` — `Campfire.tsx`, reusable `Particles.tsx` and `Rain.tsx`.
  - `src/storytelling/` — `types.ts`, `subtitles.ts`, `Subtitles.tsx`, `TitleOverlay.tsx`, `StoryAudio.tsx`, `TransitionOverlay.tsx`, `VisualEffects.tsx`, `Storyboard.tsx`.
  - `src/episodes/episode-001/` — `episode.ts`, `character.ts`, `environment.ts`, `Episode001.tsx`, `Storyboard.tsx`.
  - `src/components/` — shared overlay pieces such as `Vignette.tsx`.
- `src/Scene.tsx`, `src/Phone.tsx`, `src/RoundedBox.tsx`, and `src/helpers/*` are unused leftovers from the upstream Remotion template. They are not registered in `Root.tsx`, so changes there do not affect the render.
- `public/phone.mp4` and `public/tablet.mp4` are also template assets, unused by either episode.

## Commands

Run from `antes-de-tudo/`:

- `npm install` — requires Node `^20.19.0 || ^22.13.0 || >=24`.
- `npm run dev` — Remotion Studio preview.
- `npm run lint` — the only verification step: `eslint src && tsc`. There is no test suite or test script.
- `npx tsc` — typecheck only (also runs as the second half of `npm run lint`).
- `npx remotion compositions` — list registered compositions (also validates the bundle).
- `npx remotion still Episodio01 out/preview.png --frame=100 --gl=swangle` — render a single still.
- `npx remotion still Episodio01Storyboard out/storyboard.png --gl=swangle` — render the storyboard still.
- `npx remotion render Episodio01 out/episodio01-v2.mp4 --codec=h264 --concurrency=1 --gl=swangle` — render the V2.2 episode (45s).
- `npx remotion render Episodio01Legacy out/episodio01-legacy.mp4 --gl=swangle` — render the preserved original scene (30s).
- `npm run build` runs `remotion bundle` only; it does **not** produce an MP4.
- `out/` is gitignored; never commit renders.
- Prettier is configured (`.prettierrc`) but has no npm script; use `npx prettier --write src`.

## Rendering and code notes

- Animation is frame-driven: pass `useCurrentFrame()` values down (`frame` prop) so renders stay deterministic. Do not use wall-clock time, `requestAnimationFrame`, `setInterval`, or state-driven animation.
- `Episode001` reads scene timing from `episode.ts`. Scene boundaries are 0–270 (establishing), 270–600 (wilderness), 600–900 (closing), and `CameraRig` interpolates between the matching camera moves. Changing `durationInFrames` in `Root.tsx` requires updating the scene ranges and camera keyframes.
- Character joints (torso, head, arms, legs) are independent and posed by `getCharacterPose(frame, animation)` in `src/characters/rig.ts`.
- The terrain height field in `src/environments/terrain.ts` is shared by the terrain mesh and all object placement; keep it deterministic.
- `PrehistoricScene.tsx` (legacy) still hardcodes `width={720} height={1280}` on the `ThreeCanvas` inside `World` and camera keyframes assume 900 frames. Do not couple the new episode to it.
- `remotion.config.ts` enables Rspack, ANGLE, and JPEG frames. It applies only to Remotion CLI usage, not the Node.js APIs.
- Codespaces rendering works with `--gl=swangle`; keep `--concurrency=1` for stable SwiftShader renders.
- On-screen copy is Brazilian Portuguese; keep new UI text consistent with it.
