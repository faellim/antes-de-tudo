import type { SubtitleCue, SubtitleWord } from "./types";

type MakeSubtitleInput = {
  readonly id: string;
  readonly text: string;
  readonly from: number;
  readonly durationInFrames: number;
  readonly emphasis?: readonly string[];
};

const PAUSE = /[.,!?;:…]$/;

/**
 * Splits narration text into word cues with durations proportional to word
 * length, leaving a small pause after punctuation. The timing is deterministic
 * and can be replaced by real speech timestamps when narration is recorded.
 */
export const makeSubtitle = (input: MakeSubtitleInput): SubtitleCue => {
  const rawWords = input.text.trim().split(/\s+/).filter((word) => word.length > 0);
  const weights = rawWords.map((word) => {
    const base = Math.max(1, word.replace(/[^A-Za-zÀ-ÿ]/g, "").length);
    return PAUSE.test(word) ? base + 2 : base;
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const safeDuration = Math.max(rawWords.length, input.durationInFrames);

  const durations = weights.map((weight) => {
    return Math.max(3, Math.round((safeDuration * weight) / totalWeight));
  });

  let cursor = 0;
  const words: SubtitleWord[] = rawWords.map((word, index) => {
    const remaining = rawWords.length - index;
    const duration = Math.max(3, durations[index]);
    const wordCue: SubtitleWord = {
      text: word,
      from: input.from + cursor,
      durationInFrames:
        index === rawWords.length - 1
          ? Math.max(3, input.from + input.durationInFrames - (input.from + cursor))
          : duration,
    };
    cursor += duration;
    if (cursor > input.durationInFrames && remaining > 1) {
      cursor = input.from + input.durationInFrames;
    }
    return wordCue;
  });

  return {
    id: input.id,
    text: input.text,
    from: input.from,
    durationInFrames: input.durationInFrames,
    words,
    emphasis: input.emphasis,
  };
};

export const findActiveSubtitle = (
  frame: number,
  cues: readonly SubtitleCue[],
): SubtitleCue | null => {
  for (let index = 0; index < cues.length; index += 1) {
    const cue = cues[index];
    if (frame >= cue.from && frame < cue.from + cue.durationInFrames) {
      return cue;
    }
  }
  return null;
};
