# Cetus Math Bug Ecosystem Scan

## Background

After the Cetus incident, public security researchers scanned the Sui ecosystem for similar math-risk patterns. The report named several projects that had previously exposed similar issues and had already upgraded before publication.

## Timeline

- 2025-05-22: Cetus incident became public.
- 2025-05-23: ecosystem scan report was published.

## Root Cause Pattern

Shared libraries and repeated math patterns can spread a vulnerability class across otherwise separate protocols. The absence of a public exploit in a second protocol does not mean the pattern was harmless.

## Security Lesson

Post-incident work should include ecosystem-wide variant analysis: search for copied libraries, forked code, equivalent formulas, and old package versions.

## Related Dojo Practice

- Challenge 06: Price Rounding
- Challenge 07: Overflow Guard
- Challenge 10: Mini AMM Incident

