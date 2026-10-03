# Security and API credentials

## Current TMDB key boundary

Applies to: `src/lib/tmdb/**`, `.env.example`, deployment configuration

Cinevexa is currently a client-rendered Vite application with no backend. The TMDB v3 API key is supplied through `VITE_TMDB_API_KEY`, which Vite embeds into the browser bundle. Anyone who can use the deployed application can therefore recover and reuse that key.

The key must not be treated as a server secret in this architecture. It must not be committed to Git, placed in source files, or included in `.env.example`; local values belong only in the ignored `.env` file.

## Required production hardening

To make the TMDB key private, introduce a server-side or serverless TMDB proxy:

```text
Browser -> Cinevexa API proxy -> TMDB
                              -> TMDB API key
```

The proxy must store the key in a server-only environment variable without the `VITE_` prefix, forward the required TMDB requests, and keep browser session credentials separate from the server key. The client TMDB adapter must call the proxy instead of `api.themoviedb.org` directly.

The proxy implementation is intentionally deferred until the deployment target is selected. Vercel, Netlify, Cloudflare Pages, and a standalone Node server require different function layouts and environment configuration.

Until then, deployments must assume the TMDB key is public. Restrict its usage where TMDB and the hosting environment support it, monitor usage, and rotate it if it is committed or otherwise shared outside the intended deployment.
