import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const GET = async (request: Request) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL("/login?error=Unable to confirm your account", requestUrl.origin),
      );
    }
  }

  return NextResponse.redirect(
    new URL("/dashboard", requestUrl.origin),
  );
};