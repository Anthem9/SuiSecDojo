# Tutor Mode: Shared Object Pollution

## Concept

Shared state must be scoped to a validated actor or source.

## Direction

Find the entry that increments state without requiring a source proof.

## Checklist

- Is the counter per-user?
- Is a capability required?
- Does any caller mutate it?

## Answer

Call `vulnerable_pollute`, then solve once the pollution counter is positive.
