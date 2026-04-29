# Walkthrough: Delegated Capability Abuse

1. Claim Challenge 13.
2. Call `vulnerable_delegate_cap`.
3. Find the new `DelegatedCap` object in your wallet.
4. Call `privileged_set_flag(instance, cap)`.
5. Submit solve.

The learning point is that scope `0` behaves as universal authority.
