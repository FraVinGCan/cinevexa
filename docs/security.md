# Security and API credentials

## Current TMDB credential boundary

Applies to: `src/lib/tmdb/**`, `.env.example`, deployment configuration

Cinevexa is currently a client-rendered Vite application with no backend. The TMDB v3 API key and required v4 API Read Access Token are supplied through `VITE_TMDB_API_KEY` and `VITE_TMDB_API_READ_ACCESS_TOKEN`; Vite embeds both configured app credentials into the browser bundle. Anyone who can use the deployed application can therefore recover and reuse them.

These app credentials must not be treated as server secrets in this architecture. They must not be committed to Git, placed in source files, or populated with real values in `.env.example`; local values belong only in the ignored `.env` file. Approved v4 user access tokens and converted v3 session IDs are persisted in the browser auth store for the connected user.

## TMDB user authentication

Cinevexa requires TMDB v4 user authentication. The app-level Read Access Token creates the v4 request token used for TMDB approval. After approval, Cinevexa exchanges the v4 user access token for a v3 `session_id` so the current account features can use the existing v3 API contract. The app persists the v4 user token and v3 session ID locally; the app-level Read Access Token remains an environment variable only.

The application calls TMDB directly from the browser, so `VITE_TMDB_API_KEY` and `VITE_TMDB_API_READ_ACCESS_TOKEN` are included in the client bundle and are publicly recoverable at runtime. Neither is a server secret.

## Required production hardening

To make the TMDB key private, introduce a server-side or serverless TMDB proxy:

```text
Browser -> Cinevexa API proxy -> TMDB
                              -> TMDB API key
```

The proxy must store the key in a server-only environment variable without the `VITE_` prefix, forward the required TMDB requests, and keep browser session credentials separate from the server key. The client TMDB adapter must call the proxy instead of `api.themoviedb.org` directly.

The proxy implementation is intentionally deferred until the deployment target is selected. Vercel, Netlify, Cloudflare Pages, and a standalone Node server require different function layouts and environment configuration.

Until then, deployments must assume the TMDB key is public. Restrict its usage where TMDB and the hosting environment support it, monitor usage, and rotate it if it is committed or otherwise shared outside the intended deployment.
