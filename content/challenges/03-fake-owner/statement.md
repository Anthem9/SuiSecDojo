# Challenge 03: Fake Owner

## Background

Many Sui Move objects store an `owner` address to define who is allowed to mutate privileged state. The stored owner is only useful when the contract compares it against the transaction sender.

## Vulnerability

This challenge exposes a vulnerable entry that accepts `claimed_owner: address` and checks that parameter against the instance owner. It does not check `tx_context::sender(ctx)`.

Because the caller controls `claimed_owner`, an attacker can pass the real owner address and set restricted state.

## Goal

Set the restricted flag on your challenge instance, then call `solve` to record Challenge 03 in your `UserProgress`.

## Steps

1. Connect a Sui testnet wallet.
2. Create a `UserProgress` object if you do not already have one.
3. Claim a Challenge 03 instance.
4. Run the fake-owner exploit action.
5. Solve the challenge.

## Objects

- `UserProgress`: owned object that records claimed and completed challenge ids.
- `ChallengeInstance`: owned object with `owner`, `restricted_flag`, and `solved` fields.


## Challenge Mode / CLI/PTB Practice

The default learning path is Challenge Mode. Inspect the package, claimed instance, and entry signatures before sending the exploit transaction. You may use the web form, Sui CLI, or a manually constructed PTB.

When calling `solve`, pass two scoring arguments after the normal object arguments:

- `mode`: `1` for Challenge Mode, `2` for Guided Mode.
- `assistance_level`: `0` no hint, `1` concept hint, `2` direction hint, `3` checklist hint, `4` answer viewed.

Use fewer hints for a higher score. Viewing the practice answer still lets you finish the on-chain challenge, but records a zero score for this learning attempt.
