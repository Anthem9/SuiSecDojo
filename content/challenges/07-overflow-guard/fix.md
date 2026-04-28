# Fix: Overflow Guard

Validate the incoming value before writing it.

Safer patterns:

- Check `value < limit`, not only current state.
- Use explicit boundary tests for exact limits and large values.
- Keep arithmetic and state update order easy to audit.
