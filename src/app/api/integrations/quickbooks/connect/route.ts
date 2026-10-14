import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { serverEnv } from "@/lib/env/serverEnv";

const QUICKBOOKS_AUTHORIZATION_URL =
  "https://appcenter.intuit.com/connect/oauth2";

const QUICKBOOKS_SCOPE = "com.intuit.quickbooks.accounting";

export async function GET() {  

  const {QUICKBOOKS_CLIENT_ID: clientId, APP_BASE_URL: appUrl} = serverEnv;

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.redirect(
      new URL("/login", appUrl),
    );
  }
  
  const state = randomBytes(32).toString("hex");

  const cookieStore = await cookies();

  cookieStore.set("quickbooks_oauth_state", state, {
    httpOnly: true,
    // eslint-disable-next-line no-restricted-syntax -- NODE_ENV is framework-provided and allows insecure cookies only for local HTTP development.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/",
  });

  const redirectUri =
    `${appUrl}/api/integrations/quickbooks/callback`;

  const authorizationUrl = new URL(
    QUICKBOOKS_AUTHORIZATION_URL,
  );

  authorizationUrl.searchParams.set(
    "client_id",
    clientId,
  );

  authorizationUrl.searchParams.set(
    "redirect_uri",
    redirectUri,
  );

  authorizationUrl.searchParams.set(
    "response_type",
    "code",
  );

  authorizationUrl.searchParams.set(
    "scope",
    QUICKBOOKS_SCOPE,
  );

  authorizationUrl.searchParams.set(
    "state",
    state,
  );

  return NextResponse.redirect(authorizationUrl);
}