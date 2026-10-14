import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { getCurrentUser } from "@/lib/auth/get-current-user";

const QUICKBOOKS_AUTHORIZATION_URL =
  "https://appcenter.intuit.com/connect/oauth2";

const QUICKBOOKS_SCOPE = "com.intuit.quickbooks.accounting";

export async function GET() {  

  const clientId = process.env.QUICKBOOKS_CLIENT_ID;
  const appUrl = process.env.APP_BASE_URL;

  if (!clientId) {
    throw new Error("QUICKBOOKS_CLIENT_ID is not configured");
  }

  if (!appUrl) {
    throw new Error("APP_BASE_URL is not configured");
  }

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