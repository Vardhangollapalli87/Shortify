# CHANGELOG

## Phase 6E.4 - QR Code System

Status: Complete

Design Decision:

* QR codes are generated on the frontend from each link's canonical short URL.
* No backend QR endpoints, stored QR assets, or URL schema changes were added.

Implemented:

* Added QR action to Links management rows.
* Added reusable QRCodeModal, QRCodePreview, and QRCodeActions components.
* Added deterministic canvas QR rendering.
* Added PNG download for each short link QR code.
* Added short URL copy and QR preview regeneration inside the QR modal.
* Kept existing Link CRUD behavior unchanged.

Verification:

* Backend lint and frontend build were run for this phase.

---

## Phase 6E.3B - Settings & Account Management

Status: Complete

Implemented:

* Added protected user account endpoints under `/api/v1/users`
* Added profile retrieval and update
* Added credentials-only password change with current password and strength validation
* Added account deletion with owned link removal and refresh-token revocation
* Added protected `/settings` frontend route
* Added Settings page with Profile, Security, Connected Account, Session Information, and Danger Zone sections
* Added password visibility toggles and strength indicator
* Added delete account confirmation modal
* Added Settings API service module
* Added user-account API error mappings

Verification:

* Backend lint and frontend build were run for this phase.

---

## Phase 6E.3B - Authenticated Root Redirect

Status: Complete

Implemented:

* Added auth-aware root route behavior.
* Authenticated users visiting `/` now redirect to `/dashboard`.
* Unauthenticated users continue to see the Landing page.

---

## Phase 6E.3A - Session Persistence Audit & Fix

Status: Complete

Audit:

* Credentials and Google OAuth share the same refresh token generation and storage path.
* Browser restart restoration depends on the refresh cookie and `/auth/refresh`.
* Refresh cookie uses `httpOnly`, persistent `maxAge`, path `/api/v1/auth`, optional domain, and environment-specific `sameSite`/`secure`.
* ProtectedRoute waits for AuthProvider loading before redirecting.

Root Cause:

* Strict refresh-token rotation could return `INVALID_REFRESH_TOKEN` when the same valid refresh cookie was submitted more than once in a short window.
* Duplicate refreshes could come from page refresh, OAuth restoration, React development remounts, or multiple tabs.
* Some auth/session URLs had hardcoded defaults instead of env-only configuration.

Implemented:

* Added `REFRESH_TOKEN_ROTATION_GRACE_SECONDS`.
* Added duplicate refresh-token rotation grace handling.
* Prevented duplicate grace refresh responses from setting stale replacement cookies.
* Removed hardcoded auth/session URL defaults from frontend and backend runtime config.
* Added `verify:session-restore` verification script.

---

## Phase 6E.2 - User Experience & Session Hardening

Status: Complete

Audit:

* Critical Bugs: password-protected link UX, password removal, duplicate refresh restoration risk
* High Priority Improvements: auth-state reliability, API error mapping, rate-limit guidance, frontend validation
* Medium Priority Improvements: landing page polish, dashboard UX polish, links management UX polish

Implementation Roadmap:

* Centralize frontend API error mapping
* Dedupe session restoration and align OAuth/credentials auth-state behavior
* Add password challenge flow for protected links
* Add explicit password removal support
* Add frontend URL form validation
* Improve links management search/sort/filter/details/copy UX
* Improve landing and dashboard presentation

Implemented:

* Added centralized frontend API error mapper
* Added AuthProvider refresh-session dedupe
* Added password challenge page for protected short links
* Redirected protected-link password errors to the frontend challenge page
* Added explicit password keep, set/change, and remove options in link editing
* Added frontend validation for URL, alias, password, and expiration date
* Added Links management search, status filter, sorting, details view, and copy feedback
* Updated Landing page to professional SaaS messaging
* Improved Dashboard labels and KPI presentation
* Added password removal verification script

---

## Phase 6E.1 - Critical Product Hardening

Status: Complete

Implemented:

* Added visible Google OAuth actions to Login and Register pages
* Aligned OAuth success callback default to `/auth/callback`
* Added frontend compatibility route for `/auth/oauth/callback`
* Added AuthProvider session restoration for OAuth completion
* Added OAuth failure handling on the Login page
* Added `VITE_SHORT_LINK_BASE_URL` for canonical copied short links
* Updated copied short links to use the backend/public redirect origin
* Fixed expiration editing from stored UTC to local datetime input
* Fixed expiration saving from local datetime input back to UTC
* Added local expiration display in Links management
* Fixed `/app/links` to render Links management instead of Analytics
* Added redirect engine verification script
* Added redirect verification documentation

Known Issues Resolved:

* Google OAuth was not visible from frontend auth pages
* OAuth callback default route was misaligned
* Copy Link generated frontend-origin URLs
* Expiration date appeared incorrect after save
* `/app/links` routed to the wrong page
* Redirect engine had no repeatable local verification command

---

## Phase 1 - Backend Foundation

Status: Complete

Implemented:

* Express Server
* MongoDB Atlas
* Security Middleware
* Logging
* Global Error Handling
* Health Check Endpoint

---

## Phase 2 - Authentication

Status: Complete

Implemented:

* Registration
* Login
* JWT Authentication
* Refresh Tokens
* Password Reset
* Protected Routes

---

## Phase 3 - Google OAuth

Status: Complete

Implemented:

* Google OAuth Login
* JWT Generation
* Account Linking
* OAuth Callback Flow

---

## Phase 4 - Redirect Engine

Status: Complete

Implemented:

* Redis Lookup
* MongoDB Fallback
* Fast Redirects
* Password Protected Links
* Expired Links
* Async Analytics Collection

---

## Phase 6C - Links Management Page

Status: Complete

Implemented:

* Protected /links route
* Links page with React Query list and mutation flows
* Reusable components: LinkTable, LinkRow, LinkFormModal, LinkActions, ConfirmDeleteModal, CopyButton, StatusBadge
* Create, edit, delete, toggle, and copy actions for user-owned short links

Scope for this phase:

* Links management page only
* No analytics charts yet
* No settings page yet

---

## Phase 6B - Dashboard MVP

Status: Complete

Implemented:

* Protected /dashboard route
* Dashboard overview page
* Reusable dashboard components: DashboardHeader, StatCard, TopLinksTable, LoadingSkeleton, EmptyState, ErrorState
* React Query integration for /api/v1/analytics/overview and /api/v1/analytics/top-links

Scope for this phase:

* Dashboard MVP only
* No analytics charts yet
* No links page yet
* No settings page yet

---

## Phase 6A - Frontend Foundation

Status: Complete

Implemented:

* JavaScript-only frontend setup for React + Vite
* Tailwind CSS integration
* React Router structure
* Axios client and JWT-aware auth headers
* TanStack Query provider
* Auth context, protected route, and protected layout
* App shell with sidebar and navbar

Scope for this phase:

* Foundation only
* No dashboard pages yet
* No analytics UI yet
* No settings UI yet

---

## Phase 5 - Analytics

Status: In Progress

Approved MVP preparation:

* [x] Add analytics indexes to the `clicks` collection
* [x] Add `country` to click event records
* [x] Add `referrerHost` to click event records
* [x] Update project documentation for Phase 5 scope

Phase 5 Analytics Preparation Status: Completed

Phase 5 Analytics APIs

Implemented:

* Added analytics date-range validation for `startDate`, `endDate`, and maximum allowed range
* Added `urlId` validation for analytics resource access
* Simplified analytics overview aggregation to use `Click.userId` directly

* GET /api/v1/analytics/overview
* GET /api/v1/analytics/top-links
* GET /api/v1/analytics/urls/:urlId/summary
* GET /api/v1/analytics/urls/:urlId/timeseries
* GET /api/v1/analytics/urls/:urlId/browsers
* GET /api/v1/analytics/urls/:urlId/devices
* GET /api/v1/analytics/urls/:urlId/os
* GET /api/v1/analytics/urls/:urlId/referrers
* GET /api/v1/analytics/urls/:urlId/countries

Rejected for MVP Phase 5:

* `visitorKey`
* `url_daily_stats` collection
* bot detection

Planned next:

* Dashboard Analytics APIs
* Browser Breakdown
* Device Breakdown
* OS Breakdown
* Referrer Breakdown
* Time Series Analytics
* Top Links Analytics
