# Oracle Staleness

## Background

Price oracles are useful only when the consumed value is fresh enough for the protocol decision.

## Vulnerability Pattern

The contract checks a timestamp or epoch, but the checked freshness is not bound to the price actually used.

## Simplified Model

The planned dojo challenge will model a stale price record and a boundary check that trusts the wrong field.

## Root Cause

Freshness and value identity are validated separately, so an old value can pass through a new-looking wrapper.

## Fix Strategy

Bind value, source, epoch, and timestamp into the same verified object, then reject stale or mismatched records.

## Audit Checklist

- Is the consumed price the same value whose freshness was checked?
- Are epoch and timestamp assumptions explicit?
- Are stale, future, and mismatched-source records tested?

## Related Challenges

- Challenge 14: Oracle Staleness
- Challenge 20: Liquidation Edge Case
