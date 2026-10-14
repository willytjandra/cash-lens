import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { serverEnv } from "@/lib/env/serverEnv";
import { exchangeAuthorizationCode } from "@/lib/quickbooks/oauth";
import { getCompanyInfo } from "@/lib/quickbooks/company-info";

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

  const companyInfo = await getCompanyInfo({
    realmId,
    config: {
      accessToken: tokens.access_token,
      env: "sandbox",
    },
  });

  return NextResponse.json({
    success: true,
    realmId,
    companyName: companyInfo.CompanyName,
    country: companyInfo.Country ?? null,
    accessTokenReceived: true,
    refreshTokenReceived: true,
  });
}