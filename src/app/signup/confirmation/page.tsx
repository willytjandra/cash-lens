import Link from "next/link";

const SignupConfirmationPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold">Check your email</h1>

        <p className="mt-3 text-sm text-gray-600">
          We sent you a confirmation link. Open it to activate your CashLens
          account.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-medium underline"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
};

export default SignupConfirmationPage;
