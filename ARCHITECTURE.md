# Shortify Architecture

## Product

Production-grade URL Shortener SaaS

Goals:
- Real users
- Public deployment
- Analytics
- Secure authentication
- Scalable redirects

---

## Tech Stack

Frontend
- React
- JavaScript
- Tailwind CSS
- Shadcn UI

Backend
- Node.js
- Express.js

Database
- MongoDB Atlas

Cache
- Redis Cloud

Authentication
- JWT
- Refresh Tokens
- Google OAuth

Infrastructure
- Docker
- GitHub Actions

Deployment
- Vercel
- Render

---

## System Architecture

Frontend
    ↓
Backend API
    ↓
Redis Cloud
    ↓
MongoDB Atlas

---

## Authentication

Email + Password

Google OAuth

Email verification for credentials users

JWT Access Token

Refresh Token Rotation

OAuth completion:
- Backend Google OAuth callback: `/api/v1/auth/google/callback`
- Frontend OAuth completion route: `/auth/callback`
- Login/Register expose Google OAuth entry points.
- AuthProvider restores the refresh-token cookie into a frontend access-token session after OAuth callback.

Session persistence:
- Refresh cookies are persistent via `maxAge` derived from `JWT_REFRESH_EXPIRES_IN`.
- Refresh cookies are scoped to `/api/v1/auth`.
- Development cookies use `sameSite=lax`.
- Production cookies use `sameSite=none` and `secure=true`.
- Duplicate refresh-token use inside `REFRESH_TOKEN_ROTATION_GRACE_SECONDS` returns session data without issuing a stale cookie overwrite.
- Runtime URLs are provided through environment configuration only.

Email verification:
- Credentials registration creates a single-use verification token.
- Only the SHA-256 token hash and expiration timestamp are stored.
- Verification clears token fields, marks `isEmailVerified=true`, and sends a welcome email.
- Google users remain verified based on Google profile email verification.

Transactional email:
- Resend delivers verification, welcome, and password reset emails.
- Email links use `CLIENT_VERIFY_EMAIL_URL` and `CLIENT_PASSWORD_RESET_URL`.

---

## Short Link Origin

Frontend copied short links use:

`VITE_SHORT_LINK_BASE_URL`

This keeps copied links pointed at the backend/public redirect origin instead of the frontend application origin.

---

## Deployment Architecture

Production targets:
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Cache: Redis Cloud

Deployment configuration:
- Frontend runtime build values are supplied through `VITE_*` variables.
- Backend runtime configuration is centralized in `backend/src/config/env.js`.
- Production backend startup validates required environment variables, HTTPS callback/origin URLs, and JWT secret length.
- Docker Compose supports API, frontend, and an optional local Redis service; MongoDB remains Atlas-hosted.
- `DEPLOYMENT.md` contains Vercel, Render, Atlas, Redis Cloud, and Google OAuth production setup steps.

---

## QR Code System

QR codes are generated on the frontend from the canonical short URL.

Implementation:
- Links management exposes a QR action for each short link.
- `buildShortLink(shortCode)` provides the QR payload, so QR output uses the same configured short-link origin as copy actions.
- The QR preview renders to canvas and can be downloaded as a PNG.
- Regeneration redraws the deterministic QR preview from the latest short URL.

Design decision:
- No QR database fields, image storage, or backend QR endpoints were added.
- QR images are deterministic assets derived from the short URL, so frontend generation is the simplest production-ready approach for Phase 6E.4.

---

## Redirect Flow

User Clicks Link

↓

Redis Lookup

↓

MongoDB Fallback

↓

Redirect

↓

Async Analytics Collection

Redirect verification:
- `backend/scripts/verify-redirect-engine.js`
- `backend/docs/redirect-verification.md`

Verified cases include active, disabled, expired, missing, password-protected, and analytics collection flows.

---

## Phase 6E.2 Audit

Critical Bugs:
- Password-protected links need a frontend browser challenge instead of raw JSON.
- Password removal must be explicit in link editing.
- Refresh-token restoration must avoid duplicate rotations.

High Priority Improvements:
- Centralized frontend API error mapping.
- Friendly rate-limit and auth-error messages.
- Immediate auth state after credentials and OAuth auth.
- Client-side validation for URL management.

Medium Priority Improvements:
- Landing page release polish.
- Dashboard hierarchy and empty/loading state polish.
- Links search, sort, filter, copy feedback, and details view.

Implementation roadmap:
1. API error mapper
2. Session restoration dedupe
3. Password challenge route
4. Password removal controls
5. Validation
6. Links UX hardening
7. Landing/dashboard polish

Implemented in Phase 6E.2:
- Frontend API error mapping lives in `frontend/src/lib/apiErrors.js`.
- AuthProvider dedupes refresh restoration with a shared in-flight promise.
- Password challenge route: `/links/password/:shortCode`.
- Backend password redirect errors route browser users to the frontend challenge page.
- Link editing supports explicit password keep, set/change, and remove states.
- Links management includes search, filter, sort, copy feedback, and details view.

---

## Phase 6E.3A Session Persistence

Root cause:
- Strict refresh-token rotation could invalidate otherwise valid sessions when the same refresh cookie was used twice during startup, page refresh, OAuth callback restoration, or multiple-tab restoration.
- Some auth/session URL defaults were hardcoded instead of coming only from environment variables.

Fix:
- Added duplicate rotation grace handling in `token.service.js`.
- `auth.controller.js` now sets a new refresh cookie only when a refresh actually issues one.
- Removed hardcoded frontend/backend auth URL defaults.
- Added `backend/scripts/verify-session-restore.js`.

---

## Phase 6E.3B Settings & Account Management

Backend account endpoints:
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `PATCH /api/v1/users/change-password`
- `DELETE /api/v1/users/me`

Security decisions:
- Endpoints are protected by JWT auth middleware.
- Profile updates only allow `name` and `avatarUrl`.
- Password changes are available only for credentials-capable accounts.
- Account deletion revokes refresh tokens, deletes owned links, deletes the user, and clears the refresh cookie.

Frontend:
- Protected `/settings` route under the existing app shell.
- Sections for Profile, Security, Connected Account, Session Information, and Danger Zone.
- React Query is used for loading and mutations.

---

## Analytics

MVP analytics scope:

- Total Clicks
- Browser
- Device
- OS
- Referrer
- ReferrerHost
- Country
- Timestamp

Approved analytics preparation:
- [x] Add analytics indexes to the `clicks` collection
- [x] Add `country` to click records
- [x] Add `referrerHost` to click records

Current preparation status:
- Analytics schema updates are complete
- Index preparation is complete
- Analytics API implementation is not yet started

Rejected for MVP Phase 5:
- `visitorKey`
- `url_daily_stats` collection
- bot detection

---

## Current Collections

users

refresh_tokens

urls

clicks

## MVP Analytics Index Plan

Approved indexes for the `clicks` collection:
- `{ urlId: 1, clickedAt: -1 }`
- `{ userId: 1, clickedAt: -1 }`
- `{ urlId: 1, browser: 1, clickedAt: -1 }`
- `{ urlId: 1, device: 1, clickedAt: -1 }`
- `{ urlId: 1, os: 1, clickedAt: -1 }`
- `{ urlId: 1, referrer: 1, clickedAt: -1 }`
- `{ urlId: 1, country: 1, clickedAt: -1 }`
- `{ shortCode: 1, clickedAt: -1 }`

---

## Current Status

### Phase 7 Frontend Experience

The frontend uses a shared semantic presentation layer without changing application service boundaries:

- `ThemeProvider` initializes from `localStorage` or `prefers-color-scheme`, then applies a root `.dark` class.
- CSS variables in `frontend/src/index.css` define background, surface, border, text, muted, and primary colors for both themes.
- Shared UI primitives own card, button, form, feedback, page-header, and modal consistency.
- `ProtectedLayout` owns mobile drawer state; the sidebar remains fixed on desktop and becomes an overlay drawer below the desktop breakpoint.
- Route-level lazy loading keeps dashboard, links, analytics, settings, and public pages in separate frontend chunks.
- Page components continue to consume existing React Query hooks, AuthProvider state, Axios services, analytics data, and QR utilities unchanged.
- Toasts provide non-blocking success, error, warning, and information feedback; API errors continue through the centralized error mapper.
- Responsive layouts stack at mobile widths, links use dedicated mobile cards, and wide data tables are only rendered at desktop sizes.

Accessibility decisions:

- Visible `focus-visible` outlines are applied globally.
- Navigation drawers expose dialog semantics, labeled controls, outside-click dismissal, and Escape-key dismissal.
- Modals expose dialog labels and backdrop dismissal.
- Theme, menu, password visibility, QR, and copy controls have accessible names.
- Reduced-motion preferences suppress nonessential transitions and animations.

Phase 1 Complete
Phase 2 Complete
Phase 3 Complete
Phase 4 Complete

Current Phase:
Phase 5 Analytics

Implemented analytics APIs:
- GET /api/v1/analytics/overview
- GET /api/v1/analytics/top-links
- GET /api/v1/analytics/urls/:urlId/summary
- GET /api/v1/analytics/urls/:urlId/timeseries
- GET /api/v1/analytics/urls/:urlId/browsers
- GET /api/v1/analytics/urls/:urlId/devices
- GET /api/v1/analytics/urls/:urlId/os
- GET /api/v1/analytics/urls/:urlId/referrers
- GET /api/v1/analytics/urls/:urlId/countries

Next:
Frontend Dashboard
Docker
GitHub Actions
Deployment

---

## Known Issues Resolved

Phase 6E.1 resolved:
- Google OAuth visibility and callback alignment.
- OAuth callback session restoration.
- Copy link frontend-origin bug.
- Expiration local-time display/edit/save bug.
- `/app/links` route mismatch.
- Redirect engine verification gap.
