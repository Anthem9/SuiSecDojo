# Dango Perps Insurance Fund Exploit

## Background

On 2026-04-13, public reports described a Dango exploit involving a perpetuals insurance-fund logic flaw. The attacker was later described as a white hat after funds were returned under a bounty arrangement.

## Timeline

- 2026-04-13: exploit disclosed and operations paused.
- 2026-04-13: public reports stated funds were returned and users were not affected.

## Root Cause Pattern

Insurance funds, liquidation buffers, and collateral flows are easy places to encode assumptions that only hold under normal market conditions.

## Security Lesson

Risk-engine logic needs negative tests around insolvency, insurance-fund withdrawal, liquidation ordering, and external bridge movement.

## Related Dojo Practice

- Challenge 14: Oracle Staleness
- Challenge 15: Coin Accounting Mismatch
- Challenge 20: Liquidation Edge Case

