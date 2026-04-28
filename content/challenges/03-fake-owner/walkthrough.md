# Walkthrough: Fake Owner

`claim` creates an owned instance for the caller and records Challenge 03 as claimed.

The vulnerable function asks the caller to provide `claimed_owner`. The check only verifies that `claimed_owner` equals the instance owner. Since the function trusts caller-provided data, the caller can pass the stored owner address and flip the restricted flag.

After the flag is true, `solve` verifies that the transaction sender owns the instance and that the flag has been set. It then marks the instance solved and records Challenge 03 in `UserProgress`.

