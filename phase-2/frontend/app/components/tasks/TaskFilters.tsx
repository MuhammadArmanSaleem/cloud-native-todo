// TaskFilters component - following nextjs-frontend skill patterns
import { TaskFilters as TaskFiltersType } from '@/app/types/task';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  availableTags: string[];
}

export default function TaskFilters({ filters, onFiltersChange, availableTags }: TaskFiltersProps) {
  const handleFilterChange = (key: keyof TaskFiltersType, value: string | undefined) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Filters & Search</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Search"
          name="search"
          type="text"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Search tasks..."
        />

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
            Status
          </label>
          <select
            id="status"
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? undefined : e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1.5">
            Priority
          </label>
          <select
            id="priority"
            value={filters.priority || ''}
            onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1.5">
            Sort By
          </label>
          <select
            id="sort"
            value={filters.sort || 'created_at'}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_at">Created Date</option>
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <label className="text-sm text-gray-700">Order:</label>
        <Button
          variant={filters.order === 'asc' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => handleFilterChange('order', filters.order === 'asc' ? 'desc' : 'asc')}
        >
          {filters.order === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </Button>
      </div>
    </div>
  );
}

