import { useNavigate, useParams } from 'react-router-dom';
import { fetchTaskById } from '@/entities/task/api/taskApi';
import type { Task } from '@/entities/task/model/types';
import { useEffect, useState } from 'react';

export const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadTask = async () => {
      setLoading(true);
      const foundTask = await fetchTaskById(id);
      setTask(foundTask);
      setLoading(false);
    };

    loadTask();
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!task) return <div>Задача не найдена</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Задача #{task.id}</h1>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
        Назад
      </button>
    </div>
  );
};
