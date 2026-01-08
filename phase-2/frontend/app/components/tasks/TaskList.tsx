"use client";

import { Task } from "../../types/task";
import TaskCard from "./TaskCard";
import TaskListSkeleton from "./TaskListSkeleton";
import TaskListEmpty from "./TaskListEmpty";

export type TaskFilter = "all" | "completed" | "pending";

interface TaskListProps {
  tasks: Task[];
  filter?: TaskFilter;
  isLoading?: boolean;
  onToggleComplete: (id: number) => void;
  onDelete?: (id: number) => void;
  currentUserId?: string;
}

export default function TaskList({
  tasks,
  filter = "all",
  isLoading = false,
  onToggleComplete,
  onDelete,
  currentUserId,
}: TaskListProps) {
  // Loading State
  if (isLoading) {
    return <TaskListSkeleton />;
  }

  // Filter tasks based on completion status
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  // Empty State
  if (filteredTasks.length === 0) {
    return <TaskListEmpty filter={filter} />;
  }

  // Render Task List
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
