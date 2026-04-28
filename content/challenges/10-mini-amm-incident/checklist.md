# Checklist: Mini AMM Incident

- Is output computed from the correct reserves?
- Can a swap drain a reserve?
- Is the invariant checked after every swap?
- Are edge inputs near reserve size tested?
- Does solve or settlement validate both profit and invariant state?
