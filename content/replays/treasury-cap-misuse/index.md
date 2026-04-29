# TreasuryCap Misuse

## Background

Many Move systems separate asset minting from ordinary user actions through a `TreasuryCap` or a dedicated admin capability.

## Vulnerability Pattern

A convenience entry exposes mint-like behavior without proving that the caller owns the authority object.

## Simplified Model

The training model treats the mint authority as a threshold-changing function. The unsafe path is intentionally small so the audit focus stays on capability checks.

## Root Cause

The state mutation is protected by intent in the developer's mind, not by a capability argument or sender ownership check.

## Fix Strategy

Require a capability object for minting, keep the capability in controlled custody, and add negative tests for ordinary users.

## Audit Checklist

- Does every mint path require a capability?
- Is the capability transferred only during initialization or explicit admin rotation?
- Are public entry functions reviewed for authority-changing effects?

## Related Challenges

- Challenge 01: Anyone Can Mint
