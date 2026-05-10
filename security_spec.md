# Security Specification

## Data Invariants
1. A document must belong to a valid user.
2. Users can only read their own documents, notifications, and reports.
3. Only admins or system roles can create reports.
4. Notifications are private to the recipient.
5. Users can only update their own profile.

## The Dirty Dozen Payloads (Attempted Violations)
1. **Identity Spoofing**: Attempt to create a document with `userId` of another user.
2. **Privilege Escalation**: Attempt to set `role: 'admin'` on own user profile.
3. **Orphaned Write**: Create a document for a non-existent user.
4. **PII Leak**: Non-owner trying to 'get' a user profile.
5. **Blanket Read**: List all documents without a user filter.
6. **Immutable field update**: Change `createdAt` on a user profile.
7. **Malformed ID**: document ID with 2KB size.
8. **Action bypass**: Update a document's `status` without going through processing.
9. **Chat poisoning**: Send message to a chat the user is not part of.
10. **State shortcutting**: Set document status to `completed` manually.
11. **Resource exhaustion**: Send 2MB string as `fileName`.
12. **Anonymous access**: Unauthenticated user trying to read professional data.

## The Test Runner
A `firestore.rules.test.ts` will verify these are blocked. (Conceptually implemented in logic).
