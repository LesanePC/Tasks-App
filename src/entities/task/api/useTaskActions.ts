import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask, deleteTask, type Task } from './mock';
import type { InfiniteData } from '@tanstack/react-query';
import type { TaskPage } from './useTasks';

export const useTaskActions = () => {
  const queryClient = useQueryClient();

  const create = useMutation<Task, Error, { title: string; description: string }>({
    mutationFn: ({ title, description }) => createTask(title, description),
    onSuccess: (newTask) => {
      queryClient.setQueryData<InfiniteData<TaskPage> | undefined>(['tasks'], old => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page, i) =>
            i === 0 ? { ...page, items: [newTask, ...page.items] } : page
          ),
        };
      });
    },
  });

  const update = useMutation<Task, Error, { id: number; data: Partial<Task> }>({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<InfiniteData<TaskPage> | undefined>(['tasks'], old => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            items: page.items.map(task =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          })),
        };
      });
    },
  });

  const remove = useMutation<boolean, Error, number>({
    mutationFn: (id) => deleteTask(id),
    onSuccess: (_result, id) => {
      queryClient.setQueryData<InfiniteData<TaskPage> | undefined>(['tasks'], old => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map(page => ({
            ...page,
            items: page.items.filter(task => task.id !== id),
          })),
        };
      });
    },
  });

  return { create, update, remove };
};
