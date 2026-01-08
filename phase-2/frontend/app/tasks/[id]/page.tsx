"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import TaskHistory from "../../components/task/TaskHistory";
import CommentForm from "../../components/comments/CommentForm";
import CommentList from "../../components/comments/CommentList";
import AttachmentUpload from "../../components/attachments/AttachmentUpload";
import AttachmentList from "../../components/attachments/AttachmentList";
import ShareButton from "../../components/sharing/ShareButton";
import Toast from "../../components/ui/Toast";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "@/lib/auth";
import { uiCopy } from "../../content/uiCopy";
import { Task, TaskHistoryEntry } from "../../types/task";
import { Comment, CommentFormValues } from "../../types/comment";
import { Attachment, AttachmentFormValues } from "../../types/attachment";
import { ShareLink } from "../../types/sharing";
import { mockTasks } from "../../content/mockTasks";
import Link from "next/link";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const { session } = useAuth();
  const t = uiCopy[language];
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingAttachment, setIsSubmittingAttachment] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const taskId = params?.id ? parseInt(params.id as string, 10) : null;

  useEffect(() => {
    if (!taskId) {
      router.push("/tasks");
      return;
    }

    // Find task from mock data
    const foundTask = mockTasks.find((t) => t.id === taskId);
    if (foundTask) {
      // Add mock history, comments, and attachments if not present
      const taskWithHistory: Task = {
        ...foundTask,
        history: foundTask.history || generateMockHistory(foundTask),
        comments: foundTask.comments || generateMockComments(foundTask.id),
        attachments: foundTask.attachments || generateMockAttachments(foundTask.id),
      };
      setTask(taskWithHistory);
    } else {
      router.push("/tasks");
    }
    setIsLoading(false);
  }, [taskId, router]);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "ur" ? "ur-PK" : "en-US", {
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

  const handleCommentSubmit = async (values: CommentFormValues) => {
    if (!task || !session?.user) return;

    setIsSubmittingComment(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create new comment
      const newComment: Comment = {
        id: `comment-${task.id}-${Date.now()}`,
        task_id: task.id,
        user_id: session.user.id || "user-1",
        user_name: session.user.name || session.user.email?.split("@")[0] || "User",
        text: values.text.trim(),
        created_at: new Date().toISOString(),
      };

      // Update task with new comment
      const updatedComments = [...(task.comments || []), newComment];
      setTask({
        ...task,
        comments: updatedComments,
      });

      setToast({
        message: t.comments.posted,
        type: "success",
        isVisible: true,
      });
    } catch (error) {
      setToast({
        message: t.comments.postError,
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleAttachmentSubmit = async (values: AttachmentFormValues) => {
    if (!task || !session?.user) return;

    setIsSubmittingAttachment(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create new attachments from files
      const newAttachments: Attachment[] = values.files.map((file, index) => {
        const fileType = file.type.startsWith("image/")
          ? "image"
          : file.type === "application/pdf"
          ? "pdf"
          : file.type.startsWith("text/")
          ? "text"
          : "other";

        // Create mock file URL (in real app, this would be from server)
        const mockUrl = fileType === "image" 
          ? URL.createObjectURL(file) 
          : undefined;

        return {
          id: `attachment-${task.id}-${Date.now()}-${index}`,
          task_id: task.id,
          file_name: file.name,
          file_type: fileType as Attachment["file_type"],
          file_size: file.size,
          file_url: mockUrl,
          uploaded_by: session.user.name || session.user.email?.split("@")[0] || "User",
          uploaded_at: new Date().toISOString(),
        };
      });

      // Update task with new attachments
      const updatedAttachments = [...(task.attachments || []), ...newAttachments];
      setTask({
        ...task,
        attachments: updatedAttachments,
      });

      setToast({
        message: t.attachments.uploaded,
        type: "success",
        isVisible: true,
      });
    } catch (error) {
      setToast({
        message: t.attachments.uploadError,
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsSubmittingAttachment(false);
    }
  };

  const handleAttachmentDownload = (attachment: Attachment) => {
    if (attachment.file_url) {
      const link = document.createElement("a");
      link.href = attachment.file_url;
      link.download = attachment.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setToast({
        message: t.attachments.downloadError,
        type: "error",
        isVisible: true,
      });
    }
  };

  const handleEmailShare = async (email: string) => {
    // Mock email share
    await new Promise((resolve) => setTimeout(resolve, 500));
    setToast({
      message: t.sharing.emailSent(email),
      type: "success",
      isVisible: true,
    });
  };

  const handleLinkShare = async (): Promise<ShareLink> => {
    // Mock link generation
    await new Promise((resolve) => setTimeout(resolve, 300));
    const shareToken = `share-${task?.id}-${Date.now()}`;
    const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/tasks/${task?.id}/shared/${shareToken}`;
    setToast({
      message: t.sharing.linkGenerated,
      type: "success",
      isVisible: true,
    });
    return {
      taskId: task?.id || 0,
      shareToken,
      shareUrl,
      generatedAt: new Date().toISOString(),
    };
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-foreground">Loading task...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!task) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-4">
              Task not found
            </h2>
            <Link
              href="/tasks"
              className="text-primary hover:text-primary/80 underline"
            >
              Return to tasks
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Tasks
        </Link>

        {/* Task Details */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                {task.title}
              </h1>
              {task.description && (
                <p className="text-muted-foreground mb-4">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ShareButton task={task} variant="default" onEmailShare={handleEmailShare} onLinkShare={handleLinkShare} />
              {task.priority && (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-md ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {getPriorityLabel(task.priority)}
                </span>
              )}
              <span
                className={`px-2 py-1 text-xs font-medium rounded-md ${
                  task.completed
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>
          </div>

          {/* Task Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
            {task.due_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                <span>Due: {formatDate(task.due_date)}</span>
              </div>
            )}

            {task.recurring_pattern && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                <span className="capitalize">{task.recurring_pattern}</span>
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Task History */}
        {task.history && task.history.length > 0 && (
          <TaskHistory history={task.history} taskId={task.id} />
        )}

        {/* Attachments Section */}
        <div className="space-y-4">
          <AttachmentUpload
            onSubmit={handleAttachmentSubmit}
            isLoading={isSubmittingAttachment}
          />
          <AttachmentList
            attachments={task.attachments || []}
            onDownload={handleAttachmentDownload}
          />
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          <CommentForm
            onSubmit={handleCommentSubmit}
            isLoading={isSubmittingComment}
          />
          <CommentList comments={task.comments || []} />
        </div>

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

// Helper function to generate mock history for tasks
function generateMockHistory(task: Task): TaskHistoryEntry[] {
  const history: TaskHistoryEntry[] = [
    {
      id: `history-${task.id}-1`,
      change_type: "created",
      timestamp: task.created_at,
      user_id: task.user_id,
      user_name: "Current User",
    },
  ];

  if (task.completed) {
    history.push({
      id: `history-${task.id}-2`,
      change_type: "completed",
      timestamp: task.updated_at,
      user_id: task.user_id,
      user_name: "Current User",
    });
  }

  if (task.priority) {
    history.push({
      id: `history-${task.id}-3`,
      change_type: "priority_updated",
      timestamp: task.updated_at,
      user_id: task.user_id,
      user_name: "Current User",
      details: `Priority set to ${task.priority}`,
    });
  }

  if (task.due_date) {
    history.push({
      id: `history-${task.id}-4`,
      change_type: "due_date_set",
      timestamp: task.updated_at,
      user_id: task.user_id,
      user_name: "Current User",
    });
  }

  return history;
}

// Helper function to generate mock comments for tasks
function generateMockComments(taskId: number): Comment[] {
  return [
    {
      id: `comment-${taskId}-1`,
      task_id: taskId,
      user_id: "user-1",
      user_name: "John Doe",
      text: "This task looks good. Let's prioritize it.",
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: `comment-${taskId}-2`,
      task_id: taskId,
      user_id: "user-2",
      user_name: "Jane Smith",
      text: "I'll help with this one.",
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
  ];
}

// Helper function to generate mock attachments for tasks
function generateMockAttachments(taskId: number): Attachment[] {
  return [
    {
      id: `attachment-${taskId}-1`,
      task_id: taskId,
      file_name: "project-spec.pdf",
      file_type: "pdf",
      file_size: 245760, // 240 KB
      uploaded_by: "John Doe",
      uploaded_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
    {
      id: `attachment-${taskId}-2`,
      task_id: taskId,
      file_name: "wireframe.png",
      file_type: "image",
      file_size: 512000, // 500 KB
      file_url: "https://via.placeholder.com/200", // Mock image URL
      uploaded_by: "Jane Smith",
      uploaded_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ];
}

