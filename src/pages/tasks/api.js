let tasks = Array.from({ length: 50 }, (_, i) => ({
    id: (i + 1).toString(),
    title: `Task ${i + 1}`,
    description: `Description for task ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
}));
export const fetchTasks = async ({ page = 0, limit = 10, }) => {
    await new Promise((res) => setTimeout(res, 300));
    return tasks.slice(page * limit, (page + 1) * limit);
};
export const fetchTaskById = async (id) => {
    await new Promise((res) => setTimeout(res, 100));
    return tasks.find((t) => t.id === id);
};
export const createTask = async (task) => {
    const newTask = { ...task, id: (tasks.length + 1).toString() };
    tasks.push(newTask);
    return newTask;
};
export const updateTask = async (id, task) => {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1)
        return undefined;
    tasks[idx] = { ...tasks[idx], ...task };
    return tasks[idx];
};
export const deleteTask = async (id) => {
    tasks = tasks.filter((t) => t.id !== id);
};
