# Fix: Object Transfer Trap

- Require an explicit capability or owner check before changing custody.
- Keep transfer helpers separate from authorization decisions.
- Emit events when custody changes.
- Add negative tests for non-owner custody changes.
