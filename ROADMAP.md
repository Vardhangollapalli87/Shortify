Shortify Roadmap

Completed
----------
✓ Backend Foundation
✓ Authentication
✓ Google OAuth
✓ Redirect Engine

Current
----------
→ Phase 6A Frontend Foundation

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