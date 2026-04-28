# Fix: PTB Combo

Design state machines with PTB composition in mind.

Safer patterns:

- Do not rely on transaction separation unless enforced on-chain.
- Avoid sensitive temporary tokens unless their use is fully modeled.
- Test same-PTB combinations of public calls.
- Use explicit phases or durable state when separation matters.
