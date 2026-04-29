# Sui Mainnet Outage

## Background

On 2024-11-21, Sui Mainnet stopped processing transactions for roughly two and a half hours. The public postmortem attributes the halt to validator crash loops triggered by a congestion-control edge case.

## Timeline

- 01:15 PT: mainnet halt began.
- 03:45 PT: validators had deployed the fix and transaction processing resumed.

## Root Cause Pattern

The bug involved an assertion in scheduling / congestion-control logic. A rare transaction shape could produce an estimated execution cost of zero, causing validators to crash instead of safely handling the edge case.

## Security Lesson

Availability bugs are security-relevant. Shared-object scheduling, gas accounting, and validator release workflows need edge-case tests and fast rollback paths.

## Related Dojo Practice

- Challenge 09: PTB Combo
- Challenge 16: Signer Confusion
- Challenge 18: Epoch Reward Drift

