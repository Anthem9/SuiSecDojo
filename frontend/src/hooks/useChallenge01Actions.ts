import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import type { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import type { ChainChallengeState } from "../lib/chainState";
import {
  claimChallenge01Transaction,
  claimChallenge02Transaction,
  claimChallenge03Transaction,
  claimChallenge04Transaction,
  claimChallenge05Transaction,
  claimChallenge06Transaction,
  createProgressTransaction,
  exploitChallenge03Transaction,
  exploitChallenge04Transaction,
  exploitChallenge05Transaction,
  exploitChallenge06Transaction,
  setChallenge04AdminFlagTransaction,
  setChallenge05InitializedTransaction,
  solveChallenge01Transaction,
  solveChallenge02Transaction,
  solveChallenge03Transaction,
  solveChallenge04Transaction,
  solveChallenge05Transaction,
  solveChallenge06Transaction,
  withdrawChallenge02Transaction,
} from "../lib/transactions";
import { txStatusDigest, txStatusMessage, readableTxError } from "../lib/txStatus";
import type { TxStatus } from "../lib/txStatus";

type RefetchObjects = () => Promise<unknown>;

export function useChallenge01Actions(packageId: string, chainState: ChainChallengeState, refetchObjects: RefetchObjects) {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const signAndExecute = useSignAndExecuteTransaction();
  const [txStatus, setTxStatus] = useState<TxStatus>({ kind: "idle" });

  async function executeAndRefresh(label: string, transactionFactory: () => Transaction) {
    if (!account) {
      setTxStatus({ kind: "failed", label, message: "Connect a wallet before sending a transaction." });
      return;
    }

    try {
      setTxStatus({ kind: "awaiting-signature", label });
      const result = await signAndExecute.mutateAsync({
        transaction: transactionFactory(),
      });
      setTxStatus({ kind: "submitted", label, digest: result.digest });
      await client.waitForTransaction({ digest: result.digest });
      await refetchObjects();
      setTxStatus({ kind: "confirmed", label, digest: result.digest });
    } catch (error) {
      setTxStatus({ kind: "failed", label, message: readableTxError(error) });
    }
  }

  return {
    isPending: signAndExecute.isPending,
    lastDigest: txStatusDigest(txStatus),
    statusMessage: txStatusMessage(txStatus),
    txStatus,
    createProgress: () => executeAndRefresh("Create progress", () => createProgressTransaction(packageId)),
    claimInstance: () =>
      executeAndRefresh("Claim instance", () => claimChallenge01Transaction(packageId, chainState.progress!.objectId)),
    solveChallenge: () =>
      executeAndRefresh("Solve challenge", () =>
        solveChallenge01Transaction(packageId, chainState.progress!.objectId, chainState.challenge01Instance!.objectId),
      ),
    claimChallenge02: () =>
      executeAndRefresh("Claim Shared Vault", () => claimChallenge02Transaction(packageId, chainState.progress!.objectId)),
    withdrawChallenge02: () =>
      executeAndRefresh("Exploit withdraw", () =>
        withdrawChallenge02Transaction(packageId, chainState.challenge02Vault!.objectId),
      ),
    solveChallenge02: () =>
      executeAndRefresh("Solve Shared Vault", () =>
        solveChallenge02Transaction(
          packageId,
          chainState.progress!.objectId,
          chainState.challenge02Instance!.objectId,
          chainState.challenge02Vault!.objectId,
        ),
      ),
    claimChallenge03: () =>
      executeAndRefresh("Claim Fake Owner", () => claimChallenge03Transaction(packageId, chainState.progress!.objectId)),
    exploitChallenge03: () =>
      executeAndRefresh("Exploit fake owner", () =>
        exploitChallenge03Transaction(packageId, chainState.challenge03Instance!.objectId, chainState.challenge03Instance!.owner),
      ),
    solveChallenge03: () =>
      executeAndRefresh("Solve Fake Owner", () =>
        solveChallenge03Transaction(packageId, chainState.progress!.objectId, chainState.challenge03Instance!.objectId),
      ),
    claimChallenge04: () =>
      executeAndRefresh("Claim Leaky Capability", () => claimChallenge04Transaction(packageId, chainState.progress!.objectId)),
    exploitChallenge04: () =>
      executeAndRefresh("Claim leaked capability", () =>
        exploitChallenge04Transaction(packageId, chainState.challenge04Instance!.objectId),
      ),
    setChallenge04AdminFlag: () =>
      executeAndRefresh("Use admin capability", () =>
        setChallenge04AdminFlagTransaction(
          packageId,
          chainState.challenge04Instance!.objectId,
          chainState.challenge04AdminCap!.objectId,
        ),
      ),
    solveChallenge04: () =>
      executeAndRefresh("Solve Leaky Capability", () =>
        solveChallenge04Transaction(packageId, chainState.progress!.objectId, chainState.challenge04Instance!.objectId),
      ),
    claimChallenge05: () =>
      executeAndRefresh("Claim Bad Init", () => claimChallenge05Transaction(packageId, chainState.progress!.objectId)),
    exploitChallenge05: () =>
      executeAndRefresh("Create bad init cap", () =>
        exploitChallenge05Transaction(packageId, chainState.challenge05Instance!.objectId),
      ),
    setChallenge05Initialized: () =>
      executeAndRefresh("Initialize protected state", () =>
        setChallenge05InitializedTransaction(
          packageId,
          chainState.challenge05Instance!.objectId,
          chainState.challenge05AdminCap!.objectId,
        ),
      ),
    solveChallenge05: () =>
      executeAndRefresh("Solve Bad Init", () =>
        solveChallenge05Transaction(packageId, chainState.progress!.objectId, chainState.challenge05Instance!.objectId),
      ),
    claimChallenge06: () =>
      executeAndRefresh("Claim Price Rounding", () => claimChallenge06Transaction(packageId, chainState.progress!.objectId)),
    exploitChallenge06: () =>
      executeAndRefresh("Exploit rounding", () =>
        exploitChallenge06Transaction(packageId, chainState.challenge06Instance!.objectId),
      ),
    solveChallenge06: () =>
      executeAndRefresh("Solve Price Rounding", () =>
        solveChallenge06Transaction(packageId, chainState.progress!.objectId, chainState.challenge06Instance!.objectId),
      ),
  };
}
