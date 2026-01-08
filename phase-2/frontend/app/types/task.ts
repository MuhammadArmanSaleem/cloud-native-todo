// TypeScript interfaces for Task data
import { Comment } from './comment';
import { Attachment } from './attachment';

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'high' | 'medium' | 'low' | null;
  tags: string[];
  due_date: string | null;
  reminder_time: string | null;
  recurring_pattern: 'daily' | 'weekly' | 'monthly' | null;
  next_occurrence: string | null;
  original_task_id: number | null;
  created_at: string;
  updated_at: string;
  history?: TaskHistoryEntry[];
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface TaskHistoryEntry {
  id: string;
  change_type: 'created' | 'completed' | 'edited' | 'priority_updated' | 'due_date_set' | 'due_date_updated' | 'status_changed';
  timestamp: string;
  user_id: string;
  user_name?: string;
  details?: string; // Optional additional details (e.g., "Priority changed from low to high")
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  due_date?: string;
  reminder_time?: string;
  recurring_pattern?: 'daily' | 'weekly' | 'monthly';
}

export interface TaskUpdate extends Partial<TaskCreate> {
  completed?: boolean;
}

export interface TaskFilters {
  status?: 'all' | 'pending' | 'completed';
  priority?: string;
  tags?: string;
  search?: string;
  sort?: 'created_at' | 'due_date' | 'priority' | 'title';
  order?: 'asc' | 'desc';
}
