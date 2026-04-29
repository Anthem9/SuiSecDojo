# Challenge 18: Epoch Reward Drift

## Background

Reward accrual depends on committing the epoch boundary after accounting. If the boundary is sampled but not advanced, rewards can be accrued repeatedly.

## Vulnerability

`vulnerable_accrue(instance, observed_epoch, repeats)` adds rewards based on `observed_epoch - last_epoch` but does not update `last_epoch`.

## Goal

Claim an instance, accrue enough repeated rewards, then submit solve.

## CLI / PTB Practice

```bash
sui client call --package <PACKAGE_ID> --module challenge_18_epoch_reward_drift --function vulnerable_accrue --args <INSTANCE_ID> <OBSERVED_EPOCH> <REPEATS>
sui client call --package <PACKAGE_ID> --module challenge_18_epoch_reward_drift --function solve --args <INSTANCE_ID> <PROGRESS_ID> <MODE_CODE> <ASSISTANCE_LEVEL>
```

## Security Lesson

Update accrual checkpoints atomically with reward accounting.
