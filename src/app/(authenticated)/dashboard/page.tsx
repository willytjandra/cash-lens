import { signOut } from "../sign-out.action";

const DashboardPage = () => {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">CashLens</h1>
          <p className="mt-2 text-gray-600">
            Your QuickBooks financial dashboard.
          </p>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
};

export default DashboardPage;
