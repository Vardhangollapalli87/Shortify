Shortify Roadmap

Completed
----------
✓ Backend Foundation
✓ Authentication
✓ Google OAuth
✓ Redirect Engine
✓ Phase 6E.1 Critical Product Hardening
✓ Phase 6E.2 User Experience & Session Hardening
✓ Phase 6E.3A Session Persistence Audit & Fix

Phase 6E.1 completed:
- Google OAuth is visible on Login and Register pages.
- OAuth callback defaults align to `/auth/callback`.
- AuthProvider can restore OAuth sessions after callback.
- OAuth failure handling is surfaced on Login.
- Copied short links use `VITE_SHORT_LINK_BASE_URL`.
- Expiration editing preserves local time while storing UTC.
- `/app/links` and `/links` route consistently to Links management.
- Redirect engine verification script and documentation are available.

Known Issues Resolved:
- Google OAuth not visible or not verified from the frontend.
- Copy Link generated frontend-origin URLs.
- Expiration date appeared incorrect after save.
- `/app/links` rendered the wrong page.
- Redirect engine lacked a repeatable verification command.

Current
----------
→ Phase 6E Product Hardening

Phase 6E.3A completed:
- Audited credentials and Google OAuth session restoration.
- Verified refresh cookie settings and ProtectedRoute behavior.
- Fixed duplicate refresh-token rotation within a short grace window.
- Prevented duplicate refresh responses from overwriting cookies with invalid/stale values.
- Removed hardcoded auth/session URL defaults from frontend and backend runtime config.
- Added `verify:session-restore` for duplicate refresh restoration behavior.

Phase 6E.2 audit:
- Critical Bugs: protected-link UX missing, password removal incomplete, refresh restoration can run unnecessarily more than once.
- High Priority Improvements: auth state reliability, API error mapping, rate-limit guidance, frontend validation.
- Medium Priority Improvements: landing page, dashboard hierarchy, links search/sort/filter/details/copy UX.

Phase 6E.2 implementation order:
1. Centralized frontend API error mapper
2. Session restoration dedupe and auth-state consistency
3. Password-protected link challenge flow
4. Password removal behavior
5. Frontend validation
6. Links management UX hardening
7. Landing and dashboard UX hardening

Phase 6E.2 completed:
- Password-protected links now route browser users through a friendly password challenge.
- Password removal is explicit in the edit form.
- AuthProvider dedupes refresh restoration to reduce unnecessary refresh-token rotations.
- Frontend API errors are mapped to user-friendly messages.
- URL creation/editing has client-side validation.
- Links management includes search, sort, filters, details, and copy feedback.
- Landing and dashboard copy/presentation are release-hardened.

Links management page completed:
- Protected /links route
- React Query integration for user links and link mutations
- Create, edit, delete, toggle, and copy actions
- Reusable modal and table components

Status: Links management page is implemented. Analytics charts and settings page remain out of scope for this phase.

Dashboard MVP completed:
- Protected /dashboard route
- React Query integration with /api/v1/analytics/overview and /api/v1/analytics/top-links
- KPI cards and top links table
- Reusable loading, empty, and error states

Status: Dashboard MVP is implemented. Analytics charts, links page, and settings page remain out of scope for this phase.

Frontend foundation completed:
- React + JavaScript + Vite
- Tailwind CSS
- React Router
- Axios client
- TanStack Query
- Auth provider + protected routing
- App shell + sidebar + navbar + protected layout

Status: Frontend foundation is in place. Dashboard, analytics, and settings UI remain out of scope for this phase.

Next
----------
→ Analytics UI
→ Links UI
→ Settings UI

Phase 5 preparation
- [x] Add approved analytics indexes to click collection
- [x] Add `country` field to click records
- [x] Add `referrerHost` field to click records
- [x] Document MVP analytics scope in project docs

Status: Analytics preparation completed. Analytics API implementation is now added under `/api/v1/analytics`.

Implemented
- JWT-protected analytics endpoints
- Ownership-aware analytics queries
- Aggregation-based summary, breakdown, and time-series responses

Phase 5 implementation plan
- Prepare analytics API endpoints and aggregation queries
- Keep MVP scope limited to analytics reporting
- Do not introduce `visitorKey`, `url_daily_stats`, or bot detection in this phase

Upcoming
----------
→ Frontend SaaS Dashboard
→ Docker
→ GitHub Actions
→ Deployment
→ Production Security Review
→ UI Polish
→ Launch
