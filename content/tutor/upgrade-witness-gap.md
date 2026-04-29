# Tutor Mode: Upgrade Witness Gap

## Concept

Old witnesses and compatibility paths remain authority until explicitly retired.

## Direction

Find the old witness mint path and the old admin path.

## Checklist

- Can the old witness still be minted?
- Is it scoped to the instance?
- Does the old path still mutate state?

## Answer

Mint `OldWitness`, call `old_admin_path`, then solve.
