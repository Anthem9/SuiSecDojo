# Walkthrough: Bad Init

The instance starts with `initialized = false` and no admin capability created.

The vulnerable path is `vulnerable_create_admin_cap`. In a safe package, this kind of authority would be created only during a trusted initialization path. Here it is a callable entry for the challenge instance, so the learner can create the capability after claiming the object.

After receiving the `AdminCap`, call `admin_set_initialized`. The function checks that the capability belongs to the same instance, but it does not care that the capability was created through an unsafe path.

The solve entry succeeds only when:

- The transaction sender owns the challenge instance.
- The instance has not already been solved.
- `initialized` is true.

Solving records Challenge 05 completion and the Capability Pattern Beginner badge in `UserProgress`.
