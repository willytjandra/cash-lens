import { Suspense } from "react";
import { signIn } from "./sign-in.action";
import LoginError from "./components/LoginError";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

// Login reads request-time searchParams, so render this route at request time.
// This avoids Instant Navigation validation issues with Cache Components enabled.
export const instant = false;

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold">Sign in to CashLens</h1>

        <p className="mt-2 text-sm text-gray-600">
          Access your financial dashboard.
        </p>

        <Suspense fallback={null}>
          <LoginError searchParams={searchParams} />
        </Suspense>

        <form action={signIn} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 text-white"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
