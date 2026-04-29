# Challenge 12: Shared Object Pollution

## Background

Shared objects can be touched by many users. Any state that is not scoped to the intended actor can become polluted by unrelated calls.

## Vulnerability

`vulnerable_pollute(instance)` increments shared-like state without proving that the mutation came from the intended source or actor.

## Goal

Claim an instance, pollute the counter, then submit solve.

## CLI / PTB Practice

```bash
sui client call --package <PACKAGE_ID> --module challenge_12_shared_object_pollution --function vulnerable_pollute --args <INSTANCE_ID>
sui client call --package <PACKAGE_ID> --module challenge_12_shared_object_pollution --function solve --args <INSTANCE_ID> <PROGRESS_ID> <MODE_CODE> <ASSISTANCE_LEVEL>
```

## Security Lesson

Shared-object state must be scoped by actor, capability, or a validated source object.
