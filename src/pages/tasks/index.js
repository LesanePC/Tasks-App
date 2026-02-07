import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useTasks } from '@/entities/task/api/useTasks';
export const TasksPage = () => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTasks();
    if (isLoading)
        return _jsx("div", { children: "Loading tasks..." });
    const infiniteData = data;
    const allTasks = infiniteData?.pages.flatMap(page => page.items) || [];
    return (_jsxs("div", { children: [_jsx("h1", { children: "Tasks" }), allTasks.map((task) => (_jsxs("div", { style: { border: "1px solid #ccc", margin: 5, padding: 5 }, children: [_jsx("h3", { children: task.title }), _jsx("p", { children: task.description })] }, task.id))), hasNextPage && (_jsx("button", { onClick: () => fetchNextPage(), disabled: isFetchingNextPage, children: isFetchingNextPage ? "Loading..." : "Load More" }))] }));
};
