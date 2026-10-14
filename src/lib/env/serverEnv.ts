import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  APP_BASE_URL: z.url().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
  QUICKBOOKS_CLIENT_ID: z.string().min(1),
  QUICKBOOKS_CLIENT_SECRET: z.string().min(1),
});

const result = serverEnvSchema.safeParse({
  APP_BASE_URL: process.env.APP_BASE_URL,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID,
  QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET,
});

if (!result.success) {
  console.error(
    "Invalid server environment variables:",
    result.error.flatten().fieldErrors,
  );

  throw new Error("Invalid server environment configuration");
}

export const serverEnv = result.data;