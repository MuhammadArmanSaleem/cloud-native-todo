"use client";

import { Attachment } from "../../types/attachment";
import AttachmentCard from "./AttachmentCard";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";

interface AttachmentListProps {
  attachments: Attachment[];
  isLoading?: boolean;
  onDownload?: (attachment: Attachment) => void;
}

export default function AttachmentList({
  attachments,
  isLoading = false,
  onDownload,
}: AttachmentListProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];

  if (isLoading) {
    return (
      <div className="p-4 bg-card border border-border rounded-lg">
        <p className="text-sm text-muted-foreground">{t.attachments.loading}</p>
      </div>
    );
  }

  if (!attachments || attachments.length === 0) {
    return (
      <div className="p-4 bg-card border border-border rounded-lg text-center">
        <p className="text-sm text-muted-foreground">{t.attachments.emptyState}</p>
      </div>
    );
  }

  // Sort attachments by timestamp (oldest first)
  const sortedAttachments = [...attachments].sort(
    (a, b) =>
      new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-heading font-semibold text-foreground">
        {t.attachments.title} ({attachments.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAttachments.map((attachment) => (
          <AttachmentCard
            key={attachment.id}
            attachment={attachment}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
}


