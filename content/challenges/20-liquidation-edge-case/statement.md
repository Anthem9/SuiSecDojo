# Challenge 20: Liquidation Edge Case

## Background

Liquidation checks often compare a health factor against a threshold. Integer math near that boundary can flip the result.

## Vulnerability

`vulnerable_liquidate(instance, price, threshold)` computes health with coarse integer division and liquidates when the rounded result is below threshold.

## Goal

Claim an instance, choose edge values that make health fall below threshold, then submit solve.

## CLI / PTB Practice

```bash
sui client call --package <PACKAGE_ID> --module challenge_20_liquidation_edge_case --function vulnerable_liquidate --args <INSTANCE_ID> <PRICE> <THRESHOLD>
sui client call --package <PACKAGE_ID> --module challenge_20_liquidation_edge_case --function solve --args <INSTANCE_ID> <PROGRESS_ID> <MODE_CODE> <ASSISTANCE_LEVEL>
```

## Security Lesson

Liquidation math needs explicit precision, rounding direction, and edge tests.
