# Checklist: Anyone Can Mint

- Is every mint path guarded by a capability?
- Can a public entry function increase supply?
- Is the capability owned by the intended admin?
- Do tests include negative cases for ordinary users?
- Does the test suite cover duplicate solve attempts?
- Are helper functions kept package-private unless external access is required?
- Are capability transfer paths reviewed?
- Does the frontend explain disabled states instead of hiding failed preconditions?
