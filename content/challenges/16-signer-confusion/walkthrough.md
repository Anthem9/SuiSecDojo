# Walkthrough: Signer Confusion

1. Claim Challenge 16.
2. Inspect the instance owner.
3. Call `vulnerable_accept_intent` with that owner address.
4. Confirm `intent_accepted = true`.
5. Submit solve.

The exploit path works because the function checks the argument, not the actual sender.
