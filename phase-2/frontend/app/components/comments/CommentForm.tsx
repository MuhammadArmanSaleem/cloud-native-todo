"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { commentSchema, CommentFormValues } from "../../lib/validators/commentSchema";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";

interface CommentFormProps {
  onSubmit: (values: CommentFormValues) => Promise<void>;
  isLoading?: boolean;
}

export default function CommentForm({ onSubmit, isLoading = false }: CommentFormProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];

  const initialValues: CommentFormValues = {
    text: "",
  };

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
        Add Comment
      </h3>
      <Formik
        initialValues={initialValues}
        validationSchema={commentSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          await onSubmit(values);
          resetForm();
          setSubmitting(false);
        }}
      >
        {({ values, isSubmitting }) => {
          const submitting = isLoading || isSubmitting;
          const remainingChars = 1000 - (values.text?.length || 0);

          return (
            <Form className="space-y-4">
              <div>
                <Field
                  as="textarea"
                  id="comment-text"
                  name="text"
                  rows={4}
                  maxLength={1000}
                  placeholder={t.comments.placeholder}
                  className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-y"
                />
                <div className="flex justify-between items-center mt-1">
                  <ErrorMessage
                    name="text"
                    component="p"
                    className="text-sm text-destructive"
                  />
                  <span
                    className={`text-xs ${
                      remainingChars < 50
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {remainingChars} / 1000
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !values.text?.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? t.comments.posting : t.comments.post}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

