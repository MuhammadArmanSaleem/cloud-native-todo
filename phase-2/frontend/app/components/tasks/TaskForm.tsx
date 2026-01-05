// TaskForm component with validation - following nextjs-frontend skill patterns
'use client';

import { useState } from 'react';
import { TaskCreate, Task } from '@/app/types/task';
import { validateTask, sanitizeString, ValidationErrors } from '@/app/lib/validation';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskCreate) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TaskForm({ task, onSubmit, onCancel, isSubmitting = false }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskCreate>({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    tags: task?.tags || [],
    due_date: task?.due_date ? task.due_date.split('T')[0] : '',
    reminder_time: task?.reminder_time ? task.reminder_time.split('T')[0] + 'T' + task.reminder_time.split('T')[1] : '',
    recurring_pattern: task?.recurring_pattern || undefined,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [tagInput, setTagInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Sanitize input on change
    const sanitized = name === 'title' || name === 'description' 
      ? sanitizeString(value)
      : value;
    
    setFormData(prev => ({ ...prev, [name]: sanitized }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const sanitized = sanitizeString(tagInput.trim());
    if (sanitized && !formData.tags?.includes(sanitized)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), sanitized]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before API call
    const validationErrors = validateTask(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop - don't call API
    }

    // All validation passed - call API
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title *"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        maxLength={200}
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          maxLength={1000}
          className={`
            w-full px-3 py-2 border rounded-md
            text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.description ? 'border-red-300' : 'border-gray-300'}
          `}
        />
        {errors.description && (
          <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1.5">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority || 'medium'}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1.5">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(sanitizeString(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Add a tag and press Enter"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="button" variant="secondary" onClick={handleAddTag}>
            Add
          </Button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Due Date"
          name="due_date"
          type="date"
          value={formData.due_date || ''}
          onChange={handleChange}
          error={errors.due_date}
        />
        <Input
          label="Reminder Time"
          name="reminder_time"
          type="datetime-local"
          value={formData.reminder_time || ''}
          onChange={handleChange}
          error={errors.reminder_time}
        />
      </div>

      <div>
        <label htmlFor="recurring_pattern" className="block text-sm font-medium text-gray-700 mb-1.5">
          Recurring Pattern
        </label>
        <select
          id="recurring_pattern"
          name="recurring_pattern"
          value={formData.recurring_pattern || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}

