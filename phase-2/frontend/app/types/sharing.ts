export interface ShareLink {
  taskId: number;
  shareToken: string;
  shareUrl: string;
  generatedAt: string;
}

export interface EmailShare {
  taskId: number;
  recipientEmail: string;
  sharedAt: string;
}

export type ShareMethod = 'email' | 'link';

