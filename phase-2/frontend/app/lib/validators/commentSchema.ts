import * as yup from "yup";

export const commentSchema = yup.object({
  text: yup
    .string()
    .required("Comment text is required")
    .min(1, "Comment must be at least 1 character")
    .max(1000, "Comment must be no more than 1000 characters")
    .trim(),
});

export type CommentFormValues = yup.InferType<typeof commentSchema>;


