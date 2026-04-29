# Fix: Oracle Staleness

- Store price value and freshness metadata together.
- Check the same oracle sample that is consumed.
- Reject samples older than the configured max age.
- Test mismatched checked and consumed epochs.
