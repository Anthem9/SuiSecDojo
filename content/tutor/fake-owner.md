# Tutor Mode: Fake Owner

## Concept

Caller-supplied owner values are not authentication.

## Direction

Find the function that trusts a parameter instead of `tx_context::sender`.

## Checklist

- Which address does the caller control?
- Which address should be checked?
- What state must be set before solve?

