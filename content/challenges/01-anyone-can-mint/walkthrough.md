# Walkthrough: Anyone Can Mint

## Claiming an Instance

The `claim` entry takes your `UserProgress` object, records challenge id `1` as
claimed, and transfers a fresh `ChallengeInstance` to the transaction sender.

The instance starts with:

- `owner`: your wallet address
- `minted_amount`: `0`
- `solved`: `false`

## Why the Mint Works

The challenge module exposes `vulnerable_mint(instance, amount)` without checking a
capability. Because the caller only needs a mutable reference to their owned instance,
they can set `minted_amount` high enough to satisfy the solve threshold.

This is the intended vulnerability. It models a protocol that forgot to restrict who
can mint or credit supply.

## Solve Condition

`solve(instance, progress, ctx)` checks:

- the transaction sender owns the instance
- the instance is not already solved
- `minted_amount >= 1_000`

After those checks pass, the function marks the instance solved and records challenge
id `1` in `UserProgress.completed_challenges`.
