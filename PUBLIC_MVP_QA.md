# Public MVP QA Checklist

This checklist captures the release gate for the testnet-only public MVP.

Latest manual QA: `QA_ROUND_2.md`, completed on 2026-04-29. Result: passed for the local Sui testnet MVP, with no blocking failures.

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

Latest CLI result on 2026-04-28:

- Wallet A: `0xda68b5b7583cf1515ad207e1ce1b5d5a630a9c5832023cf2381936743b3dd0a7`
- Wallet B: `0x0152c2b850303ce4f1e1527ecc40d6220d8cf73c1aabf01714c1098d983a7c3e`
- Fund Wallet B digest: `2oKCsy8K6HHVLAjDcp6L2ntHHR8ob8ZWAPXjyygq2iez`
- Wallet B progress: `0x3f0f523feec7ec1efed2d8bd612eba5f43ee1150b2047799acb557134d7ef3a6`
- Wallet B Challenge 01 instance: `0xb7a8fad76565d2708ac45d26404d8d89acebbac61b0d5429a9f02d0b08ca9aee`
- Wallet B own solve digest: `gTedHzB2VJ1PvwmD4f9ZVbVUyhKC2kpke8zLf88Pei9`
- Wallet B badge object: `0x480e9f4f6c5fa9d7de1a8317216e4edc5b7ff93bd814cad0531f8e6b92738664`
- Wallet B solving Wallet A instance failed because the instance is owned by Wallet A, not Wallet B.

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
- Current Walrus Site object is recorded in `deployments/walrus-testnet.json`.
- Sitemap includes challenge docs, replay docs, and frontend assets.
- Local testnet portal browser access requires a separate portal process on port `3000`.

Latest Walrus verification on 2026-04-29:

- Site object: `0x0187c85b9d044089b616316855887d4e29b29268f94f451e1240d3b753842b32`
- `site-builder --context testnet sitemap` showed the current JS/CSS assets and content paths.
- Browser portal access was not tested because no local Walrus testnet portal server was running.
