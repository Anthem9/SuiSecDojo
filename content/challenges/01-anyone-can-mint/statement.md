# Challenge 01: Anyone Can Mint

## Background

The vulnerable module exposes a mint-like entry without checking an admin capability.

## Goal

Create at least `1_000` units in your challenge instance, then call `solve`.

## Security Lesson

Mint authority must be guarded by a capability such as `TreasuryCap` or a dedicated `AdminCap`.

