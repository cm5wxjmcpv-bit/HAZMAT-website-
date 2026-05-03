# ELDT Hazmat Training Platform (GitHub Pages POC)

## Overview
Plain HTML/CSS/JavaScript production-structured proof-of-concept for a paid ELDT Hazmat theory training workflow.

## Features
- Signup/login (localStorage mock auth)
- Admin seed account
- Payment gate with Stripe placeholder
- Sequential module locking
- Anti-skip video watch tracking (90% required)
- 25-question final test (80% pass)
- Certificate generation
- TPR submission queue creation
- Admin queue updates and paid toggles
- Student TPR status page

## Run Locally
1. Open project folder.
2. Serve with any static web server (example):
   - `python3 -m http.server 8080`
3. Navigate to `http://localhost:8080`.

## GitHub Pages Deploy
1. Push repository to GitHub.
2. In repo settings, open **Pages**.
3. Set source to deploy from `main` branch root.
4. Save; wait for GitHub Pages URL.

## Firebase Migration Plan
- Move `Auth` to Firebase Authentication.
- Replace `Storage/Api` with Firestore CRUD.
- Enforce security rules for student-only read/write and admin elevated access.
- Move queue updates and certificate issuance to Cloud Functions for trusted writes.

## Stripe Integration Plan
- Replace placeholder button with Stripe Checkout session endpoint via Cloud Function.
- Set `users.paid=true` only from verified Stripe webhook.

## Vimeo Integration Plan
- Replace mock `<video>` with Vimeo embed + Player API event tracking.
- Persist watch events server-side to prevent tampering.

## TPR Workflow
1. Student passes final test.
2. System creates queue record (`pending_review`) with due date = completion + 2 business days.
3. Admin reviews student data and test result.
4. Admin manually submits in FMCSA TPR provider portal.
5. Admin sets status (`ready_to_submit`, `submitted`, or `rejected`) and stores confirmation notes.

## Security Notes
- This POC stores plaintext passwords in localStorage; do not use in production.
- Students should only access their own records; implement with Firebase security rules.
- License uploads must move to secure storage (Firebase Storage + rules).
