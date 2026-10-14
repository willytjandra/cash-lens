import "server-only";

import { z } from "zod";

import { serverEnv } from "@/lib/env/serverEnv";

const QUICKBOOKS_TOKEN_URL =
  "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.number(),
  x_refresh_token_expires_in: z.number(),
  token_type: z.string(),
});

export type QuickBooksTokenResponse = z.infer<typeof tokenResponseSchema>;

export const exchangeAuthorizationCode = async ({ code, redirectUri }: {
  code: string,
  redirectUri: string,
}): Promise<QuickBooksTokenResponse> => {
  const basicAuth = Buffer.from(
    `${serverEnv.QUICKBOOKS_CLIENT_ID}:${serverEnv.QUICKBOOKS_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(QUICKBOOKS_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `QuickBooks token exchange failed with status ${response.status}`,
    );
  }

  const body: unknown = await response.json();

  return tokenResponseSchema.parse(body);
};