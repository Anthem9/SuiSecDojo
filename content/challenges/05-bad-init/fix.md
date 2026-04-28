# Fix: Bad Init

Do not expose initialization authority creation to arbitrary callers.

Safer patterns:

- Create admin capabilities only in the package `init` function or a tightly controlled setup entry.
- Transfer initial authority to a known admin address.
- Store one-time initialization state and reject repeated setup.
- Avoid public entries that mint, transfer, or recreate privileged capabilities.
- Scope capability checks to the exact object they control.
- Add negative tests where a normal user attempts to initialize state or create an admin capability.

This challenge is a simplified education model. It does not reproduce any real protocol initialization code.
