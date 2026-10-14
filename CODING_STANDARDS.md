# CashLens Coding Standards

This document records coding conventions adopted while building CashLens.

The goal is not to create a large enterprise-style rulebook. Standards are added when the project encounters a real need for consistency, maintainability, or clearer testing boundaries.

## 1. Server Actions

Server Action files use kebab-case and the `.action.ts` suffix.

Each action file should contain one Server Action.

Examples:

```text
sign-in.action.ts
sign-up.action.ts
sign-out.action.ts
disconnect-quickbooks.action.ts
```

The exported function uses normal camelCase naming:

```ts
export const signIn = async () => {
  // ...
};
```

This keeps action responsibilities obvious and makes files easy to locate as the application grows.

## 2. One React Component Per File

Prefer one named React component per file.

Example:

```text
SignupForm.tsx
LoginError.tsx
DashboardHeader.tsx
```

This provides a clear component boundary and makes it easier to introduce focused component tests later.

Small JSX fragments do not need to become separate components unless they represent a meaningful UI responsibility.

## 3. Component File Naming

React component files use PascalCase and should match the component name.

Example:

```text
SignupForm.tsx
```

```tsx
const SignupForm = () => {
  // ...
};

export default SignupForm;
```

## 4. Route-Specific Components

Components used by only one route should be colocated with that route under a `components/` directory.

Example:

```text
app/
└── signup/
    ├── components/
    │   └── SignupForm.tsx
    ├── page.tsx
    ├── sign-up.action.ts
    └── sign-up.schema.ts
```

A component should only be promoted to a shared application-level component directory when it is genuinely reused across multiple routes or features.

## 5. Preserve Next.js Reserved Filenames

Next.js framework-reserved filenames must remain unchanged.

Examples include:

```text
page.tsx
layout.tsx
loading.tsx
error.tsx
route.ts
```

Do not rename `page.tsx` to filenames such as `LoginPage.tsx`.

These filenames are part of the Next.js App Router convention.

## 6. Page Component Naming

Although Next.js route files use the reserved filename `page.tsx`, the component declared inside the file should use a descriptive name ending in `Page`.

Examples:

```tsx
const LoginPage = () => {
  // ...
};

export default LoginPage;
```

```tsx
const DashboardPage = () => {
  // ...
};

export default DashboardPage;
```

```tsx
const SignupConfirmationPage = () => {
  // ...
};

export default SignupConfirmationPage;
```

This keeps component names meaningful in stack traces, React tooling, tests, and code navigation.

## 7. Shared Zod Validation

For forms that require meaningful validation, reuse the same Zod schema for client-side and server-side validation.

The client uses the schema to provide immediate UX feedback.

The server validates the same input again because browser-side validation can be bypassed and must never be treated as authoritative.

Example flow:

```text
React Hook Form
        ↓
client-side Zod validation
        ↓
Server Action
        ↓
server-side Zod validation
        ↓
business operation
```

Avoid maintaining separate client and server validation rules for the same form.

## 8. Action State

When `useActionState` needs to represent distinct outcomes, prefer a discriminated union so TypeScript can safely narrow the available properties.

Example:

```ts
type SignUpState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors: {
        email?: string[];
        password?: string[];
        form?: string[];
      };
    };
```

This is preferred over a collection of unrelated optional properties because the state contract is explicit.

## 9. Environment Variables

Access environment variables only through typed modules under:

```text
src/lib/env/
├── clientEnv.ts
└── serverEnv.ts
```

Use `clientEnv` for `NEXT_PUBLIC_*` variables that are safe to expose to the browser.

Use `serverEnv` for server-only variables and secrets.

`serverEnv.ts` must import:

```ts
import "server-only";
```

This prevents server-only configuration from being imported into Client Components.

Required environment variables must be validated with Zod and should fail fast when missing or invalid.

Application code should not access `process.env` directly outside the environment modules, except for narrow framework-provided exceptions where justified.

Example server usage:

```ts
import { serverEnv } from "@/lib/env/serverEnv";

const clientId = serverEnv.QUICKBOOKS_CLIENT_ID;
```

Example client usage:

```ts
import { clientEnv } from "@/lib/env/clientEnv";

const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
```

Even though Next.js loads public and private configuration from the same `.env.*` files, CashLens treats them as separate configuration boundaries:

```text
.env.*
   |
   +-- clientEnv
   |     └-- browser-safe NEXT_PUBLIC_* values
   |
   └-- serverEnv
         └-- private server configuration and secrets
```

This keeps configuration strongly typed, preserves the client/server security boundary, and catches missing configuration during development or build rather than at runtime.

## 10. Server Function Arguments

For ordinary backend/server helper functions, prefer a single args/options object over multiple positional parameters when practical.

This is especially useful when a function accepts several arguments.

Example:

```ts
type GetCompanyInfoArgs = {
  realmId: string;
  accessToken: string;
};

export const getCompanyInfo = async ({
  realmId,
  accessToken,
}: GetCompanyInfoArgs) => {
  // ...
};
```

Prefer:

```ts
getCompanyInfo({
  realmId,
  accessToken,
});
```

over:

```ts
getCompanyInfo(realmId, accessToken);
```

This improves call-site readability, reduces argument-order mistakes, and makes functions easier to extend later.

Do not force this convention onto framework-defined entrypoints whose function signatures are controlled by Next.js or React.

Examples include:

- Route Handlers such as `GET(request, context)` and `POST(request, context)`
- Server Actions invoked through forms or React APIs where the framework determines the parameter shape

Framework entrypoints should follow the framework convention.

Internal helper functions called by those entrypoints should follow the args/options object convention where practical.

## 11. QuickBooks Integration Structure

QuickBooks integration code lives under:

```text
src/lib/quickbooks/
```

Group QuickBooks operations by resource or capability.

Example:

```text
src/lib/quickbooks/
├── oauth/
│   ├── exchange-authorization-code.ts
│   ├── revoke-token.ts
│   ├── refresh-access-token.ts
│   └── index.ts
├── company-info/
│   ├── get-company-info.ts
│   └── index.ts
├── invoices/
│   ├── get-invoice.ts
│   ├── create-invoice.ts
│   ├── update-invoice.ts
│   └── index.ts
└── reports/
    ├── get-profit-and-loss.ts
    ├── get-balance-sheet.ts
    └── index.ts
```

Prefer one public QuickBooks operation per file.

QuickBooks library files use kebab-case.

Examples:

```text
exchange-authorization-code.ts
revoke-token.ts
get-company-info.ts
create-invoice.ts
get-profit-and-loss.ts
```

Exported TypeScript functions use camelCase.

Example:

```ts
export const exchangeAuthorizationCode = async () => {
  // ...
};
```

Private helper functions that are only meaningful to one operation may remain in the same file.

Extract helpers only when they are reused or materially improve readability.

The `.action.ts` suffix is reserved for Next.js Server Actions and must not be used for ordinary QuickBooks integration functions.

### QuickBooks Module Barrels

Use `index.ts` barrel files selectively at meaningful QuickBooks resource or capability boundaries.

Examples:

```text
oauth/
invoices/
reports/
company-info/
```

The barrel file should expose the public API of that module.

Example:

```ts
export {
  exchangeAuthorizationCode,
  type TokenResponse,
} from "./exchange-authorization-code";

export { revokeToken } from "./revoke-token";
```

Consumers should import from the module boundary where practical:

```ts
import { exchangeAuthorizationCode, revokeToken } from "@/lib/quickbooks/oauth";
```

rather than using deep imports:

```ts
import { exchangeAuthorizationCode } from "@/lib/quickbooks/oauth/exchange-authorization-code";
```

Do not create barrel files everywhere.

Use them only where they provide a clear resource or capability boundary.

### QuickBooks Type Naming

Inside provider-specific QuickBooks modules, prefer concise domain names such as:

```text
CompanyInfo
Invoice
Customer
Account
```

The provider context is already communicated by the import path.

Example:

```ts
import type { Invoice } from "@/lib/quickbooks/invoices";
```

If a consumer needs equivalent types from multiple providers, use import aliases at the call site.

Example:

```ts
import type { Invoice as QuickBooksInvoice } from "@/lib/quickbooks/invoices";

import type { Invoice as XeroInvoice } from "@/lib/xero/invoices";
```

If CashLens later introduces its own provider-neutral domain model, use a separate CashLens-owned type rather than reusing a provider-specific type.

For example:

```text
QuickBooks Invoice
        ↓
        map
        ↓
AccountingInvoice

Xero Invoice
        ↓
        map
        ↓
AccountingInvoice
```

## 12. External API Response Modelling

When consuming QuickBooks or other external APIs, validate and map only the fields CashLens currently needs.

Do not mirror an entire provider response model unless the application genuinely requires it.

Treat the provider payload as an external contract and the CashLens model as an intentional projection of that contract.

Example:

```ts
const companyInfoResponseSchema = z.object({
  CompanyInfo: z.object({
    CompanyName: z.string().min(1),
    Country: z.string().optional(),
  }),
});
```

If CashLens later needs additional fields, add them deliberately when there is a concrete use case.

This reduces coupling to the provider and avoids breaking CashLens because of irrelevant changes in unused external fields.

## 13. Database Function Boundaries

Prefer application code for business logic unless PostgreSQL provides a concrete advantage.

Database functions are appropriate when a use case genuinely requires capabilities such as:

- transactional atomicity across several database operations
- controlled access to Supabase-managed schemas such as Vault
- tightly scoped privileged database operations

Example:

```text
create_accounting_connection
```

uses a PostgreSQL function because the following operations must succeed or fail together:

```text
insert connection
        ↓
create access-token Vault secret
        ↓
create refresh-token Vault secret
        ↓
insert credentials
```

Similarly:

```text
get_accounting_connection_refresh_token
```

exists because decrypted Vault secrets are not exposed through normal application Data API access.

Do not move application orchestration into PostgreSQL solely because it can be implemented there.

For example, QuickBooks token revocation remains application-side:

```text
get stored refresh token
        ↓
call QuickBooks revoke endpoint
        ↓
disconnect local connection
```

This keeps external integration behavior testable and controlled by application code.

## 14. Privileged Operations and Ownership Checks

Values submitted by the browser must be treated as untrusted even when they originate from a Server Component or are bound to a Server Action.

Before calling a privileged service-role operation on an existing entity, verify that the entity belongs to the current CashLens profile.

Example:

```ts
const { data: connection } = await supabase
  .schema("cashlens")
  .from("accounting_connections")
  .select("id")
  .eq("id", accountingConnectionId)
  .eq("profile_id", profile.id)
  .eq("provider", "QUICKBOOKS")
  .maybeSingle();
```

Only after ownership is established should trusted server-side code invoke an elevated operation.

Conceptually:

```text
browser-supplied ID
        ↓
verify current-user ownership
        ↓
trusted entity ID
        ↓
service-role operation
```

Using `bind()` or an inline Server Action does not provide authorization.

Transport convenience and authorization are separate concerns.

## 15. Secret Handling

OAuth access tokens, refresh tokens, and other provider credentials must remain server-side.

Do not:

- return raw tokens to Client Components
- include tokens in redirect URLs
- log raw token values
- store raw tokens in normal application tables
- expose generic Vault secret-reading APIs without a concrete use case

Persist external credentials using Supabase Vault.

Application tables should store Vault secret IDs and operational metadata such as expiry timestamps.

Prefer narrowly scoped secret-access operations.

For example:

```text
get_accounting_connection_refresh_token
```

is preferred over a generic operation such as:

```text
get_decrypted_secret
```

Add access-token retrieval only when an application use case genuinely requires it.

## Philosophy

CashLens conventions should remain pragmatic.

A convention should help us:

- understand the code quickly
- maintain consistency
- create clear testing boundaries
- reduce ambiguity as the project grows

Avoid introducing abstractions or rules solely because they are common in large enterprise applications. Add structure when the application earns the need for it.
