# Fix: Signer Confusion

- Use `tx_context::sender(ctx)` for signer checks.
- Treat address arguments as data, not proof of authority.
- Require a capability when an off-sender actor is allowed.
- Test forged address parameters.
