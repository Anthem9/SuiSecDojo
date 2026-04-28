# Challenge 09: PTB Combo

## Background

Programmable Transaction Blocks can compose multiple calls atomically. Contracts should not assume related actions happen in separate transactions.

## Vulnerability

The challenge exposes a short-lived combo token. It cannot be stored, but it can be produced and consumed in the same PTB.

## Goal

Claim an instance, run the prepare and finish calls in one PTB, then solve.

## Objects

- `ChallengeInstance`: owned object with `combo_ready` and `solved` fields.
