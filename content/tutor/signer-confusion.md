# Tutor Mode: Signer Confusion

## Concept

A caller-supplied address is not the transaction signer.

## Direction

Compare the `claimed_signer` argument with `tx_context::sender`.

## Checklist

- Is `claimed_signer` trusted?
- Does the entry derive authority from `ctx`?
- Which address must match the owner?

## Answer

Pass the instance owner as `claimed_signer`, then solve.
