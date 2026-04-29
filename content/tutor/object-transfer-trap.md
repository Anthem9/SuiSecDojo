# Tutor Mode: Object Transfer Trap

## Concept

Ownership and custody fields are security boundaries, not just UI labels.

## Direction

Look for the helper that writes `custodian`.

## Checklist

- Does the helper check sender?
- Does the custodian match owner after the call?
- Can solve trust this changed state?

## Answer

Call `vulnerable_accept_custody`, then solve after custodian equals owner.
