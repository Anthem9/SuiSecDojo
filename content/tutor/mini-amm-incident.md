# Tutor Mode: Mini AMM Incident

## Concept

AMM reserve updates must preserve the intended invariant.

## Direction

Inspect when output is computed relative to reserve updates.

## Checklist

- Is output computed from stale reserves?
- Can reserve Y be drained?
- Does solve require invariant break and profit?
