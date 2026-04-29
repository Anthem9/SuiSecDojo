# Challenge 01: Anyone Can Mint

## Background

Many Sui Move protocols expose mint-style operations for rewards, internal accounting,
test assets, or receipt objects. Those paths must be protected by a capability object
or a strict owner check. In this challenge, the mint path is deliberately left open.

The instance object is owned by your wallet. Your progress object records whether you
claimed and completed this challenge.

## Vulnerability

`vulnerable_mint(instance, amount)` increases `minted_amount` without requiring an
`AdminCap`, `TreasuryCap`, or sender ownership check. Any caller who can pass the
instance object can inflate the amount.

## Goal

Create at least `1_000` units in your challenge instance, then call `solve`.

## Steps

1. Connect a Sui testnet wallet.
2. Create a `UserProgress` object if you do not already have one.
3. Claim your Challenge 01 instance.
4. Execute the vulnerable mint path with amount `1_000`.
5. Call `solve` with your instance and progress object.

The frontend combines steps 4 and 5 into one transaction.

## Chain Objects

- `UserProgress`: owned by your address and stores claimed/completed challenge ids.
- `ChallengeInstance`: owned by your address and stores `minted_amount` plus `solved`.

## Security Lesson

Mint authority must be guarded by a capability such as `TreasuryCap` or a dedicated `AdminCap`.

## Challenge Mode / CLI/PTB Practice

The default learning path is Challenge Mode. Inspect the package, claimed instance, and entry signatures before sending the exploit transaction. You may use the web form, Sui CLI, or a manually constructed PTB.

When calling `solve`, pass two scoring arguments after the normal object arguments:

- `mode`: `1` for Challenge Mode, `2` for Guided Mode.
- `assistance_level`: `0` no hint, `1` concept hint, `2` direction hint, `3` checklist hint, `4` answer viewed.

Use fewer hints for a higher score. Viewing the practice answer still lets you finish the on-chain challenge, but records a zero score for this learning attempt.
