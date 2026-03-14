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
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment variables

Add a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
MAILTRAP_TOKEN=your-mailtrap-testing-token
MAILTRAP_TEST_INBOX_ID=your-mailtrap-test-inbox-id
MAILTRAP_FROM_EMAIL=your-sender-email
MAILTRAP_FROM_NAME=Freightos Demo
STRIPE_PAYMENT_LINK_NORMAL=
STRIPE_PAYMENT_LINK_EXPRESS=
STRIPE_PAYMENT_LINK_SUPERFAST=
STRIPE_PAYMENT_LINK_DEFAULT=
RAZORPAY_PAYMENT_LINK_NORMAL=
RAZORPAY_PAYMENT_LINK_EXPRESS=
RAZORPAY_PAYMENT_LINK_SUPERFAST=
RAZORPAY_PAYMENT_LINK_DEFAULT=
```

The current app expects Supabase to be configured for auth and server-side data reads.
The enterprise demo form sends email through Mailtrap Testing API when `MAILTRAP_TOKEN`, `MAILTRAP_TEST_INBOX_ID`, and `MAILTRAP_FROM_EMAIL` are set.
The checkout flow redirects to hosted payment URLs from the server environment. Use the service-specific payment link vars above, or set each provider's `*_PAYMENT_LINK_DEFAULT` as a fallback when all service tiers share the same hosted checkout URL.

If Supabase env vars are present:

- login and signup use Supabase Auth in the browser
- server components read live data from Supabase
- the dashboard and hero quote cards stop using demo fallback data

### Supabase SQL

Run these files in your Supabase SQL editor:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

### Blueprint coverage

- Marketplace-style hero and quote comparison panel
- Core freight capabilities from the PDF
- Workflow and KPI sections aligned to the MVP scope
- Supabase-ready table and API group modeling for future backend wiring

### Current pages

- `/`
- `/platform`
- `/solutions`
- `/resources`
- `/company`
- `/login`
- `/signup`
- `/dashboard`

### Suggested next implementation steps

1. Add Supabase env vars and generate a typed database client.
2. Add profile creation and row-level security policies around Supabase Auth users.
3. Replace static marketplace data with live quote and tracking APIs.
4. Persist homepage videos to Supabase Storage or another media store.
5. Add booking, document, and notification workflows.

### Reference material used

- Blueprint PDF: `freightos_blueprint_20260311_005225.pdf`
- Public reference site: `https://www.freightos.com/`
