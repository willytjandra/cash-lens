# Slice 3a — Application User Profile

## Goal

Introduce a CashLens-owned application user record separately from Supabase Auth.

Supabase Auth remains responsible for authentication and identity, while CashLens owns application-specific user data such as:

- internal application user ID
- first name
- last name
- application lifecycle status

This gives the application a stable internal identity that future CashLens domain data can reference without coupling directly to the authentication provider.

## Architecture

```text
Supabase Auth
    |
    | auth identity
    v
cashlens.profiles
    |
    | internal CashLens user ID
    | first name
    | last name
    | application lifecycle status
    v
future CashLens domain data
```

Email remains owned by Supabase Auth and is not duplicated in `cashlens.profiles`.

## Profile Schema

CashLens profile data is stored in:

```text
cashlens.profiles
```

The profile contains:

```text
id
auth_user_id
first_name
last_name
status
created_at
updated_at
```

`id` is the internal CashLens user identifier.

`auth_user_id` links the profile to the corresponding Supabase Auth user.

Future CashLens domain relationships should generally reference the internal CashLens profile ID rather than the Supabase Auth identifier.

## Profile Lifecycle

Profiles currently use two states:

```text
PENDING
ACTIVE
```

The signup and activation flow is:

```text
signup
    |
    v
Supabase Auth user created
    |
    v
CashLens profile created
status = PENDING
    |
    v
user confirms email
    |
    v
/auth/callback
    |
    v
profile status = ACTIVE
```

The application does not currently use profile status as a login authorization boundary.

At this stage, it represents application lifecycle state.

Additional states such as `SUSPENDED` or `DELETED` could be added later if required.

## Profile Provisioning

A profile is created immediately after a successful Supabase signup.

The normal Supabase server client performs the signup.

A trusted server-side Supabase admin client creates the initial CashLens profile because normal authenticated users are not allowed to insert arbitrary profile records.

If profile creation fails after the Auth user has been created, the signup flow attempts to remove the newly created Auth user.

This reduces the chance of leaving an incomplete state where an Auth user exists without a corresponding CashLens profile.

## Profile Activation

The email confirmation callback performs:

```text
confirmation link
    |
    v
/auth/callback
    |
    v
exchangeCodeForSession
    |
    v
get authenticated user
    |
    v
update cashlens.profiles
status = ACTIVE
    |
    v
redirect to dashboard
```

If profile activation fails, the callback:

- logs the failure
- signs the user out
- redirects to an error state instead of allowing the confirmation flow to continue as successful

The profile update uses:

```ts
supabase
  .schema("cashlens")
  .from("profiles")
  .update(...)
  .eq("auth_user_id", user.id)
  .select("id")
  .single();
```

Using:

```ts
.select("id").single()
```

verifies that exactly one profile row was updated.

A database update affecting zero rows can otherwise complete without being treated as an error.

## Database Security

CashLens database objects use the custom PostgreSQL schema:

```text
cashlens
```

Row Level Security is enabled on `cashlens.profiles`.

Authenticated users can:

- view their own profile
- update their own profile

Authenticated users cannot:

- create arbitrary profiles
- delete profiles

Profile provisioning is performed through trusted server-side code.

The RLS policy uses the authenticated Supabase identity:

```text
auth.uid() = auth_user_id
```

to ensure users can only access their own profile.

## RLS Mental Model

For PostgreSQL Row Level Security:

```text
USING
```

controls which existing rows the user is allowed to target.

```text
WITH CHECK
```

controls whether the resulting row after an insert or update is allowed.

For profile updates, these policies ensure that a user cannot modify another user's profile or reassign their profile to another Auth identity.

## Generated Database Types

CashLens uses generated Supabase TypeScript database definitions:

```text
src/types/database.types.ts
```

Types are generated from the `cashlens` schema in `portfolio-staging`.

Generation is managed from the private `portfolio-supabase` repository.

The generated `Database` type is used by:

- browser Supabase client
- server Supabase client
- admin Supabase client

This provides type-safe:

- schemas
- tables
- columns
- inserts
- updates
- PostgreSQL enums

Generated database types are treated as the source of truth for database contracts.

Application types should reuse generated database types where appropriate instead of duplicating database-owned values manually.

## Current User Model

Authenticated application code frequently needs both:

```text
Supabase Auth identity
+
CashLens profile data
```

Rather than repeating this lookup in multiple Server Components, CashLens introduces:

```text
getCurrentUser()
```

The helper combines:

```text
Supabase Auth
    +
cashlens.profiles
    |
    v
CurrentUser
```

The application-facing model contains:

```text
id
authUserId
email
firstName
lastName
status
```

Example:

```ts
const currentUser = await getCurrentUser();
```

The `CurrentUser` type reuses generated database types for database-owned values such as the profile status enum.

## Server-Only Helpers

Reusable server-side helpers use:

```ts
import "server-only";
```

rather than:

```ts
"use server";
```

`server-only` prevents a module from being imported into client-side code.

`"use server"` is used for Server Actions.

## Request-Time Authenticated Data

Authenticated user data depends on request-specific state such as Supabase Auth cookies.

With Next.js Cache Components enabled, this work must happen at request time.

`getCurrentUser()` calls:

```ts
await connection();
```

to establish that the operation depends on a real incoming request.

This prevents Next.js from trying to prerender authentication logic that depends on runtime request state.

## Suspense and Authenticated Data

Request-time data can block navigation if it is not behind a Suspense boundary.

The pattern used is:

```text
prerenderable page shell
    |
    v
Suspense
    |
    v
request-bound component
    |
    v
getCurrentUser()
```

This allows the page shell to render immediately while user-specific data is resolved.

CashLens also keeps route-level loading UI available as a general fallback.

Explicit Suspense boundaries are used where more granular loading behaviour is useful.

## React Server Cache

`getCurrentUser()` is wrapped with React `cache()`.

This allows repeated calls during the same server render to reuse the same result.

For example:

```text
layout
    |
    +--> getCurrentUser()

header
    |
    +--> getCurrentUser()

page
    |
    +--> getCurrentUser()
```

React can reuse the memoized result rather than repeating the same authentication and profile lookup work during that render.

This is request/render memoization, not long-lived application caching.

## Profile Page

The authenticated `/profile` page allows the user to:

- view their email
- edit first name
- edit last name

Email is read from Supabase Auth and remains read-only.

First name and last name are stored in `cashlens.profiles`.

## Form Validation

The profile form uses:

- React Hook Form
- Zod
- Server Actions

The same Zod schema is used on both client and server.

```text
React Hook Form
    |
    v
Zod client validation
    |
    v
Server Action
    |
    v
same Zod schema
    |
    v
database update
```

Client validation provides immediate feedback.

Server-side validation remains authoritative because browser validation can be bypassed.

## Updating the Profile

The profile Server Action:

1. validates the submitted data with Zod
2. gets the current CashLens user
3. creates the authenticated Supabase server client
4. updates the current user's profile
5. verifies exactly one row was updated
6. revalidates the `/profile` route

The update uses the internal CashLens profile ID:

```ts
supabase
  .schema("cashlens")
  .from("profiles")
  .update(...)
  .eq("id", currentUser.id)
  .select("id")
  .single();
```

This starts moving application code toward the internal CashLens user identity rather than using the external Auth identifier everywhere.

RLS still provides the database authorization boundary.

## Shared Supabase Infrastructure

CashLens currently uses shared Supabase environments:

```text
portfolio-staging
portfolio-prod
```

CashLens-owned database objects use:

```text
cashlens
```

as their PostgreSQL schema.

Database migrations and generated database types are managed centrally from the private:

```text
portfolio-supabase
```

repository.

This is a portfolio cost-saving compromise.

A real production application would normally use dedicated Supabase projects per application and environment.

## Key Learnings

The main lessons from this slice were:

- authentication identity and application identity can be separate concepts
- application domain relationships can use a stable internal user ID
- identity-owned data such as email does not need to be duplicated
- RLS provides database-level authorization for user-owned data
- trusted server access is useful for controlled provisioning
- generated database types keep application code aligned with the database contract
- request-specific authenticated data should remain server-side
- `connection()` marks request-bound server work
- Suspense prevents request-bound work from blocking the entire navigation
- React `cache()` provides request/render-level reuse for shared server data
- shared Zod schemas provide consistent client and server validation
- mutation chains such as `.update(...).select(...).single()` can verify that exactly one row was affected

## Slice Result

Slice 3a now provides:

```text
signup
    |
    v
PENDING CashLens profile
    |
    v
email confirmation
    |
    v
ACTIVE CashLens profile
    |
    v
typed current-user model
    |
    v
editable authenticated profile page
```

CashLens now has a stable application-owned user identity that future features can build on.

The next milestone is:

```text
Slice 3b — QuickBooks OAuth
```
