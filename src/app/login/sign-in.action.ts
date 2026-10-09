"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const signIn = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Email and password are required.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/login?error=Invalid email or password");
  }

  redirect("/dashboard");
};