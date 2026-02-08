"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import TaskList, { TaskFilter } from "../components/tasks/TaskList";
import TaskForm from "../components/tasks/TaskForm";
import Toast from "../components/ui/Toast";
import { useLanguage } from "../contexts/LanguageContext";
import { useVoiceCommand } from "../contexts/VoiceCommandContext";
import { useUserRole } from "../hooks/useUserRole";
import { useAuth } from "@/lib/auth";
import { uiCopy } from "../content/uiCopy";
import Link from "next/link";
import { Task } from "../types/task";
import { TaskFormValues } from "../lib/validators/taskSchema";
import { todoApi } from "@/lib/api";

function normalizeTask(t: Task): Task {
  return {
    ...t,
    due_date: t.due_date ?? null,
    created_at: typeof t.created_at === "string" ? t.created_at : new Date(t.created_at as any).toISOString(),
    updated_at: typeof t.updated_at === "string" ? t.updated_at : new Date(t.updated_at as any).toISOString(),
  };
}

export default function TasksPage() {
  const { language } = useLanguage();
  const { session } = useAuth();
  const { registerHandlers, unregisterHandlers } = useVoiceCommand();
  const { isAdmin } = useUserRole();
  const t = uiCopy[language];
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({ message: "", type: "info", isVisible: false });

  const token = session?.token ?? "";
  useEffect(() => {
    if (token) todoApi.setToken(token);
  }, [token]);

  const fetchTasks = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const list = await todoApi.getTasks({ status: filter === "all" ? undefined : filter });
      setTasks((list || []).map(normalizeTask));
    } catch (err) {
      setToast({ message: t.toast.taskDeleteError ?? "Failed to load tasks", type: "error", isVisible: true });
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, filter, t.toast.taskDeleteError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleComplete = async (id: number) => {
    try {
      const updated = await todoApi.toggleTaskCompletion(id);
      setTasks((prev) => prev.map((task) => (task.id === id ? normalizeTask(updated) : task)));
      setToast({ message: t.toast.taskUpdated ?? "Task updated", type: "success", isVisible: true });
    } catch (err) {
      setToast({ message: t.toast.taskDeleteError ?? "Failed to update", type: "error", isVisible: true });
    }
  };

  const handleTaskSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: values.title,
        description: values.description || undefined,
        priority: values.priority || undefined,
        tags: values.tags ?? [],
        due_date: values.due_date || undefined,
        recurring_pattern: (typeof values.recurring_pattern === "string" ? values.recurring_pattern : null) || undefined,
      };
      if (editingTask) {
        const updated = await todoApi.updateTask(editingTask.id, payload);
        setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? normalizeTask(updated) : task)));
        setToast({ message: t.toast.taskUpdated, type: "success", isVisible: true });
      } else {
        const created = await todoApi.createTask(payload);
        setTasks((prev) => [...prev, normalizeTask(created)]);
        setToast({ message: t.toast.taskCreated, type: "success", isVisible: true });
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (err) {
      setToast({ message: t.toast.taskDeleteError ?? "Request failed", type: "error", isVisible: true });
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
      await todoApi.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setToast({ message: t.toast.taskDeleted, type: "success", isVisible: true });
    } catch (err) {
      setToast({ message: t.toast.taskDeleteError, type: "error", isVisible: true });
      throw err;
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
            const created = await todoApi.createTask({ title: command.title });
            setTasks((prev) => [...prev, normalizeTask(created)]);
            setToast({ message: `${t.toast.taskCreated}: "${command.title}"`, type: "success", isVisible: true });
          }
          break;
        case "mark-complete":
          if (command.taskId) {
            const task = tasks.find((t) => t.id === command.taskId);
            if (task) {
              const updated = await todoApi.toggleTaskCompletion(command.taskId);
              setTasks((prev) => prev.map((t) => (t.id === command.taskId ? normalizeTask(updated) : t)));
              setToast({ message: `Task ${command.taskId} marked complete`, type: "success", isVisible: true });
            } else {
              setToast({ message: `Task ${command.taskId} not found`, type: "error", isVisible: true });
            }
          }
          break;
        case "delete":
          if (command.taskId) {
            const task = tasks.find((t) => t.id === command.taskId);
            if (task) await handleDeleteTask(command.taskId);
            else setToast({ message: `Task ${command.taskId} not found`, type: "error", isVisible: true });
          }
          break;
        case "update":
          if (command.taskId && command.newTitle) {
            const task = tasks.find((t) => t.id === command.taskId);
            if (task) {
              const updated = await todoApi.updateTask(command.taskId, { title: command.newTitle! });
              setTasks((prev) => prev.map((t) => (t.id === command.taskId ? normalizeTask(updated) : t)));
              setToast({ message: `${t.toast.taskUpdated}: Task ${command.taskId}`, type: "success", isVisible: true });
            } else {
              setToast({ message: `Task ${command.taskId} not found`, type: "error", isVisible: true });
            }
          }
          break;
      }
    } catch (err) {
      setToast({ message: "Failed to execute voice command", type: "error", isVisible: true });
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
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          currentUserId={session?.user?.id ?? ""}
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

