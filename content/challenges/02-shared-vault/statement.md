# Challenge 02: Shared Vault

## Background

Shared objects can be accessed by many users in Sui transactions. That makes them useful for
markets, pools, games, and vaults, but it also means every mutating entry must enforce its own
authorization rules.

## Vulnerability

The vault stores an `owner` field, but `vulnerable_withdraw(vault, amount)` never checks
`tx_context::sender`. Any user can drain the shared vault balance.

## Goal

Claim a Challenge 02 instance, drain its shared vault, then call `solve`.

## Steps

1. Create a `UserProgress` object if needed.
2. Claim the Shared Vault instance.
3. Call the vulnerable withdraw entry to reduce the vault balance to `0`.
4. Call `solve` with your instance, vault, and progress object.

## Chain Objects

- `ChallengeInstance`: owned by your address and stores the linked `vault_id`.
- `SharedVault`: shared object with `owner` and `balance`.
- `UserProgress`: records challenge id `2` when solved.

## Security Lesson

Shared object functions must check authorization explicitly. An `owner` field is only metadata until
the contract compares it with the transaction sender or a capability.

## Challenge Mode / CLI/PTB Practice

The default learning path is Challenge Mode. Inspect the package, claimed instance, and entry signatures before sending the exploit transaction. You may use the web form, Sui CLI, or a manually constructed PTB.

When calling `solve`, pass two scoring arguments after the normal object arguments:

- `mode`: `1` for Challenge Mode, `2` for Guided Mode.
- `assistance_level`: `0` no hint, `1` concept hint, `2` direction hint, `3` checklist hint, `4` answer viewed.

Use fewer hints for a higher score. Viewing the practice answer still lets you finish the on-chain challenge, but records a zero score for this learning attempt.
