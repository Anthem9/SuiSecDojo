# Checklist: Object Transfer Trap

- [ ] Does every custody mutation check `tx_context::sender`?
- [ ] Is the recipient the intended actor, not just the caller?
- [ ] Can custody be changed before solve or settlement?
- [ ] Are object transfers covered by negative tests?
