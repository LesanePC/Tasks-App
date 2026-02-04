import type { Task } from '../model/types';

const API_URL = 'http://localhost:3001/tasks';
const PAGE_SIZE = 20;

export interface TasksResponse {
  items: Task[];
  nextPage?: number;
}

export const fetchTasks = async (page: number = 1): Promise<TasksResponse> => {
  const res = await fetch(`${API_URL}?_page=${page}&_limit=${PAGE_SIZE}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');

  const data: Task[] = await res.json();
  const total = Number(res.headers.get('X-Total-Count') || 0);

  return {
    items: data,
    nextPage: page * PAGE_SIZE < total ? page + 1 : undefined
  };
};





/**
 * Получение задачи по ID
 */
export const fetchTaskById = async (id: number): Promise<Task | null> => {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    return null;
  }

  const data: Task = await response.json();
  return data;
};

/**
 * Создание задачи
 */
export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};

/**
 * Обновление задачи
 */
export const updateTask = async (task: Partial<Task> & { id: number }): Promise<Task> => {
  const response = await fetch(`${API_URL}/${task.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });

  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};

/**
 * Удаление задачи
 */
export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete task');
};
