import { useInfiniteQuery } from '@tanstack/react-query';
import type { Task } from './mock';
import { fetchTasks } from './mock';

export const LIMIT = 20;

export interface TaskPage {
  items: Task[];
  nextPage?: number;
}

export const useTasks = () => {
  return useInfiniteQuery<TaskPage, Error, TaskPage, readonly string[]>({
    queryKey: ['tasks'],
    queryFn: ({ pageParam }) => {
      const pageNumber = typeof pageParam === 'number' ? pageParam : 0;
      return fetchTasks(pageNumber, LIMIT);
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
