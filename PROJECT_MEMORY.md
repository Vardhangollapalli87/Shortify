# SHORTIFY - PROJECT MEMORY

## Project Status

Shortify is a production-grade URL shortening SaaS platform similar to Bitly, Dub.co, and TinyURL.

This is NOT a resume-only project.

Primary goal:

* Real users
* Public deployment
* Production-grade architecture
* Scalable backend
* Professional SaaS UI
* Real analytics
* Secure authentication

---

# Current Tech Stack

Frontend

* React
* JavaScript (NOT TypeScript for v1)
* Tailwind CSS
* Shadcn UI

Backend

* Node.js
* Express.js
* JavaScript

Database

* MongoDB Atlas

Cache

* Redis Cloud

Authentication

* JWT Access Tokens
* Refresh Tokens
* Google OAuth

Infrastructure

* Docker
* GitHub Actions

Deployment

* Frontend: Vercel
* Backend: Render

---

# Completed Phases

## Phase 6A - Frontend Foundation ✅

Implemented:

* JavaScript-only React frontend foundation
* Vite application shell
* Tailwind CSS setup
* React Router structure
* Axios client with JWT handling
* TanStack Query provider
* Auth context and protected route wrapper
* App shell, sidebar, navbar, and protected layout

Status:
Phase 6A foundation is complete. Dashboard, analytics, and settings pages are intentionally not yet implemented.

---

## Phase 1 - Backend Foundation ✅

Implemented:

* Express server
* MVC architecture
* MongoDB Atlas connection
* Environment configuration
* Health endpoint
* Global error handling
* Structured logging using Pino
* Security middleware
* Request IDs
* Docker support

Health endpoint:

GET /api/v1/health

Status:
COMPLETE

---

## Phase 2 - Authentication Module ✅

Implemented:

POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET /auth/me
POST /auth/forgot-password
POST /auth/reset-password

Features:

* bcrypt password hashing
* JWT access tokens
* Refresh token rotation
* Protected routes
* Role-based authorization
* Refresh token persistence
* Password reset flow

Status:
COMPLETE

---

## Phase 3 - Google OAuth ✅

Implemented:

GET /auth/google
GET /auth/google/callback

Features:

* Google OAuth 2.0
* Existing user login
* New user registration
* Account linking by email
* JWT generation after OAuth
* Refresh token generation
* React callback integration
* CSRF state validation

OAuth Configuration:

GOOGLE_CALLBACK_URL

http://localhost:5000/api/v1/auth/google/callback

Status:
COMPLETE

---

## Phase 4 - Redirect Engine ✅

Implemented:

GET /:shortCode

Features:

* Redis-first lookup
* MongoDB fallback
* Fast redirects
* Invalid link handling
* Disabled link handling
* Expired link handling
* Password-protected links
* Analytics collection
* Async analytics processing
* Redis Cloud integration

Error Codes:

LINK_NOT_FOUND
LINK_DISABLED
LINK_EXPIRED
LINK_PASSWORD_REQUIRED
LINK_PASSWORD_INVALID

Status:
COMPLETE

---

# Redis Architecture

Using Redis Cloud.

NO local Redis installation.

Environment Variable:

REDIS_URL

Rules:

* Redis failures must never crash application.
* MongoDB acts as fallback.
* Application must continue functioning if Redis is unavailable.

Cache Strategy:

shortify:redirect:{shortCode}

Redirect Flow:

Redis Lookup
↓
MongoDB Fallback
↓
Cache Result
↓
Redirect User
↓
Collect Analytics Async

---

# Current MongoDB Collections

users

refresh_tokens

urls

clicks

url_daily_stats

---

# Authentication Strategy

Email Login

Google OAuth Login

JWT Access Token

Refresh Token Rotation

Protected Routes

Role-Based Authorization

Refresh Tokens stored hashed

Passwords hashed with bcrypt

---

# Important Environment Variables

NODE_ENV

PORT

MONGODB_URI

REDIS_URL

JWT_ACCESS_SECRET

JWT_REFRESH_SECRET

JWT_ACCESS_EXPIRES_IN

JWT_REFRESH_EXPIRES_IN

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

GOOGLE_CALLBACK_URL

CLIENT_URL

VITE_SHORT_LINK_BASE_URL

---

# Product Requirements

Must remain production-grade.

Must support real users.

Must be deployable publicly.

Must follow SaaS standards.

Must remain scalable.

Must prioritize backend quality over feature quantity.

---

# Current Phase

Phase 6E.3B - Authenticated Root Redirect ✅

Implemented:

* Root route `/` now waits for AuthProvider session restoration.
* Authenticated users visiting `/` are redirected to `/dashboard`.
* Unauthenticated users still see the Landing page.

Files:

* `frontend/src/App.jsx`

---

Phase 6E.3A - Session Persistence Audit & Fix ✅

Session Audit Findings:

* Refresh cookie settings are persistent: `httpOnly`, `maxAge` from `JWT_REFRESH_EXPIRES_IN`, auth path `/api/v1/auth`, optional `COOKIE_DOMAIN`, `sameSite=lax` in development, and `sameSite=none` plus `secure=true` in production.
* Credentials login and Google OAuth both generate access tokens and refresh token records through the same backend token service.
* Credentials auth sets frontend user state directly from the login/register response.
* Google OAuth sets the refresh cookie in the callback, then frontend restores user state through `/auth/refresh`.
* ProtectedRoute correctly waits for AuthProvider loading before redirecting.

Root Cause Found:

* Refresh-token rotation was strict: if a valid refresh cookie was used twice in a short window, the first request rotated and revoked it while the second request could return `INVALID_REFRESH_TOKEN`.
* This could happen during browser startup, page refresh, OAuth callback restoration, React development remounts, or multiple open tabs.
* Some frontend and backend auth/session URL defaults were hardcoded instead of being sourced only from environment configuration.

Fix Implemented:

* Added a short `REFRESH_TOKEN_ROTATION_GRACE_SECONDS` window for duplicate use of a just-rotated refresh token.
* Duplicate refresh within the grace window returns a valid access token/user session without setting a stale replacement cookie.
* Refresh responses now set a refresh cookie only when a new refresh token is actually issued.
* Removed hardcoded auth/session URL defaults from frontend API/OAuth helpers and backend env config.
* Added `verify:session-restore` script for duplicate refresh restoration behavior.

Affected Files:

* `backend/src/services/token.service.js`
* `backend/src/controllers/auth.controller.js`
* `backend/src/config/env.js`
* `backend/.env.example`
* `backend/package.json`
* `backend/scripts/verify-session-restore.js`
* `frontend/src/lib/axios.js`
* `frontend/src/components/auth/GoogleOAuthButton.jsx`
* `frontend/src/lib/shortLinks.js`

---

Phase 6E.2 - User Experience & Session Hardening ✅

Audit Findings:

Critical Bugs:

* Password-protected backend redirects return `LINK_PASSWORD_REQUIRED`, but browser users do not get a friendly password challenge.
* Existing password-protected links cannot be cleanly unprotected from the edit form because blank password input is treated as "leave unchanged".
* OAuth callback and AuthProvider initialization can issue unnecessary refresh calls, which can rotate refresh tokens more than once.

High Priority Improvements:

* Login/register flows need immediate auth-state reliability after successful credential or OAuth auth.
* Frontend API errors need centralized mapping from backend error codes to user-friendly messages.
* Rate-limit and auth errors need friendly retry guidance instead of raw backend text.
* URL forms need frontend validation for URL, alias, password, and expiration constraints.

Medium Priority Improvements:

* Landing page is placeholder quality and needs a professional SaaS first screen.
* Dashboard needs improved hierarchy, KPI presentation, and release-ready wording.
* Links management needs search, sort, filter, improved actions, copy feedback, and a details view.

Implementation Roadmap:

1. Add centralized frontend API error mapping.
2. Dedupe AuthProvider session restoration and make OAuth/credentials state updates consistent.
3. Add frontend password challenge route for protected short links.
4. Redirect protected-link password errors from backend to the frontend challenge page for browser users.
5. Add explicit password keep/update/remove behavior in the Links edit form.
6. Add frontend form validation.
7. Improve landing, dashboard, and links management UX without adding QR, deployment, or Phase 7 scope.

Implemented:

* Added centralized frontend API error mapping for backend error codes and rate-limit guidance.
* Added shared refresh-session dedupe in AuthProvider to prevent duplicate refresh-token rotation.
* Added public password challenge page for password-protected short links.
* Backend redirects password-required and invalid-password browser flows to the frontend challenge page.
* Link edit form now supports keep, set/change, and remove password protection.
* Added frontend validation for original URL, custom alias, password length, and expiration date.
* Links management now supports search, status filters, sorting, details view, and copy feedback.
* Landing page updated from placeholder to release-ready SaaS positioning.
* Dashboard wording and KPI presentation improved for release polish.
* Added password removal verification script.

---

Phase 6E.1 - Critical Product Hardening ✅

Implemented:

* Google OAuth sign-in is visible on Login and Register pages.
* OAuth callback alignment now defaults to `/auth/callback`, with legacy `/auth/oauth/callback` still accepted by the frontend.
* AuthProvider exposes session restoration for OAuth completion.
* OAuth failures redirect back to Login with user-facing error handling.
* Copied short links now use `VITE_SHORT_LINK_BASE_URL` instead of the frontend origin.
* Link expiration editing converts stored UTC into local datetime input values and saves local input back to UTC.
* Links table displays expiration in local time.
* `/app/links` now renders the Links management page consistently with `/links`.
* Redirect engine verification script and documentation added.

Known Issues Resolved:

* Google OAuth was implemented on the backend but not visible from frontend auth pages.
* OAuth success callback default did not match the frontend route.
* Copy link used the frontend origin instead of the backend/public short-link origin.
* Expiration dates drifted because UTC ISO strings were sliced directly into `datetime-local`.
* `/app/links` incorrectly rendered the Analytics page.
* Redirect engine behavior lacked local verification coverage.

---

Phase 6C - Links Management Page ✅

Implemented:

* Protected /links route
* Links management page with React Query
* Link table, link row, modal form, delete confirmation, copy button, status badge, and action controls
* Link creation, editing, deletion, and active/inactive toggle flows

Scope for this phase:

* Links management page only
* No analytics charts yet
* No settings page yet

Implemented:

* Protected /dashboard route
* Dashboard overview page with React Query integration
* KPI cards for total links, total clicks, unique visitors, and top performing link
* Top links table for analytics overview
* Reusable dashboard components for loading, empty, and error states

Scope for this phase:

* Dashboard MVP only
* No analytics charts yet
* No links page yet
* No settings page yet

---

# Next Phase

Phase 5 - Analytics System

MVP Analytics Scope (Approved)

* Add analytics-oriented MongoDB indexes for fast dashboard queries.
* Add `country` to click events for geographic reporting.
* Add `referrerHost` to click events for referrer aggregation.
* Keep MVP analytics limited to click-event capture and reporting APIs.

MVP analytics exclusions (Rejected for Phase 5)

* `visitorKey` is not part of MVP scope.
* `url_daily_stats` collection is not part of MVP scope.
* Bot detection is not part of MVP scope.

Requirements:

Track:

* Total Clicks
* Unique Visitors
* Browser
* Device
* Operating System
* Referrer
* Country
* Timestamp

Requirements:

* Dashboard-ready APIs
* Aggregation support
* Scalable MongoDB design
* Non-blocking writes
* Production-grade implementation
* Approved MVP indexes for clicks collection
* `country` and `referrerHost` fields in click records

Phase 5 Analytics Preparation Status:

* Schema preparation completed for `country` and `referrerHost`
* Analytics indexes prepared for MVP reporting queries
* Analytics API implementation is now in progress and routes are available under `/api/v1/analytics`
* Backend hardening completed for analytics input validation and overview aggregation efficiency

New analytics API routes:

* GET /api/v1/analytics/overview
* GET /api/v1/analytics/top-links
* GET /api/v1/analytics/urls/:urlId/summary
* GET /api/v1/analytics/urls/:urlId/timeseries
* GET /api/v1/analytics/urls/:urlId/browsers
* GET /api/v1/analytics/urls/:urlId/devices
* GET /api/v1/analytics/urls/:urlId/os
* GET /api/v1/analytics/urls/:urlId/referrers
* GET /api/v1/analytics/urls/:urlId/countries

Do not redesign existing architecture.

Continue from current implementation.

Use existing MongoDB schemas and Redis integration.
