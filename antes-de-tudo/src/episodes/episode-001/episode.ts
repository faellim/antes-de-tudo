import { VIDEO } from "../../core/config";
import { INITIAL_CHARACTER_PLACEMENT, CHARACTER_ACTIONS } from "./character";
import { ENVIRONMENT_EVENTS, CAMPFIRE } from "./environment";
import { makeSubtitle } from "../../storytelling/subtitles";
import type {
  BackgroundMusicCue,
  EpisodeDefinition,
  NarrationCue,
  SceneDefinition,
  SoundEffectCue,
} from "../../storytelling/types";

const INCLUDE = (ids: readonly string[]) =>
  CHARACTER_ACTIONS.filter((action) => ids.indexOf(action.id) !== -1);

const MUSIC: BackgroundMusicCue = {
  id: "score-main",
  label: "Trilha principal",
  from: 0,
  durationInFrames: VIDEO.durationInFrames,
  volume: 0.26,
  fadeInFrames: 60,
  fadeOutFrames: 90,
  duckDuringNarration: true,
  duckTo: 0.38,
  src: "audio/music/theme.mp3",
  available: false,
  note: "Trilha contínua e instrumental, sem voz.",
};

const FIRE_LOOP: SoundEffectCue = {
  id: "sfx-fire-loop",
  label: "Fogo crepitando",
  from: 0,
  durationInFrames: VIDEO.durationInFrames,
  volume: 0.22,
  src: "audio/sfx/fire-loop.mp3",
  available: false,
};

const WIND_DAY: SoundEffectCue = {
  id: "sfx-wind-day",
  label: "Vento diurno",
  from: 120,
  durationInFrames: 180,
  volume: 0.18,
  src: "audio/sfx/wind-day.mp3",
  available: false,
};

const FOOTSTEPS: SoundEffectCue = {
  id: "sfx-footsteps",
  label: "Passos na terra",
  from: 140,
  durationInFrames: 328,
  volume: 0.2,
  src: "audio/sfx/footsteps.mp3",
  available: false,
};

const FIRE_CATCH: SoundEffectCue = {
  id: "sfx-fire-catch",
  label: "Fogo reacendendo",
  from: 684,
  durationInFrames: 24,
  volume: 0.35,
  src: "audio/sfx/fire-catch.mp3",
  available: false,
};

const WIND_NIGHT_1: SoundEffectCue = {
  id: "sfx-wind-night-1",
  label: "Vento noturno",
  from: 700,
  durationInFrames: 170,
  volume: 0.22,
  src: "audio/sfx/wind-night.mp3",
  available: false,
};

const WIND_NIGHT_2: SoundEffectCue = {
  id: "sfx-wind-night-2",
  label: "Vento noturno",
  from: 870,
  durationInFrames: 330,
  volume: 0.18,
  src: "audio/sfx/wind-night.mp3",
  available: false,
};

const DAWN_BIRDS: SoundEffectCue = {
  id: "sfx-dawn-birds",
  label: "Aves ao amanhecer",
  from: 1210,
  durationInFrames: 120,
  volume: 0.25,
  src: "audio/sfx/dawn-birds.mp3",
  available: false,
};

const NARR_1: NarrationCue = {
  id: "narr-01",
  text:
    "Você acorda. O chão é frio. E o céu não tem paredes. Este é um cenário especulativo, baseado em evidências arqueológicas.",
  from: 10,
  durationInFrames: 100,
  src: "audio/narration/narr-01.mp3",
  available: false,
  voice: "narrador-principal",
};

const NARR_2: NarrationCue = {
  id: "narr-02",
  text:
    "Há cerca de cem mil anos, humanos já viviam em pequenos grupos e conheciam o fogo. A solidão aqui é uma escolha narrativa, não uma certeza histórica.",
  from: 132,
  durationInFrames: 156,
  src: "audio/narration/narr-02.mp3",
  available: false,
  voice: "narrador-principal",
};

const NARR_3: NarrationCue = {
  id: "narr-03",
  text:
    "Sem abrigo, água ou fogo, a paisagem deixa de ser bela e passa a ser um problema de sobrevivência. Hipótese, não fato.",
  from: 310,
  durationInFrames: 218,
  src: "audio/narration/narr-03.mp3",
  available: false,
  voice: "narrador-principal",
};

const NARR_4: NarrationCue = {
  id: "narr-04",
  text:
    "O sol se põe. Manter uma chama acesa pode significar atravessar a noite. O fogo exige trabalho contínuo.",
  from: 560,
  durationInFrames: 290,
  src: "audio/narration/narr-04.mp3",
  available: false,
  voice: "narrador-principal",
};

const NARR_5: NarrationCue = {
  id: "narr-05",
  text:
    "Abrigado, você espera. Do lado de fora, o frio não negocia. O abrigo de pedra é uma inferência, não uma reconstrução exata.",
  from: 884,
  durationInFrames: 300,
  src: "audio/narration/narr-05.mp3",
  available: false,
  voice: "narrador-principal",
};

const NARR_6: NarrationCue = {
  id: "narr-06",
  text:
    "O sol volta. A pergunta continua: você saberia sobreviver há cem mil anos?",
  from: 1212,
  durationInFrames: 126,
  src: "audio/narration/narr-06.mp3",
  available: false,
  voice: "narrador-principal",
};

const SUB_1 = makeSubtitle({
  id: "sub-01",
  text: "Você acorda. O chão é frio. O céu não tem paredes.",
  from: 10,
  durationInFrames: 100,
  emphasis: ["acorda", "frio"],
});

const SUB_2 = makeSubtitle({
  id: "sub-02",
  text: "Há cerca de 100 mil anos, humanos já viviam em grupos e conheciam o fogo.",
  from: 132,
  durationInFrames: 156,
  emphasis: ["100", "fogo"],
});

const SUB_3 = makeSubtitle({
  id: "sub-03",
  text: "Sem abrigo, água ou fogo, a paisagem vira perigo.",
  from: 310,
  durationInFrames: 218,
  emphasis: ["abrigo", "fogo"],
});

const SUB_4 = makeSubtitle({
  id: "sub-04",
  text: "O sol se põe. Manter a chama acesa é atravessar a noite.",
  from: 560,
  durationInFrames: 290,
  emphasis: ["sol", "noite"],
});

const SUB_5 = makeSubtitle({
  id: "sub-05",
  text: "Abrigado, você espera. O frio lá fora não negocia.",
  from: 884,
  durationInFrames: 300,
  emphasis: ["Abrigado", "frio"],
});

const SUB_6 = makeSubtitle({
  id: "sub-06",
  text: "O sol volta. A pergunta continua: você sobreviveria?",
  from: 1212,
  durationInFrames: 126,
  emphasis: ["sol", "sobreviveria"],
});

const SCENE_1: SceneDefinition = {
  id: "wake",
  act: "Ato 1 · Gancho",
  startFrame: 0,
  durationInFrames: 120,
  summary:
    "O personagem acorda no chão, desorientado. O céu aberto domina o quadro e o gancho é lançado.",
  narration: NARR_1,
  subtitle: SUB_1,
  characterActions: INCLUDE(["wake-up", "sit-look"]),
  environment: {
    id: "prehistoric-valley",
    label: "Vale aberto ao amanhecer",
    campfire: CAMPFIRE,
  },
  environmentEvents: [ENVIRONMENT_EVENTS[0]],
  cameraShot: {
    kind: "closeUp",
    anchor: "character",
    description:
      "Plano fechado lateral, começando perto do corpo deitado e afastando para revelar a postura.",
  },
  cameraMovement: {
    kind: "dollyOut",
    fromPosition: [2.7, 1.0, 1.6],
    toPosition: [3.5, 1.75, 3.6],
    fromTarget: [0, 0.7, -0.5],
    toTarget: [0, 1.35, 0],
    fromFov: 44,
    toFov: 38,
    easing: "easeInOut",
  },
  soundEffects: [FIRE_LOOP],
  backgroundMusic: [MUSIC],
  transitions: [
    { id: "tr-fadein", kind: "fadeIn", from: 0, durationInFrames: 24 },
  ],
  visualEvents: [],
};

const SCENE_2: SceneDefinition = {
  id: "reveal",
  act: "Ato 2 · Solidão",
  startFrame: 120,
  durationInFrames: 180,
  summary:
    "A câmera afasta e revela o vale. O personagem caminha e observa o horizonte vazio.",
  narration: NARR_2,
  subtitle: SUB_2,
  characterActions: INCLUDE(["stand-up", "walk-out", "look-horizon"]),
  environment: {
    id: "prehistoric-valley",
    label: "Vale aberto, sem abrigo visível",
    campfire: CAMPFIRE,
  },
  environmentEvents: [ENVIRONMENT_EVENTS[1], ENVIRONMENT_EVENTS[2]],
  cameraShot: {
    kind: "establishing",
    anchor: "world",
    description:
      "Plano geral do vale, afastando para mostrar a escala e a solidão.",
  },
  cameraMovement: {
    kind: "crane",
    fromPosition: [3.6, 2.8, 7.6],
    toPosition: [2.0, 2.3, 5.4],
    fromTarget: [-1.4, 1.5, -2.2],
    toTarget: [-0.4, 1.35, -1.6],
    fromFov: 48,
    toFov: 42,
    easing: "easeInOut",
  },
  soundEffects: [WIND_DAY],
  backgroundMusic: [MUSIC],
  transitions: [],
  visualEvents: [
    {
      id: "ve-shake-realization",
      kind: "shake",
      from: 262,
      durationInFrames: 16,
      intensity: 0.5,
      note: "Micro tremor na percepção da escala.",
    },
  ],
};

const SCENE_3: SceneDefinition = {
  id: "shelter",
  act: "Ato 3 · Busca de abrigo",
  startFrame: 300,
  durationInFrames: 240,
  summary:
    "O personagem aponta para a formação rochosa, caminha até ela e se abaixa para recolher material.",
  narration: NARR_3,
  subtitle: SUB_3,
  characterActions: INCLUDE([
    "point-cave",
    "walk-cave",
    "crouch-cave",
    "pick-stick",
  ]),
  environment: {
    id: "prehistoric-valley",
    label: "Formação rochosa como abrigo",
    campfire: CAMPFIRE,
  },
  environmentEvents: [ENVIRONMENT_EVENTS[3]],
  cameraShot: {
    kind: "tracking",
    anchor: "character",
    description:
      "Plano de acompanhamento lateral, seguindo o deslocamento até o abrigo.",
  },
  cameraMovement: {
    kind: "track",
    fromPosition: [3.6, 2.0, 4.0],
    toPosition: [2.9, 1.8, 3.4],
    fromTarget: [0, 1.2, 0],
    toTarget: [0, 1.2, 0],
    fromFov: 42,
    toFov: 38,
    easing: "easeInOut",
  },
  soundEffects: [FOOTSTEPS],
  backgroundMusic: [MUSIC],
  transitions: [],
  visualEvents: [],
};

const SCENE_4: SceneDefinition = {
  id: "night",
  act: "Ato 4 · Noite e fogo",
  startFrame: 540,
  durationInFrames: 330,
  summary:
    "Anoitece. O personagem corre de volta ao fogo, reacende a chama e treme com o frio.",
  narration: NARR_4,
  subtitle: SUB_4,
  characterActions: INCLUDE([
    "rise",
    "run-back",
    "turn-fire",
    "tend-fire",
    "shiver-cold",
  ]),
  environment: {
    id: "prehistoric-valley",
    label: "Vale ao entardecer e à noite",
    campfire: CAMPFIRE,
  },
  environmentEvents: [
    ENVIRONMENT_EVENTS[4],
    ENVIRONMENT_EVENTS[5],
    ENVIRONMENT_EVENTS[6],
  ],
  cameraShot: {
    kind: "dollyIn",
    anchor: "character",
    description:
      "Dolly in durante a corrida e a aproximação do fogo, fechando o quadro.",
  },
  cameraMovement: {
    kind: "dollyIn",
    fromPosition: [3.2, 2.0, 4.6],
    toPosition: [2.2, 1.55, 3.0],
    fromTarget: [0, 1.15, 0],
    toTarget: [0, 1.2, 0.2],
    fromFov: 46,
    toFov: 36,
    easing: "easeInOut",
  },
  soundEffects: [FIRE_CATCH, WIND_NIGHT_1],
  backgroundMusic: [MUSIC],
  transitions: [
    {
      id: "tr-night-dip",
      kind: "dipToBlack",
      from: 855,
      durationInFrames: 30,
    },
  ],
  visualEvents: [
    {
      id: "ve-fire-flare",
      kind: "flash",
      from: 690,
      durationInFrames: 20,
      intensity: 0.22,
      color: "#ffb35c",
    },
  ],
};

const SCENE_5: SceneDefinition = {
  id: "survive",
  act: "Ato 5 · Sobreviver",
  startFrame: 870,
  durationInFrames: 330,
  summary:
    "Abrigado entre as pedras, o personagem se abaixa, treme e espera a noite passar.",
  narration: NARR_5,
  subtitle: SUB_5,
  characterActions: INCLUDE(["shelter-crouch", "shiver-night", "settle"]),
  environment: {
    id: "prehistoric-valley",
    label: "Noite profunda ao redor do fogo",
    campfire: CAMPFIRE,
  },
  environmentEvents: [ENVIRONMENT_EVENTS[7], ENVIRONMENT_EVENTS[8]],
  cameraShot: {
    kind: "reaction",
    anchor: "character",
    description:
      "Plano de reação, afastando levemente para mostrar o fogo e a escuridão.",
  },
  cameraMovement: {
    kind: "dollyOut",
    fromPosition: [1.9, 1.35, 3.2],
    toPosition: [2.8, 1.75, 4.6],
    fromTarget: [0, 1.1, 0],
    toTarget: [0, 1.2, -0.2],
    fromFov: 36,
    toFov: 44,
    easing: "easeInOut",
  },
  soundEffects: [WIND_NIGHT_2],
  backgroundMusic: [MUSIC],
  transitions: [],
  visualEvents: [],
};

const SCENE_6: SceneDefinition = {
  id: "dawn",
  act: "Ato 6 · Pergunta final",
  startFrame: 1200,
  durationInFrames: 150,
  summary:
    "Amanhece. O personagem se levanta e olha para o horizonte enquanto a pergunta final aparece.",
  narration: NARR_6,
  subtitle: SUB_6,
  characterActions: INCLUDE(["stand-dawn", "look-dawn"]),
  environment: {
    id: "prehistoric-valley",
    label: "Primeira luz e amanhecer",
    campfire: CAMPFIRE,
  },
  environmentEvents: [
    ENVIRONMENT_EVENTS[9],
    ENVIRONMENT_EVENTS[10],
    ENVIRONMENT_EVENTS[11],
  ],
  cameraShot: {
    kind: "dollyOut",
    anchor: "character",
    description:
      "Dolly out final, revelando o vale iluminado pela manhã.",
  },
  cameraMovement: {
    kind: "dollyOut",
    fromPosition: [1.4, 1.5, 2.6],
    toPosition: [4.6, 2.7, 8.2],
    fromTarget: [0, 1.35, 0],
    toTarget: [0, 1.2, -2.0],
    fromFov: 36,
    toFov: 50,
    easing: "easeInOut",
  },
  soundEffects: [DAWN_BIRDS],
  backgroundMusic: [MUSIC],
  transitions: [
    { id: "tr-fadeout", kind: "fadeOut", from: 1325, durationInFrames: 25 },
  ],
  visualEvents: [
    {
      id: "ve-dawn-flash",
      kind: "flash",
      from: 1215,
      durationInFrames: 24,
      intensity: 0.18,
      color: "#ffd9a8",
    },
  ],
};

const scenes: readonly SceneDefinition[] = [
  SCENE_1,
  SCENE_2,
  SCENE_3,
  SCENE_4,
  SCENE_5,
  SCENE_6,
];

export const episode001: EpisodeDefinition = {
  id: "Episodio01",
  title: "E se você acordasse há 100 mil anos?",
  subtitle: "Você sobreviveria?",
  logline:
    "Uma pessoa moderna acorda há cerca de 100 mil anos e precisa encontrar abrigo, fogo e sobreviver à noite.",
  historicalNote:
    "Reconstrução especulativa: vestígios arqueológicos indicam uso de fogo e abrigos rochosos em períodos próximos, mas esta cena específica não é um fato documentado.",
  width: VIDEO.width,
  height: VIDEO.height,
  fps: VIDEO.fps,
  durationInFrames: VIDEO.durationInFrames,
  scenes,
  titleCues: [
    {
      id: "tc-kicker",
      text: "Antes de Tudo apresenta",
      kind: "kicker",
      from: 8,
      durationInFrames: 88,
      placement: "top",
    },
    {
      id: "tc-title",
      text: "E se você acordasse\nhá 100 mil anos?",
      kind: "title",
      from: 22,
      durationInFrames: 90,
      placement: "top",
    },
    {
      id: "tc-disclaimer",
      text: "Reconstrução especulativa baseada em evidências arqueológicas.",
      kind: "disclaimer",
      from: 1270,
      durationInFrames: 80,
      placement: "top",
    },
  ],
  initialCharacter: INITIAL_CHARACTER_PLACEMENT,
};
