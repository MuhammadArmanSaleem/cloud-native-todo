import * as yup from "yup";

// Recurring pattern validation
const recurringPatternSchema = yup
  .mixed()
  .nullable()
  .test(
    "is-valid-pattern",
    "Recurring pattern must be daily, weekly, monthly, or custom",
    (value) => {
      if (!value) return true; // Optional field
      if (typeof value === "string") {
        return ["daily", "weekly", "monthly"].includes(value);
      }
      if (typeof value === "object" && value !== null) {
        // Custom pattern object
        if ("type" in value && value.type === "custom") {
          if ("frequency" in value && "unit" in value) {
            const freq = value.frequency as number;
            const unit = value.unit as string;
            return (
              typeof freq === "number" &&
              freq >= 1 &&
              freq <= 365 &&
              (unit === "days" || unit === "weeks")
            );
          }
        }
      }
      return false;
    }
  );

export const taskFormSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(1, "Title must be at least 1 character")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  description: yup
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  priority: yup
    .string()
    .oneOf(["low", "medium", "high", null], "Priority must be low, medium, or high")
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  tags: yup
    .array()
    .of(yup.string())
    .nullable()
    .transform((value) => (value === null || value === undefined ? [] : value)),
  due_date: yup
    .string()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null || originalValue === undefined) {
        return null;
      }
      // If it's already a Date object, convert to ISO string date part
      if (originalValue instanceof Date) {
        return isNaN(originalValue.getTime()) ? null : originalValue.toISOString().split("T")[0];
      }
      // If it's a string, validate it's a valid date
      const date = new Date(originalValue);
      return isNaN(date.getTime()) ? null : originalValue;
    })
    .test("is-valid-date", "Due date must be a valid date", (value) => {
      if (!value) return true; // Optional field
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),
  recurring_pattern: recurringPatternSchema,
});

export type TaskFormValues = yup.InferType<typeof taskFormSchema>;

