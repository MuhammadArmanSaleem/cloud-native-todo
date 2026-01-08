"use client";

import { Comment } from "../../types/comment";
import CommentCard from "./CommentCard";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";

interface CommentListProps {
  comments: Comment[];
  isLoading?: boolean;
}

export default function CommentList({ comments, isLoading = false }: CommentListProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];

  if (isLoading) {
    return (
      <div className="p-4 bg-card border border-border rounded-lg">
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="p-4 bg-card border border-border rounded-lg text-center">
        <p className="text-sm text-muted-foreground">{t.comments.emptyState}</p>
      </div>
    );
  }

  // Sort comments by timestamp (oldest first)
  const sortedComments = [...comments].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-heading font-semibold text-foreground">
        Comments ({comments.length})
      </h3>
      <div className="space-y-3">
        {sortedComments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}


