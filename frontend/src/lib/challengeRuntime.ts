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
  canUseCapability: boolean;
  useCapabilityReason: string;
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
  const isChallenge04Selected = input.selectedChallengeId === "4";
  const isChallenge05Selected = input.selectedChallengeId === "5";
  const isChallenge06Selected = input.selectedChallengeId === "6";
  const isChallenge07Selected = input.selectedChallengeId === "7";
  const isChallenge08Selected = input.selectedChallengeId === "8";
  const isChallenge09Selected = input.selectedChallengeId === "9";
  const isChallenge10Selected = input.selectedChallengeId === "10";
  const selectedInstance = isChallenge02Selected
    ? input.chainState.challenge02Instance
    : isChallenge03Selected
      ? input.chainState.challenge03Instance
      : isChallenge04Selected
        ? input.chainState.challenge04Instance
        : isChallenge05Selected
          ? input.chainState.challenge05Instance
          : isChallenge06Selected
            ? input.chainState.challenge06Instance
            : isChallenge07Selected
              ? input.chainState.challenge07Instance
              : isChallenge08Selected
                ? input.chainState.challenge08Instance
                : isChallenge09Selected
                  ? input.chainState.challenge09Instance
                  : isChallenge10Selected
                    ? input.chainState.challenge10Instance
                    : input.chainState.challenge01Instance;
  const hasInstance = Boolean(selectedInstance);
  const hasVault = Boolean(input.chainState.challenge02Vault);
  const isChallenge01Ready = Number(input.chainState.challenge01Instance?.mintedAmount ?? "0") >= 1_000;
  const isChallenge02Drained = input.chainState.challenge02Vault?.balance === "0";
  const isChallenge03FlagSet = input.chainState.challenge03Instance?.restrictedFlag === true;
  const isChallenge04AdminFlagSet = input.chainState.challenge04Instance?.adminFlag === true;
  const hasChallenge04Cap = Boolean(input.chainState.challenge04AdminCap);
  const isChallenge05Initialized = input.chainState.challenge05Instance?.initialized === true;
  const hasChallenge05Cap = Boolean(input.chainState.challenge05AdminCap);
  const challenge06Credits = Number(input.chainState.challenge06Instance?.credits ?? "0");
  const isChallenge06Ready = challenge06Credits >= 10;
  const isChallenge07Ready = Number(input.chainState.challenge07Instance?.guardedValue ?? "0") >= 1_000;
  const isChallenge08Ready = input.chainState.challenge08Instance?.legacyFlag === true;
  const isChallenge09Ready = input.chainState.challenge09Instance?.comboReady === true;
  const isChallenge10Ready = input.chainState.challenge10Instance?.invariantBroken === true;
  const isSolved =
    selectedInstance?.solved === true || input.chainState.progress?.completedChallengeIds.includes(input.selectedChallengeId) === true;
  const actionBusy = input.actionBusy === true;

  const runtimeState = getRuntimeState({
    isConnected,
    hasPackage,
    hasProgress,
    hasInstance,
    isSolved,
    readyToSolve:
      (isChallenge02Selected && hasVault && isChallenge02Drained) ||
      (isChallenge01Selected && isChallenge01Ready) ||
      (isChallenge03Selected && isChallenge03FlagSet) ||
      (isChallenge04Selected && isChallenge04AdminFlagSet) ||
      (isChallenge05Selected && isChallenge05Initialized) ||
      (isChallenge06Selected && isChallenge06Ready) ||
      (isChallenge07Selected && isChallenge07Ready) ||
      (isChallenge08Selected && isChallenge08Ready) ||
      (isChallenge09Selected && isChallenge09Ready) ||
      (isChallenge10Selected && isChallenge10Ready),
  });
  const supportsOnChain =
    isChallenge01Selected ||
    isChallenge02Selected ||
    isChallenge03Selected ||
    isChallenge04Selected ||
    isChallenge05Selected ||
    isChallenge06Selected ||
    isChallenge07Selected ||
    isChallenge08Selected ||
    isChallenge09Selected ||
    isChallenge10Selected;

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
      ((isChallenge02Selected && hasVault && !isChallenge02Drained) ||
        (isChallenge03Selected && !isChallenge03FlagSet) ||
        (isChallenge04Selected && !hasChallenge04Cap) ||
        (isChallenge05Selected && !hasChallenge05Cap) ||
        (isChallenge06Selected && !isChallenge06Ready) ||
        (isChallenge07Selected && !isChallenge07Ready) ||
        (isChallenge08Selected && !isChallenge08Ready) ||
        (isChallenge09Selected && !isChallenge09Ready) ||
        (isChallenge10Selected && !isChallenge10Ready)) &&
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
          isChallenge04Selected,
          hasChallenge04Cap,
          isChallenge05Selected,
          hasChallenge05Cap,
          isChallenge06Selected,
          isChallenge06Ready,
          isChallenge07Selected,
          isChallenge07Ready,
          isChallenge08Selected,
          isChallenge08Ready,
          isChallenge09Selected,
          isChallenge09Ready,
          isChallenge10Selected,
          isChallenge10Ready,
          isSolved,
        ),
    canUseCapability:
      isConnected &&
      hasPackage &&
      hasProgress &&
      hasInstance &&
      ((isChallenge04Selected && hasChallenge04Cap && !isChallenge04AdminFlagSet) ||
        (isChallenge05Selected && hasChallenge05Cap && !isChallenge05Initialized)) &&
      !isSolved &&
      !actionBusy,
    useCapabilityReason: actionBusy
      ? "Transaction or chain refresh pending."
      : reasonForUseCapability(
          isConnected,
          hasPackage,
          hasProgress,
          hasInstance,
          isChallenge04Selected,
          hasChallenge04Cap,
          isChallenge04AdminFlagSet,
          isChallenge05Selected,
          hasChallenge05Cap,
          isChallenge05Initialized,
          isSolved,
        ),
    canSolve:
      isConnected &&
      hasPackage &&
      hasProgress &&
      hasInstance &&
      !isSolved &&
      supportsOnChain &&
      ((isChallenge01Selected && isChallenge01Ready) ||
        isChallenge02Drained ||
        isChallenge03FlagSet ||
        isChallenge04AdminFlagSet ||
        isChallenge05Initialized ||
        isChallenge06Ready ||
        isChallenge07Ready ||
        isChallenge08Ready ||
        isChallenge09Ready ||
        isChallenge10Ready) &&
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
          isChallenge01Selected,
          isChallenge01Ready,
          isChallenge02Selected,
          hasVault,
          isChallenge02Drained,
          isChallenge03Selected,
          isChallenge03FlagSet,
          isChallenge04Selected,
          hasChallenge04Cap,
          isChallenge04AdminFlagSet,
          isChallenge05Selected,
          hasChallenge05Cap,
          isChallenge05Initialized,
          isChallenge06Selected,
          isChallenge06Ready,
          isChallenge07Selected,
          isChallenge07Ready,
          isChallenge08Selected,
          isChallenge08Ready,
          isChallenge09Selected,
          isChallenge09Ready,
          isChallenge10Selected,
          isChallenge10Ready,
        ),
  };
}

function reasonForUseCapability(
  isConnected: boolean,
  hasPackage: boolean,
  hasProgress: boolean,
  hasInstance: boolean,
  isChallenge04Selected: boolean,
  hasChallenge04Cap: boolean,
  isChallenge04AdminFlagSet: boolean,
  isChallenge05Selected: boolean,
  hasChallenge05Cap: boolean,
  isChallenge05Initialized: boolean,
  isSolved: boolean,
): string {
  if (!isConnected) return "Connect a wallet first.";
  if (!hasPackage) return "Set VITE_PACKAGE_ID before using the capability.";
  if (!isChallenge04Selected && !isChallenge05Selected) return "Capability action is enabled for Challenge 04 and 05 only.";
  if (!hasProgress) return "Create a progress object first.";
  if (!hasInstance) return "Claim an instance first.";
  if (isSolved) return isChallenge05Selected ? "Challenge 05 already completed." : "Challenge 04 already completed.";
  if (isChallenge04Selected && !hasChallenge04Cap) return "Claim the leaked admin capability first.";
  if (isChallenge04Selected && isChallenge04AdminFlagSet) return "Admin flag already set; solve the challenge.";
  if (isChallenge05Selected && !hasChallenge05Cap) return "Create the bad init admin capability first.";
  if (isChallenge05Selected && isChallenge05Initialized) return "Initialized state already set; solve the challenge.";
  if (isChallenge05Selected) return "Ready to use the bad init admin capability.";
  return "Ready to use the leaked admin capability.";
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
  isChallenge04Selected: boolean,
  hasChallenge04Cap: boolean,
  isChallenge05Selected: boolean,
  hasChallenge05Cap: boolean,
  isChallenge06Selected: boolean,
  isChallenge06Ready: boolean,
  isChallenge07Selected: boolean,
  isChallenge07Ready: boolean,
  isChallenge08Selected: boolean,
  isChallenge08Ready: boolean,
  isChallenge09Selected: boolean,
  isChallenge09Ready: boolean,
  isChallenge10Selected: boolean,
  isChallenge10Ready: boolean,
  isSolved: boolean,
): string {
  if (!isConnected) return "Connect a wallet first.";
  if (!hasPackage) return "Set VITE_PACKAGE_ID before exploiting.";
  if (
    !isChallenge02Selected &&
    !isChallenge03Selected &&
    !isChallenge04Selected &&
    !isChallenge05Selected &&
    !isChallenge06Selected &&
    !isChallenge07Selected &&
    !isChallenge08Selected &&
    !isChallenge09Selected &&
    !isChallenge10Selected
  ) {
    return `Exploit action is not enabled for Challenge ${formatChallengeId(selectedChallengeId)}.`;
  }
  if (!hasProgress) return "Create a progress object first.";
  if (!hasInstance) return "Claim an instance first.";
  if (isSolved) return `Challenge ${formatChallengeId(selectedChallengeId)} already completed.`;
  if (isChallenge02Selected && !hasVault) return "Shared vault is still loading.";
  if (isChallenge02Selected && isChallenge02Drained) return "Vault already drained; solve the challenge.";
  if (isChallenge03Selected && isChallenge03FlagSet) return "Restricted flag already set; solve the challenge.";
  if (isChallenge03Selected) return "Ready to exploit the trusted owner parameter.";
  if (isChallenge04Selected && hasChallenge04Cap) return "Admin capability already claimed; set the admin flag.";
  if (isChallenge04Selected) return "Ready to claim the leaked admin capability.";
  if (isChallenge05Selected && hasChallenge05Cap) return "Bad init admin capability already created; initialize state.";
  if (isChallenge05Selected) return "Ready to create the bad init admin capability.";
  if (isChallenge06Selected && isChallenge06Ready) return "Rounding credits reached; solve the challenge.";
  if (isChallenge06Selected) return "Ready to exploit repeated tiny rounded buys.";
  if (isChallenge07Selected && isChallenge07Ready) return "Guarded value is high enough; solve the challenge.";
  if (isChallenge07Selected) return "Ready to bypass the wrong guard.";
  if (isChallenge08Selected && isChallenge08Ready) return "Legacy flag set; solve the challenge.";
  if (isChallenge08Selected) return "Ready to use the old vulnerable path.";
  if (isChallenge09Selected && isChallenge09Ready) return "PTB combo completed; solve the challenge.";
  if (isChallenge09Selected) return "Ready to run the PTB combo.";
  if (isChallenge10Selected && isChallenge10Ready) return "AMM invariant is broken; solve the challenge.";
  if (isChallenge10Selected) return "Ready to break the AMM invariant.";
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
  isChallenge01Selected: boolean,
  isChallenge01Ready: boolean,
  isChallenge02Selected: boolean,
  hasVault: boolean,
  isChallenge02Drained: boolean,
  isChallenge03Selected: boolean,
  isChallenge03FlagSet: boolean,
  isChallenge04Selected: boolean,
  hasChallenge04Cap: boolean,
  isChallenge04AdminFlagSet: boolean,
  isChallenge05Selected: boolean,
  hasChallenge05Cap: boolean,
  isChallenge05Initialized: boolean,
  isChallenge06Selected: boolean,
  isChallenge06Ready: boolean,
  isChallenge07Selected: boolean,
  isChallenge07Ready: boolean,
  isChallenge08Selected: boolean,
  isChallenge08Ready: boolean,
  isChallenge09Selected: boolean,
  isChallenge09Ready: boolean,
  isChallenge10Selected: boolean,
  isChallenge10Ready: boolean,
): string {
  if (!isConnected) return "Connect a wallet first.";
  if (!hasPackage) return "Set VITE_PACKAGE_ID before solving.";
  if (!supportsOnChain) return `On-chain solve is not enabled for Challenge ${formatChallengeId(selectedChallengeId)}.`;
  if (!hasProgress) return "Create a progress object first.";
  if (!hasInstance) return "Claim an instance first.";
  if (isSolved) return `Challenge ${formatChallengeId(selectedChallengeId)} already completed.`;
  if (isChallenge01Selected && !isChallenge01Ready) return "Run your mint before submitting solve.";
  if (isChallenge01Selected) return "Ready to submit Anyone Can Mint solve.";
  if (isChallenge02Selected && !hasVault) return "Shared vault is still loading.";
  if (isChallenge02Selected && !isChallenge02Drained) return "Drain the shared vault before solving.";
  if (isChallenge02Selected) return "Ready to solve Shared Vault.";
  if (isChallenge03Selected && !isChallenge03FlagSet) return "Set the restricted flag before solving.";
  if (isChallenge03Selected) return "Ready to solve Fake Owner.";
  if (isChallenge04Selected && !hasChallenge04Cap) return "Claim the leaked admin capability first.";
  if (isChallenge04Selected && !isChallenge04AdminFlagSet) return "Use the admin capability before solving.";
  if (isChallenge04Selected) return "Ready to solve Leaky Capability.";
  if (isChallenge05Selected && !hasChallenge05Cap) return "Create the bad init admin capability first.";
  if (isChallenge05Selected && !isChallenge05Initialized) return "Initialize protected state before solving.";
  if (isChallenge05Selected) return "Ready to solve Bad Init.";
  if (isChallenge06Selected && !isChallenge06Ready) return "Exploit rounding until credits reach 10.";
  if (isChallenge06Selected) return "Ready to solve Price Rounding.";
  if (isChallenge07Selected && !isChallenge07Ready) return "Set guarded value to the exploit threshold first.";
  if (isChallenge07Selected) return "Ready to solve Overflow Guard.";
  if (isChallenge08Selected && !isChallenge08Ready) return "Use the old vulnerable path first.";
  if (isChallenge08Selected) return "Ready to solve Old Package Trap.";
  if (isChallenge09Selected && !isChallenge09Ready) return "Run the PTB combo first.";
  if (isChallenge09Selected) return "Ready to solve PTB Combo.";
  if (isChallenge10Selected && !isChallenge10Ready) return "Break the AMM invariant first.";
  if (isChallenge10Selected) return "Ready to solve Mini AMM Incident.";
  return "Ready to submit solve.";
}

function formatChallengeId(challengeId: string): string {
  return challengeId.padStart(2, "0");
}
