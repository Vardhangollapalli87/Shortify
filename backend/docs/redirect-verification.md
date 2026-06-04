# Redirect Engine Verification

Phase 6E.1 verifies the redirect engine without requiring MongoDB or Redis by mocking the model and cache boundaries in `backend/scripts/verify-redirect-engine.js`.

Verified cases:

* Active link resolves to its original URL and is cached.
* Disabled link returns `LINK_DISABLED`.
* Expired link returns `LINK_EXPIRED`.
* Missing link returns `LINK_NOT_FOUND`.
* Password-protected link requires a password.
* Password-protected link rejects an invalid password.
* Password-protected link accepts a valid password.
* Redirect analytics creates a click record and increments URL click counters.

Command:

```sh
npm run verify:redirect
```

Manual production check:

* Create a link from the Links page.
* Copy the generated short link and confirm it uses `VITE_SHORT_LINK_BASE_URL`.
* Open the short link and confirm the backend redirects to the original URL.
* Disable the link and confirm it no longer redirects.
* Set an expiration date in local time and confirm the saved value displays in local time.
* Add password protection and confirm the redirect requires the password.
* Confirm analytics increments after a successful redirect.
