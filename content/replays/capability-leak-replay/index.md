# Capability Leak Replay

## Background

Sui Move capability objects are a common way to encode authority. If an AdminCap or initialization capability is leaked, duplicated, or publicly creatable, the access-control boundary becomes ineffective.

## Vulnerability Pattern

The simplified pattern is:

- a privileged object is created by an unrestricted public entry;
- ownership of the capability is not tied to the intended admin;
- restricted functions validate the cap but not the cap creation path;
- initialization code can be called after deployment by ordinary users.

## Simplified Model

This replay maps to Challenge 04 and Challenge 05. Challenge 04 models a leaked capability. Challenge 05 models an initialization path that lets a user create an admin capability for their instance.

## Root Cause

The root cause is treating possession of a capability as sufficient without proving the capability could only have been created and transferred through the intended authority path.

## Fix Strategy

- Mint AdminCap only in trusted initialization.
- Keep capability constructors private or package-restricted.
- Bind caps to the intended object, admin, and lifecycle.
- Add negative tests for ordinary users attempting to create or receive caps.

## Audit Checklist

- Can any public entry create an admin or treasury capability?
- Is the cap transferred only to the intended admin?
- Can initialization run more than once?
- Do restricted calls check both cap identity and target object identity?
- Are all negative capability tests present?

## Related Challenges

- Challenge 04: Leaky Capability
- Challenge 05: Bad Init

This replay is a minimized education model. It does not reproduce a real protocol or provide instructions for attacking real assets.
