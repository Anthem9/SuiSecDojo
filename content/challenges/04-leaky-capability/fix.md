# Fix: Leaky Capability

Do not expose capability minting or transfer paths to arbitrary callers.

Safer patterns:

- Mint `AdminCap` only during initialization.
- Transfer the capability to a known admin address or keep it under controlled ownership.
- Do not provide public entry functions that create privileged capabilities.
- Scope capability checks to the target object id when a capability is instance-specific.
- Add negative tests where a normal user tries to obtain or use a capability they should not control.

