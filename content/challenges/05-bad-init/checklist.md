# Checklist: Bad Init

- Is every initialization entry restricted to the intended caller or phase?
- Can any user create an `AdminCap` after deployment?
- Can initialization be called more than once?
- Are capabilities scoped to the object they control?
- Are initialization flags set before privileged operations become available?
- Do tests include unauthorized initialization attempts?
- Do tests include duplicate initialization attempts?
- Do tests cover capability reuse across unrelated objects?
