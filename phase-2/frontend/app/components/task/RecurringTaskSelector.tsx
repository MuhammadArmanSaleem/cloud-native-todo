"use client";

import { useField } from "formik";
import { useState, useEffect } from "react";

interface RecurringTaskSelectorProps {
  name: string;
  label?: string;
}

type RecurringPattern = "daily" | "weekly" | "monthly" | "custom" | null;

export default function RecurringTaskSelector({
  name,
  label = "Recurring Pattern",
}: RecurringTaskSelectorProps) {
  const [field, meta, helpers] = useField(name);
  const [customFrequency, setCustomFrequency] = useState<number>(1);
  const [customUnit, setCustomUnit] = useState<"days" | "weeks">("days");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const currentPattern = (field.value as RecurringPattern) || null;

  const handlePatternChange = (pattern: RecurringPattern) => {
    if (pattern === "custom") {
      setShowCustomInput(true);
      helpers.setValue({
        type: "custom",
        frequency: customFrequency,
        unit: customUnit,
      });
    } else {
      setShowCustomInput(false);
      helpers.setValue(pattern);
    }
  };

  const handleCustomFrequencyChange = (frequency: number) => {
    setCustomFrequency(frequency);
    if (currentPattern === "custom" || showCustomInput) {
      helpers.setValue({
        type: "custom",
        frequency,
        unit: customUnit,
      });
    }
  };

  const handleCustomUnitChange = (unit: "days" | "weeks") => {
    setCustomUnit(unit);
    if (currentPattern === "custom" || showCustomInput) {
      helpers.setValue({
        type: "custom",
        frequency: customFrequency,
        unit,
      });
    }
  };

  const handleClear = () => {
    helpers.setValue(null);
    setShowCustomInput(false);
  };

  // Check if current value is a custom pattern object
  const isCustomPattern =
    typeof field.value === "object" &&
    field.value !== null &&
    "type" in field.value &&
    field.value.type === "custom";

  // Initialize custom input state from field value
  useEffect(() => {
    if (isCustomPattern) {
      setShowCustomInput(true);
      if ("frequency" in field.value) {
        setCustomFrequency(field.value.frequency as number);
      }
      if ("unit" in field.value) {
        setCustomUnit(field.value.unit as "days" | "weeks");
      }
    } else if (typeof field.value === "string" && field.value !== null) {
      setShowCustomInput(false);
    } else if (field.value === null) {
      setShowCustomInput(false);
    }
  }, [field.value, isCustomPattern]);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
        {field.value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Clear recurring pattern"
          >
            Clear
          </button>
        )}
      </div>

      {/* Pattern Options */}
      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`${name}_pattern`}
              checked={currentPattern === "daily"}
              onChange={() => handlePatternChange("daily")}
              className="w-4 h-4 text-primary border-border focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm text-foreground">Daily</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`${name}_pattern`}
              checked={currentPattern === "weekly"}
              onChange={() => handlePatternChange("weekly")}
              className="w-4 h-4 text-primary border-border focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm text-foreground">Weekly</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`${name}_pattern`}
              checked={currentPattern === "monthly"}
              onChange={() => handlePatternChange("monthly")}
              className="w-4 h-4 text-primary border-border focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm text-foreground">Monthly</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`${name}_pattern`}
              checked={currentPattern === "custom" || isCustomPattern}
              onChange={() => handlePatternChange("custom")}
              className="w-4 h-4 text-primary border-border focus:ring-2 focus:ring-ring"
            />
            <span className="text-sm text-foreground">Custom</span>
          </label>
        </div>

        {/* Custom Pattern Input */}
        {showCustomInput && (
          <div className="ml-6 p-3 bg-card border border-border rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">Every</span>
              <input
                type="number"
                min="1"
                max="365"
                value={customFrequency}
                onChange={(e) =>
                  handleCustomFrequencyChange(parseInt(e.target.value) || 1)
                }
                className="w-20 px-2 py-1 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <select
                value={customUnit}
                onChange={(e) =>
                  handleCustomUnitChange(e.target.value as "days" | "weeks")
                }
                className="px-2 py-1 bg-background border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {meta.error && meta.touched && (
        <p className="mt-1.5 text-sm text-destructive">{meta.error}</p>
      )}
    </div>
  );
}

