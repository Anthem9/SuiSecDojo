import type { ChainChallengeState } from "./chainState";

export type ChallengeRuntimeState =
  | "not-connected"
  | "missing-package"
  | "missing-progress"
  | "not-claimed"
  | "claimed"
  | "solved";

export type Challenge01ActionState = {
  canCreateProgress: boolean;
  createProgressReason: string;
  canClaim: boolean;
  claimReason: string;
  canSolve: boolean;
  solveReason: string;
  runtimeState: ChallengeRuntimeState;
};

type Challenge01ActionInput = {
  accountAddress?: string;
  packageId: string;
  selectedChallengeId: string;
  chainState: ChainChallengeState;
  actionBusy?: boolean;
};

export function getChallenge01ActionState(input: Challenge01ActionInput): Challenge01ActionState {
  const isConnected = Boolean(input.accountAddress);
  const hasPackage = Boolean(input.packageId.trim());
  const hasProgress = Boolean(input.chainState.progress);
  const hasInstance = Boolean(input.chainState.challenge01Instance);
  const isChallenge01Selected = input.selectedChallengeId === "1";
  const isSolved =
    input.chainState.challenge01Instance?.solved === true ||
    input.chainState.progress?.completedChallengeIds.includes("1") === true;
  const actionBusy = input.actionBusy === true;

  const runtimeState = getRuntimeState({
    isConnected,
    hasPackage,
    hasProgress,
    hasInstance,
    isSolved,
  });

  return {
    runtimeState,
    canCreateProgress: isConnected && hasPackage && !hasProgress && !actionBusy,
    createProgressReason: actionBusy
      ? "Transaction or chain refresh pending."
      : reasonForCreateProgress(isConnected, hasPackage, hasProgress),
    canClaim: isConnected && hasPackage && hasProgress && !hasInstance && isChallenge01Selected && !actionBusy,
    claimReason: actionBusy
      ? "Transaction or chain refresh pending."
      : reasonForClaim(isConnected, hasPackage, hasProgress, hasInstance, isChallenge01Selected),
    canSolve: isConnected && hasPackage && hasProgress && hasInstance && !isSolved && isChallenge01Selected && !actionBusy,
    solveReason: actionBusy
      ? "Transaction or chain refresh pending."
      : reasonForSolve(isConnected, hasPackage, hasProgress, hasInstance, isSolved, isChallenge01Selected),
  };
}

function getRuntimeState(input: {
  isConnected: boolean;
  hasPackage: boolean;
  hasProgress: boolean;
  hasInstance: boolean;
  isSolved: boolean;
}): ChallengeRuntimeState {
  if (!input.isConnected) return "not-connected";
  if (!input.hasPackage) return "missing-package";
  if (!input.hasProgress) return "missing-progress";
  if (!input.hasInstance) return "not-claimed";
  if (input.isSolved) return "solved";
  return "claimed";
}

function reasonForCreateProgress(isConnected: boolean, hasPackage: boolean, hasProgress: boolean): string {
  if (!isConnected) return "Connect a wallet first.";
  if (!hasPackage) return "Set VITE_PACKAGE_ID before sending transactions.";
  if (hasProgress) return "Progress object already exists.";
  return "Ready to create your progress object.";
}

function reasonForClaim(
  isConnected: boolean,
  hasPackage: boolean,
  hasProgress: boolean,
  hasInstance: boolean,
  isChallenge01Selected: boolean,
): string {
  if (!isConnected) return "Connect a wallet first.";
  if (!hasPackage) return "Set VITE_PACKAGE_ID before claiming.";
  if (!isChallenge01Selected) return "On-chain claim is enabled for Challenge 01 only.";
  if (!hasProgress) return "Create a progress object first.";
  if (hasInstance) return "Challenge 01 instance already claimed.";
  return "Ready to claim Challenge 01.";
}

function reasonForSolve(
  isConnected: boolean,
  hasPackage: boolean,
  hasProgress: boolean,
  hasInstance: boolean,
  isSolved: boolean,
  isChallenge01Selected: boolean,
): string {
  if (!isConnected) return "Connect a wallet first.";
  if (!hasPackage) return "Set VITE_PACKAGE_ID before solving.";
  if (!isChallenge01Selected) return "On-chain solve is enabled for Challenge 01 only.";
  if (!hasProgress) return "Create a progress object first.";
  if (!hasInstance) return "Claim an instance first.";
  if (isSolved) return "Challenge 01 already completed.";
  return "Ready to run vulnerable mint and solve.";
}
