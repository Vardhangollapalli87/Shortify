# Shortify Deployment Guide

## Deployment Audit Findings

Resolved in Phase 6E.5:

* Frontend did not have a Dockerfile.
* Root Docker Compose only started the backend API.
* Docker Compose used fixed local port mappings instead of environment interpolation.
* Frontend Vite dev server pinned a local host and port in source.
* Backend container health check used a hardcoded local hostname and implicit port fallback.
* Deployment documentation for Vercel, Render, MongoDB Atlas, Redis Cloud, and Google OAuth production setup was missing.
* Production environment validation did not fail fast for insecure production callback/origin URLs.

Remaining deployment risks:

* Frontend bundle has a large chunk warning and should be code-split after launch readiness.
* npm audit reports moderate frontend dependency advisories from the QR dependency tree.

## Target Architecture

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas
* Cache: Redis Cloud
* Email: Resend
* Future services: AWS S3

## Frontend Deployment - Vercel

Project root:

```text
frontend
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Required Vercel environment variables:

```text
VITE_API_BASE_URL=https://your-api-domain.example/api/v1
VITE_SHORT_LINK_BASE_URL=https://your-api-domain.example
```

Notes:

* `VITE_API_BASE_URL` must point to the Render backend API route prefix.
* `VITE_SHORT_LINK_BASE_URL` must point to the public redirect origin.
* `frontend/vercel.json` rewrites all SPA routes to `index.html`.

## Backend Deployment - Render

Backend root:

```text
backend
```

Runtime:

```text
Docker
```

Start command is provided by `backend/Dockerfile`.

Required Render environment variables:

```text
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
REDIS_URL=rediss://...
JWT_ACCESS_SECRET=<at least 32 characters>
JWT_REFRESH_SECRET=<at least 32 characters>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
REFRESH_TOKEN_ROTATION_GRACE_SECONDS=10
CORS_ORIGINS=https://your-frontend-domain.example
CLIENT_URL=https://your-frontend-domain.example
CLIENT_VERIFY_EMAIL_URL=https://your-frontend-domain.example/verify-email
CLIENT_PASSWORD_RESET_URL=https://your-frontend-domain.example/reset-password
EMAIL_VERIFICATION_TOKEN_EXPIRES_MINUTES=60
CLIENT_OAUTH_SUCCESS_URL=https://your-frontend-domain.example/auth/callback
CLIENT_OAUTH_FAILURE_URL=https://your-frontend-domain.example/login
RESEND_API_KEY=<resend-api-key>
EMAIL_FROM=Shortify <noreply@your-domain.example>
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
GOOGLE_CALLBACK_URL=https://your-api-domain.example/api/v1/auth/google/callback
REFRESH_TOKEN_COOKIE_NAME=shortify_refresh_token
GOOGLE_OAUTH_STATE_COOKIE_NAME=shortify_google_oauth_state
HEALTHCHECK_HOST=127.0.0.1
HEALTHCHECK_PATH=/api/v1/health
```

Optional Render environment variables:

```text
COOKIE_DOMAIN=
REQUEST_BODY_LIMIT=10kb
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
LOG_LEVEL=info
REDIRECT_CACHE_TTL_SECONDS=86400
PASSWORD_RESET_TOKEN_EXPIRES_MINUTES=15
```

Cookie notes:

* Production refresh cookies use `httpOnly`, `secure=true`, and `sameSite=none`.
* Leave `COOKIE_DOMAIN` empty unless the frontend and backend share a parent domain and cross-subdomain cookie scoping is required.
* `CORS_ORIGINS` must include the exact Vercel production origin.

## MongoDB Atlas Setup

1. Create an Atlas cluster.
2. Create a database user with application-only credentials.
3. Allow Render outbound access through Atlas network access rules.
4. Use the Atlas SRV connection string for `MONGODB_URI`.
5. Keep `autoIndex` disabled in production through the existing backend database config.

## Redis Cloud Setup

1. Create a Redis Cloud database.
2. Copy the TLS Redis connection string.
3. Set `REDIS_URL` on Render.
4. Keep Redis optional for local development; backend falls back to MongoDB if Redis is unavailable.

## Resend Setup

1. Create a Resend account.
2. Verify the sending domain.
3. Create an API key for transactional emails.
4. Set `RESEND_API_KEY` on Render.
5. Set `EMAIL_FROM` to a verified sender, for example `Shortify <noreply@your-domain.example>`.
6. Set `CLIENT_VERIFY_EMAIL_URL` to the frontend `/verify-email` route.
7. Keep `CLIENT_PASSWORD_RESET_URL` pointed at the frontend password reset route.

## Google OAuth Production Setup

Google Cloud Console authorized redirect URI:

```text
https://your-api-domain.example/api/v1/auth/google/callback
```

Backend variables that must match:

```text
GOOGLE_CALLBACK_URL=https://your-api-domain.example/api/v1/auth/google/callback
CLIENT_OAUTH_SUCCESS_URL=https://your-frontend-domain.example/auth/callback
CLIENT_OAUTH_FAILURE_URL=https://your-frontend-domain.example/login
```

Frontend login/register buttons derive the OAuth start URL from `VITE_API_BASE_URL`.

## Docker

Copy root compose variables:

```bash
cp .env.example .env
```

Copy backend variables:

```bash
cp backend/.env.example backend/.env
```

Build backend:

```bash
docker build -t shortify-api ./backend
```

Build frontend:

```bash
docker build --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL --build-arg VITE_SHORT_LINK_BASE_URL=$VITE_SHORT_LINK_BASE_URL -t shortify-frontend ./frontend
```

Run API and frontend:

```bash
docker compose up --build
```

Run with local Redis service:

```bash
docker compose --profile local-cache up --build
```

For Redis Cloud, set `REDIS_URL` in `backend/.env` and omit the `local-cache` profile.

## Deployment Checklist

* Backend `NODE_ENV` is `production`.
* Vercel `VITE_API_BASE_URL` points at the Render API `/api/v1`.
* Vercel `VITE_SHORT_LINK_BASE_URL` points at the public redirect origin.
* Render `CORS_ORIGINS` contains the exact Vercel origin.
* Google OAuth redirect URI exactly matches `GOOGLE_CALLBACK_URL`.
* MongoDB Atlas network access allows Render.
* Redis Cloud URL is set if redirect caching is required.
* JWT secrets are unique and at least 32 characters.
* Refresh cookie works in production browser testing.
* `/api/v1/health` returns healthy after deployment.

## Production Verification Checklist

* Register, login, logout.
* Google OAuth login.
* Credentials registration sends verification email.
* Email verification marks the account verified.
* Resend verification email works for unverified credentials users.
* Password reset email is delivered through Resend.
* Browser restart session restore.
* Create, edit, delete, toggle links.
* Password-protected link challenge.
* Expiring link behavior.
* Redirect from public short URL.
* Analytics collection after redirects.
* QR code generation and PNG download.
* Settings profile update, password change, and account deletion.
