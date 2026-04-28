# Challenge 06: Price Rounding

## Background

DeFi contracts often convert payments into shares, credits, or balances. The rounding direction matters: a small arithmetic shortcut can turn many tiny actions into more value than a single equivalent action.

## Vulnerability

This challenge intentionally rounds every buy upward. A payment of `1` receives one full credit even though the configured price is `10` per credit.

## Goal

Use repeated tiny buys to reach `10` credits while paying only `10` total units, then solve the challenge.

## Steps

1. Create a `UserProgress` object if needed.
2. Claim a Challenge 06 instance.
3. Execute the vulnerable tiny-buy path.
4. Confirm credits reached the solve threshold.
5. Solve the challenge.

## Objects

- `ChallengeInstance`: owned object with `paid_amount`, `credits`, and `solved` fields.
