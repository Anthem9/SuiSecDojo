# Public MVP QA Checklist

This checklist captures the Phase 3 release gate for the testnet-only public MVP.

## Safety Boundary

- The app states that all challenges are minimized education models.
- The app states that content must not be used against real protocols, real assets, or unauthorized systems.
- README states that vulnerable challenges run only on testnet/devnet.

## Two-wallet Functional QA

Wallet A:

- Create `UserProgress`.
- Complete Challenge 01, Challenge 02, and Challenge 03.
- Confirm Profile shows claimed, completed, and earned badges.

Wallet B:

- Confirm no Wallet A progress is visible.
- Create a separate `UserProgress`.
- Claim a separate challenge instance.
- Confirm Wallet B cannot solve Wallet A's instance.

## Browser QA

- Desktop 1440px: challenge list, detail, docs, and profile fit without overlap.
- Laptop 1280px: action buttons wrap cleanly.
- Mobile 390px: long object IDs wrap and wallet controls remain clickable.
- Transaction failure messages are readable.
- Successful transactions show a digest link.

## Chain QA

- Current package ID matches `deployments/testnet.json`.
- Current registry object is readable.
- Challenge 01-10 objects parse in the frontend.
- CLI smoke covers claim, exploit, and solve paths for the current package.
- Badge object minting is visible after supported solve paths.

## Walrus QA

- `frontend/dist` exists after build.
- Existing Walrus Site object is updated, not replaced.
- Sitemap includes challenge docs, replay docs, and frontend assets.
- Local testnet portal URL opens the current app.
