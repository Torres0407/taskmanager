# Grindstone Security Specification

## 1. Data Invariants

- **User Profile:**
  - `points` and `xp` must always be non-negative.
  - `isAdmin` cannot be modified by the user.
  - `uid` must match the authenticated user ID.
  - `email` must match the authenticated user's email.
  - `streak` must be non-negative.

- **Tasks:**
  - `userId` must match the authenticated user ID.
  - `pointsValue` is determined by the server/rules based on priority.
  - Once `status` is 'completed', it cannot be changed back (Terminal State).
  - `completedAt` must be set when `status` is 'completed'.

- **Transactions:**
  - Immutable once created.
  - `userId` must match the authenticated user ID.
  - `amount` reflects the change in points.

- **Global Config:**
  - Read-only for all users.
  - Write-only for admins.

## 2. The "Dirty Dozen" Payloads

1. **Self-Promotion:** User attempts to set `isAdmin: true` on their profile.
2. **Identity Spoofing:** User attempts to create a task with another user's `userId`.
3. **Point Injection:** User attempts to update their `points` directly.
4. **XP Injection:** User attempts to update their `xp` directly.
5. **Achievement Spoofing:** User attempts to record an achievement unlock for themselves without proper trigger.
6. **Task Forgery:** User attempts to create a task with a massive `pointsValue`.
7. **Config Overwrite:** Non-admin user attempts to change global game parameters.
8. **Negative Points:** User attempts to set `points` to a negative value.
9. **Transaction Fraud:** User attempts to create a transaction document for another user.
10. **State Rewind:** User attempts to change a 'completed' task back to 'pending'.
11. **PII Leak:** User attempts to read another user's full profile (containing email).
12. **ID Poisoning:** Attacker attempts to create a document with a 2KB string as ID.

## 3. Test Runner (Draft Plan)

The `firestore.rules.test.ts` will verify that `PERMISSION_DENIED` is returned for all above payloads.

*Note: Since I cannot run the actual test suite in this environment without a full emulator setup, I will focus on the logic and manual audit.*
