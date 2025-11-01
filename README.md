# Rooted

Next.js application for the `intelliversetechnologies-pixel/rooted` repository.

## Quick Start

- Prerequisites:
  - Node.js 18.x (LTS) and npm
  - Git

```
# Install dependencies (uses package-lock.json)
npm ci

# Start development server
npm run dev

# Build for production (ensure required env vars are set)
npm run build

# Start production server
npm start
```

## Scripts

- `dev`: Run the Next.js dev server
- `build`: Production build
- `start`: Start built app
- `lint`: Run Next.js ESLint (if configured)

## Environment Variables

Create a `.env.local` file at the project root for local development. Example values depend on your integrations (Auth0, Supabase, Firebase, MongoDB). Common patterns:

```
NEXT_PUBLIC_API_BASE_URL=
AUTH0_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=
FIREBASE_API_KEY=
MONGODB_URI=
```

For CI builds that require env vars, set them in the GitHub repository settings (Settings → Secrets and variables → Actions) and unskip the build step in the workflow (see below).

## CI

This repo includes a GitHub Actions workflow in `.github/workflows/ci.yml` that installs dependencies and runs lint/tests. The build step is disabled by default to avoid failures when env vars are missing. To enable builds in CI, set `CI_SKIP_BUILD` to `false` or remove the `if` guard in the workflow.

## Contributing

Please open pull requests against `main`. A PR template is provided in `.github/pull_request_template.md` to guide submissions.

