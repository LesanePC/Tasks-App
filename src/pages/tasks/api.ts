export interface Task {
  id: string;
  title: string;
  description?: string;
}

let tasks: Task[] = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  title: `Task ${i + 1}`,
  description: `Description for task ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
}));

export const fetchTasks = async ({
  page = 0,
  limit = 10,
}): Promise<Task[]> => {
  await new Promise((res) => setTimeout(res, 300));
  return tasks.slice(page * limit, (page + 1) * limit);
};

export const fetchTaskById = async (id: string): Promise<Task | undefined> => {
  await new Promise((res) => setTimeout(res, 100));
  return tasks.find((t) => t.id === id);
};

export const createTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const newTask = { ...task, id: (tasks.length + 1).toString() };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task | undefined> => {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return undefined;
  tasks[idx] = { ...tasks[idx], ...task };
  return tasks[idx];
};

export const deleteTask = async (id: string): Promise<void> => {
  tasks = tasks.filter((t) => t.id !== id);
};
