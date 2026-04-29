# Tutor Mode: Coin Accounting Mismatch

## Concept

Internal credits must match deposits or another verified accounting source.

## Direction

Find the entry that increases credits without deposits.

## Checklist

- Are credits and deposits updated together?
- Is there a positive amount check?
- Does solve compare credits to deposits?

## Answer

Call `vulnerable_credit_without_coin` with a positive amount, then solve.
