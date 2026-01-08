import { TaskFilter } from "./TaskList";

interface TaskListEmptyProps {
  filter: TaskFilter;
}

export default function TaskListEmpty({ filter }: TaskListEmptyProps) {
  const getMessage = (): string => {
    switch (filter) {
      case "completed":
        return "No completed tasks yet. Complete a task to see it here.";
      case "pending":
        return "No pending tasks. Great job! All tasks are complete.";
      default:
        return "No tasks yet. Click 'Add Task' to create your first task.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <svg
        className="w-16 h-16 text-muted mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p className="text-lg text-muted-foreground">{getMessage()}</p>
    </div>
  );
}


