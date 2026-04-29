# Walkthrough: Epoch Reward Drift

1. Claim Challenge 18.
2. Observe `last_epoch = 0`.
3. Call `vulnerable_accrue` with a higher observed epoch and repeated accrual count.
4. Confirm rewards reach the solve threshold.
5. Submit solve.
