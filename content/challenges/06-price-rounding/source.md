# Source Notes: Price Rounding

Core challenge entries:

```move
challenge_06_price_rounding::claim(progress, ctx)
challenge_06_price_rounding::vulnerable_buy(instance, payment)
challenge_06_price_rounding::solve(instance, progress, ctx)
```

The vulnerable entry rounds each payment up independently:

```move
let rounded_credits = (payment + PRICE_PER_CREDIT - 1) / PRICE_PER_CREDIT;
```

The secure lesson is to test arithmetic across repeated small operations, not only one normal-sized operation.
