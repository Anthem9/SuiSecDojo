# Challenge 07: Overflow Guard

## Background

Boundary checks must validate the value that will be written, not only the value that already exists.

## Vulnerability

The challenge guard checks the old `guarded_value` before assigning the new input. A caller can pass a value far above the intended safe range.

## Goal

Claim an instance, bypass the wrong guard by setting a large value, then solve.

## Objects

- `ChallengeInstance`: owned object with `guarded_value` and `solved` fields.
