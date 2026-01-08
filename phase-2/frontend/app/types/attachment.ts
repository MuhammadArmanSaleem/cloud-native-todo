export type AttachmentFileType = 'image' | 'pdf' | 'text' | 'other';

export interface Attachment {
  id: string;
  task_id: number;
  file_name: string;
  file_type: AttachmentFileType;
  file_size: number; // in bytes
  file_url?: string; // Mock file URL or blob data
  uploaded_by: string;
  uploaded_at: string;
}

export interface AttachmentFormValues {
  files: File[];
}

// File validation constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_PDF_TYPES = ['application/pdf'];
export const ALLOWED_TEXT_TYPES = ['text/plain', 'text/markdown'];

export function getFileType(file: File): AttachmentFileType {
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) return 'image';
  if (ALLOWED_PDF_TYPES.includes(file.type)) return 'pdf';
  if (ALLOWED_TEXT_TYPES.includes(file.type)) return 'text';
  return 'other';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

