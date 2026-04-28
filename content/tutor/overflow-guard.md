# Tutor Mode: Overflow Guard

## Concept

Guards must validate the incoming value, not only the previous state.

## Direction

Look for a check that reads old state before assigning attacker-controlled input.

## Checklist

- What value is checked?
- What value is written?
- Can the written value exceed the solve threshold?

