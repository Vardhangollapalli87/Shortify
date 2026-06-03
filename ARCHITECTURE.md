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

JWT Access Token

Refresh Token Rotation

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