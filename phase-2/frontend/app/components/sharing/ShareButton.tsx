"use client";

import { useState } from "react";
import { Task } from "../../types/task";
import { ShareLink } from "../../types/sharing";
import ShareTaskDialog from "./ShareTaskDialog";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";

interface ShareButtonProps {
  task: Task;
  onEmailShare?: (email: string) => Promise<void>;
  onLinkShare?: () => Promise<ShareLink>;
  variant?: "default" | "icon";
}

export default function ShareButton({
  task,
  onEmailShare,
  onLinkShare,
  variant = "default",
}: ShareButtonProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEmailShare = async (email: string) => {
    if (onEmailShare) {
      await onEmailShare(email);
    } else {
      // Mock email share
      console.log("Mock: Sharing task via email to", email);
    }
    setIsDialogOpen(false);
  };

  const handleLinkShare = async (): Promise<ShareLink> => {
    if (onLinkShare) {
      return await onLinkShare();
    } else {
      // Mock link generation
      const shareToken = `share-${task.id}-${Date.now()}`;
      const shareUrl = `${window.location.origin}/tasks/${task.id}/shared/${shareToken}`;
      return {
        taskId: task.id,
        shareToken,
        shareUrl,
        generatedAt: new Date().toISOString(),
      };
    }
  };

  if (variant === "icon") {
    return (
      <>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          aria-label={t.sharing.shareTask}
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
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
        <ShareTaskDialog
          task={task}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onEmailShare={handleEmailShare}
          onLinkShare={handleLinkShare}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
      >
        {t.sharing.share}
      </button>
      <ShareTaskDialog
        task={task}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onEmailShare={handleEmailShare}
        onLinkShare={handleLinkShare}
      />
    </>
  );
}

