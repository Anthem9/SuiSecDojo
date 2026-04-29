# Challenge 09: PTB Combo

## Background

Programmable Transaction Blocks can compose multiple calls atomically. Contracts should not assume related actions happen in separate transactions.

## Vulnerability

The challenge exposes a short-lived combo token. It cannot be stored, but it can be produced and consumed in the same PTB.

## Goal

Claim an instance, run the prepare and finish calls in one PTB, then solve.

## Objects

- `ChallengeInstance`: owned object with `combo_ready` and `solved` fields.

## Challenge Mode / CLI/PTB Practice

The default learning path is Challenge Mode. Inspect the package, claimed instance, and entry signatures before sending the exploit transaction. You may use the web form, Sui CLI, or a manually constructed PTB.

When calling `solve`, pass two scoring arguments after the normal object arguments:

- `mode`: `1` for Challenge Mode, `2` for Guided Mode.
- `assistance_level`: `0` no hint, `1` concept hint, `2` direction hint, `3` checklist hint, `4` answer viewed.

Use fewer hints for a higher score. Viewing the practice answer still lets you finish the on-chain challenge, but records a zero score for this learning attempt.
