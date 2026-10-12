"use client";

import { useActionState } from "react";

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

  return (
    <form action={formAction} className="space-y-4">
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
          name="firstName"
          type="text"
          defaultValue={firstName}
          className="mt-1 w-full rounded border px-3 py-2"
        />

        {state.status === "error" &&
          state.fieldErrors?.firstName?.map((error) => (
            <p key={error} className="mt-1 text-sm">
              {error}
            </p>
          ))}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium">
          Last name
        </label>

        <input
          id="lastName"
          name="lastName"
          type="text"
          defaultValue={lastName}
          className="mt-1 w-full rounded border px-3 py-2"
        />

        {state.status === "error" &&
          state.fieldErrors?.lastName?.map((error) => (
            <p key={error} className="mt-1 text-sm">
              {error}
            </p>
          ))}
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
