# Fix the two selected security findings

## Changes
- Remove the self-service administrator promotion function and its sign-in call, so signing in cannot grant an administrator role.
- Replace broad portfolio-file reads with staff-only storage access.
- Add a public server-side portfolio reader that signs only files attached to published portfolio records, preserving the public gallery without exposing unrelated stored files.
- Apply a database migration that removes the broad file policy and adds the staff-only read policy.
- Verify the affected sign-in and portfolio paths, then mark only the two requested findings as fixed.

## Technical details
- Existing administrator assignments remain unchanged; future roles continue to be managed through the protected role table.
- Public visitors receive short-lived links only for published portfolio items. Draft or unattached files remain private.
- No other scanner findings or application systems will be changed.
