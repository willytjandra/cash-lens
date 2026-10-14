import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().min(1),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.url().min(1),
});

const result = clientEnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL,

  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,

  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL,
});

if (!result.success) {
  console.error(
    "Invalid client environment variables:",
    result.error.flatten().fieldErrors,
  );

  throw new Error("Invalid client environment configuration");
}

export const clientEnv = result.data;