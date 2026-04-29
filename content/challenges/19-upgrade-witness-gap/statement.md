# Challenge 19: Upgrade Witness Gap

## Background

Package upgrades often introduce new authority objects. Old witness paths must be retired or they remain valid attack surface.

## Vulnerability

`vulnerable_mint_old_witness(instance)` lets a caller mint an obsolete witness, and `old_admin_path(instance, witness)` still accepts it.

## Goal

Claim an instance, mint the old witness, use the old admin path, then submit solve.

## CLI / PTB Practice

```bash
sui client call --package <PACKAGE_ID> --module challenge_19_upgrade_witness_gap --function vulnerable_mint_old_witness --args <INSTANCE_ID>
sui client call --package <PACKAGE_ID> --module challenge_19_upgrade_witness_gap --function old_admin_path --args <INSTANCE_ID> <OLD_WITNESS_ID>
sui client call --package <PACKAGE_ID> --module challenge_19_upgrade_witness_gap --function solve --args <INSTANCE_ID> <PROGRESS_ID> <MODE_CODE> <ASSISTANCE_LEVEL>
```

## Security Lesson

Upgrades must retire obsolete witnesses and old admin paths.
