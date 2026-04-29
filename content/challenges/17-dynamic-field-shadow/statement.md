# Challenge 17: Dynamic Field Shadow

## Background

Dynamic-field designs need stable namespaces and collision-resistant keys. A user-controlled key can shadow protected state if namespace boundaries are weak.

## Vulnerability

`vulnerable_write_shadow(instance, key)` records a shadow key and treats it as valid when it matches the trusted key.

## Goal

Claim an instance, identify the trusted key, write the matching shadow key, then submit solve.

## CLI / PTB Practice

```bash
sui client call --package <PACKAGE_ID> --module challenge_17_dynamic_field_shadow --function vulnerable_write_shadow --args <INSTANCE_ID> <KEY>
sui client call --package <PACKAGE_ID> --module challenge_17_dynamic_field_shadow --function solve --args <INSTANCE_ID> <PROGRESS_ID> <MODE_CODE> <ASSISTANCE_LEVEL>
```

## Security Lesson

Separate trusted namespace keys from user-controlled keys.
