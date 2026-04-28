# Testing Instructions for AI Agent

When modifying this repository, follow these rules:

1. Identify the risk level of the change: low, medium, or high.
2. Read existing tests before changing implementation.
3. For bug fixes, add a failing regression test first when practical.
4. For new business logic, add unit tests for main and boundary cases.
5. Prefer scoped tests during development.
6. Do not run full test suites unless the change is high-risk or broad.
7. After changes, run the smallest sufficient test set.
8. Report exactly which tests were run and which were not run.
9. If tests fail, fix the root cause instead of weakening tests.
10. Do not delete or loosen tests without explaining why.

Recommended commands:

- Low-risk change: `make check`
- Medium-risk change: `make test`
- High-risk change: `make ci`

