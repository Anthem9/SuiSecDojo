# Package Upgrade Footgun

## Background

Move package upgrades can improve new code while old entry points or old initialization assumptions remain part of the deployed surface.

## Vulnerability Pattern

The visible path is fixed, but a legacy entry still mutates the same state or a public setup path can create authority after deployment.

## Simplified Model

The dojo version models old and new paths inside a small package so learners can inspect the difference without copying a production protocol.

## Root Cause

Upgrade planning focused on the replacement function, not the full public API and historical object graph.

## Fix Strategy

Inventory every public entry before upgrade, disable deprecated state transitions, and write tests that call the old path directly.

## Audit Checklist

- Are deprecated entries still callable?
- Can initialization be repeated or simulated after deployment?
- Do old objects still satisfy new authority checks?

## Related Challenges

- Challenge 05: Bad Init
- Challenge 08: Old Package Trap
