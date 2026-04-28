# Walkthrough: Overflow Guard

The vulnerable function checks `instance.guarded_value < SAFE_LIMIT`, then writes the user supplied value.

Because the old value starts at zero, the check passes even when the incoming value is `1000`.

Solve succeeds when `guarded_value >= 1000`.
