# Challenge 12: Shared Object Pollution

Status: coming soon.

This challenge is reserved for a future shared-object isolation module.

## Practice Goal

Find how one user's call can pollute shared state used by another user's instance.

## Audit Questions

- Is per-user state isolated?
- Does shared state record the caller or an instance id?
- Can one wallet influence another wallet's solve condition?
