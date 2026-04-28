# Fix: Fake Owner

The contract should not trust a user-provided address for authorization.

Use `tx_context::sender(ctx)` inside the privileged function and compare it with the stored owner:

```move
assert!(tx_context::sender(ctx) == instance.owner, ENotOwner);
```

For higher-value admin actions, prefer capability objects such as `AdminCap` or scoped permission objects. A capability proves authority through ownership of an object, while a raw address parameter proves nothing.

Safe patterns:

- Check the real transaction sender for owner-only actions.
- Use capability ownership for admin-only actions.
- Keep vulnerable helper functions package-private unless they are intentionally public.
- Add negative tests where a non-owner attempts the privileged path.

