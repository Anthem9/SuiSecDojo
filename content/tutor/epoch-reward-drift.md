# Tutor Mode: Epoch Reward Drift

## Concept

Reward accrual must advance its checkpoint.

## Direction

Look for reward growth without updating `last_epoch`.

## Checklist

- Is `last_epoch` advanced?
- Can repeated accrual count the same delta?
- What reward threshold does solve require?

## Answer

Use observed epoch `4` and repeats `6`, then solve.
