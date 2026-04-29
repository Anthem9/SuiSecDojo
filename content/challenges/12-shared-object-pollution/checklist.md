# Checklist: Shared Object Pollution

- [ ] Is each mutation scoped to the intended actor?
- [ ] Can another user increment or reset state?
- [ ] Are shared object fields partitioned by owner or source?
- [ ] Are unrelated-object negative tests present?
