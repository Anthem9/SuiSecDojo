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
