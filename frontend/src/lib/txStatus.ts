export type TxStatus =
  | { kind: "idle" }
  | { kind: "awaiting-signature"; label: string }
  | { kind: "submitted"; label: string; digest: string }
  | { kind: "confirmed"; label: string; digest: string }
  | { kind: "failed"; label: string; message: string };

export function txStatusMessage(status: TxStatus): string {
  switch (status.kind) {
    case "idle":
      return "Connect a wallet to start the on-chain dojo flow.";
    case "awaiting-signature":
      return `${status.label} transaction is waiting for wallet approval.`;
    case "submitted":
      return `${status.label} transaction submitted. Waiting for finality.`;
    case "confirmed":
      return `${status.label} completed on testnet.`;
    case "failed":
      return `${status.label} failed: ${status.message}`;
  }
}

export function txStatusDigest(status: TxStatus): string | undefined {
  return status.kind === "submitted" || status.kind === "confirmed" ? status.digest : undefined;
}

export function readableTxError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const abortMatch = message.match(/MoveAbort[^.\n,)]*|abort(?:ed)?[^.\n]*/i);
  if (abortMatch) return abortMatch[0].trim();
  if (message.toLowerCase().includes("insufficient")) return "Insufficient balance for gas or required assets.";
  return message || "Transaction failed.";
}
