import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchTasks } from '../api/taskApi';
import type { Task } from '../model/types';

export const LIMIT = 20;

export interface TaskPage {
  items: Task[];
  nextPage?: number;
}

export const useTasks = () => {
  return useInfiniteQuery<TaskPage, Error>({
    queryKey: ['tasks'],
    queryFn: ({ pageParam = 1 }) => fetchTasks(pageParam as number),
    getNextPageParam: lastPage => lastPage.nextPage,
    initialPageParam: 1,
  });
};
