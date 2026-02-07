import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchTasks } from "./taskApi";
export const useTasks = () => useInfiniteQuery({
    queryKey: ["tasks"],
    queryFn: ({ pageParam = 1 }) => fetchTasks({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    initialPageParam: 1,
});
