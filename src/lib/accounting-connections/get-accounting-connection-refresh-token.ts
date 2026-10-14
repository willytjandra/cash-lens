import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

type GetAccountingConnectionRefreshTokenArgs = {
  accountingConnectionId: string;
};

export const getAccountingConnectionRefreshToken = async ({
  accountingConnectionId,
}: GetAccountingConnectionRefreshTokenArgs): Promise<string | null> => {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .schema("cashlens")
    .rpc("get_accounting_connection_refresh_token", {
      p_accounting_connection_id: accountingConnectionId,
    });

  if (error) {
    throw new Error(
      `Failed to get accounting connection refresh token: ${error.message}`,
    );
  }

  return data;
};