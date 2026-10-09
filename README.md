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
```

`.env.local` is not committed to source control.

## Deployment

CashLens is deployed with Vercel.

Live application:

https://cash-lens-eta.vercel.app/

For the current development phase, CashLens uses the existing `document-hub-staging` Supabase project as a shared development backend. This is a temporary pragmatic setup while working within the current Supabase project limit.

## Documentation

### Learning journey

CashLens is being built incrementally through practical vertical slices. Each guide documents the decisions, implementation steps, and key learning from that milestone:

1. [Project Foundation](docs/learning/01-project-foundation.md)

More guides will be added as the project progresses.

## Project Status

### Slice 1 — Project Foundation

The initial project foundation includes:

- Next.js + TypeScript
- pnpm
- Tailwind CSS
- GitHub repository
- Supabase browser and server client configuration
- environment variable template
- production build gate
- basic CashLens landing page
- Vercel deployment baseline

Development will continue through small vertical slices, with each slice adding a working piece of functionality and documenting the key learning along the way.
