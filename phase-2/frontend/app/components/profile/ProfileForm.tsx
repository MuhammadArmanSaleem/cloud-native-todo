"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { profileSchema, ProfileFormValues } from "../../lib/validators/profileSchema";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";

interface ProfileFormProps {
  initialValues: {
    name: string;
    email: string;
    password?: string;
  };
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export default function ProfileForm({
  initialValues,
  onSubmit,
  isLoading = false,
  error,
}: ProfileFormProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];

  const formInitialValues: ProfileFormValues = {
    name: initialValues.name || "",
    email: initialValues.email || "",
    password: null,
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={profileSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => {
        const submitting = isLoading || isSubmitting;

        return (
          <Form className="space-y-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                placeholder="Enter your name"
              />
              <ErrorMessage
                name="name"
                component="p"
                className="mt-1.5 text-sm text-destructive"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="mt-1.5 text-sm text-destructive"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                New Password (optional)
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                placeholder="Leave empty to keep current password"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Leave empty if you don't want to change your password
              </p>
              <ErrorMessage
                name="password"
                component="p"
                className="mt-1.5 text-sm text-destructive"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-2 justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}


