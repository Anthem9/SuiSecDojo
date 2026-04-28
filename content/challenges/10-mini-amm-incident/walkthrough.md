# Walkthrough: Mini AMM Incident

The instance starts with reserves `100 / 100`.

Calling the vulnerable swap with input `100` computes output from stale reserves and drains too much `y`.

Solve succeeds when the invariant is broken and attacker profit reaches the threshold.
