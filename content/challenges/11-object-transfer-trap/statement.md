# Challenge 11: Object Transfer Trap

## Background

Move object ownership is part of the authorization boundary. A helper that transfers custody to a caller can change who later appears authorized.

## Vulnerability

`vulnerable_accept_custody(instance)` assigns the challenge custodian to the transaction sender. The solve path accepts the state once custodian and owner match, so the learner must reason about how custody changed.

## Goal

Claim an instance, make the custodian match the instance owner, then submit solve.

## CLI / PTB Practice

```bash
sui client call --package <PACKAGE_ID> --module challenge_11_object_transfer_trap --function vulnerable_accept_custody --args <INSTANCE_ID>
sui client call --package <PACKAGE_ID> --module challenge_11_object_transfer_trap --function solve --args <INSTANCE_ID> <PROGRESS_ID> <MODE_CODE> <ASSISTANCE_LEVEL>
```

## Security Lesson

Do not treat a post-transfer owner or custodian field as proof that the transfer was authorized for the intended workflow.
