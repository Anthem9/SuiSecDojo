# Walkthrough: Shared Vault

## Claiming

`claim(progress, ctx)` records challenge id `2`, creates a shared vault with balance `100`, and
transfers an owned `ChallengeInstance` to the learner. The instance stores the vault object id.

## Exploit

`vulnerable_withdraw(vault, amount)` only checks that the vault has enough balance. It does not check
that `tx_context::sender(ctx)` equals `vault.owner`, and it does not require a capability.

Because the vault is shared, any transaction can include it. Withdrawing `100` drains the vault.

## Solve

`solve(instance, vault, progress, ctx)` verifies:

- the sender owns the instance
- the instance points at the supplied vault
- the vault balance is `0`
- the instance is not already solved

After success, challenge id `2` is recorded in `completed_challenges`.
