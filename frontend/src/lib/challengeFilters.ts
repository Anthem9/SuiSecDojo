import type { ChallengeDifficulty, ChallengeMetadata } from "../types";

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
      challenge.description.toLowerCase().includes(query) ||
      challenge.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesDifficulty && matchesCategory && matchesQuery;
  });
}

export function getChallengeBySlug(challenges: ChallengeMetadata[], slug: string): ChallengeMetadata | undefined {
  return challenges.find((challenge) => challenge.slug === slug);
}

