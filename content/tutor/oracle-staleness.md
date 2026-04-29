# Tutor Mode: Oracle Staleness

## Concept

Freshness metadata must belong to the exact price that is consumed.

## Direction

Compare `checked_epoch` and `price_epoch`.

## Checklist

- Which epoch is checked?
- Which epoch is stored?
- Is the consumed price stale?

## Answer

Use `checked_epoch = 10` and `price_epoch = 1`, then solve.
