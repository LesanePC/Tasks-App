import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask, deleteTask } from "./taskApi";
export const useTaskActions = () => {
    const queryClient = useQueryClient();
    // CREATE
    const create = useMutation({
        mutationFn: (task) => createTask(task),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });
    // UPDATE
    const update = useMutation({
        mutationFn: ({ taskId, data }) => updateTask(taskId, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });
    // DELETE
    const remove = useMutation({
        mutationFn: (id) => deleteTask(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });
    return { create, update, remove };
};
