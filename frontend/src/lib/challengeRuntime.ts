import type { ChainChallengeState } from "./chainState";

export type ChallengeRuntimeState =
  | "not-connected"
  | "missing-package"
  | "missing-progress"
  | "not-claimed"
  | "claimed"
  | "ready-to-solve"
  | "solved";

export type ChallengeActionState = {
  canCreateProgress: boolean;
  createProgressReason: string;
  canClaim: boolean;
  claimReason: string;
  canExploit: boolean;
  exploitReason: string;
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

export function getChallenge01ActionState(input: Challenge01ActionInput): ChallengeActionState {
  const isConnected = Boolean(input.accountAddress);
  const hasPackage = Boolean(input.packageId.trim());
  const hasProgress = Boolean(input.chainState.progress);
  const isChallenge01Selected = input.selectedChallengeId === "1";
  const isChallenge02Selected = input.selectedChallengeId === "2";
  const isChallenge03Selected = input.selectedChallengeId === "3";
  const selectedInstance = isChallenge02Selected
    ? input.chainState.challenge02Instance
    : isChallenge03Selected
      ? input.chainState.challenge03Instance
      : input.chainState.challenge01Instance;
  const hasInstance = Boolean(selectedInstance);
  const hasVault = Boolean(input.chainState.challenge02Vault);
  const isChallenge02Drained = input.chainState.challenge02Vault?.balance === "0";
  const isChallenge03FlagSet = input.chainState.challenge03Instance?.restrictedFlag === true;
  const isSolved =
    selectedInstance?.solved === true || input.chainState.progress?.completedChallengeIds.includes(input.selectedChallengeId) === true;
  const actionBusy = input.actionBusy === true;

  const runtimeState = getRuntimeState({
    isConnected,
    hasPackage,
    hasProgress,
    hasInstance,
    isSolved,
    readyToSolve: (isChallenge02Selected && hasVault && isChallenge02Drained) || (isChallenge03Selected && isChallenge03FlagSet),
  });
  const supportsOnChain = isChallenge01Selected || isChallenge02Selected || isChallenge03Selected;

  return {
    runtimeState,
    canCreateProgress: isConnected && hasPackage && !hasProgress && !actionBusy,
    createProgressReason: actionBusy
      ? "Transaction or chain refresh pending."
      : reasonForCreateProgress(isConnected, hasPackage, hasProgress),
    canClaim: isConnected && hasPackage && hasProgress && !hasInstance && supportsOnChain && !actionBusy,
    claimReason: actionBusy
      ? "Transaction or chain refresh pending."
      : reasonForClaim(isConnected, hasPackage, hasProgress, hasInstance, supportsOnChain, input.selectedChallengeId),
    canExploit:
      isConnected &&
      hasPackage &&
      hasProgress &&
      hasInstance &&
      ((isChallenge02Selected && hasVault && !isChallenge02Drained) || (isChallenge03Selected && !isChallenge03FlagSet)) &&
      !isSolved &&
      !actionBusy,
    exploitReason: actionBusy
      ? "Transaction or chain refresh pending."
      : reasonForExploit(
          isConnected,
          hasPackage,
          hasProgress,
          hasInstance,
          input.selectedChallengeId,
          isChallenge02Selected,
          hasVault,
          isChallenge02Drained,
          isChallenge03Selected,
          isChallenge03FlagSet,
          isSolved,
        ),
    canSolve:
      isConnected &&
      hasPackage &&
      hasProgress &&
      hasInstance &&
      !isSolved &&
      supportsOnChain &&
      (isChallenge01Selected || isChallenge02Drained || isChallenge03FlagSet) &&
      !actionBusy,
    solveReason: actionBusy
      ? "Transaction or chain refresh pending."
      : reasonForSolve(
          isConnected,
          hasPackage,
          hasProgress,
          hasInstance,
          isSolved,
          supportsOnChain,
          input.selectedChallengeId,
          isChallenge02Selected,
          hasVault,
          isChallenge02Drained,
          isChallenge03Selected,
          isChallenge03FlagSet,
        ),
  };
}

function getRuntimeState(input: {
  isConnected: boolean;
  hasPackage: boolean;
  hasProgress: boolean;
  hasInstance: boolean;
  isSolved: boolean;
  readyToSolve: boolean;
}): ChallengeRuntimeState {
  if (!input.isConnected) return "not-connected";
  if (!input.hasPackage) return "missing-package";
  if (!input.hasProgress) return "missing-progress";
  if (!input.hasInstance) return "not-claimed";
  if (input.isSolved) return "solved";
  if (input.readyToSolve) return "ready-to-solve";
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
  supportsOnChain: boolean,
  selectedChallengeId: string,
): string {
  if (!isConnected) return "Connect a wallet first.";
  if (!hasPackage) return "Set VITE_PACKAGE_ID before claiming.";
  if (!supportsOnChain) return `On-chain claim is not enabled for Challenge ${formatChallengeId(selectedChallengeId)}.`;
  if (!hasProgress) return "Create a progress object first.";
  if (hasInstance) return `Challenge ${formatChallengeId(selectedChallengeId)} instance already claimed.`;
  return `Ready to claim Challenge ${formatChallengeId(selectedChallengeId)}.`;
}

function reasonForExploit(
  isConnected: boolean,
  hasPackage: boolean,
  hasProgress: boolean,
  hasInstance: boolean,
  selectedChallengeId: string,
  isChallenge02Selected: boolean,
  hasVault: boolean,
  isChallenge02Drained: boolean,
  isChallenge03Selected: boolean,
  isChallenge03FlagSet: boolean,
  isSolved: boolean,
): string {
  if (!isConnected) return "Connect a wallet first.";
  if (!hasPackage) return "Set VITE_PACKAGE_ID before exploiting.";
  if (!isChallenge02Selected && !isChallenge03Selected) {
    return `Exploit action is not enabled for Challenge ${formatChallengeId(selectedChallengeId)}.`;
  }
  if (!hasProgress) return "Create a progress object first.";
  if (!hasInstance) return "Claim an instance first.";
  if (isSolved) return `Challenge ${formatChallengeId(selectedChallengeId)} already completed.`;
  if (isChallenge02Selected && !hasVault) return "Shared vault is still loading.";
  if (isChallenge02Selected && isChallenge02Drained) return "Vault already drained; solve the challenge.";
  if (isChallenge03Selected && isChallenge03FlagSet) return "Restricted flag already set; solve the challenge.";
  if (isChallenge03Selected) return "Ready to exploit the trusted owner parameter.";
  return "Ready to exploit the missing withdraw authorization.";
}

function reasonForSolve(
  isConnected: boolean,
  hasPackage: boolean,
  hasProgress: boolean,
  hasInstance: boolean,
  isSolved: boolean,
  supportsOnChain: boolean,
  selectedChallengeId: string,
  isChallenge02Selected: boolean,
  hasVault: boolean,
  isChallenge02Drained: boolean,
  isChallenge03Selected: boolean,
  isChallenge03FlagSet: boolean,
): string {
  if (!isConnected) return "Connect a wallet first.";
  if (!hasPackage) return "Set VITE_PACKAGE_ID before solving.";
  if (!supportsOnChain) return `On-chain solve is not enabled for Challenge ${formatChallengeId(selectedChallengeId)}.`;
  if (!hasProgress) return "Create a progress object first.";
  if (!hasInstance) return "Claim an instance first.";
  if (isSolved) return `Challenge ${formatChallengeId(selectedChallengeId)} already completed.`;
  if (isChallenge02Selected && !hasVault) return "Shared vault is still loading.";
  if (isChallenge02Selected && !isChallenge02Drained) return "Drain the shared vault before solving.";
  if (isChallenge02Selected) return "Ready to solve Shared Vault.";
  if (isChallenge03Selected && !isChallenge03FlagSet) return "Set the restricted flag before solving.";
  if (isChallenge03Selected) return "Ready to solve Fake Owner.";
  return "Ready to run vulnerable mint and solve.";
}

function formatChallengeId(challengeId: string): string {
  return challengeId.padStart(2, "0");
}
