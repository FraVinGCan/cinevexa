# Cinevexa

A movie and TV discovery web app built on the [TMDB API](https://developer.themoviedb.org/docs/getting-started), with no separate backend, database, or auth system.

## Stack

- React 19
- TypeScript
- Vite 8
- React Router

## Getting started

Install dependencies:

```bash
npm install
```

Create a local env file from the example and add your TMDB API key:

```bash
cp .env.example .env
```

```env
VITE_TMDB_API_KEY=your-tmdb-api-key
```

Get a key from the [TMDB developer portal](https://developer.themoviedb.org/signup). The `.env` file is gitignored and must not be committed.

Start the dev server:

```bash
npm run dev
```

## Scripts

| Script            | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR |
| `npm run build`   | Type-check, then build for production |
| `npm run lint`    | Run ESLint                         |
| `npm run preview` | Serve the production build locally |

## Structure

```
src/
├── App.tsx        # Root component
├── main.tsx       # Entry point, React Router setup
└── css/
    └── main.css   # Global styles
```
