"use client";

import { Comment } from "../../types/comment";
import { useLanguage } from "../../contexts/LanguageContext";

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const { language } = useLanguage();

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Relative time for recent comments
    if (diffInSeconds < 60) {
      return language === "ur" ? "ابھی" : "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return language === "ur"
        ? `${minutes} منٹ پہلے`
        : `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return language === "ur"
        ? `${hours} گھنٹے پہلے`
        : `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return language === "ur"
        ? `${days} دن پہلے`
        : `${days} day${days !== 1 ? "s" : ""} ago`;
    } else {
      // Absolute date for older comments
      return date.toLocaleString(language === "ur" ? "ur-PK" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="p-4 bg-background border border-border rounded-md">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {comment.user_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {comment.user_name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatTimestamp(comment.created_at)}
            </p>
          </div>
        </div>
      </div>
      <p className="text-sm text-foreground whitespace-pre-wrap break-words">
        {comment.text}
      </p>
    </div>
  );
}

