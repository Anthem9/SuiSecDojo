# Challenge 10: Mini AMM Incident

## Background

AMM logic depends on reserve accounting and invariant preservation. Bad update order can create abnormal output.

## Vulnerability

The simplified swap computes output from stale reserves and allows a large input to drain reserve `y`, breaking the invariant.

## Goal

Claim an instance, perform the vulnerable swap, then solve after the invariant is broken.

## Objects

- `ChallengeInstance`: owned object with reserves, attacker profit, invariant status, and solved state.

## Challenge Mode / CLI/PTB Practice

The default learning path is Challenge Mode. Inspect the package, claimed instance, and entry signatures before sending the exploit transaction. You may use the web form, Sui CLI, or a manually constructed PTB.

When calling `solve`, pass two scoring arguments after the normal object arguments:

- `mode`: `1` for Challenge Mode, `2` for Guided Mode.
- `assistance_level`: `0` no hint, `1` concept hint, `2` direction hint, `3` checklist hint, `4` answer viewed.

Use fewer hints for a higher score. Viewing the practice answer still lets you finish the on-chain challenge, but records a zero score for this learning attempt.
