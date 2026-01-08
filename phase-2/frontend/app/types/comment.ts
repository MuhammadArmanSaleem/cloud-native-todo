export interface Comment {
  id: string;
  task_id: number;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
}

export interface CommentFormValues {
  text: string;
}

