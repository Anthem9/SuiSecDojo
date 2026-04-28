# Checklist: Price Rounding

- Does the rounding direction favor the correct side?
- Can repeated tiny actions produce more output than one aggregate action?
- Is fixed-point precision high enough for the asset decimals?
- Are dust payments rejected or accumulated safely?
- Are boundary values tested around the unit price?
- Are invariants tested across repeated operations?
- Is solve or settlement logic checking both output and cost?
