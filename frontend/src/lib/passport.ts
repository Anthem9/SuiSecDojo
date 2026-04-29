import type { ProfileSummary } from "./profile";

export type PassportSummary = {
  holder: string;
  network: string;
  completedLabel: string;
  badgeLabel: string;
  scoreLabel: string;
  nextStep: string;
  certificateTitle: string;
};

export function summarizePassport(profile: ProfileSummary): PassportSummary {
  return {
    holder: profile.walletLabel,
    network: profile.network,
    completedLabel: `${profile.completed}/${profile.total} challenges completed`,
    badgeLabel: `${profile.badgeCount} badges earned`,
    scoreLabel: `${profile.totalScore ?? 0} testnet learning points`,
    nextStep: profile.nextChallenge ? `Next: ${profile.nextChallenge.title}` : "All current challenges completed",
    certificateTitle: profile.completed >= 10 ? "SuiSec Dojo Completion Certificate" : "SuiSec Dojo Progress Passport",
  };
}
