import React from "react";
import { palette } from "../core/palette";
import type { EpisodeDefinition, SceneDefinition } from "./types";

const SCENE_COLORS = [
  "#f2b35c",
  "#8fc7a8",
  "#d98f6a",
  "#7d94c9",
  "#b78ac9",
  "#e0c46a",
];

const formatTime = (frame: number): string =>
  `${(frame / 30).toFixed(1)}s`;

const Section: React.FC<{
  readonly title: string;
  readonly children: React.ReactNode;
}> = ({ title, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <div
      style={{
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: 2.2,
        textTransform: "uppercase",
        color: palette.accent,
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: 12.5, lineHeight: 1.35, color: palette.text }}>
      {children}
    </div>
  </div>
);

const SceneCard: React.FC<{
  readonly scene: SceneDefinition;
  readonly index: number;
  readonly color: string;
}> = ({ scene, index, color }) => {
  const endFrame = scene.startFrame + scene.durationInFrames;
  const actionLines = scene.characterActions.map((action) => {
    const start = (action.from / 30).toFixed(1);
    const end = ((action.from + action.durationInFrames) / 30).toFixed(1);
    return `${action.kind} · ${start}s–${end}s`;
  });
  const environmentLabels = scene.environmentEvents.map(
    (event) => event.keyframe.label,
  );

  const audioSummary = [
    scene.narration
      ? `Narração: ${scene.narration.available ? "arquivo pronto" : "pendente"}`
      : null,
    scene.soundEffects.length > 0
      ? `${scene.soundEffects.length} SFX`
      : null,
    scene.backgroundMusic.length > 0
      ? `${scene.backgroundMusic.length} trilha(s)`
      : null,
  ]
    .filter((item): item is string => item !== null)
    .join(" · ");

  return (
    <div
      style={{
        width: 466,
        height: 744,
        borderRadius: 18,
        background: "rgba(20, 29, 26, 0.96)",
        border: `1px solid ${color}55`,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              background: color,
              color: palette.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 13,
            }}
          >
            {index + 1}
          </div>
          <div style={{ fontWeight: 800, fontSize: 15, color: palette.text }}>
            {scene.id}
          </div>
        </div>
        <div style={{ fontSize: 11, color: palette.accent, fontWeight: 700 }}>
          {formatTime(scene.startFrame)} → {formatTime(endFrame)}
        </div>
      </div>

      <div
        style={{
          fontSize: 11,
          color: "rgba(255, 247, 227, 0.72)",
          fontStyle: "italic",
        }}
      >
        {scene.act} · {scene.durationInFrames} frames · {(scene.durationInFrames / 30).toFixed(1)}s
      </div>

      <div
        style={{
          fontSize: 12.5,
          color: palette.text,
          lineHeight: 1.35,
          fontWeight: 600,
        }}
      >
        {scene.summary}
      </div>

      {scene.narration ? (
        <Section title="Narração">
          {scene.narration.text}
        </Section>
      ) : null}

      {scene.subtitle ? (
        <Section title="Legenda">
          {scene.subtitle.text}
        </Section>
      ) : null}

      <Section title="Ações do personagem">
        {actionLines.length > 0
          ? actionLines.join(" · ")
          : "Nenhuma ação declarada"}
      </Section>

      <Section title="Câmera">
        {scene.cameraShot.kind} ({scene.cameraShot.anchor}) · {scene.cameraMovement.kind}
        <br />
        {scene.cameraShot.description}
      </Section>

      <Section title="Ambiente">
        {scene.environment.label}
        {environmentLabels.length > 0 ? ` · ${environmentLabels.join(", ")}` : ""}
      </Section>

      <Section title="Áudio">
        {audioSummary.length > 0 ? audioSummary : "Nenhum áudio declarado"}
      </Section>

      <Section title="Transições / eventos">
        {scene.transitions.map((item) => item.kind).join(", ") || "nenhuma"}
        {scene.visualEvents.length > 0
          ? ` · ${scene.visualEvents.map((item) => item.kind).join(", ")}`
          : ""}
      </Section>
    </div>
  );
};

export const Storyboard: React.FC<{
  readonly episode: EpisodeDefinition;
}> = ({ episode }) => {
  return (
    <div
      style={{
        width: 1080,
        height: 3000,
        background: "#0b1310",
        color: palette.text,
        fontFamily: "Arial, Helvetica, sans-serif",
        padding: 64,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 3.2,
            textTransform: "uppercase",
            color: palette.accent,
          }}
        >
          Antes de Tudo · Story Engine V2.2
        </div>
        <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1 }}>
          Storyboard · {episode.title}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,247,227,0.72)" }}>
          {episode.logline}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,247,227,0.62)" }}>
          {episode.durationInFrames} frames · {(episode.durationInFrames / 30).toFixed(1)}s ·{" "}
          {episode.fps} fps · {episode.width}×{episode.height} · {episode.scenes.length} cenas
        </div>
      </div>

      <div style={{ display: "flex", height: 34, borderRadius: 8, overflow: "hidden" }}>
        {episode.scenes.map((scene, index) => {
          const color = SCENE_COLORS[index % SCENE_COLORS.length];
          return (
            <div
              key={scene.id}
              style={{
                flex: scene.durationInFrames,
                background: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: palette.ink,
                fontSize: 11,
                fontWeight: 800,
                borderRight: "1px solid rgba(0,0,0,0.25)",
              }}
            >
              {(scene.durationInFrames / 30).toFixed(1)}s
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "space-between",
        }}
      >
        {episode.scenes.map((scene, index) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            index={index}
            color={SCENE_COLORS[index % SCENE_COLORS.length]}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: "auto",
          fontSize: 11,
          lineHeight: 1.45,
          color: "rgba(255,247,227,0.62)",
          borderTop: "1px solid rgba(255,247,227,0.12)",
          paddingTop: 16,
        }}
      >
        <strong style={{ color: palette.accent }}>Áudio:</strong> nenhuma faixa real incluída.
        Os cues declaram caminhos esperados e ficam com available=false até que os
        arquivos sejam adicionados. Veja public/audio/README.md.
        <br />
        <strong style={{ color: palette.accent }}>Precisão histórica:</strong>{" "}
        {episode.historicalNote}
      </div>
    </div>
  );
};
