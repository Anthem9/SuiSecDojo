# Checklist: Shared Vault

- Does every shared-object mutating entry check the sender or a capability?
- Is the `owner` field actually used for authorization?
- Can a non-owner withdraw, reset, pause, or modify restricted state?
- Are object id relationships checked before solving or transferring value?
- Do tests include non-owner negative cases?
- Do tests cover repeat solve and invalid preconditions?
