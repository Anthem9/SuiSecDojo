export type ChallengeDifficulty = "beginner" | "easy" | "medium" | "hard";
export type ChallengeStatus = "live" | "coming-soon";

export type ChallengeMetadata = {
  id: string;
  title: string;
  titleZh?: string;
  slug: string;
  difficulty: ChallengeDifficulty;
  category: string;
  categoryZh?: string;
  tags: string[];
  tagsZh?: string[];
  description: string;
  descriptionZh?: string;
  packageId?: string;
  moduleName?: string;
  walrusBlobId?: string;
  sourceUrl?: string;
  status?: ChallengeStatus;
  relatedIncidentSlugs?: string[];
  cliTemplateUrl?: string;
};

export type IncidentReference = {
  label: string;
  url: string;
};

export type IncidentMetadata = {
  slug: string;
  title: string;
  titleZh?: string;
  summary: string;
  summaryZh?: string;
  category: string;
  categoryZh?: string;
  date: string;
  affectedProtocol: string;
  affectedProtocolZh?: string;
  impact: string;
  impactZh?: string;
  status: string;
  statusZh?: string;
  relatedChallengeIds: string[];
  sourceUrl: string;
  references: IncidentReference[];
};

export type ChallengeProgress = {
  completedChallengeIds: string[];
  badgeIds: string[];
};
