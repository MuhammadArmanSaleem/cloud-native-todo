import * as yup from "yup";

export const emailShareSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format"),
});

export type EmailShareFormValues = yup.InferType<typeof emailShareSchema>;

