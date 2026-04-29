import { Transaction } from "@mysten/sui/transactions";
import { MODE_CODE, type AssistanceLevel, type TrainingMode } from "./scoring";

export type SolveOptions = {
  mode: TrainingMode;
  assistanceLevel: AssistanceLevel;
};

function solveArgs(tx: Transaction, options: SolveOptions) {
  return [tx.pure.u8(MODE_CODE[options.mode]), tx.pure.u8(options.assistanceLevel)];
}

export function createProgressTransaction(packageId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::user_progress::create`,
  });
  return tx;
}

export function mintDojoPassTransaction(packageId: string, configId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::dojo_pass::mint_pass`,
    arguments: [tx.object(configId)],
  });
  return tx;
}

export function unlockAnswerTransaction(packageId: string, configId: string, passId: string, challengeId: string, priceMist: string): Transaction {
  const tx = new Transaction();
  const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(priceMist || "0")]);
  tx.moveCall({
    target: `${packageId}::dojo_pass::unlock_answer`,
    arguments: [tx.object(configId), tx.object(passId), tx.pure.u64(challengeId), payment],
  });
  return tx;
}

export function mintDojoBadgeTransaction(
  packageId: string,
  configId: string,
  passId: string,
  badgeType: string,
  expiresEpoch: string,
  nonce: string,
  signature: number[],
  priceMist: string,
  recipient: string,
): Transaction {
  const tx = new Transaction();
  const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(priceMist || "0")]);
  const badge = tx.moveCall({
    target: `${packageId}::dojo_pass::mint_badge`,
    arguments: [
      tx.object(configId),
      tx.object(passId),
      tx.pure.u64(badgeType),
      tx.pure.u64(expiresEpoch),
      tx.pure.u64(nonce),
      tx.pure.vector("u8", signature),
      payment,
    ],
  });
  tx.transferObjects([badge], recipient);
  return tx;
}

export function claimChallenge01Transaction(packageId: string, progressId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_01_anyone_can_mint::claim`,
    arguments: [tx.object(progressId)],
  });
  return tx;
}

export function mintChallenge01Transaction(packageId: string, instanceId: string, amount = 1_000): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_01_anyone_can_mint::vulnerable_mint`,
    arguments: [tx.object(instanceId), tx.pure.u64(amount)],
  });
  return tx;
}

export function guidedSolveChallenge01Transaction(packageId: string, progressId: string, instanceId: string, options: SolveOptions): Transaction {
  const tx = new Transaction();
  const progress = tx.object(progressId);
  const instance = tx.object(instanceId);

  tx.moveCall({
    target: `${packageId}::challenge_01_anyone_can_mint::vulnerable_mint`,
    arguments: [instance, tx.pure.u64(1_000)],
  });
  tx.moveCall({
    target: `${packageId}::challenge_01_anyone_can_mint::solve`,
    arguments: [instance, progress, ...solveArgs(tx, options)],
  });

  return tx;
}

export function solveChallenge01Transaction(packageId: string, progressId: string, instanceId: string, options: SolveOptions): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_01_anyone_can_mint::solve`,
    arguments: [tx.object(instanceId), tx.object(progressId), ...solveArgs(tx, options)],
  });
  return tx;
}

export function claimChallenge02Transaction(packageId: string, progressId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_02_shared_vault::claim`,
    arguments: [tx.object(progressId)],
  });
  return tx;
}

export function withdrawChallenge02Transaction(packageId: string, vaultId: string, amount = 100): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_02_shared_vault::vulnerable_withdraw`,
    arguments: [tx.object(vaultId), tx.pure.u64(amount)],
  });
  return tx;
}

export function solveChallenge02Transaction(packageId: string, progressId: string, instanceId: string, vaultId: string, options: SolveOptions): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_02_shared_vault::solve`,
    arguments: [tx.object(instanceId), tx.object(vaultId), tx.object(progressId), ...solveArgs(tx, options)],
  });
  return tx;
}

export function claimChallenge03Transaction(packageId: string, progressId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_03_fake_owner::claim`,
    arguments: [tx.object(progressId)],
  });
  return tx;
}

export function exploitChallenge03Transaction(packageId: string, instanceId: string, claimedOwner: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_03_fake_owner::vulnerable_set_flag`,
    arguments: [tx.object(instanceId), tx.pure.address(claimedOwner), tx.pure.bool(true)],
  });
  return tx;
}

export function solveChallenge03Transaction(packageId: string, progressId: string, instanceId: string, options: SolveOptions): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_03_fake_owner::solve`,
    arguments: [tx.object(instanceId), tx.object(progressId), ...solveArgs(tx, options)],
  });
  return tx;
}

export function claimChallenge04Transaction(packageId: string, progressId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_04_leaky_capability::claim`,
    arguments: [tx.object(progressId)],
  });
  return tx;
}

export function exploitChallenge04Transaction(packageId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_04_leaky_capability::vulnerable_claim_cap`,
    arguments: [tx.object(instanceId)],
  });
  return tx;
}

export function setChallenge04AdminFlagTransaction(packageId: string, instanceId: string, capId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_04_leaky_capability::admin_set_flag`,
    arguments: [tx.object(instanceId), tx.object(capId)],
  });
  return tx;
}

export function solveChallenge04Transaction(packageId: string, progressId: string, instanceId: string, options: SolveOptions): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_04_leaky_capability::solve`,
    arguments: [tx.object(instanceId), tx.object(progressId), ...solveArgs(tx, options)],
  });
  return tx;
}

export function claimChallenge05Transaction(packageId: string, progressId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_05_bad_init::claim`,
    arguments: [tx.object(progressId)],
  });
  return tx;
}

export function exploitChallenge05Transaction(packageId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_05_bad_init::vulnerable_create_admin_cap`,
    arguments: [tx.object(instanceId)],
  });
  return tx;
}

export function setChallenge05InitializedTransaction(packageId: string, instanceId: string, capId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_05_bad_init::admin_set_initialized`,
    arguments: [tx.object(instanceId), tx.object(capId)],
  });
  return tx;
}

export function solveChallenge05Transaction(packageId: string, progressId: string, instanceId: string, options: SolveOptions): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_05_bad_init::solve`,
    arguments: [tx.object(instanceId), tx.object(progressId), ...solveArgs(tx, options)],
  });
  return tx;
}

export function claimChallenge06Transaction(packageId: string, progressId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_06_price_rounding::claim`,
    arguments: [tx.object(progressId)],
  });
  return tx;
}

export function exploitChallenge06Transaction(packageId: string, instanceId: string, repeats = 10, payment = 1): Transaction {
  const tx = new Transaction();
  const instance = tx.object(instanceId);

  for (let i = 0; i < repeats; i += 1) {
    tx.moveCall({
      target: `${packageId}::challenge_06_price_rounding::vulnerable_buy`,
      arguments: [instance, tx.pure.u64(payment)],
    });
  }

  return tx;
}

export function solveChallenge06Transaction(packageId: string, progressId: string, instanceId: string, options: SolveOptions): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_06_price_rounding::solve`,
    arguments: [tx.object(instanceId), tx.object(progressId), ...solveArgs(tx, options)],
  });
  return tx;
}

export function claimSimpleChallengeTransaction(packageId: string, moduleName: string, progressId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::${moduleName}::claim`,
    arguments: [tx.object(progressId)],
  });
  return tx;
}

export function exploitChallenge07Transaction(packageId: string, instanceId: string, value = 1_000): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_07_overflow_guard::vulnerable_set_value`,
    arguments: [tx.object(instanceId), tx.pure.u64(value)],
  });
  return tx;
}

export function exploitChallenge08Transaction(packageId: string, instanceId: string, path: "old" | "new" = "old"): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_08_old_package_trap::${path === "new" ? "new_checked_path" : "old_vulnerable_path"}`,
    arguments: [tx.object(instanceId)],
  });
  return tx;
}

export function exploitChallenge09Transaction(packageId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  const instance = tx.object(instanceId);
  tx.moveCall({
    target: `${packageId}::challenge_09_ptb_combo::prepare_combo`,
    arguments: [instance],
  });
  tx.moveCall({
    target: `${packageId}::challenge_09_ptb_combo::finish_combo`,
    arguments: [instance],
  });
  return tx;
}

export function exploitChallenge10Transaction(packageId: string, instanceId: string, amount = 100): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_10_mini_amm_incident::vulnerable_swap`,
    arguments: [tx.object(instanceId), tx.pure.u64(amount)],
  });
  return tx;
}

export function exploitChallenge11Transaction(packageId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_11_object_transfer_trap::vulnerable_accept_custody`,
    arguments: [tx.object(instanceId)],
  });
  return tx;
}

export function exploitChallenge12Transaction(packageId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_12_shared_object_pollution::vulnerable_pollute`,
    arguments: [tx.object(instanceId)],
  });
  return tx;
}

export function exploitChallenge13Transaction(packageId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_13_delegated_capability_abuse::vulnerable_delegate_cap`,
    arguments: [tx.object(instanceId)],
  });
  return tx;
}

export function setChallenge13PrivilegedFlagTransaction(packageId: string, instanceId: string, capId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_13_delegated_capability_abuse::privileged_set_flag`,
    arguments: [tx.object(instanceId), tx.object(capId)],
  });
  return tx;
}

export function exploitChallenge14Transaction(packageId: string, instanceId: string, checkedEpoch = 10, priceEpoch = 1): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_14_oracle_staleness::vulnerable_use_price`,
    arguments: [tx.object(instanceId), tx.pure.u64(checkedEpoch), tx.pure.u64(priceEpoch)],
  });
  return tx;
}

export function exploitChallenge15Transaction(packageId: string, instanceId: string, amount = 1): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_15_coin_accounting_mismatch::vulnerable_credit_without_coin`,
    arguments: [tx.object(instanceId), tx.pure.u64(amount)],
  });
  return tx;
}

export function exploitChallenge16Transaction(packageId: string, instanceId: string, claimedSigner: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_16_signer_confusion::vulnerable_accept_intent`,
    arguments: [tx.object(instanceId), tx.pure.address(claimedSigner)],
  });
  return tx;
}

export function exploitChallenge17Transaction(packageId: string, instanceId: string, key = 7): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_17_dynamic_field_shadow::vulnerable_write_shadow`,
    arguments: [tx.object(instanceId), tx.pure.u64(key)],
  });
  return tx;
}

export function exploitChallenge18Transaction(packageId: string, instanceId: string, observedEpoch = 4, repeats = 6): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_18_epoch_reward_drift::vulnerable_accrue`,
    arguments: [tx.object(instanceId), tx.pure.u64(observedEpoch), tx.pure.u64(repeats)],
  });
  return tx;
}

export function exploitChallenge19Transaction(packageId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_19_upgrade_witness_gap::vulnerable_mint_old_witness`,
    arguments: [tx.object(instanceId)],
  });
  return tx;
}

export function setChallenge19OldWitnessTransaction(packageId: string, instanceId: string, witnessId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_19_upgrade_witness_gap::old_admin_path`,
    arguments: [tx.object(instanceId), tx.object(witnessId)],
  });
  return tx;
}

export function exploitChallenge20Transaction(packageId: string, instanceId: string, price = 24, threshold = 50): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_20_liquidation_edge_case::vulnerable_liquidate`,
    arguments: [tx.object(instanceId), tx.pure.u64(price), tx.pure.u64(threshold)],
  });
  return tx;
}

export function solveSimpleChallengeTransaction(
  packageId: string,
  moduleName: string,
  progressId: string,
  instanceId: string,
  options: SolveOptions,
): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::${moduleName}::solve`,
    arguments: [tx.object(instanceId), tx.object(progressId), ...solveArgs(tx, options)],
  });
  return tx;
}
