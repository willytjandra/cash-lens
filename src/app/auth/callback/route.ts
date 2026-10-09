import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const redirectToLoginError = (requestUrl: URL, message: string) =>
  NextResponse.redirect(
    new URL(`/login?error=${encodeURIComponent(message)}`, requestUrl.origin),
  );

export const GET = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return redirectToLoginError(
      requestUrl,
      "Invalid or expired confirmation link.",
    );
  }

  const supabase = await createClient();

  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error("Failed to exchange confirmation code", {
      error: exchangeError,
    });

    return redirectToLoginError(
      requestUrl,
      "Unable to confirm your account.",
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Unable to get authenticated user after confirmation", {
      error: userError,
    });

    await supabase.auth.signOut();

    return redirectToLoginError(
      requestUrl,
      "Unable to complete account confirmation.",
    );
  }

  const { data: profile, error: profileError } = await supabase
    .schema("cashlens")
    .from("profiles")
    .update({
      status: "ACTIVE",
      updated_at: new Date().toISOString(),
    })
    .eq("auth_user_id", user.id)
    .select("id")
    .single();

  if (profileError || !profile) {
    console.error("Failed to activate CashLens profile", {
      authUserId: user.id,
      error: profileError,
    });

    await supabase.auth.signOut();

    return redirectToLoginError(
      requestUrl,
      "Unable to complete account setup. Please try again.",
    );
  }

  return NextResponse.redirect(
    new URL("/dashboard", requestUrl.origin),
  );
};