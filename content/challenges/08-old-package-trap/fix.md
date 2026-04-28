# Fix: Old Package Trap

Treat deprecated entries as part of the active attack surface.

Safer patterns:

- Disable or gate old paths during upgrade.
- Keep migration tests that call legacy entries.
- Document package versions that remain callable.
- Avoid assuming frontend removal disables a public entry.
