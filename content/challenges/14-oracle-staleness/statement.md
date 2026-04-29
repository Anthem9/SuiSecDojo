# Challenge 14: Oracle Staleness

## Background

Oracle data must be checked at the same boundary where it is consumed. Checking one epoch while consuming another creates a freshness gap.

## Vulnerability

`vulnerable_use_price(instance, checked_epoch, price_epoch)` trusts `checked_epoch` but records and consumes `price_epoch`.

## Goal

Claim an instance, pass a fresh checked epoch with a stale price epoch, then submit solve.

## CLI / PTB Practice

```bash
sui client call --package <PACKAGE_ID> --module challenge_14_oracle_staleness --function vulnerable_use_price --args <INSTANCE_ID> 10 1
sui client call --package <PACKAGE_ID> --module challenge_14_oracle_staleness --function solve --args <INSTANCE_ID> <PROGRESS_ID> <MODE_CODE> <ASSISTANCE_LEVEL>
```

## Security Lesson

Validate the exact oracle sample that the protocol consumes.
