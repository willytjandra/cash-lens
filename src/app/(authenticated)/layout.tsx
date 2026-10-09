import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { PropsWithChildren } from "react";

// This authenticated route depends on request-time cookies for the Supabase session.
// With Next.js Cache Components enabled, make the whole route blocking instead of
// wrapping the auth check in Suspense.
export const instant = false;

const AuthenticatedLayout = async ({ children }: PropsWithChildren) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return children;
};

export default AuthenticatedLayout;
