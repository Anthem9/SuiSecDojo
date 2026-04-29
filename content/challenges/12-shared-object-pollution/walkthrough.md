# Walkthrough: Shared Object Pollution

1. Claim Challenge 12.
2. Observe `pollution_count`.
3. Call `vulnerable_pollute`.
4. Confirm the count increased.
5. Submit solve.

The issue is not the counter itself; it is the absence of a binding between mutation authority and the state being changed.
