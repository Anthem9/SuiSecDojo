import type { ChallengeDifficulty } from "../types";

export type TrainingMode = "challenge" | "guided";
export type AssistanceLevel = 0 | 1 | 2 | 3 | 4;

export const MODE_CODE: Record<TrainingMode, 1 | 2> = {
  challenge: 1,
  guided: 2,
};

export const assistanceLabels: Record<AssistanceLevel, string> = {
  0: "No hint",
  1: "Concept hint",
  2: "Direction hint",
  3: "Checklist hint",
  4: "Answer viewed",
};

export function baseScoreForDifficulty(difficulty: ChallengeDifficulty): number {
  switch (difficulty) {
    case "beginner":
      return 100;
    case "easy":
      return 150;
    case "medium":
      return 250;
    case "hard":
      return 400;
  }
}

export function calculateScore(baseScore: number, mode: TrainingMode, assistanceLevel: AssistanceLevel): number {
  if (assistanceLevel === 4) return 0;
  const modeScore = mode === "guided" ? Math.floor((baseScore * 40) / 100) : baseScore;
  const penalty = assistancePenaltyPercent(assistanceLevel);
  return Math.floor((modeScore * (100 - penalty)) / 100);
}

export function assistancePenaltyPercent(level: AssistanceLevel): number {
  switch (level) {
    case 0:
      return 0;
    case 1:
      return 10;
    case 2:
      return 25;
    case 3:
      return 50;
    case 4:
      return 100;
  }
}

export function nextAssistanceLevel(current: AssistanceLevel, revealed: AssistanceLevel): AssistanceLevel {
  return Math.max(current, revealed) as AssistanceLevel;
}

export function formatTrainingMode(mode: TrainingMode): string {
  return mode === "challenge" ? "Challenge Mode" : "Guided Mode";
}
