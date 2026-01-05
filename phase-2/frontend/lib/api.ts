// API service for interacting with the backend - following nextjs-frontend skill patterns
import { Task, TaskCreate, TaskUpdate, TaskFilters } from '../app/types/task';

class TodoApiService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
  }

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.tags) params.append('tags', filters.tags);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.order) params.append('order', filters.order);

    const url = `${this.baseUrl}/api/tasks${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tasks || [];
  }

  async createTask(taskData: TaskCreate): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText}`);
    }

    return await response.json();
  }

  async updateTask(id: number, taskData: TaskUpdate): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.statusText}`);
    }

    return await response.json();
  }

  async deleteTask(id: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete task: ${response.statusText}`);
    }

    return await response.json();
  }

  async toggleTaskCompletion(id: number): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/api/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle task completion: ${response.statusText}`);
    }

    return await response.json();
  }
}

export const todoApi = new TodoApiService();