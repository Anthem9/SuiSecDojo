# Challenge 08: Old Package Trap

## Background

Upgrades and fixes can leave older entry points available. A fixed new path does not help if a deprecated path still mutates protected state.

## Vulnerability

The new checked path rejects the operation, but the old path is still callable and sets `legacy_flag`.

## Goal

Claim an instance, use the old vulnerable path, then solve.

## Objects

- `ChallengeInstance`: owned object with `legacy_flag` and `solved` fields.
