# Firestore Security Specification

## 1. Data Invariants
1. **Default-Deny Catch-All**: Any path outside `properties`, `inquiries`, `admins`, `business_settings`, `property_images`, and `testimonials` is strictly denied for all reads and writes.
2. **Admin-Only Mutations on Catalog & Settings**: Only verified administrators (`isAdmin()`) may create, update, or delete `properties`, `business_settings`, `property_images`, `testimonials`, and `admins`. Public admin self-registration is impossible.
3. **PII Isolation on Inquiries**: `inquiries` contains sensitive client PII (`fullName`, `phone`, `email`, `message`). Public visitors may only `create` inquiries with `status == 'new'` and server-enforced timestamps (`createdAt == request.time`, `updatedAt == request.time`); `get`, `list`, `update`, and `delete` are strictly restricted to `isAdmin()`.
4. **Unpublished Listing Protection**: Public `get` and `list` on `properties` and `testimonials` require `resource.data.isPublished == true`. Drafts are readable only by `isAdmin()`.
5. **Path Variable & Payload Integrity**: All document IDs must match `^[a-zA-Z0-9_\-]+$` (`<= 128` chars), every string has explicit `.size()` bounds, arrays are bounded (`<= 25` items), and shadow/ghost fields are rejected via `keys().hasAll(...) && keys().hasOnly(...)` and `affectedKeys().hasOnly(...)`.
6. **Immutable Ownership & Timestamps**: `createdAt` and `createdBy` are immutable after creation; `createdAt` and `updatedAt` must equal `request.time`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Ghost Field Injection on Inquiry Create**: `{ ...validInquiry, isAdmin: true, priorityScore: 999 }` -> `PERMISSION_DENIED` (blocked by `hasOnly`).
2. **Inquiry Status Tampering on Create**: `{ ...validInquiry, status: 'closed' }` -> `PERMISSION_DENIED` (create requires `status == 'new'`).
3. **Client Timestamp Forgery on Property Create**: `{ ...validProperty, createdAt: Timestamp.fromDate(new Date('2020-01-01')) }` -> `PERMISSION_DENIED` (`createdAt == request.time`).
4. **Unauthenticated Inquiry List Scraping**: `getDocs(collection(db, 'inquiries'))` as anonymous/public user -> `PERMISSION_DENIED`.
5. **Unauthenticated Inquiry Get by ID**: `getDoc(doc(db, 'inquiries', 'inq1'))` as non-admin -> `PERMISSION_DENIED`.
6. **Self-Assigned Admin Escalation**: Signed-in non-admin user attempts `setDoc(doc(db, 'admins', auth.uid), { uid: auth.uid, email: 'attacker@evil.com', role: 'owner' })` -> `PERMISSION_DENIED`.
7. **Unverified Email Admin Spoof**: Token with `email: 'samullah404@gmail.com'` and `email_verified: false` -> `PERMISSION_DENIED`.
8. **1MB String Resource Poisoning**: `{ ...validInquiry, fullName: 'A'.repeat(50000) }` -> `PERMISSION_DENIED` (`fullName.size() <= 120`).
9. **Path ID Poisoning**: `setDoc(doc(db, 'inquiries', 'bad/../../id'), validInquiry)` -> `PERMISSION_DENIED` (`isValidId`).
10. **Non-Admin Property Creation**: Signed-in non-admin user attempts `setDoc(doc(db, 'properties', 'p1'), validProperty)` -> `PERMISSION_DENIED`.
11. **Immutable `createdBy` Tampering on Update**: Admin attempts to mutate `createdBy` or `createdAt` on an existing property -> `PERMISSION_DENIED`.
12. **Draft Property Leak via List**: Public user queries `properties` where `isPublished == false` -> `PERMISSION_DENIED`.
