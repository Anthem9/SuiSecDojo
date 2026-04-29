# Walkthrough: Object Transfer Trap

1. Claim Challenge 11 to create a wallet-owned instance.
2. Inspect `owner` and `custodian`.
3. Call `vulnerable_accept_custody`.
4. Verify `custodian == owner`.
5. Submit solve with your progress object.

The vulnerable call is intentionally small: it shows how a helper can mutate custody without checking the original authority boundary.
