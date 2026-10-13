"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";

import { profileSchema, type ProfileFormValues } from "../profile.schema";
import {
  updateProfile,
  type ProfileActionState,
} from "../update-profile.action";

type ProfileFormProps = {
  email: string;
  firstName: string;
  lastName: string;
};

const initialState: ProfileActionState = {
  status: "idle",
  message: "",
};

const ProfileForm = ({ email, firstName, lastName }: ProfileFormProps) => {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName,
      lastName,
    },
  });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();

    formData.set("firstName", values.firstName);
    formData.set("lastName", values.lastName);

    formAction(formData);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>

        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium">
          First name
        </label>

        <input
          id="firstName"
          type="text"
          {...register("firstName")}
          className="mt-1 w-full rounded border px-3 py-2"
        />

        {errors.firstName && (
          <p className="mt-1 text-sm">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium">
          Last name
        </label>

        <input
          id="lastName"
          type="text"
          {...register("lastName")}
          className="mt-1 w-full rounded border px-3 py-2"
        />

        {errors.lastName && (
          <p className="mt-1 text-sm">{errors.lastName.message}</p>
        )}
      </div>

      {state.message && <p className="text-sm">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded border px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
};

export default ProfileForm;
