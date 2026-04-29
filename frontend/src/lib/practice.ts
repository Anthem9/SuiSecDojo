import type { ChainChallengeState } from "./chainState";
import type { ChallengeMetadata } from "../types";

export type PracticeDefaults = {
  mintAmount: string;
  withdrawAmount: string;
  claimedOwner: string;
  buyPayment: string;
  buyRepeats: string;
  guardedValue: string;
  oldPath: "old" | "new";
  swapAmount: string;
  checkedEpoch: string;
  priceEpoch: string;
  creditAmount: string;
};

export const defaultPracticeInputs: PracticeDefaults = {
  mintAmount: "1000",
  withdrawAmount: "100",
  claimedOwner: "",
  buyPayment: "1",
  buyRepeats: "10",
  guardedValue: "1000",
  oldPath: "old",
  swapAmount: "100",
  checkedEpoch: "10",
  priceEpoch: "1",
  creditAmount: "1",
};

export function cliPracticeTemplate(input: {
  challenge: ChallengeMetadata;
  packageId: string;
  chainState: ChainChallengeState;
  values: PracticeDefaults;
}): string {
  const progressId = input.chainState.progress?.objectId ?? "<PROGRESS_ID>";
  const instanceId = instanceIdForChallenge(input.challenge.id, input.chainState);
  const moduleName = input.challenge.moduleName ?? "<MODULE>";
  const packageId = input.packageId || "<PACKAGE_ID>";
  const solveArgs = `${instanceId} ${progressId} <MODE_CODE> <ASSISTANCE_LEVEL>`;

  switch (input.challenge.id) {
    case "1":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_mint --args ${instanceId} ${input.values.mintAmount}`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "2":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_withdraw --args ${input.chainState.challenge02Vault?.objectId ?? "<VAULT_ID>"} ${input.values.withdrawAmount}`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${instanceId} ${input.chainState.challenge02Vault?.objectId ?? "<VAULT_ID>"} ${progressId} <MODE_CODE> <ASSISTANCE_LEVEL>`,
      ].join("\n");
    case "3":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_set_flag --args ${instanceId} ${input.values.claimedOwner || "<CLAIMED_OWNER>"} true`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "4":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_claim_cap --args ${instanceId}`,
        `sui client call --package ${packageId} --module ${moduleName} --function admin_set_flag --args ${instanceId} <ADMIN_CAP_ID>`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "5":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_create_admin_cap --args ${instanceId}`,
        `sui client call --package ${packageId} --module ${moduleName} --function admin_set_initialized --args ${instanceId} <ADMIN_CAP_ID>`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "6":
      return [
        `# repeat ${input.values.buyRepeats} times, or build one PTB with repeated vulnerable_buy calls`,
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_buy --args ${instanceId} ${input.values.buyPayment}`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "7":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_set_value --args ${instanceId} ${input.values.guardedValue}`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "8":
      return [
        `# new_checked_path should reject; old_vulnerable_path is the deprecated entry to inspect`,
        `sui client call --package ${packageId} --module ${moduleName} --function ${input.values.oldPath === "new" ? "new_checked_path" : "old_vulnerable_path"} --args ${instanceId}`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "9":
      return [
        `# PTB shape: prepare_combo(instance) -> finish_combo(instance) -> solve(instance, progress, mode, assistance) in one transaction`,
        `sui client ptb --move-call ${packageId}::${moduleName}::prepare_combo @${instanceId} --move-call ${packageId}::${moduleName}::finish_combo @${instanceId} --move-call ${packageId}::${moduleName}::solve @${instanceId} @${progressId} <MODE_CODE> <ASSISTANCE_LEVEL>`,
      ].join("\n");
    case "10":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_swap --args ${instanceId} ${input.values.swapAmount}`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "11":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_accept_custody --args ${instanceId}`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "12":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_pollute --args ${instanceId}`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "13":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_delegate_cap --args ${instanceId}`,
        `sui client call --package ${packageId} --module ${moduleName} --function privileged_set_flag --args ${instanceId} <DELEGATED_CAP_ID>`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "14":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_use_price --args ${instanceId} ${input.values.checkedEpoch} ${input.values.priceEpoch}`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    case "15":
      return [
        `sui client call --package ${packageId} --module ${moduleName} --function vulnerable_credit_without_coin --args ${instanceId} ${input.values.creditAmount}`,
        `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`,
      ].join("\n");
    default:
      return `sui client call --package ${packageId} --module ${moduleName} --function solve --args ${solveArgs}`;
  }
}

function instanceIdForChallenge(challengeId: string, chainState: ChainChallengeState): string {
  switch (challengeId) {
    case "2":
      return chainState.challenge02Instance?.objectId ?? "<INSTANCE_ID>";
    case "3":
      return chainState.challenge03Instance?.objectId ?? "<INSTANCE_ID>";
    case "4":
      return chainState.challenge04Instance?.objectId ?? "<INSTANCE_ID>";
    case "5":
      return chainState.challenge05Instance?.objectId ?? "<INSTANCE_ID>";
    case "6":
      return chainState.challenge06Instance?.objectId ?? "<INSTANCE_ID>";
    case "7":
      return chainState.challenge07Instance?.objectId ?? "<INSTANCE_ID>";
    case "8":
      return chainState.challenge08Instance?.objectId ?? "<INSTANCE_ID>";
    case "9":
      return chainState.challenge09Instance?.objectId ?? "<INSTANCE_ID>";
    case "10":
      return chainState.challenge10Instance?.objectId ?? "<INSTANCE_ID>";
    case "11":
      return chainState.challenge11Instance?.objectId ?? "<INSTANCE_ID>";
    case "12":
      return chainState.challenge12Instance?.objectId ?? "<INSTANCE_ID>";
    case "13":
      return chainState.challenge13Instance?.objectId ?? "<INSTANCE_ID>";
    case "14":
      return chainState.challenge14Instance?.objectId ?? "<INSTANCE_ID>";
    case "15":
      return chainState.challenge15Instance?.objectId ?? "<INSTANCE_ID>";
    default:
      return chainState.challenge01Instance?.objectId ?? "<INSTANCE_ID>";
  }
}
