# PTB Atomicity Bypass

## Background

Programmable Transaction Blocks let users compose several Move calls in one transaction.

## Vulnerability Pattern

A contract assumes two actions happen in separate transactions, but a learner combines them atomically and reaches an impossible intermediate state.

## Simplified Model

The dojo pattern uses a setup call and finish call that become dangerous only when ordered inside the same PTB.

## Root Cause

The invariant describes user workflow rather than transaction-level state transitions.

## Fix Strategy

Treat all public entries as composable, store explicit phase state, and test same-transaction call combinations.

## Audit Checklist

- Can setup and finalize be called in one PTB?
- Are temporary objects consumed in the intended order?
- Does the invariant hold after every public call, not only after user workflows?

## Related Challenges

- Challenge 09: PTB Combo
