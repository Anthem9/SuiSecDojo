export type ChallengeDifficulty = "beginner" | "easy" | "medium" | "hard";
export type ChallengeStatus = "live" | "coming-soon";

export type ChallengeMetadata = {
  id: string;
  title: string;
  slug: string;
  difficulty: ChallengeDifficulty;
  category: string;
  tags: string[];
  description: string;
  packageId?: string;
  moduleName?: string;
  walrusBlobId?: string;
  sourceUrl?: string;
  status?: ChallengeStatus;
  relatedIncidentSlugs?: string[];
  cliTemplateUrl?: string;
};

export type ChallengeProgress = {
  completedChallengeIds: string[];
  badgeIds: string[];
};
