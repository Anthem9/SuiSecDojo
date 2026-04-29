# Challenge 04: Leaky Capability

## Background

Sui Move often uses capability objects to represent privileged authority. A function can require an `AdminCap` instead of trusting an address parameter.

## Vulnerability

This challenge intentionally exposes a public entry that lets any caller claim the admin capability for their instance. Once the capability is leaked, the caller can execute an admin-only state transition.

## Goal

Claim the leaked admin capability, use it to set the protected admin flag, then solve the challenge.

## Steps

1. Create a `UserProgress` object if needed.
2. Claim a Challenge 04 instance.
3. Claim the leaked `AdminCap`.
4. Use the capability to set the admin flag.
5. Solve the challenge.

## Objects

- `ChallengeInstance`: owned object with `cap_claimed`, `admin_flag`, and `solved` fields.
- `AdminCap`: owned capability object scoped to one challenge instance.


## Challenge Mode / CLI/PTB Practice

The default learning path is Challenge Mode. Inspect the package, claimed instance, and entry signatures before sending the exploit transaction. You may use the web form, Sui CLI, or a manually constructed PTB.

When calling `solve`, pass two scoring arguments after the normal object arguments:

- `mode`: `1` for Challenge Mode, `2` for Guided Mode.
- `assistance_level`: `0` no hint, `1` concept hint, `2` direction hint, `3` checklist hint, `4` answer viewed.

Use fewer hints for a higher score. Viewing the practice answer still lets you finish the on-chain challenge, but records a zero score for this learning attempt.
