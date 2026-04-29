# Challenge 11: Object Transfer Trap

Status: coming soon.

This challenge is reserved for a future on-chain module about object custody and unintended transfers. It will not be claimable until the Move module, tests, frontend parser, transaction builder, and deployment record are complete.

## Practice Goal

Reason about who owns a protected object after helper functions transfer it.

## Audit Questions

- Which entry moves the object?
- Does the receiver match the learner or the intended authority?
- Can a later solve path trust ownership after a transfer helper ran?
