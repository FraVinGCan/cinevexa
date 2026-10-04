# Cinevexa

A movie and TV discovery web app built on the [TMDB API](https://developer.themoviedb.org/docs/getting-started), with no separate backend or database.

## Stack

- React 19, TypeScript 6, Vite 8
- React Router 8 for routing
- TanStack Query 5 and its devtools for TMDB data fetching and caching
- shadcn/ui on Base UI, styled with Tailwind CSS 4
- React Hook Form with Zod 4 for forms and validation
- Zustand 5 for client state

## Getting started

Install dependencies:

```bash
npm install
```

Create a local env file from the example and add your TMDB credentials:

```bash
cp .env.example .env
```

```env
VITE_TMDB_API_KEY=your-tmdb-api-key
VITE_TMDB_API_READ_ACCESS_TOKEN=your-tmdb-api-read-access-token
```

Get both credentials from the [TMDB developer portal](https://developer.themoviedb.org/signup). The `.env` file is gitignored and must not be committed.

TMDB credentials are client-visible in this architecture. See [Security and API credentials](docs/security.md) for authentication and deployment guidance.

Start the dev server:

```bash
npm run dev
```

## Scripts

| Script            | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR    |
| `npm run build`   | Type-check, then build for production |
| `npm run lint`    | Run ESLint                            |
| `npm run preview` | Serve the production build locally    |

## Structure

```
src/
├── App.tsx                 # Root component
├── main.tsx                # Entry point, providers and router setup
├── components/
│   └── ui/                 # shadcn/ui components
├── lib/
│   └── utils.ts            # Shared helpers
└── css/
    └── main.css            # Global styles
```
