# Walkthrough: Oracle Staleness

1. Claim Challenge 14.
2. Call `vulnerable_use_price` with `checked_epoch >= 10`.
3. Use a lower `price_epoch`.
4. Confirm `stale_price_used = true`.
5. Submit solve.
