import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database.types";

type AccountingProvider =
  Database["cashlens"]["Enums"]["accounting_provider"];

type CreateAccountingConnectionArgs = {
  profileId: string;
  provider: AccountingProvider;
  externalId: string;
  companyName: string;
  country: string | undefined;
  currency: string | undefined;
  scopes: string[];
  credentials: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
  };
};

export const createAccountingConnection = async ({
  profileId,
  provider,
  externalId,
  companyName,
  country,
  currency,
  scopes,
  credentials,
}: CreateAccountingConnectionArgs): Promise<string> => {
  const supabase = createAdminClient();

  const { data, error } = await supabase.schema('cashlens').rpc(
    "create_accounting_connection",
    {
      p_profile_id: profileId,
      p_provider: provider,
      p_external_id: externalId,
      p_company_name: companyName,
      p_country: country,
      p_currency: currency,
      p_scopes: scopes,
      p_access_token: credentials.accessToken,
      p_refresh_token: credentials.refreshToken,
      p_access_token_expires_at:
        credentials.accessTokenExpiresAt.toISOString(),
      p_refresh_token_expires_at:
        credentials.refreshTokenExpiresAt.toISOString(),
    },
  );

  if (error) {
    throw new Error(
      `Failed to create accounting connection: ${error.message}`,
    );
  }

  return data;
};