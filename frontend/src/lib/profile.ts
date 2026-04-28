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
  const progressBadgeLabels = (input.chainState.progress?.badgeIds ?? []).map(formatBadgeType);
  const objectBadgeLabels = input.badges.map((badge) => formatBadgeType(badge.badgeType));
  const badgeLabels = Array.from(new Set([...progressBadgeLabels, ...objectBadgeLabels]));

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
    default:
      return `Badge ${badgeType}`;
  }
}

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

