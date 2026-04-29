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
  exploitChallenge07Transaction,
  exploitChallenge08Transaction,
  exploitChallenge09Transaction,
  exploitChallenge10Transaction,
  guidedSolveChallenge01Transaction,
  mintChallenge01Transaction,
  claimSimpleChallengeTransaction,
  setChallenge04AdminFlagTransaction,
  setChallenge05InitializedTransaction,
  solveChallenge01Transaction,
  solveChallenge02Transaction,
  solveChallenge03Transaction,
  solveChallenge04Transaction,
  solveChallenge05Transaction,
  solveChallenge06Transaction,
  solveSimpleChallengeTransaction,
  withdrawChallenge02Transaction,
  type SolveOptions,
} from "../lib/transactions";
import type { PracticeDefaults } from "../lib/practice";
import { txStatusDigest, txStatusMessage, readableTxError } from "../lib/txStatus";
import type { TxStatus } from "../lib/txStatus";

type RefetchObjects = () => Promise<unknown>;

const defaultSolveOptions: SolveOptions = { mode: "challenge", assistanceLevel: 0 };

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
    mintChallenge01: (amount = 1_000) =>
      executeAndRefresh("Run your mint", () => mintChallenge01Transaction(packageId, chainState.challenge01Instance!.objectId, amount)),
    solveChallenge: (options: SolveOptions = defaultSolveOptions) =>
      executeAndRefresh(options.mode === "guided" ? "Guided solve challenge" : "Submit solve", () =>
        options.mode === "guided"
          ? guidedSolveChallenge01Transaction(packageId, chainState.progress!.objectId, chainState.challenge01Instance!.objectId, options)
          : solveChallenge01Transaction(packageId, chainState.progress!.objectId, chainState.challenge01Instance!.objectId, options),
      ),
    claimChallenge02: () =>
      executeAndRefresh("Claim Shared Vault", () => claimChallenge02Transaction(packageId, chainState.progress!.objectId)),
    withdrawChallenge02: (amount = 100) =>
      executeAndRefresh("Run withdraw call", () =>
        withdrawChallenge02Transaction(packageId, chainState.challenge02Vault!.objectId, amount),
      ),
    solveChallenge02: (options: SolveOptions = defaultSolveOptions) =>
      executeAndRefresh("Submit Shared Vault solve", () =>
        solveChallenge02Transaction(
          packageId,
          chainState.progress!.objectId,
          chainState.challenge02Instance!.objectId,
          chainState.challenge02Vault!.objectId,
          options,
        ),
      ),
    claimChallenge03: () =>
      executeAndRefresh("Claim Fake Owner", () => claimChallenge03Transaction(packageId, chainState.progress!.objectId)),
    exploitChallenge03: (claimedOwner?: string) =>
      executeAndRefresh("Run owner claim", () =>
        exploitChallenge03Transaction(
          packageId,
          chainState.challenge03Instance!.objectId,
          claimedOwner || chainState.challenge03Instance!.owner,
        ),
      ),
    solveChallenge03: (options: SolveOptions = defaultSolveOptions) =>
      executeAndRefresh("Submit Fake Owner solve", () =>
        solveChallenge03Transaction(packageId, chainState.progress!.objectId, chainState.challenge03Instance!.objectId, options),
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
    solveChallenge04: (options: SolveOptions = defaultSolveOptions) =>
      executeAndRefresh("Submit Leaky Capability solve", () =>
        solveChallenge04Transaction(packageId, chainState.progress!.objectId, chainState.challenge04Instance!.objectId, options),
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
    solveChallenge05: (options: SolveOptions = defaultSolveOptions) =>
      executeAndRefresh("Submit Bad Init solve", () =>
        solveChallenge05Transaction(packageId, chainState.progress!.objectId, chainState.challenge05Instance!.objectId, options),
      ),
    claimChallenge06: () =>
      executeAndRefresh("Claim Price Rounding", () => claimChallenge06Transaction(packageId, chainState.progress!.objectId)),
    exploitChallenge06: (repeats = 10, payment = 1) =>
      executeAndRefresh("Run rounded buys", () =>
        exploitChallenge06Transaction(packageId, chainState.challenge06Instance!.objectId, repeats, payment),
      ),
    solveChallenge06: (options: SolveOptions = defaultSolveOptions) =>
      executeAndRefresh("Submit Price Rounding solve", () =>
        solveChallenge06Transaction(packageId, chainState.progress!.objectId, chainState.challenge06Instance!.objectId, options),
      ),
    claimChallenge07: () =>
      executeAndRefresh("Claim Overflow Guard", () =>
        claimSimpleChallengeTransaction(packageId, "challenge_07_overflow_guard", chainState.progress!.objectId),
      ),
    exploitChallenge07: (value = 1_000) =>
      executeAndRefresh("Run guarded value call", () =>
        exploitChallenge07Transaction(packageId, chainState.challenge07Instance!.objectId, value),
      ),
    solveChallenge07: (options: SolveOptions = defaultSolveOptions) =>
      executeAndRefresh("Submit Overflow Guard solve", () =>
        solveSimpleChallengeTransaction(
          packageId,
          "challenge_07_overflow_guard",
          chainState.progress!.objectId,
          chainState.challenge07Instance!.objectId,
          options,
        ),
      ),
    claimChallenge08: () =>
      executeAndRefresh("Claim Old Package Trap", () =>
        claimSimpleChallengeTransaction(packageId, "challenge_08_old_package_trap", chainState.progress!.objectId),
      ),
    exploitChallenge08: (path: PracticeDefaults["oldPath"] = "old") =>
      executeAndRefresh("Use old package path", () =>
        exploitChallenge08Transaction(packageId, chainState.challenge08Instance!.objectId, path),
      ),
    solveChallenge08: (options: SolveOptions = defaultSolveOptions) =>
      executeAndRefresh("Submit Old Package Trap solve", () =>
        solveSimpleChallengeTransaction(
          packageId,
          "challenge_08_old_package_trap",
          chainState.progress!.objectId,
          chainState.challenge08Instance!.objectId,
          options,
        ),
      ),
    claimChallenge09: () =>
      executeAndRefresh("Claim PTB Combo", () =>
        claimSimpleChallengeTransaction(packageId, "challenge_09_ptb_combo", chainState.progress!.objectId),
      ),
    exploitChallenge09: () =>
      executeAndRefresh("Run PTB combo", () =>
        exploitChallenge09Transaction(packageId, chainState.challenge09Instance!.objectId),
      ),
    solveChallenge09: (options: SolveOptions = defaultSolveOptions) =>
      executeAndRefresh("Submit PTB Combo solve", () =>
        solveSimpleChallengeTransaction(
          packageId,
          "challenge_09_ptb_combo",
          chainState.progress!.objectId,
          chainState.challenge09Instance!.objectId,
          options,
        ),
      ),
    claimChallenge10: () =>
      executeAndRefresh("Claim Mini AMM Incident", () =>
        claimSimpleChallengeTransaction(packageId, "challenge_10_mini_amm_incident", chainState.progress!.objectId),
      ),
    exploitChallenge10: (amount = 100) =>
      executeAndRefresh("Run AMM swap", () =>
        exploitChallenge10Transaction(packageId, chainState.challenge10Instance!.objectId, amount),
      ),
    solveChallenge10: (options: SolveOptions = defaultSolveOptions) =>
      executeAndRefresh("Submit Mini AMM solve", () =>
        solveSimpleChallengeTransaction(
          packageId,
          "challenge_10_mini_amm_incident",
          chainState.progress!.objectId,
          chainState.challenge10Instance!.objectId,
          options,
        ),
      ),
  };
}
