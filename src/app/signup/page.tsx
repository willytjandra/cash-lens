import SignupForm from "./components/SignupForm";

const SignupPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Create your CashLens account</h1>

        <p className="mt-2 text-sm text-gray-600">
          Sign up to access your financial dashboard.
        </p>

        <SignupForm />
      </div>
    </main>
  );
};

export default SignupPage;
