# Checklist: Signer Confusion

- [ ] Does authorization derive from `tx_context::sender`?
- [ ] Are caller-supplied addresses treated as untrusted?
- [ ] Are owner, sender, and delegate roles separate?
- [ ] Are forged owner parameter tests present?
