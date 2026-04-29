# Challenge 07: Overflow Guard

## Background

Boundary checks must validate the value that will be written, not only the value that already exists.

## Vulnerability

The challenge guard checks the old `guarded_value` before assigning the new input. A caller can pass a value far above the intended safe range.

## Goal

Claim an instance, bypass the wrong guard by setting a large value, then solve.

## Objects

- `ChallengeInstance`: owned object with `guarded_value` and `solved` fields.

## Challenge Mode / CLI/PTB Practice

The default learning path is Challenge Mode. Inspect the package, claimed instance, and entry signatures before sending the exploit transaction. You may use the web form, Sui CLI, or a manually constructed PTB.

When calling `solve`, pass two scoring arguments after the normal object arguments:

- `mode`: `1` for Challenge Mode, `2` for Guided Mode.
- `assistance_level`: `0` no hint, `1` concept hint, `2` direction hint, `3` checklist hint, `4` answer viewed.

Use fewer hints for a higher score. Viewing the practice answer still lets you finish the on-chain challenge, but records a zero score for this learning attempt.
