# Source Notes: Overflow Guard

Core entries:

```move
challenge_07_overflow_guard::claim(progress, ctx)
challenge_07_overflow_guard::vulnerable_set_value(instance, value)
challenge_07_overflow_guard::solve(instance, progress, ctx)
```

The vulnerable entry checks the old state before writing the new value.
