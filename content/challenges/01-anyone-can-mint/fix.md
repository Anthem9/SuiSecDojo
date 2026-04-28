# Fix Notes: Anyone Can Mint

## Root Cause

The mint path changes supply-like state without proving that the caller has mint
authority.

## Safer Patterns

Use one of these patterns before mutating mint-sensitive state:

- Require an `AdminCap` owned by the authorized operator.
- Require a `TreasuryCap<T>` when minting a real coin type.
- Keep helper functions `public(package)` when they should only be called by trusted
  modules in the same package.
- Add negative tests showing ordinary users cannot mint.

## Visibility Guidance

`public entry` functions are directly callable from transactions. Treat them as part
of the external attack surface.

`public(package)` limits calls to modules in the same package, but transaction entry
visibility and package design still need review. Do not rely on naming conventions as
authorization.

## Minimal Repair

A repaired version would require a capability argument:

```move
public struct AdminCap has key, store {
    id: UID,
}

public entry fun mint(_: &AdminCap, instance: &mut ChallengeInstance, amount: u64) {
    instance.minted_amount = instance.minted_amount + amount;
}
```

For real coin minting, use the framework coin APIs and protect the `TreasuryCap`.
