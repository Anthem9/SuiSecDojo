# Walkthrough: Leaky Capability

The instance starts with `cap_claimed = false` and `admin_flag = false`.

`vulnerable_claim_cap` should have been restricted, but it transfers an `AdminCap` to whoever calls it. The capability stores the target instance id.

After claiming the capability, call `admin_set_flag`. That function only checks that the capability belongs to the instance. Since you now own the leaked capability, the admin flag can be set.

`solve` requires the instance owner, an unset solved state, and `admin_flag = true`.

