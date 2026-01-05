// Main Todo page - following nextjs-frontend skill patterns with props, maps, and TypeScript
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { todoApi } from '@/lib/api';
import { Task, TaskCreate, TaskFilters as TaskFiltersType } from './types/task';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import TaskFilters from './components/tasks/TaskFilters';
import Button from './components/ui/Button';

export default function TodoPage() {
  const { signIn, signOut, session } = useAuth();
  
  const handleSignIn = async () => {
    // TODO: Implement proper sign in with Better Auth
    // For now, show placeholder
    const email = prompt('Email:');
    const password = prompt('Password:');
    if (email && password) {
      try {
        await signIn({ email, password });
      } catch (error) {
        alert('Sign in failed. Please check your credentials.');
      }
    }
  };
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFiltersType>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tasks from API
  const fetchTasks = async () => {
    if (!session?.token) return;

    try {
      todoApi.setToken(session.token);
      const tasksData = await todoApi.getTasks(filters);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks when session or filters change
  useEffect(() => {
    if (session) {
      setLoading(true);
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [session, filters]);

  // Handle creating/updating task
  const handleTaskSubmit = async (data: TaskCreate) => {
    if (!session?.token) return;

    setIsSubmitting(true);
    try {
      todoApi.setToken(session.token);

      if (editingTask) {
        await todoApi.updateTask(editingTask.id, data);
      } else {
        await todoApi.createTask(data);
      }

      setShowTaskForm(false);
      setEditingTask(null);
      await fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle toggling task completion
  const handleToggleComplete = async (id: number) => {
    if (!session?.token) return;

    try {
      todoApi.setToken(session.token);
      await todoApi.toggleTaskCompletion(id);
      await fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Handle editing task
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // Handle deleting task
  const handleDelete = async (id: number) => {
    if (!session?.token) return;

    try {
      todoApi.setToken(session.token);
      await todoApi.deleteTask(id);
      await fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  // Get unique tags from all tasks for filter suggestions
  const availableTags = Array.from(
    new Set(tasks.flatMap(task => task.tags || []))
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-600">{session.user?.email}</span>
                  <Button variant="secondary" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={handleSignIn}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {!session ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Please sign in to manage your tasks
            </h2>
            <Button onClick={handleSignIn}>
              Sign In
            </Button>
          </div>
        ) : (
          <>
            {/* Task Form */}
            {showTaskForm && (
              <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <TaskForm
                  task={editingTask}
                  onSubmit={handleTaskSubmit}
                  onCancel={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}

            {/* Action Bar */}
            {!showTaskForm && (
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Your Tasks</h2>
                <Button onClick={() => setShowTaskForm(true)}>
                  + New Task
                </Button>
              </div>
            )}

            {/* Filters */}
            {!showTaskForm && (
              <TaskFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableTags={availableTags}
              />
            )}

            {/* Task List */}
            {!showTaskForm && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <TaskList
                  tasks={tasks}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  emptyMessage={
                    Object.keys(filters).length > 0
                      ? 'No tasks match your filters. Try adjusting your search criteria.'
                      : 'No tasks yet. Create your first task above!'
                  }
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
