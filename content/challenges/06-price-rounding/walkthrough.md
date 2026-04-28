# Walkthrough: Price Rounding

The intended price is `10` payment units for one credit. A normal buy with payment `10` produces one credit.

The vulnerable function uses upward rounding:

```move
(payment + PRICE_PER_CREDIT - 1) / PRICE_PER_CREDIT
```

That means payment `1` also becomes one credit. Repeating payment `1` ten times produces ten credits for the same total payment that should normally produce only one credit.

The solve entry succeeds only when:

- The transaction sender owns the instance.
- The instance is not already solved.
- `credits >= 10`.
- `paid_amount <= 10`.

This models precision loss and rounding-direction bugs without using real assets.
