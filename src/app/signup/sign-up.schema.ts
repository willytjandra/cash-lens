import { z } from "zod";

export const signUpSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: z.email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;