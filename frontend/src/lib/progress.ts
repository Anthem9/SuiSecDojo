import type { ChallengeMetadata, ChallengeProgress } from "../types";

export type ProgressSummary = {
  completed: number;
  total: number;
  percent: number;
  nextChallenge?: ChallengeMetadata;
};

export function summarizeProgress(
  challenges: ChallengeMetadata[],
  progress: ChallengeProgress,
): ProgressSummary {
  const completedIds = new Set(progress.completedChallengeIds);
  const completed = challenges.filter((challenge) => completedIds.has(challenge.id)).length;
  const total = challenges.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const nextChallenge = challenges.find((challenge) => !completedIds.has(challenge.id));

  return { completed, total, percent, nextChallenge };
}

export function isChallengeCompleted(progress: ChallengeProgress, challengeId: string): boolean {
  return progress.completedChallengeIds.includes(challengeId);
}

