# Fix: Epoch Reward Drift

- Advance `last_epoch` after accrual.
- Reject repeated accrual for the same interval.
- Use checked arithmetic around epoch deltas.
- Test zero repeats, stale epochs, and repeated calls.
