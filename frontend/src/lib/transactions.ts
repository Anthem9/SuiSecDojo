import { Transaction } from "@mysten/sui/transactions";

export function createProgressTransaction(packageId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::user_progress::create`,
  });
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

export function solveChallenge01Transaction(packageId: string, progressId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  const progress = tx.object(progressId);
  const instance = tx.object(instanceId);

  tx.moveCall({
    target: `${packageId}::challenge_01_anyone_can_mint::vulnerable_mint`,
    arguments: [instance, tx.pure.u64(1_000)],
  });
  tx.moveCall({
    target: `${packageId}::challenge_01_anyone_can_mint::solve`,
    arguments: [instance, progress],
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

export function withdrawChallenge02Transaction(packageId: string, vaultId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_02_shared_vault::vulnerable_withdraw`,
    arguments: [tx.object(vaultId), tx.pure.u64(100)],
  });
  return tx;
}

export function solveChallenge02Transaction(packageId: string, progressId: string, instanceId: string, vaultId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_02_shared_vault::solve`,
    arguments: [tx.object(instanceId), tx.object(vaultId), tx.object(progressId)],
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

export function solveChallenge03Transaction(packageId: string, progressId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_03_fake_owner::solve`,
    arguments: [tx.object(instanceId), tx.object(progressId)],
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

export function solveChallenge04Transaction(packageId: string, progressId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_04_leaky_capability::solve`,
    arguments: [tx.object(instanceId), tx.object(progressId)],
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

export function solveChallenge05Transaction(packageId: string, progressId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_05_bad_init::solve`,
    arguments: [tx.object(instanceId), tx.object(progressId)],
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

export function exploitChallenge06Transaction(packageId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  const instance = tx.object(instanceId);

  for (let i = 0; i < 10; i += 1) {
    tx.moveCall({
      target: `${packageId}::challenge_06_price_rounding::vulnerable_buy`,
      arguments: [instance, tx.pure.u64(1)],
    });
  }

  return tx;
}

export function solveChallenge06Transaction(packageId: string, progressId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_06_price_rounding::solve`,
    arguments: [tx.object(instanceId), tx.object(progressId)],
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

export function exploitChallenge07Transaction(packageId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_07_overflow_guard::vulnerable_set_value`,
    arguments: [tx.object(instanceId), tx.pure.u64(1_000)],
  });
  return tx;
}

export function exploitChallenge08Transaction(packageId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_08_old_package_trap::old_vulnerable_path`,
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

export function exploitChallenge10Transaction(packageId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::challenge_10_mini_amm_incident::vulnerable_swap`,
    arguments: [tx.object(instanceId), tx.pure.u64(100)],
  });
  return tx;
}

export function solveSimpleChallengeTransaction(packageId: string, moduleName: string, progressId: string, instanceId: string): Transaction {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::${moduleName}::solve`,
    arguments: [tx.object(instanceId), tx.object(progressId)],
  });
  return tx;
}
