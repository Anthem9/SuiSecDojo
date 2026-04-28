import { describe, expect, it } from "vitest";
import { readableTxError, txStatusDigest, txStatusMessage } from "./txStatus";

describe("transaction status", () => {
  it("should produce readable status messages and digest links", () => {
    expect(txStatusMessage({ kind: "idle" })).toContain("Connect a wallet");
    expect(txStatusMessage({ kind: "awaiting-signature", label: "Claim" })).toContain("wallet approval");
    expect(txStatusDigest({ kind: "confirmed", label: "Claim", digest: "abc" })).toBe("abc");
    expect(txStatusDigest({ kind: "failed", label: "Claim", message: "nope" })).toBeUndefined();
  });

  it("should extract useful transaction failure messages", () => {
    expect(readableTxError(new Error("MoveAbort in command 0"))).toBe("MoveAbort in command 0");
    expect(readableTxError(new Error("InsufficientGas"))).toBe("Insufficient balance for gas or required assets.");
  });
});

