import "server-only";

import { cache } from "react";
import { connection } from "next/server";

import { createClient } from "@/lib/supabase/server";

import type { Database } from "@/types/database.types";

export type CurrentUser = {
  id: string;
  authUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  status: Database["cashlens"]["Enums"]["profile_status"];
};

export const getCurrentUser = cache(async () : Promise<CurrentUser | null> => {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .schema("cashlens")
    .from("profiles")
    .select("id, first_name, last_name, status")
    .eq("auth_user_id", user.id)
    .single();

  if (profileError) {
    throw new Error("Unable to load current user profile");
  }

  return {
    id: profile.id,
    authUserId: user.id,
    email: user.email ?? "",
    firstName: profile.first_name,
    lastName: profile.last_name,
    status: profile.status,
  };
});