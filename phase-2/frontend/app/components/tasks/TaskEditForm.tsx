"use client";

import TaskForm from "./TaskForm";
import { Task } from "../../types/task";
import { TaskFormValues } from "../../lib/validators/taskSchema";

interface TaskEditFormProps {
  task: Task;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function TaskEditForm({
  task,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TaskEditFormProps) {
  return (
    <TaskForm
      task={task}
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
    />
  );
}


