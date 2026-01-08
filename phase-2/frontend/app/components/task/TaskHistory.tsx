"use client";

import { TaskHistoryEntry } from "../../types/task";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";

interface TaskHistoryProps {
  history: TaskHistoryEntry[];
  taskId: number;
}

export default function TaskHistory({ history, taskId }: TaskHistoryProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString(language === "ur" ? "ur-PK" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChangeTypeLabel = (changeType: TaskHistoryEntry["change_type"]): string => {
    const labels: Record<TaskHistoryEntry["change_type"], string> = {
      created: "Task Created",
      completed: "Task Completed",
      edited: "Task Edited",
      priority_updated: "Priority Updated",
      due_date_set: "Due Date Set",
      due_date_updated: "Due Date Updated",
      status_changed: "Status Changed",
    };
    return labels[changeType] || changeType;
  };

  const getChangeTypeIcon = (changeType: TaskHistoryEntry["change_type"]): string => {
    const icons: Record<TaskHistoryEntry["change_type"], string> = {
      created: "➕",
      completed: "✅",
      edited: "✏️",
      priority_updated: "🔔",
      due_date_set: "📅",
      due_date_updated: "📅",
      status_changed: "🔄",
    };
    return icons[changeType] || "•";
  };

  if (!history || history.length === 0) {
    return (
      <div className="p-4 bg-card border border-border rounded-lg">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Task History
        </h3>
        <p className="text-sm text-muted-foreground">No history available for this task.</p>
      </div>
    );
  }

  // Sort history by timestamp (newest first)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
        Task History
      </h3>
      <div className="space-y-3">
        {sortedHistory.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start gap-3 p-3 bg-background border border-border rounded-md"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
              {getChangeTypeIcon(entry.change_type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-foreground">
                  {getChangeTypeLabel(entry.change_type)}
                </span>
                {entry.details && (
                  <span className="text-xs text-muted-foreground">• {entry.details}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatTimestamp(entry.timestamp)}</span>
                {entry.user_name && (
                  <>
                    <span>•</span>
                    <span>by {entry.user_name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

