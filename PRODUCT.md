# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences, weighted equally in scope and craft.

**The streaming-bound viewer.** They have limited time and a subscription or two, and they arrive with a question of the form "what should I watch tonight?" They browse curated rails, filter down, and want to leave knowing a title _and_ where they can actually watch it in their market. Their job is a confident decision, not a catalogue tour. Success for them is finding one title they then watch, so the gap between discovery and a playable option is the part that matters most.

**The film fan building a library.** They return over months, tracking, rating, and organising titles. Their job is a well-kept personal record — a watchlist that is not a dumping ground, favourites that mean something, ratings they can trust, and custom lists for the cases TMDB's own lists do not cover. Success for them is saving and finding a title across sessions without friction.

Both arrive on the catalogue surface first. Neither is a secondary or degraded mode of the other; a visitor can be one on Tuesday and the other on Saturday.

## Product Purpose

Cinevexa is a movie and TV discovery web app. It lets a visitor find films, series, and the people behind them, understand them in depth, and decide where to watch — then, optionally, keep what they found in a personal library that persists.

It exists because catalogue data is scattered across many sites, and none of them answer both "what is this" and "where can I actually get it". The product's success is a visitor arriving with a vague itch, leaving with a specific title and a provider, and — for the returning visitor — leaving with that title in a library they built themselves.

## Positioning

**TMDB is the only backend, the only database, and the only identity provider.** There is no server, no BFF, no serverless proxy, and no first-party account system. TMDB is the source of truth for catalogue data, artwork, trailers, reviews, watch providers, and every user-owned collection. This is a genuine mechanism, not a claim: a conventional product would need accounts, a database, and a sync layer, and this one has none.

Everything user-owned therefore lives in the visitor's own TMDB account. Personal data is never held by Cinevexa beyond a TMDB `session_id` in the visitor's own browser storage. That is a real privacy property and a real constraint at the same time: there is no way to offer a Cinevexa-specific feature that TMDB cannot store, and no way to recover a library that is not a TMDB library.

The other half of the position: **anonymous browsing is a complete experience, and sign-in is an upgrade rather than a gate.** Every catalogue, discovery, search, and detail surface works signed out and is never gated, stubbed, or degraded to push a sign-in prompt. Signing in with TMDB unlocks the watchlist, favourites, ratings, custom lists, and personalised recommendations. The visitor chooses to upgrade; the product does not withhold the core job in exchange.

## Operating Context

- The app is a client-rendered SPA. All TMDB traffic goes directly from the visitor's browser to TMDB; requests carry the API key from build-time environment configuration.
- **The target market is the visitor's own region.** Watch providers, certification filters, release dates, and region-scoped rails all resolve against a region the visitor selects and can change. A title being unavailable in a region is normal, not an error state.
- Image-forward browsing is the real usage scene. The product is judged on a dark room, a large poster grid, and long horizontal browsing — so density, legibility of metadata at small sizes, and smooth scrolling are functional requirements, not decoration.
- The primary locale is `en-US`, and the interface language is fixed at English for now.
- The `session_id` is the user's credential. It lives in browser storage, is cleared on sign-out and on any `401` from TMDB, and its loss means the library is simply reconnected — there is no Cinevexa-side recovery path to design for.
- The product is a portfolio and demonstration piece. It is judged on craft, completeness, and legibility of its engineering by a reviewer rather than by a user base. That makes false substance — invented numbers, fake testimonials, decorative complexity with no job — the most damaging thing this product can do.

## Capabilities and Constraints

**Catalogue and discovery** — trending by day and week across all media, now playing, popular, top rated, and upcoming movies; popular, top rated, on the air, and airing today shows; filterable discovery for movies and series; search across movies, series, and people; keyword-driven browsing.

**Depth** — full movie and series detail from a single catalogue request: overview, cast and crew, trailers and images, reviews, similar titles, recommendations, watch providers, and external links. Series extend to season and episode pages. People, collections, and keywords each have their own surfaces.

**Personal library** (requires a TMDB account) — watchlist, favourites, ratings, custom lists, and personalised recommendations, all read from and written back to TMDB. Optimistic watchlist, favourite, and rating controls, with a per-title `account_states` read as the source of truth for the control state.

**Shareability** — every filter, sort, tab, and page state lives in the URL, so any view is shareable, bookmarkable, and back-button correct.

**Constraints that future work must respect**

- TMDB is the only data source. Any feature that cannot be served by a documented TMDB endpoint is out of scope unless the constraint itself is changed deliberately.
- No server-side rendering, no prerendering, no application-owned authentication, no first-party content of any kind.
- TMDB rate limits are real. The home surface fans out to several independent requests; duplicate fetches for shared data and polling are defects, not trade-offs.
- The v3 request-token authentication flow is the confirmed path, because the v4 flow requires an API Read Access Token that is not configured.
- Only TMDB endpoints that back a shipped surface are implemented.
- New dependencies require explicit approval and are pulled through the shadcn add command so the change surfaces.

**Open decisions, deliberately unrecorded**

- Whether the v4 personalised recommendations endpoint accepts a v3 session. It is planned to fall back to a watchlist- and favourites-derived section, and that fallback is not yet confirmed.
- Whether the interface is ever localised beyond English. Nothing requires it yet.
- The accessibility conformance target. The specific requirements below are confirmed; the formal standard is not chosen.

## Brand Commitments

The name **Cinevexa** is fixed, alongside a single SVG favicon. There is no confirmed logo, voice, or personality; this record makes no claim about them.

**The visual world is a keyable, page-addressed broadcast index.** Every title is an addressed cell that carries its own channel, so a visitor's region and a title's provider are read from the cell rather than opened in a dialog. The arrangement this refuses is the streaming app's own: a full-bleed backdrop hero followed by undifferentiated poster rails. The interface never reads as a streaming service, and a poster wall that never answers where to watch is a failure of the product, not a style.

**The palette is a seven-role frame, dark-first.** A near-black ground, a red primary that carries every action and active mark, a gold reserved for scores and nothing else, and one cool role for live programming. A real light mode ships and is designed in its own right, because a poster grid on a light ground is a different composition problem rather than an inverted dark one. TMDB artwork is never tinted, cropped to its cell and left in its own colour.

Confirmed constraints on naming: the TMDB name and marks are TMDB's, not Cinevexa's, and TMDB attribution is required wherever TMDB data appears. "Cinevexa" is the only first-party name, and the app title and favicon carry it.

## Evidence on Hand

Every real content asset in this product comes from TMDB at runtime, and the interface is built to display it.

- **Catalogue content:** titles, series, seasons, episodes, people, collections, keywords, genres, certifications, and their metadata.
- **Media:** poster and backdrop artwork, profile images, stills, and trailers at TMDB's published image sizes.
- **Editorial:** user-written TMDB reviews, used as reviews, with their author and score.
- **Commerce-shaped data:** watch-provider availability and monetisation type per region, which is the mechanism that closes the "where can I watch it" loop.
- **Ratings:** TMDB vote averages and vote counts. These are the only scores shown, and no Cinevexa-authored score exists.

**Absences that future work must not fabricate:** no user testimonials, no customer logos or counts, no usage statistics, no performance benchmarks, no editorial voice of our own, no pricing or licensing claims, and no Cinevexa-originated ratings. The absence of testimonials and usage numbers is a consequence of this being a demonstration piece with no user base, and the interface must be designed so that its absence reads as honest rather than unfinished.

## Product Principles

1. **A signed-out visitor gets the whole job.** Discovery, search, and depth are complete without an account. Sign-in is offered where it genuinely adds something, and nowhere as a toll gate.
2. **One title, one clear path to watching.** Discovery that cannot answer "where do I get this, in my region" is a dead end. Providers are a first-class part of the answer, not a footnote.
3. **Depth without ceremony.** A title's full story — who made it, what people think, what it resembles, what images exist — arrives in a single request and reads as one surface, not a stack of widgets.
4. **The library is the visitor's, honestly.** Everything personal is read from and written to the visitor's own TMDB account, with optimistic controls that never lie about state and never fabricate a save that did not happen.
5. **Earn the portfolio claim.** Craft and completeness are the deliverable. No invented proof, no decorative complexity, no surface that exists only to look considered.

## Accessibility & Inclusion

Confirmed requirements, established in the project plan:

- Every interactive element has a visible focus ring, an accessible name, and a minimum 44 px touch target.
- Poster cards hold a 2:3 aspect ratio at every breakpoint, so grid layout never reflows as images load and content is never lost to a layout shift.
- `prefers-reduced-motion` disables carousel autoplay, transitions, and skeleton shimmer.
- Every loading, error, and empty state offers a next action — search, clear filters, or sign in — rather than a dead end.
- Missing artwork renders a designed placeholder instead of a broken image or collapsed card.
