# Áudio previsto para o Episódio 01

Nenhum arquivo de áudio foi incluído neste repositório. Os cues de narração,
efeitos sonoros e trilha são declarados em `src/episodes/episode-001/episode.ts`
com `available: false` até que os arquivos reais sejam adicionados.

## Estrutura esperada (relativa a `public/`)

```
public/audio/
  narration/
    narr-01.mp3   # 0–4s, gancho
    narr-02.mp3   # 4–10s, revelação do ambiente
    narr-03.mp3   # 10–18s, busca de abrigo
    narr-04.mp3   # 18–29s, noite e fogo
    narr-05.mp3   # 29–40s, sobrevivência
    narr-06.mp3   # 40–45s, pergunta final
  sfx/
    fire-loop.mp3
    wind-day.mp3
    footsteps.mp3
    fire-catch.mp3
    wind-night.mp3
    dawn-birds.mp3
  music/
    theme.mp3
```

## Como ativar

1. Gere ou licencie os arquivos acima.
2. Coloque-os exatamente nas rotas declaradas.
3. Em `src/episodes/episode-001/episode.ts`, altere `available: false` para
   `available: true` nos cues correspondentes.
4. Rode `npm run lint`, `npm run build` e renderize novamente.

## Especificações sugeridas

- Narracao: 48 kHz, mono, mp3 ou wav. A duracao deve bater com
  `durationInFrames` do cue (1 frame = 1/30 s). Ajuste o cue se a gravacao
  for mais curta ou mais longa.
- Efeitos: curtos e sem voz. Loops sem clicks.
- Trilha: instrumental, sem voz, loopavel ou com fade in/out declarado.
- Ducking: `StoryAudio` reduz a trilha para `duckTo` enquanto uma narração
  `available` estiver ativa.

## Licenças

Use apenas material com licença adequada: voz própria, TTS com licença
compatível, ou bibliotecas CC0/CC BY com atribuição documentada. Não adicione
arquivos de terceiros sem registrar a fonte e a licença.
