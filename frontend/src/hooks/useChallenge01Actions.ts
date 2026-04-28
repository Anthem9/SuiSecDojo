import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import type { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import type { ChainChallengeState } from "../lib/chainState";
import {
  claimChallenge01Transaction,
  createProgressTransaction,
  solveChallenge01Transaction,
} from "../lib/transactions";

type RefetchObjects = () => Promise<unknown>;

export function useChallenge01Actions(packageId: string, chainState: ChainChallengeState, refetchObjects: RefetchObjects) {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const signAndExecute = useSignAndExecuteTransaction();
  const [statusMessage, setStatusMessage] = useState("Connect a wallet to start the on-chain dojo flow.");
  const [lastDigest, setLastDigest] = useState<string>();

  async function executeAndRefresh(label: string, transactionFactory: () => Transaction) {
    if (!account) {
      setStatusMessage("Connect a wallet before sending a transaction.");
      return;
    }

    try {
      setStatusMessage(`${label} transaction is waiting for wallet approval...`);
      const result = await signAndExecute.mutateAsync({
        transaction: transactionFactory(),
      });
      setLastDigest(result.digest);
      setStatusMessage(`${label} transaction submitted. Waiting for finality...`);
      await client.waitForTransaction({ digest: result.digest });
      await refetchObjects();
      setStatusMessage(`${label} completed on testnet.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : `${label} failed.`);
    }
  }

  return {
    isPending: signAndExecute.isPending,
    lastDigest,
    statusMessage,
    createProgress: () => executeAndRefresh("Create progress", () => createProgressTransaction(packageId)),
    claimInstance: () =>
      executeAndRefresh("Claim instance", () => claimChallenge01Transaction(packageId, chainState.progress!.objectId)),
    solveChallenge: () =>
      executeAndRefresh("Solve challenge", () =>
        solveChallenge01Transaction(packageId, chainState.progress!.objectId, chainState.challenge01Instance!.objectId),
      ),
  };
}
