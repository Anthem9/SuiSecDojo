import type { BadgeObject, ChainChallengeState } from "./chainState";
import type { ChallengeMetadata } from "../types";

export type ProfileSummary = {
  walletLabel: string;
  network: string;
  claimed: number;
  completed: number;
  total: number;
  percent: number;
  nextChallenge?: ChallengeMetadata;
  badgeCount: number;
  badgeLabels: string[];
  badgeDetails: BadgeDetail[];
};

export type BadgeDetail = {
  label: string;
  badgeType: string;
  objectId?: string;
  issuedAtEpoch?: string;
  requirement: string;
};

export function summarizeProfile(input: {
  accountAddress?: string;
  network: string;
  challenges: ChallengeMetadata[];
  chainState: ChainChallengeState;
  badges: BadgeObject[];
}): ProfileSummary {
  const claimedIds = new Set(input.chainState.progress?.claimedChallengeIds ?? []);
  const completedIds = new Set(input.chainState.progress?.completedChallengeIds ?? []);
  const total = input.challenges.length;
  const completed = input.challenges.filter((challenge) => completedIds.has(challenge.id)).length;
  const claimed = input.challenges.filter((challenge) => claimedIds.has(challenge.id)).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const nextChallenge = input.challenges.find((challenge) => !completedIds.has(challenge.id));
  const badgeDetails = mergeBadgeDetails(input.chainState.progress?.badgeIds ?? [], input.badges);
  const badgeLabels = badgeDetails.map((badge) => badge.label);

  return {
    walletLabel: input.accountAddress ? shortAddress(input.accountAddress) : "Wallet not connected",
    network: input.network,
    claimed,
    completed,
    total,
    percent,
    nextChallenge,
    badgeCount: badgeLabels.length,
    badgeLabels,
    badgeDetails,
  };
}

export function formatBadgeType(badgeType: string): string {
  switch (badgeType) {
    case "1":
      return "Object Security Beginner";
    case "2":
      return "Shared Object Beginner";
    case "3":
      return "Capability Pattern Beginner";
    case "4":
      return "DeFi Logic Beginner";
    case "5":
      return "Incident Replay Beginner";
    default:
      return `Badge ${badgeType}`;
  }
}

export function badgeRequirement(badgeType: string): string {
  switch (badgeType) {
    case "1":
      return "Complete Challenge 01.";
    case "2":
      return "Complete Challenge 02.";
    case "3":
      return "Complete Challenge 04 or Challenge 05.";
    case "4":
      return "Complete Challenge 06 and Challenge 10.";
    case "5":
      return "Reserved for incident replay learning.";
    default:
      return "Complete the related learning path.";
  }
}

function mergeBadgeDetails(progressBadgeIds: string[], badges: BadgeObject[]): BadgeDetail[] {
  const detailsByType = new Map<string, BadgeDetail>();

  for (const badgeType of progressBadgeIds) {
    detailsByType.set(badgeType, {
      label: formatBadgeType(badgeType),
      badgeType,
      requirement: badgeRequirement(badgeType),
    });
  }

  for (const badge of badges) {
    detailsByType.set(badge.badgeType, {
      label: formatBadgeType(badge.badgeType),
      badgeType: badge.badgeType,
      objectId: badge.objectId,
      issuedAtEpoch: badge.issuedAtEpoch,
      requirement: badgeRequirement(badge.badgeType),
    });
  }

  return Array.from(detailsByType.values());
}

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
