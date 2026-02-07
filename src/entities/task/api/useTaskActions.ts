import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../model/types";
import { createTask, updateTask, deleteTask } from "./taskApi";

export const useTaskActions = () => {
  const queryClient = useQueryClient();

  // CREATE
  const create = useMutation<Task, Error, Omit<Task, "id">>(
    {
      mutationFn: (task) => createTask(task),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    }
  );

  // UPDATE
  const update = useMutation<Task, Error, { taskId: string; data: Partial<Task> }>(
    {
      mutationFn: ({ taskId, data }) => updateTask(taskId, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    }
  );

  // DELETE
  const remove = useMutation<void, Error, string>(
    {
      mutationFn: (id) => deleteTask(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    }
  );

  return { create, update, remove };
};
