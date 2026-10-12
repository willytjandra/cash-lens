"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

import { profileSchema } from "./profile.schema";

export type ProfileActionState =
  | {
      status: "idle";
      message: "";
    }
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      fieldErrors?: {
        firstName?: string[];
        lastName?: string[];
      };
    };

export const updateProfile = async (
  previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> => {
  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      status: "error",
      message: "You must be signed in.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .schema("cashlens")
    .from("profiles")
    .update({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", currentUser.id)
    .select("id")
    .single();

  if (error) {
    console.error("Failed to update CashLens profile", {
      profileId: currentUser.id,
      error,
    });

    return {
      status: "error",
      message: "Unable to update your profile.",
    };
  }

  revalidatePath("/profile");

  return {
    status: "success",
    message: "Profile updated.",
  };
};