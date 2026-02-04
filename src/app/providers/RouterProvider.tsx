import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TasksPage } from "@/pages/tasks/TasksPage";
import { TaskDetailPage } from "@/pages/tasks/TaskDetailPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <TasksPage />,
    },
    {
      path: "/tasks/:id",
      element: <TaskDetailPage />,
    },
  ],
  {
    basename: "/Tasks-App/",
  }
);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
