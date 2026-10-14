type QuickBooksConnectionCardProps = {
  connection: {
    id: string;
    company_name: string;
    country: string | null;
    status: "CONNECTED" | "DISCONNECTED";
  } | null;
};

const QuickBooksConnectionCard = ({
  connection,
}: QuickBooksConnectionCardProps) => {
  const isConnected = connection?.status === "CONNECTED";

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">QuickBooks</h2>

          {isConnected ? (
            <>
              <p className="mt-2 text-sm text-gray-600">Connected to</p>

              <p className="mt-1 font-medium text-gray-900">
                {connection.company_name}
              </p>

              {connection.country && (
                <p className="mt-1 text-sm text-gray-500">
                  {connection.country}
                </p>
              )}
            </>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Connect your QuickBooks company to CashLens.
            </p>
          )}
        </div>

        <div>
          {isConnected ? (
            <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              Connected
            </span>
          ) : (
            <a
              href="/api/integrations/quickbooks/connect"
              className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              Connect
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuickBooksConnectionCard;
