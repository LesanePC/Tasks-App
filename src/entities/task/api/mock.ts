export type Task = {
  id: number;
  title: string;
  description: string;
};

let TOTAL = 1000;

export const tasks: Task[] = Array.from({ length: TOTAL }, (_, i) => ({
  id: i + 1,
  title: `Задача #${i + 1}`,
  description:
    'Описание задачи. Очень длинный текст, чтобы проверить обрезание строки и работу виртуализации.',
}));

export const fetchTasks = async (
  page: number,
  limit: number
): Promise<{ items: Task[]; nextPage?: number }> => {
  await new Promise(r => setTimeout(r, 400));
  const start = page * limit;
  const end = start + limit;
  const items = tasks.slice(start, end);
  return { items, nextPage: end < TOTAL ? page + 1 : undefined };
};

// --------------------- CRUD ---------------------

export const createTask = async (title: string, description: string) => {
  const newTask: Task = { id: tasks.length + 1, title, description };
  tasks.unshift(newTask);
  TOTAL = tasks.length;
  return newTask;
};

export const updateTask = async (id: number, data: Partial<Task>) => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Задача не найдена');
  tasks[index] = { ...tasks[index], ...data };
  return tasks[index];
};

export const deleteTask = async (id: number) => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) throw new Error('Задача не найдена');
  tasks.splice(index, 1);
  TOTAL = tasks.length;
  return true;
};
