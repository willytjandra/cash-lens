import "server-only";

import { z } from "zod";

type QuickBooksEnvironment = "sandbox" | "prod";

const QUICKBOOKS_BASE_URL: Record<
  QuickBooksEnvironment,
  string
> = {
  sandbox: "https://sandbox-quickbooks.api.intuit.com",
  prod: "https://quickbooks.api.intuit.com",
};

const companyInfoResponseSchema = z.object({
  CompanyInfo: z.object({
    CompanyName: z.string().min(1),
    Country: z.string().optional(),
  }),
});

export type CompanyInfo = z.infer<
  typeof companyInfoResponseSchema
>["CompanyInfo"];

export const getCompanyInfo = async ({
  realmId,
  config: {
    accessToken,
    minorVersion = "75",
    env,
  },
}: {
  realmId: string;
  config: {
    accessToken: string;
    minorVersion?: string;
    env: QuickBooksEnvironment;
  };
}): Promise<CompanyInfo> => {
  const url = new URL(
    `/v3/company/${realmId}/companyinfo/${realmId}`,
    QUICKBOOKS_BASE_URL[env],
  );

  url.searchParams.set("minorversion", minorVersion);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `QuickBooks CompanyInfo request failed with status ${response.status}`,
    );
  }

  const body: unknown = await response.json();

  return companyInfoResponseSchema.parse(body).CompanyInfo;
};