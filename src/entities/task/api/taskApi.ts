import type { Task } from "../model/types";

export type TasksPageResponse = {
  items: Task[];
  next: number | null;
};

export const fetchTasks = async ({ page }: { page: number }): Promise<TasksPageResponse> => {
  const res = await fetch(`http://localhost:3001/tasks?_page=${page}&_per_page=10`);
  if (!res.ok) throw new Error("Failed to fetch tasks");

  const json = await res.json();

  return {
    items: json.data,
    next: json.next,
  };
};

// Одна задача по id
export const fetchTaskById = async (id: string): Promise<Task> => {
  const res = await fetch(`http://localhost:3001/tasks/${id}`);
  if (!res.ok) throw new Error("Failed to fetch task");
  return res.json();
};

// Создание задачи
export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const res = await fetch(`http://localhost:3001/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

// Обновление задачи
export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const res = await fetch(`http://localhost:3001/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};

// Удаление задачи
export const deleteTask = async (id: string): Promise<void> => {
  const res = await fetch(`http://localhost:3001/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
};
