# Tutor Mode: Delegated Capability Abuse

## Concept

Delegated capabilities need a narrow scope.

## Direction

Inspect how scope `0` is interpreted.

## Checklist

- Is the cap tied to the instance?
- Is universal scope guarded?
- Which object id does the cap authorize?

## Answer

Mint the delegated cap, call `privileged_set_flag`, then solve.
