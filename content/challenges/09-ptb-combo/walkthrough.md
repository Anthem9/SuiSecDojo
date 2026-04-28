# Walkthrough: PTB Combo

The exploit transaction calls `prepare_combo(instance)` and passes the returned token directly into `finish_combo(instance, token)`.

The token has no storage ability, so the practical lesson is about same-transaction composition rather than holding an object over time.

Solve succeeds when `combo_ready` is true.
