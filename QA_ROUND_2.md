# QA Round 2 - 2026-04-29

## Environment

- Browser: Codex in-app browser; responsive screenshots with local Chrome headless 147.
- Wallet: Unsafe Burner Wallet on Sui testnet.
- Wallet A suffix: `308219`.
- Wallet B suffix: `417ec9`.
- Package: `0xeb9229cefe033adf3ef3ac79768d24525f9413c443337360b2a444a13b6d4081`.
- Registry: `0xe5f959d224ef239ee522abe19c059e8f93230f1b984a9cc8ba5588b8b51834ca`.
- Walrus Site object: `0x0187c85b9d044089b616316855887d4e29b29268f94f451e1240d3b753842b32`.

## Passed

- Local site opened correctly and displayed the current package.
- 390 / 1280 / 1440 widths had no horizontal scroll, button overflow, or blank page.
- ZH/EN, Docs, Tutor, Report, Passport, and Leaderboard rendered.
- Challenge 01 regression passed: no `Invalid Sui Object id`; claim showed instance id; solve became available; completion and Object Security Beginner badge displayed.
- Challenge 02 regression passed: vault balance reached `0`; UI moved to solved after about 6 seconds; solve disabled; Profile and Passport synced; Shared Object Beginner badge displayed.
- Challenge 03 regression passed: restricted flag was `true`; completion solved; progress reached `3/10`; Authorization & Capability Beginner badge displayed; Passport and Leaderboard synced.
- Wallet B isolation passed: initial `0/10`; independent progress and Challenge 01 instance; no Wallet A progress or instance appeared.
- Report Copy regression passed: clipboard denial showed a readable UI message and the page did not crash.

## Transaction Digests

- Wallet A funding: `ForPyQ4r9AXizex7RhZojmgGZsaRoByNBApcpEaeDPAx`.
- Wallet B funding: `EuTwVP1X7AiXwzt7sjVUkr2698LXekFcjeNwJh6zTAj2`.
- Challenge 01 create: `8tVrvuiXvsBF25JfSzgX1esJWoKFPgowEjrQ8qtUeVQH`.
- Challenge 01 claim: `7RE8UezrDmUekGexqpx7zJ3bsgdgsNCyeRHBfbiZrpcY`.
- Challenge 01 solve: `E7vcX8PaXU19ZEz5Ri7FnxJj7bY9c981kPz8oCN4P1SZ`.
- Challenge 02 claim: `DVZXL48WT9MScibJAtAqedbWzR71PJZin2Ft9MZ43YrN`.
- Challenge 02 exploit: `CqH9q2dr5TBTztLk3HytgtShLTeqPEMv51MQq354fEMb`.
- Challenge 02 solve: `6qPHCPWj2vwXhDsGDBHTv872RwgpxhtAGgPMsMh6q5Ab`.
- Challenge 03 claim: `AYGFkeSJW62dnKHDstp8FzWzLESKypbZ96NxgBhxkYYi`.
- Challenge 03 exploit: `8gnq2NAsD6iGSPuKAG8j1fCt3b3ktfHrmTWLtFqVh9FY`.
- Challenge 03 solve: `764VNcDJAeDz1WEZXQ7mua8Rd8jbxqJYACK3qQGbr4p8`.
- Wallet B create: `fkiCta2YwtnTgegEKwUwyGLbnQm5c7eS11FGjW7W35V`.
- Wallet B claim Challenge 01: `BDpYRHKQU8LirN3dNXmSnCKw7XQJNXX7hU1fouHjE6pU`.

## Not Tested

- Walrus testnet portal browser access. The deployed site object and sitemap were verified with `site-builder`, but this machine did not have a local testnet portal server running at port `3000`.
- Real Sui Wallet extension signing. The in-app browser exposed only Unsafe Burner Wallet during this round.
- Refresh persistence for Unsafe Burner Wallet. The burner generated a new address after refresh, so persistence was not representative of a real wallet extension. Chain state before refresh was verified.

## Result

QA Round 2 passed for the local Sui testnet MVP. No blocking failures remain.
