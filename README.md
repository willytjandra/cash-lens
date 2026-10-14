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
- Supabase Vault
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

Required variables currently include:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=

APP_BASE_URL=
SUPABASE_SECRET_KEY=

QUICKBOOKS_CLIENT_ID=
QUICKBOOKS_CLIENT_SECRET=
```

`.env.local` is not committed to source control.

Application code accesses configuration through typed environment modules:

```text
src/lib/env/
├── clientEnv.ts
└── serverEnv.ts
```

Public `NEXT_PUBLIC_*` values use `clientEnv`.

Private server configuration and secrets use `serverEnv`.

## Supabase Environments

CashLens currently uses shared Supabase environments with other portfolio applications:

```text
portfolio-staging
portfolio-prod
```

This shared setup exists to reduce infrastructure cost while building and learning.

It is a deliberate portfolio-environment compromise rather than the recommended architecture for a real production application.

In a real production system, CashLens would normally use dedicated Supabase projects per environment, for example:

```text
cashlens-staging
cashlens-prod
```

The shared environments contain application-specific database namespaces so unrelated applications can keep their database objects clearly separated.

CashLens application-owned database objects use the `cashlens` PostgreSQL schema.

## Database Migrations

Database migrations are **not managed from this repository**.

Because multiple portfolio applications currently share the same physical Supabase projects, migration history is managed centrally in the private `portfolio-supabase` repository.

This avoids migration-history drift between applications sharing the same Supabase database.

If a CashLens change requires any persistent database change, including:

- schemas
- tables
- columns
- indexes
- constraints
- enums
- grants
- Row Level Security
- RLS policies
- database functions
- triggers

make the corresponding change as a migration in `portfolio-supabase`.

Follow the database migration runbook in that repository for the deployment workflow:

```text
create migration
        |
        v
apply to portfolio-staging
        |
        v
verify
        |
        v
review / commit
        |
        v
apply to portfolio-prod
        |
        v
verify
```

Persistent database changes should not be made manually through the Supabase Dashboard.

The Dashboard may still be used for inspection and troubleshooting.

## Database Types

CashLens uses generated Supabase TypeScript definitions for type-safe database access.

The generated types live at:

```text
src/types/database.types.ts
```

They are generated from the `cashlens` schema in `portfolio-staging` and are used by the browser, server, and admin Supabase clients.

Database type generation is managed from the private `portfolio-supabase` repository.

After a database migration changes the application database contract, regenerate the CashLens types from that repository and commit the updated `database.types.ts` file here.

See the database migration runbook in `portfolio-supabase` for the exact workflow.

## Database Security

Using an application-specific PostgreSQL schema provides an ownership and organisation boundary, but it does not replace application security.

CashLens database tables should still use appropriate:

- PostgreSQL grants
- Row Level Security
- RLS policies
- foreign-key constraints
- least-privilege access

Normal application access should use authenticated Supabase sessions and RLS.

Privileged Supabase service-role access should only be used from trusted server-side code for operations that genuinely require elevated access.

OAuth credentials are stored using Supabase Vault.

Raw QuickBooks access and refresh tokens are not stored in normal CashLens application tables.

Database functions that access Vault or perform privileged accounting-connection operations are restricted to trusted service-role access.

## QuickBooks Integration

CashLens currently supports connecting and disconnecting a QuickBooks company.

The connection flow includes:

```text
CashLens
    |
    v
QuickBooks OAuth authorization
    |
    v
OAuth callback + state validation
    |
    v
authorization code exchange
    |
    v
QuickBooks CompanyInfo
    |
    v
provider-neutral accounting connection
    |
    v
encrypted token storage in Supabase Vault
```

The disconnect flow revokes the authorization with QuickBooks before removing local credentials and marking the CashLens connection as disconnected.

QuickBooks-specific integration code lives under:

```text
src/lib/quickbooks/
```

Provider-neutral accounting connection operations live under:

```text
src/lib/accounting-connections/
```

## Deployment

CashLens is deployed with Vercel.

Live application:

https://cash-lens-eta.vercel.app/

Local development uses `portfolio-staging`.

The deployed portfolio application currently also uses `portfolio-staging` while active development is ongoing.

Once CashLens reaches a demo-ready milestone, the deployed application will be switched to `portfolio-prod`.

## Documentation

### Architecture

- [QuickBooks Connection Lifecycle](docs/architecture/quickbooks-connection-lifecycle.md)

### Learning journey

CashLens is being built incrementally through practical vertical slices. Each guide documents the decisions, implementation steps, and key learning from that milestone:

1. [Project Foundation](docs/learning/01-project-foundation.md)
2. [Authentication](docs/learning/02-authentication.md)
3. [Application User Profile](docs/learning/03a-application-user-profile.md)
4. [QuickBooks OAuth](docs/learning/03b-quickbooks-oauth.md)

Additional learning guides will be added as the project progresses.

### Coding standards

Project coding conventions are documented in:

```text
CODING_STANDARDS.md
```

## Project Status

Completed so far:

```text
Slice 1
Project Foundation
        |
        v
Slice 2
Authentication
        |
        v
Slice 3a
Application User Profile
        |
        v
Slice 3b
QuickBooks OAuth
```

CashLens currently has:

- Next.js and Supabase application foundations
- Supabase authentication and email confirmation
- protected authenticated application routes
- CashLens-owned application user profiles
- profile provisioning and activation
- generated type-safe Supabase database access
- authenticated current-user loading
- editable user profiles with React Hook Form and Zod validation
- typed client and server environment configuration
- QuickBooks OAuth authorization
- OAuth state validation
- QuickBooks company metadata retrieval
- provider-neutral accounting connection modelling
- secure OAuth token storage using Supabase Vault
- transactional accounting connection persistence
- connected QuickBooks company UI
- QuickBooks authorization revocation
- end-to-end disconnect support

The next milestones will build on the QuickBooks connection foundation with financial data retrieval, token refresh, synchronization, background processing, scheduled jobs, reliability patterns, and financial dashboards.
