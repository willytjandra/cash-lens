import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createAccountingConnection } from "@/lib/accounting-connections";
import { getCurrentUser } from "@/lib/auth/";
import { serverEnv } from "@/lib/env/serverEnv";
import { getCompanyInfo } from "@/lib/quickbooks/company-info";
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

  const profile = await getCurrentUser();

  if (!profile) {
    return NextResponse.redirect(
      new URL("/login", serverEnv.APP_BASE_URL),
    );
  }

  const redirectUri =
    `${serverEnv.APP_BASE_URL}${QUICKBOOKS_CALLBACK_PATH}`;

  const tokens = await exchangeAuthorizationCode({
    code,
    redirectUri,
  });

  const companyInfo = await getCompanyInfo({
    realmId,
    config: {
      accessToken: tokens.access_token,
      env: "sandbox",
    },
  });

  const now = Date.now();

  await createAccountingConnection({
    profileId: profile.id,
    provider: "QUICKBOOKS",
    externalId: realmId,
    companyName: companyInfo.CompanyName,
    country: companyInfo.Country,
    currency: undefined,
    scopes: [
      "com.intuit.quickbooks.accounting",
    ],
    credentials: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      accessTokenExpiresAt: new Date(
        now + tokens.expires_in * 1000,
      ),
      refreshTokenExpiresAt: new Date(
        now + tokens.x_refresh_token_expires_in * 1000,
      ),
    },
  });

  return NextResponse.redirect(
    new URL(
      "/integrations?quickbooks=connected",
      serverEnv.APP_BASE_URL,
    ),
  );
}