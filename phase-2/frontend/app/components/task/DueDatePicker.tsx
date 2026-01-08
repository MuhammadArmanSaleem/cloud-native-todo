"use client";

import { useField } from "formik";

interface DueDatePickerProps {
  name: string;
  label?: string;
  showTime?: boolean;
}

export default function DueDatePicker({
  name,
  label = "Due Date",
  showTime = false,
}: DueDatePickerProps) {
  const [field, meta, helpers] = useField(name);

  const formatDateForInput = (value: string | null | Date): string => {
    if (!value) return "";
    if (value instanceof Date) {
      if (isNaN(value.getTime())) return "";
      return value.toISOString().split("T")[0];
    }
    if (typeof value === "string") {
      const date = new Date(value);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    }
    return "";
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      helpers.setValue(value);
    } else {
      helpers.setValue(null);
    }
  };

  const handleClear = () => {
    helpers.setValue(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
        {field.value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Clear due date"
          >
            Clear
          </button>
        )}
      </div>
      <div className="relative">
        <input
          type="date"
          id={name}
          name={name}
          value={formatDateForInput(field.value)}
          onChange={handleDateChange}
          onBlur={field.onBlur}
          className={`w-full px-4 py-2 bg-card border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
            meta.error && meta.touched
              ? "border-destructive"
              : "border-border"
          }`}
        />
        {showTime && field.value && (
          <input
            type="time"
            name={`${name}_time`}
            className="mt-2 w-full px-4 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          />
        )}
      </div>
      {meta.error && meta.touched && (
        <p className="mt-1.5 text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
}


