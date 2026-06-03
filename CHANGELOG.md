# CHANGELOG

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

## Phase 5 - Analytics

Status: In Progress

Approved MVP preparation:

* [x] Add analytics indexes to the `clicks` collection
* [x] Add `country` to click event records
* [x] Add `referrerHost` to click event records
* [x] Update project documentation for Phase 5 scope

Phase 5 Analytics Preparation Status: Completed

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
