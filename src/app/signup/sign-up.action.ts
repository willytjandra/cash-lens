"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { signUpSchema } from "./sign-up.schema";
import { createAdminClient } from "@/lib/supabase/admin";

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

  const { data, error } = await supabase.auth.signUp({
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

  const user = data.user;

  if (!user) {
    return {
      success: false,
      errors: {
          form: ['unable to create user'],
        },
    };
  }

  const admin = createAdminClient();

  const { error: profileError } = await admin
    .schema("cashlens")
    .from("profiles")
    .insert({
      auth_user_id: user.id,
      first_name: firstName,
      last_name: lastName,
    });

    if (profileError) {
      await admin.auth.admin.deleteUser(user.id);

      console.error("Failed to create CashLens profile", profileError);

      return {
        success: false,
        errors: {
            form: ['unable to create user profile'],
          },
      };
    }


  redirect("/signup/confirmation");
};