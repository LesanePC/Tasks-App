import { jsx as _jsx } from "react/jsx-runtime";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { TasksPage } from "@/pages/tasks/TasksPage";
import { TaskDetailPage } from "@/pages/tasks/TaskDetailPage";
const router = createHashRouter([
    {
        path: "/",
        element: _jsx(TasksPage, {}),
    },
    {
        path: "/tasks/:id",
        element: _jsx(TaskDetailPage, {}),
    },
]);
export const AppRouter = () => {
    return _jsx(RouterProvider, { router: router });
};
