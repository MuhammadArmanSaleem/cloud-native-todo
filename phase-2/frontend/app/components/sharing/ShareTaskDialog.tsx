"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { emailShareSchema, EmailShareFormValues } from "../../lib/validators/shareSchema";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";
import { ShareMethod, ShareLink } from "../../types/sharing";
import { Task } from "../../types/task";

interface ShareTaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEmailShare?: (email: string) => Promise<void>;
  onLinkShare?: () => Promise<ShareLink>;
}

export default function ShareTaskDialog({
  task,
  isOpen,
  onClose,
  onEmailShare,
  onLinkShare,
}: ShareTaskDialogProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];
  const [shareMethod, setShareMethod] = useState<ShareMethod>("link");
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isSharingEmail, setIsSharingEmail] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setShareMethod("link");
      setShareLink(null);
      setIsGeneratingLink(false);
      setIsSharingEmail(false);
      setLinkCopied(false);
    }
  }, [isOpen]);

  // Generate share link when link method is selected
  useEffect(() => {
    if (isOpen && shareMethod === "link" && !shareLink && onLinkShare) {
      handleGenerateLink();
    }
  }, [isOpen, shareMethod]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleGenerateLink = async () => {
    if (!onLinkShare) return;
    setIsGeneratingLink(true);
    try {
      const link = await onLinkShare();
      setShareLink(link);
    } catch (error) {
      console.error("Failed to generate share link:", error);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink.shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleEmailSubmit = async (values: EmailShareFormValues) => {
    if (!onEmailShare) return;
    setIsSharingEmail(true);
    try {
      await onEmailShare(values.email);
    } catch (error) {
      console.error("Failed to share via email:", error);
    } finally {
      setIsSharingEmail(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
    >
      <div
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 id="share-dialog-title" className="text-xl font-heading font-semibold text-foreground">
            {t.sharing.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card"
            aria-label={t.sharing.close}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Info */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t.sharing.sharingTask}</p>
            <p className="text-base font-medium text-foreground">{task.title}</p>
          </div>

          {/* Share Method Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {t.sharing.selectMethod}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShareMethod("link")}
                className={`flex-1 px-4 py-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card ${
                  shareMethod === "link"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              >
                {t.sharing.link}
              </button>
              <button
                type="button"
                onClick={() => setShareMethod("email")}
                className={`flex-1 px-4 py-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card ${
                  shareMethod === "email"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              >
                {t.sharing.email}
              </button>
            </div>
          </div>

          {/* Link Sharing */}
          {shareMethod === "link" && (
            <div className="space-y-4">
              {isGeneratingLink ? (
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">{t.sharing.generatingLink}</p>
                </div>
              ) : shareLink ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    {t.sharing.shareLink}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareLink.shareUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`px-4 py-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card ${
                        linkCopied
                          ? "bg-success text-success-foreground border-success"
                          : "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                      }`}
                    >
                      {linkCopied ? t.sharing.copied : t.sharing.copy}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateLink}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card transition-colors"
                >
                  {t.sharing.generateLink}
                </button>
              )}
            </div>
          )}

          {/* Email Sharing */}
          {shareMethod === "email" && (
            <Formik
              initialValues={{ email: "" }}
              validationSchema={emailShareSchema}
              onSubmit={handleEmailSubmit}
            >
              <Form className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {t.sharing.recipientEmail}
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t.sharing.emailPlaceholder}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1.5 text-sm text-destructive"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSharingEmail}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSharingEmail ? t.sharing.sending : t.sharing.sendEmail}
                </button>
              </Form>
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}

