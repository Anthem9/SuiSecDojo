# AMM Math Error Replay

## Background

Automated market makers depend on reserve accounting, invariant checks, and rounding rules. A small ordering mistake can turn a harmless swap into an inconsistent state transition.

## Vulnerability Pattern

The simplified pattern is:

- compute output before applying the input reserve update;
- round in the direction that favors the caller;
- update one reserve without preserving the intended invariant;
- validate only the final flag instead of the transition.

## Simplified Model

This replay maps to Challenge 06 and Challenge 10. Challenge 06 isolates precision loss from repeated small purchases. Challenge 10 isolates an AMM reserve update that can break the invariant and produce abnormal profit.

## Root Cause

The root cause is not a single arithmetic operator. It is a missing state-transition proof: every reserve and credit update must be checked against the invariant that the protocol claims to maintain.

## Fix Strategy

- Define the invariant before writing the swap or pricing code.
- Apply reserve updates in the intended order.
- Use explicit rounding direction and test both sides of every boundary.
- Add negative tests for repeated small operations and maximum-size inputs.

## Audit Checklist

- Does every arithmetic path specify rounding direction?
- Are reserves updated before dependent output calculations when required?
- Is the invariant checked after every state transition?
- Are repeated small operations tested?
- Are boundary values tested near zero, one unit, and maximum values?

## Related Challenges

- Challenge 06: Price Rounding
- Challenge 10: Mini AMM Incident

This replay is a minimized education model. It does not reproduce a real protocol or provide instructions for attacking real assets.
