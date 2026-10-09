# CashLens

CashLens is a portfolio and learning project focused on building a production-style QuickBooks financial dashboard using Next.js, TypeScript, and Supabase.

The project is based on a real freelance client requirement and is being developed incrementally through small vertical slices.

## Goals

CashLens is designed to explore practical application development around:

- QuickBooks API integration
- OAuth
- financial data synchronisation
- background processing
- scheduled jobs
- Supabase Edge Functions
- Supabase Queues
- integration reliability
- financial dashboards and reporting

The focus is on pragmatic, freelancer-friendly application development rather than enterprise-level architecture.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Zod
- React Hook Form
- pnpm
- Vercel

Additional technologies will be introduced as the project evolves.

## Development

Install dependencies:

```bash
pnpm install
```

Start the local development server:

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

Run the production build gate:

```bash
pnpm build:prod
```

## Environment Configuration

Copy the example environment file and add the required values:

```bash
cp .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

For local development:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The deployed application uses its Vercel URL for `NEXT_PUBLIC_SITE_URL`.

`.env.local` is not committed to source control.

## Deployment

CashLens is deployed with Vercel.

Live application:

https://cash-lens-eta.vercel.app/

For the current development phase, CashLens uses the existing `document-hub-staging` Supabase project as a shared development backend. This is a temporary pragmatic setup while working within the current Supabase project limit.

Because Supabase Auth configuration is project-wide, CashLens explicitly provides its email confirmation redirect URL rather than relying on the shared project's default Site URL.

When CashLens becomes substantial enough to require isolated infrastructure, the intended environment structure is:

```text
cash-lens-staging
    ↓
local development / testing

cash-lens
    ↓
production
```

## Documentation

### Learning journey

CashLens is being built incrementally through practical vertical slices. Each guide documents the decisions, implementation steps, problems encountered, and key learning from that milestone.

1. [Slice 1 — Project Foundation](docs/learning/01-project-foundation.md)
2. [Slice 2 — Authentication](docs/learning/02-authentication.md)

### Coding standards

Project conventions are recorded in:

[CODING_STANDARDS.md](CODING_STANDARDS.md)

The standards are intentionally developed alongside the application rather than creating a large rulebook upfront. Conventions are added when the project encounters a real need for consistency, maintainability, or clearer testing boundaries.

## Project Status

CashLens currently has:

- a deployed Next.js + Supabase foundation
- complete Supabase authentication
- signup with client and server validation
- email confirmation and callback handling
- protected authenticated routes
- sign in and sign out
- production build validation through `pnpm build:prod`

The application is deployed at:

https://cash-lens-eta.vercel.app/

### Next

The next slice will begin the QuickBooks integration, starting with the OAuth connection flow between a CashLens user and a QuickBooks company.

Detailed implementation notes and learning history are available in the [learning documentation](docs/learning/).

## Current Application Flow

```text
Unauthenticated
    |
    |-- /signup
    |      `-- create account + confirm email
    |
    `-- /login
           `-- authenticate
                  |
                  v
             /dashboard
                  |
                  `-- sign out
                         |
                         v
                      /login
```

The dashboard is currently intentionally minimal. Future slices will introduce the QuickBooks integration and financial dashboard functionality.

Development will continue through small vertical slices, with each slice adding a working piece of functionality and documenting the key learning along the way.
