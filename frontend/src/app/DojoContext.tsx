import { useCurrentAccount } from "@mysten/dapp-kit";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { challenges } from "../data/challenges";
import { useChallenge01Actions } from "../hooks/useChallenge01Actions";
import { useDojoObjects } from "../hooks/useDojoObjects";
import { useLeaderboardEvents } from "../hooks/useLeaderboardEvents";
import { getChallenge01ActionState } from "../lib/challengeRuntime";
import { CONTRACTS, SUI_NETWORK } from "../lib/constants";
import { dictionaries, type Locale } from "../lib/i18n";
import { defaultPracticeInputs, type PracticeDefaults } from "../lib/practice";
import { summarizeProfile } from "../lib/profile";
import { summarizeProgress } from "../lib/progress";
import { baseScoreForDifficulty, calculateScore, type AssistanceLevel, type TrainingMode } from "../lib/scoring";
import type { ChallengeMetadata } from "../types";

export type DojoContextValue = ReturnType<typeof useDojoState>;

const DojoContext = createContext<DojoContextValue | undefined>(undefined);

export function DojoProvider({ children }: { children: ReactNode }) {
  const value = useDojoState();
  return <DojoContext.Provider value={value}>{children}</DojoContext.Provider>;
}

export function useDojo() {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("useDojo must be used within DojoProvider");
  }
  return value;
}

function useDojoState() {
  const account = useCurrentAccount();
  const packageId = CONTRACTS.PACKAGE_ID;
  const [locale, setLocale] = useState<Locale>("zh");
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("challenge");
  const [assistanceLevel, setAssistanceLevel] = useState<AssistanceLevel>(0);
  const [practiceInputs, setPracticeInputs] = useState<PracticeDefaults>(defaultPracticeInputs);
  const { chainState, chainProgress, isSolved, ownedObjectsQuery, challenge02VaultQuery, suiBalanceMist, refetchObjects } =
    useDojoObjects(account?.address, packageId);
  const challengeActions = useChallenge01Actions(packageId, chainState, refetchObjects);
  const leaderboardQuery = useLeaderboardEvents(packageId, account?.address);
  const progress = summarizeProgress(challenges, chainProgress);
  const profile = summarizeProfile({
    accountAddress: account?.address,
    network: SUI_NETWORK,
    challenges,
    chainState,
    badges: chainState.badges ?? [],
    leaderboardEntry: leaderboardQuery.leaderboard.currentEntry,
  });
  const warnings = [
    SUI_NETWORK !== "testnet" ? `Current network is ${SUI_NETWORK}; SuiSec Dojo challenges are configured for testnet.` : undefined,
    account?.address && suiBalanceMist === "0" ? "Wallet has no SUI available for gas. Fund it from the Sui testnet faucet." : undefined,
  ].filter((message): message is string => Boolean(message));
  const t = dictionaries[locale];

  function actionStateFor(challenge: ChallengeMetadata) {
    return getChallenge01ActionState({
      accountAddress: account?.address,
      packageId,
      selectedChallengeId: challenge.id,
      chainState,
      actionBusy: challengeActions.isPending || ownedObjectsQuery.isFetching || challenge02VaultQuery.isFetching,
    });
  }

  function scorePreviewFor(challenge: ChallengeMetadata) {
    return calculateScore(baseScoreForDifficulty(challenge.difficulty), trainingMode, assistanceLevel);
  }

  const setPracticeInput = <Key extends keyof PracticeDefaults>(key: Key, value: PracticeDefaults[Key]) => {
    setPracticeInputs((current) => ({ ...current, [key]: value }));
  };

  const asPositiveInt = (value: string, fallback: number) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  function runPracticeAction(challenge: ChallengeMetadata) {
    switch (challenge.id) {
      case "20":
        challengeActions.exploitChallenge20(
          asPositiveInt(practiceInputs.liquidationPrice, 24),
          asPositiveInt(practiceInputs.liquidationThreshold, 50),
        );
        return;
      case "19":
        challengeActions.exploitChallenge19();
        return;
      case "18":
        challengeActions.exploitChallenge18(
          asPositiveInt(practiceInputs.rewardEpoch, 4),
          asPositiveInt(practiceInputs.rewardRepeats, 6),
        );
        return;
      case "17":
        challengeActions.exploitChallenge17(asPositiveInt(practiceInputs.shadowKey, 7));
        return;
      case "16":
        challengeActions.exploitChallenge16(practiceInputs.claimedSigner || chainState.challenge16Instance?.owner);
        return;
      case "15":
        challengeActions.exploitChallenge15(asPositiveInt(practiceInputs.creditAmount, 1));
        return;
      case "14":
        challengeActions.exploitChallenge14(asPositiveInt(practiceInputs.checkedEpoch, 10), asPositiveInt(practiceInputs.priceEpoch, 1));
        return;
      case "13":
        challengeActions.exploitChallenge13();
        return;
      case "12":
        challengeActions.exploitChallenge12();
        return;
      case "11":
        challengeActions.exploitChallenge11();
        return;
      case "10":
        challengeActions.exploitChallenge10(asPositiveInt(practiceInputs.swapAmount, 100));
        return;
      case "9":
        challengeActions.exploitChallenge09();
        return;
      case "8":
        challengeActions.exploitChallenge08(practiceInputs.oldPath);
        return;
      case "7":
        challengeActions.exploitChallenge07(asPositiveInt(practiceInputs.guardedValue, 1_000));
        return;
      case "6":
        challengeActions.exploitChallenge06(asPositiveInt(practiceInputs.buyRepeats, 10), asPositiveInt(practiceInputs.buyPayment, 1));
        return;
      case "5":
        challengeActions.exploitChallenge05();
        return;
      case "4":
        challengeActions.exploitChallenge04();
        return;
      case "3":
        challengeActions.exploitChallenge03(practiceInputs.claimedOwner || chainState.challenge03Instance?.owner);
        return;
      case "2":
        challengeActions.withdrawChallenge02(asPositiveInt(practiceInputs.withdrawAmount, 100));
        return;
      case "1":
        challengeActions.mintChallenge01(asPositiveInt(practiceInputs.mintAmount, 1_000));
        return;
      default:
        return;
    }
  }

  function solveChallenge(challenge: ChallengeMetadata) {
    const solveOptions = { mode: trainingMode, assistanceLevel };
    switch (challenge.id) {
      case "20":
        challengeActions.solveChallenge20(solveOptions);
        return;
      case "19":
        challengeActions.solveChallenge19(solveOptions);
        return;
      case "18":
        challengeActions.solveChallenge18(solveOptions);
        return;
      case "17":
        challengeActions.solveChallenge17(solveOptions);
        return;
      case "16":
        challengeActions.solveChallenge16(solveOptions);
        return;
      case "15":
        challengeActions.solveChallenge15(solveOptions);
        return;
      case "14":
        challengeActions.solveChallenge14(solveOptions);
        return;
      case "13":
        challengeActions.solveChallenge13(solveOptions);
        return;
      case "12":
        challengeActions.solveChallenge12(solveOptions);
        return;
      case "11":
        challengeActions.solveChallenge11(solveOptions);
        return;
      case "10":
        challengeActions.solveChallenge10(solveOptions);
        return;
      case "9":
        challengeActions.solveChallenge09(solveOptions);
        return;
      case "8":
        challengeActions.solveChallenge08(solveOptions);
        return;
      case "7":
        challengeActions.solveChallenge07(solveOptions);
        return;
      case "6":
        challengeActions.solveChallenge06(solveOptions);
        return;
      case "5":
        challengeActions.solveChallenge05(solveOptions);
        return;
      case "4":
        challengeActions.solveChallenge04(solveOptions);
        return;
      case "3":
        challengeActions.solveChallenge03(solveOptions);
        return;
      case "2":
        challengeActions.solveChallenge02(solveOptions);
        return;
      case "1":
        challengeActions.solveChallenge(solveOptions);
        return;
      default:
        return;
    }
  }

  function claimChallenge(challenge: ChallengeMetadata) {
    switch (challenge.id) {
      case "20":
        challengeActions.claimChallenge20();
        return;
      case "19":
        challengeActions.claimChallenge19();
        return;
      case "18":
        challengeActions.claimChallenge18();
        return;
      case "17":
        challengeActions.claimChallenge17();
        return;
      case "16":
        challengeActions.claimChallenge16();
        return;
      case "15":
        challengeActions.claimChallenge15();
        return;
      case "14":
        challengeActions.claimChallenge14();
        return;
      case "13":
        challengeActions.claimChallenge13();
        return;
      case "12":
        challengeActions.claimChallenge12();
        return;
      case "11":
        challengeActions.claimChallenge11();
        return;
      case "10":
        challengeActions.claimChallenge10();
        return;
      case "9":
        challengeActions.claimChallenge09();
        return;
      case "8":
        challengeActions.claimChallenge08();
        return;
      case "7":
        challengeActions.claimChallenge07();
        return;
      case "6":
        challengeActions.claimChallenge06();
        return;
      case "5":
        challengeActions.claimChallenge05();
        return;
      case "4":
        challengeActions.claimChallenge04();
        return;
      case "3":
        challengeActions.claimChallenge03();
        return;
      case "2":
        challengeActions.claimChallenge02();
        return;
      case "1":
        challengeActions.claimInstance();
        return;
      default:
        return;
    }
  }

  function useCapability(challenge: ChallengeMetadata) {
    if (challenge.id === "19") {
      challengeActions.setChallenge19OldWitness();
      return;
    }
    if (challenge.id === "5") {
      challengeActions.setChallenge05Initialized();
      return;
    }
    if (challenge.id === "13") {
      challengeActions.setChallenge13PrivilegedFlag();
      return;
    }
    challengeActions.setChallenge04AdminFlag();
  }

  return useMemo(
    () => ({
      account,
      actionStateFor,
      assistanceLevel,
      chainState,
      challengeActions,
      challenge02VaultQuery,
      claimChallenge,
      isSolved,
      leaderboardQuery,
      locale,
      ownedObjectsQuery,
      packageId,
      practiceInputs,
      profile,
      progress,
      runPracticeAction,
      scorePreviewFor,
      setAssistanceLevel,
      setLocale,
      setPracticeInput,
      setTrainingMode,
      solveChallenge,
      t,
      trainingMode,
      useCapability,
      warnings,
    }),
    [
      account,
      actionStateFor,
      assistanceLevel,
      chainState,
      challengeActions,
      challenge02VaultQuery,
      isSolved,
      leaderboardQuery,
      locale,
      ownedObjectsQuery,
      packageId,
      practiceInputs,
      profile,
      progress,
      t,
      trainingMode,
      warnings,
    ],
  );
}
