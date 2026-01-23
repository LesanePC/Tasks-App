import { createBrowserRouter, RouterProvider as RRRouterProvider } from "react-router-dom";
import { TasksPage } from "@/pages/tasks/TasksPage";
import { TaskDetailPage } from "@/pages/tasks/TaskDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TasksPage />,
  },
  {
    path: "/tasks/:id",
    element: <TaskDetailPage />,
  },
]);

export const AppRouter = () => {
  return <RRRouterProvider router={router} />;
};
