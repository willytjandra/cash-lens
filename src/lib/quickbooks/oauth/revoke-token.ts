import "server-only";

import { serverEnv } from "@/lib/env/serverEnv";

const QUICKBOOKS_REVOKE_URL =
  "https://developer.api.intuit.com/v2/oauth2/tokens/revoke";

type RevokeTokenArgs = {
  token: string;
};

export const revokeToken = async ({
  token,
}: RevokeTokenArgs): Promise<void> => {
  const authorization = Buffer.from(
    `${serverEnv.QUICKBOOKS_CLIENT_ID}:${serverEnv.QUICKBOOKS_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(QUICKBOOKS_REVOKE_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      token,
    }),
  });

  if (!response.ok) {
    const responseBody = await response.text();

    throw new Error(
      `QuickBooks token revocation failed with status ${response.status}: ${responseBody}`,
    );
  }
};