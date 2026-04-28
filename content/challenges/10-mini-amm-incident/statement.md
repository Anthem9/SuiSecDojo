# Challenge 10: Mini AMM Incident

## Background

AMM logic depends on reserve accounting and invariant preservation. Bad update order can create abnormal output.

## Vulnerability

The simplified swap computes output from stale reserves and allows a large input to drain reserve `y`, breaking the invariant.

## Goal

Claim an instance, perform the vulnerable swap, then solve after the invariant is broken.

## Objects

- `ChallengeInstance`: owned object with reserves, attacker profit, invariant status, and solved state.
