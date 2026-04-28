# Tutor Mode: Old Package Trap

## Concept

Deprecated entry points remain attack surface if they can still mutate state.

## Direction

Compare the new checked path with the old path.

## Checklist

- Does the new path reject?
- Does the old path still write state?
- Does solve care which path was used?

