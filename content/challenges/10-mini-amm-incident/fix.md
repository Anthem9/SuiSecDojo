# Fix: Mini AMM Incident

AMM math should preserve the intended invariant across every state transition.

Safer patterns:

- Compute output with the correct reserve update order.
- Enforce slippage and liquidity bounds.
- Test invariant preservation after swaps.
- Test edge cases where input approaches reserve size.
