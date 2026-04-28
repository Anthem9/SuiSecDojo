import type { ProfileSummary } from "./profile";

export type PassportSummary = {
  holder: string;
  network: string;
  completedLabel: string;
  badgeLabel: string;
  nextStep: string;
  certificateTitle: string;
};

export function summarizePassport(profile: ProfileSummary): PassportSummary {
  return {
    holder: profile.walletLabel,
    network: profile.network,
    completedLabel: `${profile.completed}/${profile.total} challenges completed`,
    badgeLabel: `${profile.badgeCount} badges earned`,
    nextStep: profile.nextChallenge ? `Next: ${profile.nextChallenge.title}` : "All current challenges completed",
    certificateTitle: profile.completed >= 10 ? "SuiSec Dojo Completion Certificate" : "SuiSec Dojo Progress Passport",
  };
}

