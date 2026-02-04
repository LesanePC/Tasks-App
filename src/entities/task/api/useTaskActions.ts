import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask, deleteTask } from '@/entities/task/api/taskApi';
import type { Task } from '@/entities/task/model/types';

export const useTaskActions = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (task: Omit<Task, 'id'>) => createTask(task),
    onSuccess: (newTask) => {
      queryClient.setQueryData(['tasks'], (oldData: any) => {
        if (!oldData) return oldData;

        const updatedPages = [...oldData.pages];
        if (updatedPages.length > 0) {
          updatedPages[0] = {
            ...updatedPages[0],
            items: [newTask, ...updatedPages[0].items],
          };
        }

        return { ...oldData, pages: updatedPages };
      });
    },
  });

  const update = useMutation({
    mutationFn: (task: Partial<Task> & { id: number }) => updateTask(task),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(['tasks'], (oldData: any) => {
        if (!oldData) return oldData;

        const updatedPages = oldData.pages.map((page: any) => ({
          ...page,
          items: page.items.map((t: Task) =>
            t.id === updatedTask.id ? { ...t, ...updatedTask } : t
          ),
        }));

        return { ...oldData, pages: updatedPages };
      });
    },
  });

  const remove = useMutation({
  mutationFn: (id: number) => deleteTask(id),
  onSuccess: (_data, id) => {
    queryClient.setQueryData(['tasks'], (oldData: any) => {
      if (!oldData) return oldData;

      const updatedPages = oldData.pages.map((page: any) => ({
        ...page,
        items: page.items.filter((t: Task) => t.id !== id),
      }));

      return { ...oldData, pages: updatedPages };
    });
  },
});


  return { create, update, remove };
};
