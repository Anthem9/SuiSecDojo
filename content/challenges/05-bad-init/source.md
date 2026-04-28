# Source Notes: Bad Init

Core challenge entries:

```move
challenge_05_bad_init::claim(progress, ctx)
challenge_05_bad_init::vulnerable_create_admin_cap(instance, ctx)
challenge_05_bad_init::admin_set_initialized(instance, cap)
challenge_05_bad_init::solve(instance, progress, ctx)
```

The vulnerable entry intentionally creates an `AdminCap` for an already claimed instance:

```move
public(package) entry fun vulnerable_create_admin_cap(instance: &mut ChallengeInstance, ctx: &mut TxContext)
```

The secure lesson is to keep this authority creation inside a trusted initialization path and test that normal users cannot mint privileged capability objects.
