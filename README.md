## Freightos Ocean AI

This repository is a Next.js implementation of a Freightos-style ocean freight marketplace and rate management platform, based on the provided blueprint PDF and the public Freightos reference site.

### Tech stack

- Next.js App Router
- TypeScript
- React 19
- Supabase SSR client support for auth and Postgres-backed data flows
- Demo data fallback so first load is populated before Supabase is connected

### Getting started

Install dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev