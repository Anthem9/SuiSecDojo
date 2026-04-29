# Challenge 13: Delegated Capability Abuse

## Background

Capabilities should be scoped narrowly. A delegated capability that acts as universal authority can bypass the intended resource boundary.

## Vulnerability

`vulnerable_delegate_cap(instance)` creates a delegated cap with scope `0`, and `privileged_set_flag` accepts scope `0` as universal.

## Goal

Claim an instance, mint the delegated cap, use it to set the privileged flag, then submit solve.

## CLI / PTB Practice

```bash
sui client call --package <PACKAGE_ID> --module challenge_13_delegated_capability_abuse --function vulnerable_delegate_cap --args <INSTANCE_ID>
sui client call --package <PACKAGE_ID> --module challenge_13_delegated_capability_abuse --function privileged_set_flag --args <INSTANCE_ID> <DELEGATED_CAP_ID>
sui client call --package <PACKAGE_ID> --module challenge_13_delegated_capability_abuse --function solve --args <INSTANCE_ID> <PROGRESS_ID> <MODE_CODE> <ASSISTANCE_LEVEL>
```

## Security Lesson

Delegation needs explicit scope, lifecycle, and revocation tests.
