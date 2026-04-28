# Fix: Price Rounding

Rounding rules must match the economic invariant of the protocol.

Safer patterns:

- Round in favor of the protocol when minting shares or credits.
- Accumulate payment first, then convert at a stable precision.
- Use fixed-point scaling for fractional prices.
- Reject dust payments when the result would be zero.
- Test small repeated operations against one equivalent aggregate operation.
- Add boundary tests around `price - 1`, `price`, and `price + 1`.

This challenge is a simplified education model and does not reproduce a real AMM or lending market.
