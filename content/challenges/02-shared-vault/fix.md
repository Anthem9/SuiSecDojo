# Fix Notes: Shared Vault

## Root Cause

The withdraw entry trusts the shared object state but never enforces who is allowed to mutate it.

## Safer Patterns

- Compare `tx_context::sender(ctx)` with the vault owner before withdrawing.
- Prefer capability objects when multiple authorized operators are expected.
- Keep public shared-object entries small and explicit.
- Add negative tests where a non-owner attempts each privileged action.

## Minimal Repair

```move
public entry fun withdraw(vault: &mut SharedVault, amount: u64, ctx: &TxContext) {
    assert!(tx_context::sender(ctx) == vault.owner, ENotOwner);
    assert!(vault.balance >= amount, EInsufficientBalance);
    vault.balance = vault.balance - amount;
}
```

For production vaults, also consider event emission, withdrawal limits, and clear separation between
admin operations and user operations.
