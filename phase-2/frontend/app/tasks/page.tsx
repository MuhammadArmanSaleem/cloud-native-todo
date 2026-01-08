"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import TaskList, { TaskFilter } from "../components/tasks/TaskList";
import TaskForm from "../components/tasks/TaskForm";
import Toast from "../components/ui/Toast";
import { useLanguage } from "../contexts/LanguageContext";
import { useVoiceCommand } from "../contexts/VoiceCommandContext";
import { useUserRole } from "../hooks/useUserRole";
import { uiCopy } from "../content/uiCopy";
import Link from "next/link";
import { mockTasks } from "../content/mockTasks";
import { Task } from "../types/task";
import { TaskFormValues } from "../lib/validators/taskSchema";

export default function TasksPage() {
  const { language } = useLanguage();
  const { registerHandlers, unregisterHandlers } = useVoiceCommand();
  const { isAdmin } = useUserRole();
  const t = uiCopy[language];
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const handleToggleComplete = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleTaskSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      // Mock API call - in real app, this would call the API
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingTask) {
        // Update existing task
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTask.id
              ? {
                  ...task,
                  title: values.title,
                  description: values.description || null,
                  priority: values.priority,
                  tags: values.tags || [],
                  due_date: values.due_date || null,
                  recurring_pattern: values.recurring_pattern || null,
                }
              : task
          )
        );
      } else {
        // Create new task
        const newTask: Task = {
          id: Math.max(...tasks.map((t) => t.id), 0) + 1,
          user_id: "user-1",
          title: values.title,
          description: values.description || null,
          completed: false,
          priority: values.priority,
          tags: values.tags || [],
          due_date: values.due_date || null,
          reminder_time: null,
          recurring_pattern: typeof values.recurring_pattern === "string" 
            ? values.recurring_pattern 
            : null,
          next_occurrence: null,
          original_task_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
      }

      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCancelForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      // Mock API call - in real app, this would call the API
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Remove task from state immediately
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

      // Show success toast
      setToast({
        message: t.toast.taskDeleted,
        type: "success",
        isVisible: true,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      setToast({
        message: t.toast.taskDeleteError,
        type: "error",
        isVisible: true,
      });
      throw error; // Re-throw to let component handle it
    }
  };

  const handleVoiceCommand = async (command: {
    action: "add" | "mark-complete" | "delete" | "update";
    taskId?: number;
    title?: string;
    newTitle?: string;
  }) => {
    try {
      switch (command.action) {
        case "add":
          if (command.title) {
            const newTask: Task = {
              id: Math.max(...tasks.map((t) => t.id), 0) + 1,
              user_id: "user-1",
              title: command.title,
              description: null,
              completed: false,
              priority: null,
              tags: [],
              due_date: null,
              reminder_time: null,
              recurring_pattern: null,
              next_occurrence: null,
              original_task_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setTasks((prevTasks) => [...prevTasks, newTask]);
            setToast({
              message: `${t.toast.taskCreated}: "${command.title}"`,
              type: "success",
              isVisible: true,
            });
          }
          break;

        case "mark-complete":
          if (command.taskId) {
            const task = tasks.find((t) => t.id === command.taskId);
            if (task) {
              setTasks((prevTasks) =>
                prevTasks.map((t) =>
                  t.id === command.taskId ? { ...t, completed: true } : t
                )
              );
              setToast({
                message: `Task ${command.taskId} marked as complete`,
                type: "success",
                isVisible: true,
              });
            } else {
              setToast({
                message: `Task ${command.taskId} not found`,
                type: "error",
                isVisible: true,
              });
            }
          }
          break;

        case "delete":
          if (command.taskId) {
            const task = tasks.find((t) => t.id === command.taskId);
            if (task) {
              await handleDeleteTask(command.taskId);
            } else {
              setToast({
                message: `Task ${command.taskId} not found`,
                type: "error",
                isVisible: true,
              });
            }
          }
          break;

        case "update":
          if (command.taskId && command.newTitle) {
            const task = tasks.find((t) => t.id === command.taskId);
            if (task) {
              setTasks((prevTasks) =>
                prevTasks.map((t) =>
                  t.id === command.taskId
                    ? { ...t, title: command.newTitle!, updated_at: new Date().toISOString() }
                    : t
                )
              );
              setToast({
                message: `${t.toast.taskUpdated}: Task ${command.taskId}`,
                type: "success",
                isVisible: true,
              });
            } else {
              setToast({
                message: `Task ${command.taskId} not found`,
                type: "error",
                isVisible: true,
              });
            }
          }
          break;
      }
    } catch (error) {
      console.error("Error executing voice command:", error);
      setToast({
        message: "Failed to execute voice command",
        type: "error",
        isVisible: true,
      });
    }
  };

  const handleVoiceError = (error: string) => {
    setToast({
      message: error,
      type: "error",
      isVisible: true,
    });
  };

  // Register voice command handlers when component mounts
  useEffect(() => {
    registerHandlers(handleVoiceCommand, handleVoiceError);
    return () => {
      unregisterHandlers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
      {/* Header with Add Task Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold text-foreground">{t.taskList.title}</h1>
        {!showTaskForm && (
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/roles"
                className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
              >
                {t.roles.taskManagement}
              </Link>
            )}
            <button
              onClick={() => setShowTaskForm(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
            >
              {t.header.addTask}
            </button>
          </div>
        )}
      </div>

      {/* Task Form */}
      {showTaskForm && (
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
            {editingTask ? t.taskForm.editTitle : t.taskForm.createTitle}
          </h2>
          <TaskForm
            task={editingTask}
            onSubmit={handleTaskSubmit}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Filter Controls */}
      {!showTaskForm && (
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted border border-border"
            }`}
          >
            {t.taskList.all}
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === "pending"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted border border-border"
            }`}
          >
            {t.taskList.pending}
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === "completed"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted border border-border"
            }`}
          >
            {t.taskList.completed}
          </button>
        </div>
      )}

      {/* Task List */}
      {!showTaskForm && (
        <TaskList
          tasks={tasks}
          filter={filter}
          isLoading={isLoading}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          currentUserId="user-1"
        />
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      </div>
    </ProtectedRoute>
  );
}

