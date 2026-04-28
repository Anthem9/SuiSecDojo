# Tutor Mode: Shared Vault

## Concept

Shared objects need explicit authorization for every privileged mutation.

## Direction

Inspect whether withdraw checks the vault owner before reducing balance.

## Checklist

- Is the stored owner compared with sender?
- Can a non-owner mutate balance?
- Is the vault bound to the instance?

