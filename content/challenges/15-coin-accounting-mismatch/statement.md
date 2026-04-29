# Challenge 15: Coin Accounting Mismatch

## Background

Internal accounting must match actual coin movement. Credits without matching deposits create claims that are not backed by assets.

## Vulnerability

`vulnerable_credit_without_coin(instance, amount)` increases internal credits without increasing deposits.

## Goal

Claim an instance, create credits greater than deposits, then submit solve.

## CLI / PTB Practice

```bash
sui client call --package <PACKAGE_ID> --module challenge_15_coin_accounting_mismatch --function vulnerable_credit_without_coin --args <INSTANCE_ID> 1
sui client call --package <PACKAGE_ID> --module challenge_15_coin_accounting_mismatch --function solve --args <INSTANCE_ID> <PROGRESS_ID> <MODE_CODE> <ASSISTANCE_LEVEL>
```

## Security Lesson

Every internal credit should correspond to a validated asset movement or an explicit accounting source.
