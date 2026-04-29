# Challenge 13: Delegated Capability Abuse

Status: coming soon.

This challenge is reserved for a future capability delegation module.

## Practice Goal

Inspect whether a delegated capability is scoped to the resource it is supposed to control.

## Audit Questions

- Is the capability bound to an instance id?
- Can a borrowed or delegated cap mutate unrelated state?
- Does revocation actually prevent later use?
