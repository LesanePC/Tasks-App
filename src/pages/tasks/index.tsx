import React from "react";
import { useTasks } from '../../entities/task/api/useTasks';
import type { Task } from '../../entities/task/model/types';
import type { TaskPage } from '../../entities/task/api/useTasks';
import type { InfiniteData } from '@tanstack/react-query';

export const TasksPage: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTasks();

  if (isLoading) return <div>Loading tasks...</div>;

  const infiniteData = data as InfiniteData<TaskPage> | undefined;
  const allTasks: Task[] = infiniteData?.pages.flatMap(page => page.items) || [];

  return (
    <div>
      <h1>Tasks</h1>

      {allTasks.map((task: Task) => (
        <div key={task.id} style={{ border: "1px solid #ccc", margin: 5, padding: 5 }}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};
