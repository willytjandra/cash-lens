import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import QuickBooksConnectionCard from "./components/QuickBooksConnectionCard";
import { redirect } from "next/navigation";

type IntegrationsPageProps = {
  searchParams: Promise<{
    quickbooks?: string;
    reason?: string;
  }>;
};

const IntegrationsPage = async ({ searchParams }: IntegrationsPageProps) => {
  const profile = await getCurrentUser();
  if (!profile) {
    redirect("/login");
  }

  const params = await searchParams;

  const supabase = await createClient();

  const { data: quickBooksConnection, error } = await supabase
    .schema("cashlens")
    .from("accounting_connections")
    .select(
      `
      id,
      company_name,
      country,
      status
    `,
    )
    .eq("profile_id", profile.id)
    .eq("provider", "QUICKBOOKS")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to get QuickBooks connection: ${error.message}`);
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          Integrations
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Connect your accounting platforms to CashLens.
        </p>
      </div>

      {params.quickbooks === "connected" && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          QuickBooks connected successfully.
        </div>
      )}

      {params.quickbooks === "error" && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          We couldn&apos;t connect QuickBooks. Please try again.
        </div>
      )}

      <QuickBooksConnectionCard connection={quickBooksConnection} />
    </main>
  );
};

export default IntegrationsPage;
