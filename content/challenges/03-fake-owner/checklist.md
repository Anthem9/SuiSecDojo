# Checklist: Fake Owner

- [ ] Does every owner-only entry compare against `tx_context::sender(ctx)`?
- [ ] Are caller-provided address parameters treated as data, not proof?
- [ ] Are capability objects used for privileged protocol roles?
- [ ] Do tests cover non-owner calls?
- [ ] Do tests cover forged owner parameters?
- [ ] Do public entry functions expose only intended state transitions?

