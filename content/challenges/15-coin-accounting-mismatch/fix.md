# Fix: Coin Accounting Mismatch

- Update deposits and credits in one atomic path.
- Require a real coin transfer or verified accounting source before crediting.
- Check invariants after every public entry.
- Test zero amounts and repeated small amounts.
