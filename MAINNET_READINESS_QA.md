# Mainnet Readiness QA

Date:
Tester:
Browser / Wallet:
Mainnet operator address:

## 1. Local Readiness

- [ ] `git status --short` is clean before starting.
- [ ] `make ci` passes.
- [ ] `cd contracts-mainnet && sui move test` passes.
- [ ] `npm --prefix frontend audit --omit=dev` reports `0 vulnerabilities`.
- [ ] `git diff --check` passes.
- [ ] Browser QA confirms no user-facing “付费” or “paid” product copy appears in zh/en UI.

## 2. Mainnet Address And Funds

- [ ] A dedicated mainnet operator address is selected.
- [ ] Operator private key / recovery phrase is stored outside the repo.
- [ ] `sui client switch --env mainnet` points to mainnet.
- [ ] `sui client active-address` matches the operator address.
- [ ] `sui client balance` shows at least `10 SUI`.
- [ ] Mainnet WAL balance or storage resource is enough for one Walrus Site deployment; recommended buffer is `5-20 WAL`.

## 3. Mainnet Contract Dry Run

- [ ] `scripts/publish-dojo-pass-mainnet.sh` runs in dry-run mode without `CONFIRM_MAINNET=1`.
- [ ] Dry-run package only contains `badge` and `dojo_pass`.
- [ ] Dry-run does not include any `challenge_*`, `user_progress`, or `challenge_registry` modules.
- [ ] Mainnet publish is not executed unless explicitly authorized.

## 4. Frontend Network Guard QA

- [ ] Wallet on testnet: challenge claim / solve actions are enabled when normal prerequisites are met.
- [ ] Wallet on testnet: Dojo Pass actions show a switch-to-mainnet message and do not submit transactions.
- [ ] Wallet on mainnet: Dojo Pass actions are enabled when config exists.
- [ ] Wallet on mainnet: challenge claim / solve actions show a switch-to-testnet message and do not submit transactions.
- [ ] No in-app network selector is visible.
- [ ] 390 / 1280 / 1440 px layouts have no horizontal overflow.

## 5. Mainnet Post-Publish QA

Run only after explicit mainnet authorization.

- [ ] Publish `contracts-mainnet` and record package / upgrade cap / digest.
- [ ] Create `DojoPassConfig` with answer price `100000000` MIST and badge price `1000000000` MIST.
- [ ] Mint Dojo Pass from wallet A; only gas is charged.
- [ ] Wallet A cannot mint a second Dojo Pass.
- [ ] Unlock Challenge 01 answer from wallet A; `0.1 SUI` is transferred into config.
- [ ] Wallet B cannot see wallet A's unlocked answer state.
- [ ] `seal_approve(pass, 1)` succeeds for wallet A after unlock and fails before unlock.
- [ ] Badge proof service signs only when testnet progress meets the requirement.
- [ ] Wallet A mints a badge; `1 SUI` is transferred into config and Badge object is received.
- [ ] Wallet B cannot use wallet A's pass for answer unlock or badge mint.
- [ ] `withdraw` works only for the configured recipient.

## 6. Walrus / SuiNS QA

- [ ] `scripts/build-frontend.sh` passes.
- [ ] `CONFIRM_MAINNET=1 scripts/deploy-walrus-mainnet-site.sh` deploys or updates a mainnet Walrus Site.
- [ ] `deployments/walrus-mainnet.json` records the site object ID.
- [ ] SuiNS is set to the Walrus Site ID.
- [ ] Public URL opens through `wal.app` or configured SuiNS route.
- [ ] Direct refresh works for `/`, `/challenges`, `/challenges/anyone-can-mint`, `/profile`, `/about`.
- [ ] Frontend displays testnet challenge package and mainnet Dojo Pass package/config.

## Notes

- Vulnerable challenge packages must remain testnet-only.
- Do not publish the full `contracts/` package to mainnet.
- Seal encrypted answer rendering is not production-complete until key servers and encrypted answer artifacts are configured.
