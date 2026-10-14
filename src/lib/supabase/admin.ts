import "server-only";

import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { clientEnv } from "@/lib/env/clientEnv";
import { serverEnv } from "@/lib/env/serverEnv";

export const createAdminClient = () => {
  return createClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
};