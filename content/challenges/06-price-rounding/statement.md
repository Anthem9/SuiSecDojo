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

## Challenge Mode / CLI/PTB Practice

The default learning path is Challenge Mode. Inspect the package, claimed instance, and entry signatures before sending the exploit transaction. You may use the web form, Sui CLI, or a manually constructed PTB.

When calling `solve`, pass two scoring arguments after the normal object arguments:

- `mode`: `1` for Challenge Mode, `2` for Guided Mode.
- `assistance_level`: `0` no hint, `1` concept hint, `2` direction hint, `3` checklist hint, `4` answer viewed.

Use fewer hints for a higher score. Viewing the practice answer still lets you finish the on-chain challenge, but records a zero score for this learning attempt.
