"use server";

import { revalidatePath } from "next/cache";

import {
  disconnectAccountingConnection,
  getAccountingConnectionRefreshToken,
} from "@/lib/accounting-connections";
import { getCurrentUser } from "@/lib/auth";
import { revokeToken } from "@/lib/quickbooks/oauth";
import { createClient } from "@/lib/supabase/server";

export const disconnectQuickBooks = async (
  accountingConnectionId: string,
): Promise<void> => {
  const profile = await getCurrentUser();

  if (!profile) {
    throw new Error("User is not authenticated");
  }

  const supabase = await createClient();

  const { data: connection, error } = await supabase
    .schema("cashlens")
    .from("accounting_connections")
    .select("id")
    .eq("id", accountingConnectionId)
    .eq("profile_id", profile.id)
    .eq("provider", "QUICKBOOKS")
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to verify accounting connection: ${error.message}`,
    );
  }

  if (!connection) {
    throw new Error("Accounting connection not found");
  }

  const refreshToken =
    await getAccountingConnectionRefreshToken({ accountingConnectionId: connection.id });

  if (refreshToken) {
    await revokeToken({
      token: refreshToken,
    });
  }

  await disconnectAccountingConnection({
    accountingConnectionId: connection.id,
  });

  revalidatePath("/integrations");
};