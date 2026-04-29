# Challenge 16: Signer Confusion

## Background

Authorization must come from `tx_context::sender` or a verified capability, not from an address argument supplied by the caller.

## Vulnerability

`vulnerable_accept_intent(instance, claimed_signer)` trusts a caller-supplied signer and accepts the intent when that value equals the instance owner.

## Goal

Claim an instance, pass the expected owner address as `claimed_signer`, then submit solve.

## CLI / PTB Practice

```bash
sui client call --package <PACKAGE_ID> --module challenge_16_signer_confusion --function vulnerable_accept_intent --args <INSTANCE_ID> <CLAIMED_SIGNER>
sui client call --package <PACKAGE_ID> --module challenge_16_signer_confusion --function solve --args <INSTANCE_ID> <PROGRESS_ID> <MODE_CODE> <ASSISTANCE_LEVEL>
```

## Security Lesson

Never confuse a user-provided identity field with the transaction signer.
