import type { ChallengeDifficulty, ChallengeMetadata } from "../types";
import { challengeDescription, challengeTitle, challengeTags } from "./challengeText";

export type ChallengeFilters = {
  difficulty?: ChallengeDifficulty | "all";
  category?: string;
  query?: string;
};

export function filterChallenges(
  challenges: ChallengeMetadata[],
  filters: ChallengeFilters,
): ChallengeMetadata[] {
  const query = filters.query?.trim().toLowerCase();

  return challenges.filter((challenge) => {
    const matchesDifficulty =
      !filters.difficulty || filters.difficulty === "all" || challenge.difficulty === filters.difficulty;
    const matchesCategory = !filters.category || challenge.category === filters.category;
    const matchesQuery =
      !query ||
      challenge.title.toLowerCase().includes(query) ||
      challengeTitle(challenge, "zh").toLowerCase().includes(query) ||
      challenge.description.toLowerCase().includes(query) ||
      challengeDescription(challenge, "zh").toLowerCase().includes(query) ||
      challenge.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      challengeTags(challenge, "zh").some((tag) => tag.toLowerCase().includes(query));

    return matchesDifficulty && matchesCategory && matchesQuery;
  });
}

export function getChallengeBySlug(challenges: ChallengeMetadata[], slug: string): ChallengeMetadata | undefined {
  return challenges.find((challenge) => challenge.slug === slug);
}
