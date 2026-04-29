# Challenge 08: Old Package Trap

## Background

Upgrades and fixes can leave older entry points available. A fixed new path does not help if a deprecated path still mutates protected state.

## Vulnerability

The new checked path rejects the operation, but the old path is still callable and sets `legacy_flag`.

## Goal

Claim an instance, use the old vulnerable path, then solve.

## Objects

- `ChallengeInstance`: owned object with `legacy_flag` and `solved` fields.

## Challenge Mode / CLI/PTB Practice

The default learning path is Challenge Mode. Inspect the package, claimed instance, and entry signatures before sending the exploit transaction. You may use the web form, Sui CLI, or a manually constructed PTB.

When calling `solve`, pass two scoring arguments after the normal object arguments:

- `mode`: `1` for Challenge Mode, `2` for Guided Mode.
- `assistance_level`: `0` no hint, `1` concept hint, `2` direction hint, `3` checklist hint, `4` answer viewed.

Use fewer hints for a higher score. Viewing the practice answer still lets you finish the on-chain challenge, but records a zero score for this learning attempt.
