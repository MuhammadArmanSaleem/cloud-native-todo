// PriorityIndicator component - following nextjs-frontend skill patterns
interface PriorityIndicatorProps {
  priority: 'high' | 'medium' | 'low' | null;
  size?: 'sm' | 'md';
}

export default function PriorityIndicator({ priority, size = 'md' }: PriorityIndicatorProps) {
  if (!priority) return null;

  const priorityConfig = {
    high: { color: 'bg-red-500', label: 'High' },
    medium: { color: 'bg-yellow-500', label: 'Medium' },
    low: { color: 'bg-green-500', label: 'Low' }
  };

  const config = priorityConfig[priority];
  const sizeClass = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <div className="flex items-center gap-1.5">
      <span className={`${sizeClass} ${config.color} rounded-full`} aria-label={config.label} />
      <span className="text-xs text-gray-600">{config.label}</span>
    </div>
  );
}

