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
connect-quickbooks.action.ts
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

## Philosophy

CashLens conventions should remain pragmatic.

A convention should help us:

- understand the code quickly
- maintain consistency
- create clear testing boundaries
- reduce ambiguity as the project grows

Avoid introducing abstractions or rules solely because they are common in large enterprise applications. Add structure when the application earns the need for it.
