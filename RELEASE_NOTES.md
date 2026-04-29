# Release Notes

## v0.4.1-qa-passed - 2026-04-29

SuiSec Dojo Phase 4 is marked QA passed for the local Sui testnet MVP.

### Highlights

- Challenge 01-10 are available on Sui testnet.
- Challenge 01-03 manual browser QA passed with Unsafe Burner Wallet.
- Completion events power the no-backend leaderboard.
- Profile, Badge, Security Passport, static Tutor Mode, Report Training, Docs, and bilingual content are available.
- QA Round 2 verified responsive layouts at 390 / 1280 / 1440 widths.

### QA Fixes Included

- Fixed post-claim object refresh so Challenge 01 no longer shows `Invalid Sui Object id`.
- Added retry-based object refresh so Challenge 02 solve state syncs without manual refresh.
- Updated Challenge 03 to issue badge type `3` and emit `badge_type=3`.
- Added visible clipboard permission feedback in Report Training.

### Deployment

- Sui package: `0xeb9229cefe033adf3ef3ac79768d24525f9413c443337360b2a444a13b6d4081`
- Challenge registry: `0xe5f959d224ef239ee522abe19c059e8f93230f1b984a9cc8ba5588b8b51834ca`
- Walrus testnet site object: `0x0187c85b9d044089b616316855887d4e29b29268f94f451e1240d3b753842b32`
- Walrus local portal URL: `http://1dfmlb4xz3wfc6ajfzyf7ydahsjoiyqu27v2yah42o6hczm7m.localhost:3000`

### Verification

- `make check-env`
- `make ci`
- `npm --prefix frontend audit --omit=dev`
- `git diff --check`
- Challenge 03 CLI smoke verified badge type `3`
- Walrus sitemap verified current assets and content
- GitHub Actions run `25084231397` passed

### Known Limits

- Testnet only. No mainnet assets or mainnet certificate minting.
- Walrus testnet browser access requires a local or third-party testnet portal.
- Real Sui Wallet extension signing was not tested in Round 2; Unsafe Burner Wallet was used.
