// TaskList component using maps for data rendering - following nextjs-frontend skill patterns
import { Task } from '@/app/types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  emptyMessage?: string;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  emptyMessage = 'No tasks found'
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

