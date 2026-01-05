// TaskItem component with props interface - following nextjs-frontend skill patterns
import { Task } from '@/app/types/task';
import PriorityIndicator from '../ui/PriorityIndicator';
import Button from '../ui/Button';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
  const isDueSoon = task.due_date && !isOverdue && 
    new Date(task.due_date).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <li className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-base font-medium ${
                task.completed 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              {task.priority && <PriorityIndicator priority={task.priority} size="sm" />}
              {task.recurring_pattern && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {task.recurring_pattern}
                </span>
              )}
            </div>
            {task.description && (
              <p className={`text-sm text-gray-600 mb-2 ${
                task.completed ? 'line-through' : ''
              }`}>
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              {task.tags && task.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {task.due_date && (
                <span className={`text-xs ${
                  isOverdue ? 'text-red-600 font-medium' :
                  isDueSoon ? 'text-yellow-600 font-medium' :
                  'text-gray-500'
                }`}>
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            disabled={task.completed}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm(`Delete task "${task.title}"?`)) {
                onDelete(task.id);
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
}

