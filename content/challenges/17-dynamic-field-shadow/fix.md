# Fix: Dynamic Field Shadow

- Use typed keys or prefixed namespaces for dynamic fields.
- Never let user input choose privileged keys directly.
- Validate namespace ownership before writes.
- Test key collisions and same-key writes from unrelated callers.
