# Shared Object Pollution Replay

## Background

Shared objects are powerful because many users can access the same state. That also means every entry function touching shared state must define who is allowed to mutate it.

## Vulnerability Pattern

The simplified pattern is:

- shared object stores an owner field;
- withdraw or mutation entry does not check `tx_context::sender`;
- any caller can alter shared state;
- the solve condition only observes that the shared state changed.

## Simplified Model

This replay maps to Challenge 02. The challenge uses a shared vault with a simulated balance. The vulnerable withdraw path checks balance but does not enforce authorization.

## Root Cause

The root cause is confusing data ownership with authorization. Storing an owner field is not enough; every privileged mutation must compare the sender or require a capability.

## Fix Strategy

- Check `tx_context::sender(ctx)` before privileged shared-object mutation.
- Prefer capability-gated access for high-value operations.
- Keep shared object state transitions small and easy to test.
- Add tests where a non-owner attempts every privileged action.

## Audit Checklist

- Does every shared object mutation have an authorization rule?
- Is the stored owner actually checked?
- Can a non-owner withdraw, reset, or alter state?
- Are shared object IDs bound to the user's challenge instance?
- Are negative tests written for each privileged entry?

## Related Challenges

- Challenge 02: Shared Vault

This replay is a minimized education model. It does not reproduce a real protocol or provide instructions for attacking real assets.
