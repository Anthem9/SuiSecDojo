# Fix: Liquidation Edge Case

- Use fixed-point precision with documented rounding direction.
- Test exact-threshold, just-below, and just-above cases.
- Separate oracle price scaling from liquidation threshold scaling.
- Avoid truncation when the protocol needs conservative comparison.
