"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Task } from "../../types/task";
import { taskFormSchema, TaskFormValues } from "../../lib/validators/taskSchema";
import { useState } from "react";
import DueDatePicker from "../task/DueDatePicker";
import RecurringTaskSelector from "../task/RecurringTaskSelector";

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TaskForm({
  task,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TaskFormProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];
  const [tagInput, setTagInput] = useState("");

  // Initial values for Formik - convert date to string format for HTML input
  const getInitialDueDate = (): string | null => {
    if (!task?.due_date) return null;
    const date = new Date(task.due_date);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split("T")[0];
  };

  // Get initial recurring pattern
  const getInitialRecurringPattern = () => {
    if (!task?.recurring_pattern) return null;
    // If it's a string, return as is
    if (typeof task.recurring_pattern === "string") {
      return task.recurring_pattern;
    }
    // If it's an object, return as is
    if (typeof task.recurring_pattern === "object") {
      return task.recurring_pattern;
    }
    return null;
  };

  const initialValues: TaskFormValues = {
    title: task?.title || "",
    description: task?.description || null,
    priority: task?.priority || null,
    tags: task?.tags || [],
    due_date: getInitialDueDate(),
    recurring_pattern: getInitialRecurringPattern(),
  };

  const handleAddTag = (
    currentTags: string[],
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!tagInput.trim()) return;
    const trimmedTag = tagInput.trim();
    if (!currentTags.includes(trimmedTag)) {
      setFieldValue("tags", [...currentTags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (
    tagToRemove: string,
    currentTags: string[],
    setFieldValue: (field: string, value: any) => void
  ) => {
    setFieldValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={taskFormSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ values, setFieldValue, isSubmitting: formikSubmitting }) => {
        const submitting = isSubmitting || formikSubmitting;

        return (
          <Form className="space-y-4">
            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                {t.taskForm.titleLabel} <span className="text-destructive">*</span>
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                maxLength={200}
                className="w-full px-4 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                placeholder={t.taskForm.titlePlaceholder}
              />
              <ErrorMessage
                name="title"
                component="p"
                className="mt-1.5 text-sm text-destructive"
              />
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                {t.taskForm.descriptionLabel}
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background resize-y"
                placeholder={t.taskForm.descriptionPlaceholder}
              />
              <div className="flex justify-between items-center mt-1">
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-sm text-destructive"
                />
                <span className="text-xs text-muted-foreground">
                  {(values.description?.length || 0)} / 1000
                </span>
              </div>
            </div>

            {/* Priority Field */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                {t.taskForm.priorityLabel}
              </label>
              <Field
                as="select"
                id="priority"
                name="priority"
                className="w-full px-4 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              >
                <option value="">{t.taskForm.priorityNone}</option>
                <option value="low">{t.taskForm.priorityLow}</option>
                <option value="medium">{t.taskForm.priorityMedium}</option>
                <option value="high">{t.taskForm.priorityHigh}</option>
              </Field>
              <ErrorMessage
                name="priority"
                component="p"
                className="mt-1.5 text-sm text-destructive"
              />
            </div>

            {/* Tags Field */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(values.tags || [], setFieldValue);
                    }
                  }}
                  placeholder={t.taskForm.addTagPlaceholder}
                  className="flex-1 px-4 py-2 bg-card border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(values.tags || [], setFieldValue)}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
                >
                  Add
                </button>
              </div>
              {values.tags && values.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {values.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground text-sm rounded"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveTag(tag, values.tags || [], setFieldValue)
                        }
                        className="text-muted-foreground hover:text-foreground focus:outline-none"
                        aria-label={`Remove tag ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <ErrorMessage
                name="tags"
                component="p"
                className="mt-1.5 text-sm text-destructive"
              />
            </div>

            {/* Due Date Field */}
            <DueDatePicker name="due_date" label={t.taskForm.dueDateLabel} />

            {/* Recurring Pattern Field */}
            <RecurringTaskSelector name="recurring_pattern" label={t.taskForm.recurringPatternLabel} />

            {/* Form Actions */}
            <div className="flex gap-2 justify-end pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="px-4 py-2 bg-card border border-border text-foreground rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.taskForm.cancelButton}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? t.taskForm.saving
                  : task
                  ? t.taskForm.saveButton
                  : t.taskForm.createButton}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
