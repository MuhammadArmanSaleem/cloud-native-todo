"use client";

import { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { attachmentSchema, AttachmentFormValues } from "../../lib/validators/attachmentSchema";
import { useLanguage } from "../../contexts/LanguageContext";
import { uiCopy } from "../../content/uiCopy";
import { formatFileSize, MAX_FILE_SIZE } from "../../types/attachment";

interface AttachmentUploadProps {
  onSubmit: (values: AttachmentFormValues) => Promise<void>;
  isLoading?: boolean;
}

export default function AttachmentUpload({
  onSubmit,
  isLoading = false,
}: AttachmentUploadProps) {
  const { language } = useLanguage();
  const t = uiCopy[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const initialValues: AttachmentFormValues = {
    files: [],
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
    }
  };

  const handleRemoveFile = (index: number, setFieldValue: (field: string, value: any) => void) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setFieldValue("files", newFiles);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
        {t.attachments.uploadTitle}
      </h3>
      <Formik
        initialValues={initialValues}
        validationSchema={attachmentSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          await onSubmit(values);
          resetForm();
          setSelectedFiles([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setSubmitting(false);
        }}
      >
        {({ setFieldValue, isSubmitting, errors }) => {
          const submitting = isLoading || isSubmitting;

          return (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="file-input"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  {t.attachments.selectFiles}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="file-input"
                  name="files"
                  multiple
                  accept="image/*,.pdf,.txt,.md"
                  onChange={(e) => {
                    handleFileChange(e);
                    const files = e.target.files;
                    if (files) {
                      setFieldValue("files", Array.from(files));
                    }
                  }}
                  className="w-full px-4 py-2 bg-background border border-border rounded-md text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.attachments.fileTypesHint} ({formatFileSize(MAX_FILE_SIZE)} {t.attachments.maxSize})
                </p>
                <ErrorMessage
                  name="files"
                  component="p"
                  className="mt-1.5 text-sm text-destructive"
                />
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {t.attachments.selectedFiles} ({selectedFiles.length})
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-background border border-border rounded-md"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index, setFieldValue)}
                          className="ml-2 p-1 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                          aria-label={t.attachments.removeFile(file.name)}
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || selectedFiles.length === 0}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? t.attachments.uploading : t.attachments.upload}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

