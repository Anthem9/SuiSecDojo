# Shared Object Authorization Drift

## Background

Shared objects are powerful because many users can access the same object, but that also makes every mutation path security-sensitive.

## Vulnerability Pattern

State that originally belonged to one owner becomes reachable through shared access without adding sender or capability checks.

## Simplified Model

The dojo examples keep the object small and focus on whether the caller is allowed to mutate the selected state.

## Root Cause

The contract preserves an `owner` field but forgets to enforce it on later public entries.

## Fix Strategy

Check `tx_context::sender`, require a capability, or redesign the object so shared paths cannot mutate owner-only state.

## Audit Checklist

- Does every shared object mutation define who may call it?
- Are owner fields enforced, not just stored?
- Can a second wallet affect another learner's instance?

## Related Challenges

- Challenge 02: Shared Vault
- Challenge 03: Fake Owner
