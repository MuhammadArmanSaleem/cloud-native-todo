import * as yup from "yup";

export const profileSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less")
    .trim(),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .trim(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

export type ProfileFormValues = yup.InferType<typeof profileSchema>;


