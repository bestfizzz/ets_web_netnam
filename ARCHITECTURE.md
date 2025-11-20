# ETSclientUI — Architecture Overview

## Summary
ETSclientUI is a Next.js TypeScript frontend application that acts as a UI client and proxy to backend APIs (including an Immich integration). The project includes:
- Next.js app (pages/app directory)
- Client-side API wrappers under `lib/client_api/`
- Shared HTTP wrapper at `lib/http`
- Types under `lib/types/`
- Logging utility at `lib/logger/logger.ts`
- Public assets including an embedded CKEditor build at `public/ckeditor`
- Dockerfile for production image

## Tech stack
- Next.js (TypeScript)
- Node.js (runtime)
- Docker (container image)
- CKEditor 4 (embedded under `public/ckeditor`)
- HTTP client wrapper (in `lib/http`)
- Custom logger: [`lib/logger/logger.ts`](lib/logger/logger.ts)

## High-level architecture
- Browser -> Next.js frontend (client & server-side rendering)
- Frontend uses client API wrappers in `lib/client_api/` for API calls.
- Some client APIs call a local proxy path (e.g. `/api/url-manager`) while others may call the remote server directly using `process.env.NEXT_PUBLIC_URL`.
- The Next.js app can be built into a standalone Node server (see `Dockerfile`).

ASCII overview:
Client browser
  ↕
Next.js app (pages / app/)
  ↕
Client API wrappers → local proxy endpoints (/api/*) OR direct server via NEXT_PUBLIC_URL
  ↕
Remote backend (Immich / AI services)

## Important modules & files
- Client API wrappers
  - [`lib/client_api/url-manager.client.ts`](lib/client_api/url-manager.client.ts) — Url manager client. Exposes `UrlManagerClientAPI` with:
    - list → `url-manager.client.ts#list`
    - serverList → `url-manager.client.ts#serverList` (uses `process.env.NEXT_PUBLIC_URL`)
    - create / get / update / delete
- HTTP wrapper
  - [`lib/http`](lib/http) — centralized fetch wrapper used by all client APIs (see usages in `lib/client_api/*`)
- Types
  - [`lib/types/url-manager`](lib/types/url-manager) — request/response shapes for Url Manager APIs
- Logger
  - [`lib/logger/logger.ts`](lib/logger/logger.ts) — writes colored console output and file logs (logs folder)
- API Documentation
  - [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md) — API spec, models, env variables
- Docker
  - [`Dockerfile`](Dockerfile) — multi-stage build for production

## Environment variables (high-level)
See full list in [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md). Key entries used by the frontend:
- NEXT_PUBLIC_URL — direct backend base URL (used by `serverList` in `url-manager.client.ts`)
- NEXT_PUBLIC_BACKEND_URL — optional alternate backend
- NODE_ENV, PORT

## Notes & gotchas
- `lib/client_api/url-manager.client.ts` constructs SERVER_BASE using `process.env.NEXT_PUBLIC_URL`:
  - Ensure `NEXT_PUBLIC_URL` is set at build time for server-side direct calls.
- The repo includes a local copy of CKEditor under `public/ckeditor`. Licensing notes are inside `public/ckeditor/LICENSE.md` and plugin READMEs (some premium plugins mention licensing).
- Logger writes into `logs` directory created at runtime (see `lib/logger/logger.ts`).

## How to run (dev)
- Install:
  - npm ci
- Start dev server:
  - npm run dev
- Open:
  - http://localhost:3000

## How to build & run (prod)
- Build:
  - npm run build
- Start:
  - npm start
- Or use `Dockerfile`:
  - docker build -t etsclientui .
  - docker run -e NEXT_PUBLIC_URL="https://api.yourserver" -p 3000:3000 etsclientui

## Recommended documentation & next steps
1. Centralize the HTTP wrapper documentation in `lib/http/README.md` describing:
   - error handling
   - automatic token injection
   - types used (generic typing pattern used in client calls)
2. Add API usage examples and code snippets for each client API (e.g. show how to call [`UrlManagerClientAPI.serverList`](lib/client_api/url-manager.client.ts#serverList) with session cookie).
3. Add a short CONTRIBUTING.md with local environment setup and Docker instructions.
4. Add unit tests for `lib/client_api/` wrappers (mock `lib/http`) — example test target: `url-manager.client.ts`.
5. Add CI that checks env variables presence for builds that rely on `NEXT_PUBLIC_URL`.

## Quick example: Using UrlManagerClientAPI
- File: [`lib/client_api/url-manager.client.ts`](lib/client_api/url-manager.client.ts)
- Example usage:
```ts
// call list (proxied)
await UrlManagerClientAPI.list()

// call serverList (direct)
await UrlManagerClientAPI.serverList(sessionCookie, accessToken)
```

## Where to find more details
- Application README — [`README.md`](README.md)
- API spec — [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md)
- CKEditor assets & license — [`public/ckeditor`](public/ckeditor)
- Logger implementation — [`lib/logger/logger.ts`](lib/logger/logger.ts)
