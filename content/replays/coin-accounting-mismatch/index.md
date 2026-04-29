# Coin Accounting Mismatch

## Background

Protocols often track both real coin balances and internal credits, shares, or reserves.

## Vulnerability Pattern

One path updates the internal ledger differently from the actual coin movement, letting balances drift.

## Simplified Model

The dojo version reduces this to small counters so learners can reason about state deltas before studying larger DeFi systems.

## Root Cause

The implementation treats accounting variables as summaries but does not reconcile them after every mutation.

## Fix Strategy

Update coin movement and internal accounting in one audited block, test edge values, and assert core invariants after mutations.

## Audit Checklist

- Does every coin transfer update the corresponding internal ledger?
- Are rounding direction and remainder handling explicit?
- Do tests compare before/after deltas for both coin and accounting state?

## Related Challenges

- Challenge 06: Price Rounding
- Challenge 10: Mini AMM Incident
