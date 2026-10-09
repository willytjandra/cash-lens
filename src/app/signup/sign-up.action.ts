"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { signUpSchema } from "./sign-up.schema";

export type SignUpState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        form?: string[];
      };
    };

export const signUp = async (
  _previousState: SignUpState,
  formData: FormData,
): Promise<SignUpState> => {
  const result = signUpSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, email, password } = result.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      errors: {
        form: [error.message],
      },
    };
  }

  redirect("/signup/confirmation");
};