"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";

import { signUp, type SignUpState } from "../sign-up.action";
import { signUpSchema, type SignUpInput } from "../sign-up.schema";

const initialState: SignUpState = {
  success: false,
  errors: {},
};

const SignupForm = () => {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();

    formData.set("firstName", data.firstName);
    formData.set("lastName", data.lastName);
    formData.set("email", data.email);
    formData.set("password", data.password);
    formData.set("confirmPassword", data.confirmPassword);

    startTransition(() => formAction(formData));
  });

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            First name
          </label>

          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            {...register("firstName")}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />

          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last name
          </label>

          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            {...register("lastName")}
            className="mt-1 w-full rounded-md border px-3 py-2"
          />

          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>

        <input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirm password
        </label>

        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {!state.success && state.errors.form && (
        <p className="text-sm text-red-600">{state.errors.form[0]}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-black px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
};

export default SignupForm;
