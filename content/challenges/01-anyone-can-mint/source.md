# Source: Anyone Can Mint

Primary module:

```text
contracts/sources/challenge_01_anyone_can_mint.move
```

Primary tests:

```text
contracts/tests/challenge_01_tests.move
```

Key entries:

- `claim(progress, ctx)`
- `vulnerable_mint(instance, amount)`
- `solve(instance, progress, ctx)`

The vulnerable path is intentionally minimal so the authorization issue is isolated
from unrelated protocol logic.
