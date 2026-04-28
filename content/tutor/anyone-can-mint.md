# Tutor Mode: Anyone Can Mint

## Concept

Mint authority should be represented by a capability such as `TreasuryCap` or an admin capability.

## Direction

Look for an entry function that changes minted amount without checking who called it.

## Checklist

- Is there a capability argument?
- Is `tx_context::sender` checked?
- Does solve require a threshold?

