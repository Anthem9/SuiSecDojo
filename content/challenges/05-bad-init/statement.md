# Challenge 05: Bad Init

## Background

Initialization code often creates the first privileged objects in a Sui Move package. If that path is exposed too broadly, a normal user can create authority that should only exist during setup.

## Vulnerability

This challenge intentionally exposes an admin capability creation function after the instance has already been claimed. Any caller can create an instance-scoped `AdminCap` and use it to set protected initialization state.

## Goal

Create the bad initialization admin capability, use it to set the protected state, then solve the challenge.

## Steps

1. Create a `UserProgress` object if needed.
2. Claim a Challenge 05 instance.
3. Call the vulnerable admin capability creation entry.
4. Use the capability to set `initialized = true`.
5. Solve the challenge.

## Objects

- `ChallengeInstance`: owned object with `admin_cap_created`, `initialized`, and `solved` fields.
- `AdminCap`: owned capability object scoped to one challenge instance.
