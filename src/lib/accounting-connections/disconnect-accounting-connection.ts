import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

type DisconnectAccountingConnectionArgs = {
  accountingConnectionId: string;
};

export const disconnectAccountingConnection = async ({
  accountingConnectionId,
}: DisconnectAccountingConnectionArgs): Promise<void> => {
  const supabase = createAdminClient();

  const { error } = await supabase
    .schema("cashlens")
    .rpc("disconnect_accounting_connection", {
      p_accounting_connection_id: accountingConnectionId,
    });

  if (error) {
    throw new Error(
      `Failed to disconnect accounting connection: ${error.message}`,
    );
  }
};