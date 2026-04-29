# Fix: Shared Object Pollution

- Add sender or capability checks before mutating shared state.
- Store per-user or per-instance sub-state when global counters are unsafe.
- Validate source object identity before accepting a mutation.
- Test unrelated callers and unrelated instances.
