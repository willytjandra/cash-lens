import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { serverEnv } from "@/lib/env/serverEnv";
import { exchangeAuthorizationCode } from "@/lib/quickbooks/oauth";

const QUICKBOOKS_CALLBACK_PATH =
  "/api/integrations/quickbooks/callback";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const realmId = searchParams.get("realmId");
  const error = searchParams.get("error");

  const cookieStore = await cookies();

  const expectedState = cookieStore.get(
    "quickbooks_oauth_state",
  )?.value;

  cookieStore.delete("quickbooks_oauth_state");

  if (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 400,
      },
    );
  }

  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.json(
      {
        error: "Invalid OAuth state",
      },
      {
        status: 400,
      },
    );
  }

  if (!code || !realmId) {
    return NextResponse.json(
      {
        error: "Missing QuickBooks OAuth callback parameters",
      },
      {
        status: 400,
      },
    );
  }

  const redirectUri =
    `${serverEnv.APP_BASE_URL}${QUICKBOOKS_CALLBACK_PATH}`;

  const tokens = await exchangeAuthorizationCode(
    code,
    redirectUri,
  );

  return NextResponse.json({
    success: true,
    realmId,
    accessTokenReceived: Boolean(tokens.access_token),
    refreshTokenReceived: Boolean(tokens.refresh_token),
    accessTokenExpiresIn: tokens.expires_in,
    refreshTokenExpiresIn:
      tokens.x_refresh_token_expires_in,
  });
}