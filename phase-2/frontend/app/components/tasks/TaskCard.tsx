"use client";

import { Task } from "../../types/task";
import { useState } from "react";
import Link from "next/link";
import ConfirmDeleteDialog from "../task/ConfirmDeleteDialog";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete?: (id: number) => void;
  currentUserId?: string;
}

export default function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  currentUserId,
}: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user owns this task and delete handler is provided
  const canDelete = onDelete && (!currentUserId || task.user_id === currentUserId);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(task.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPriorityColor = (priority: string | null): string => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "";
    }
  };

  const getPriorityLabel = (priority: string | null): string => {
    switch (priority) {
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return "";
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border border-border bg-card ${
        task.completed ? "opacity-60" : ""
      } transition-opacity`}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background cursor-pointer"
          aria-label={`Mark task "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
        />

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title - Clickable to view details */}
          <Link href={`/tasks/${task.id}`}>
            <h3
              className={`text-lg font-heading font-semibold hover:text-primary transition-colors ${
                task.completed ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              {task.title}
            </h3>
          </Link>

          {/* Description */}
          {task.description && (
            <p
              className={`mt-1 text-sm ${
                task.completed ? "text-muted-foreground" : "text-muted-foreground"
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata Row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Priority Badge */}
            {task.priority && (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-md ${getPriorityColor(
                  task.priority
                )}`}
              >
                {getPriorityLabel(task.priority)}
              </span>
            )}

            {/* Due Date */}
            {task.due_date && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{formatDate(task.due_date)}</span>
              </div>
            )}

            {/* Recurring Indicator */}
            {task.recurring_pattern && (
              <div className="flex items-center gap-1 text-sm text-accent">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="capitalize">
                  {task.recurring_pattern}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-start gap-2">
          {canDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              aria-label={`Delete task "${task.title}"`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        taskTitle={task.title}
        isLoading={isDeleting}
      />
    </div>
  );
}

