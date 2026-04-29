# Scallop Deprecated Rewards Contract Exploit

## Background

On 2026-04-26, public reports described an exploit against a deprecated Scallop rewards-side contract tied to sSUI incentives. The reports say core lending markets and user deposits were not affected.

## Timeline

- 2026-04-26: attack targeted a deprecated rewards component.
- 2026-04-26: affected contracts were reportedly frozen and core protocol activity resumed.

## Root Cause Pattern

Deprecated contracts can remain callable. If old reward logic, package versions, or admin paths are not disabled, they remain part of the attack surface.

## Security Lesson

Upgrade plans must include old-package inventory, reachable entry-point review, incentive contract decommissioning, and regression tests for obsolete flows.

## Related Dojo Practice

- Challenge 05: Bad Init
- Challenge 08: Old Package Trap
- Challenge 19: Upgrade Witness Gap

