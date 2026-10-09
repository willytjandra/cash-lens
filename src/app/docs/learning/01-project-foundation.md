# Slice 1 — Project Foundation

## Goal

Establish the initial CashLens application foundation using a simple, freelancer-friendly stack.

The goal of this slice is not to build business functionality yet. It is to create a clean baseline that later slices can build on.

## What Was Built

This slice introduced the initial application setup:

- Next.js
- TypeScript
- React
- Tailwind CSS
- pnpm
- GitHub repository
- Supabase client configuration
- environment configuration
- production build gate
- basic CashLens landing page
- Vercel deployment baseline

CashLens is developed incrementally through small vertical slices. Each slice should leave the application in a working state.

## Project Structure

The application uses the Next.js App Router and keeps the initial structure deliberately small.

Current Supabase helpers:

```text
src/
  lib/
    supabase/
      client.ts
      server.ts
```

The browser and server Supabase clients are separated because Next.js runs code in both client and server environments.

## Environment Configuration

Local configuration is stored in:

```text
.env.local
```

This file is not committed to source control.

An example configuration is committed as:

```text
.env.example
```

Current variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

This allows another developer to see which environment variables are required without exposing real values.

## Supabase Environment Strategy

The current Supabase account supports two projects, and both are already used by DocumentHub:

```text
document-hub
document-hub-staging
```

Rather than creating another account or upgrading solely for this learning project, CashLens currently reuses:

```text
document-hub-staging
```

as its development backend.

This is a temporary pragmatic decision.

Current setup:

```text
document-hub
  -> DocumentHub production

document-hub-staging
  -> DocumentHub development/staging
  -> CashLens development
```

CashLens should avoid depending on DocumentHub-specific tables or application logic.

When CashLens reaches the point where a dedicated backend is required, the intended structure is:

```text
cash-lens-staging
  -> local development / testing

cash-lens
  -> production
```

For now, the shared staging project allows development to continue without introducing unnecessary infrastructure cost.

### Trade-offs of sharing the staging project

Database objects can be kept separate, but some Supabase features are project-wide.

In particular:

- Supabase Auth users and authentication settings are shared
- project-level configuration is shared
- future OAuth and callback configuration may need extra care
- background jobs and integration credentials should be isolated before the application handles meaningful production data

This is acceptable for the early learning slices, but the decision should be revisited as CashLens grows.

## Supabase Clients

CashLens uses `@supabase/ssr` to create separate browser and server clients.

### Browser client

The browser client is used by Client Components when Supabase needs to be accessed from the browser.

### Server client

The server client integrates Supabase with Next.js cookies and can be used from Server Components, Server Actions, and Route Handlers.

Separating these clients keeps the setup compatible with the Next.js App Router and prepares the project for authentication in later slices.

## Production Build Gate

A production build command was added:

```bash
pnpm build:prod
```

The build gate combines the main checks required before deployment:

```text
lint
Next.js type generation
TypeScript type checking
production build
```

The purpose is to have one simple command that verifies the application before production changes are pushed.

This follows the same pragmatic approach used in DocumentHub without introducing a more complex CI pipeline yet.

## Deployment

CashLens uses Vercel for deployment.

Deploying at the foundation stage establishes the deployment pipeline early rather than waiting until the application is feature complete.

For now, the Vercel deployment also uses the shared `document-hub-staging` Supabase project.

This should move to a dedicated CashLens Supabase project before the application contains meaningful production data or external integration credentials.

## Key Decisions

### Use pnpm

CashLens uses pnpm as its package manager.

This keeps dependency management consistent and produces a `pnpm-lock.yaml` lockfile.

### Keep the architecture small

No repository layer, service abstraction, dependency injection, or other enterprise-style architecture has been introduced.

Those abstractions should only be added if the application develops a real need for them.

### Deploy early

The application is deployed at the foundation stage.

This means later slices can be tested against a real hosted environment and deployment issues can be discovered early.

### Share Supabase staging temporarily

Reusing `document-hub-staging` avoids paying for additional Supabase infrastructure before the project needs it.

The trade-off is that some project-level Supabase configuration is shared.

This is acceptable for the early slices and should be revisited as CashLens grows.

## Key Learning

This slice reinforced several practical patterns:

- establish deployment early
- keep secrets out of source control
- commit an `.env.example`
- separate browser and server Supabase clients
- use a single production build command as a deployment gate
- avoid infrastructure complexity until it is required
- treat environment strategy as an explicit technical decision
- document temporary compromises so they can be revisited later

## Next Slice

Slice 2 will introduce authentication.

Because authentication was already explored in DocumentHub, the focus will be on applying the established pattern efficiently rather than relearning the fundamentals.
