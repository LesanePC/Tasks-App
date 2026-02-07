import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import type { Task } from '@/entities/task/model/types';
import { useTasks, type TasksPageResponse } from '@/entities/task/api/useTasks';
import { useTaskActions } from '@/entities/task/api/useTaskActions';

import styles from './TasksPage.module.scss';

interface TaskWithDisplayId extends Task {
  displayId: number;
}

export const TasksPage = () => {
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks();
  const { create, update, remove } = useTaskActions();
  const navigate = useNavigate();

  const parentRef = useRef<HTMLDivElement>(null);

  // Локальные временные задачи, чтобы новые появлялись сверху
  const [localTasks, setLocalTasks] = useState<TaskWithDisplayId[]>([]);

  // Собираем все серверные задачи и добавляем displayId
  const infiniteData = data as InfiniteData<TasksPageResponse> | undefined;
  const serverTasks: TaskWithDisplayId[] = infiniteData?.pages.flatMap(p =>
    p.items.map(t => ({ ...t, displayId: (t as any).displayId ?? t.id }))
  ) || [];

  // Все задачи для рендеринга: сначала локальные, потом серверные
  const allTasks: TaskWithDisplayId[] = [...localTasks, ...serverTasks].sort((a, b) => b.displayId - a.displayId);

  // Виртуализатор
  const rowVirtualizer = useVirtualizer({
    count: allTasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  // Автоподгрузка при скролле вниз
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const virtualItems = rowVirtualizer.getVirtualItems();
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    const el = document.getElementById(`task-${lastItem.index}`);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { root: parentRef.current, rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rowVirtualizer.getVirtualItems(), hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Создание новой задачи
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreate = () => {
    if (!newTitle) return;

    // Вычисляем следующий displayId
    const nextDisplayId =
      allTasks.length > 0 ? Math.max(...allTasks.map(t => t.displayId)) + 1 : 1;

    // Временный id для UI
    const tempId = Date.now();

    const tempTask: TaskWithDisplayId = {
      id: tempId,
      displayId: nextDisplayId,
      title: newTitle,
      description: newDescription,
    };

    // Добавляем временно в локальный state, чтобы сразу сверху
    setLocalTasks(prev => [tempTask, ...prev]);

    // Отправляем на сервер
    create.mutate(
  { title: newTitle, description: newDescription },
  {
    onSuccess: serverTask => {
      setLocalTasks(prev =>
        prev.map(t =>
          t.id === tempId ? { ...serverTask, displayId: nextDisplayId } : t
        )
      );

          // Обновляем queryClient
          queryClient.setQueryData<InfiniteData<TasksPageResponse>>(['tasks'], oldData => {
            if (!oldData) return oldData;

            const newPages = oldData.pages.map(page => ({
              ...page,
              items: page.items.map(t =>
                t.id === tempId ? { ...serverTask, displayId: nextDisplayId } : t
              ),
            }));

            return { ...oldData, pages: newPages };
          });
        },
      }
    );

    setNewTitle('');
    setNewDescription('');
  };

  const handleEdit = (task: TaskWithDisplayId) => {
    update.mutate({ taskId: String(task.id), data: { title: task.title + ' (обновлено)' } });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить задачу?')) return;

    remove.mutate(String(id), {
      onSuccess: () => {
        // Удаляем из локального state
        setLocalTasks(prev => prev.filter(t => t.id !== id));

        queryClient.setQueryData<InfiniteData<TasksPageResponse>>(['tasks'], oldData => {
          if (!oldData) return oldData;

          const newPages = oldData.pages.map(page => ({
            ...page,
            items: page.items.filter(task => task.id !== id),
          }));

          return { ...oldData, pages: newPages };
        });
      },
    });
  };

  return (
    <div className={styles.page}>
      <h1>Список задач</h1>

      <div className={styles.form}>
        <input
          placeholder="Название задачи"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
        />
        <input
          placeholder="Описание"
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
        />
        <button onClick={handleCreate} disabled={create.status === 'pending'}>
          {create.status === 'pending' ? 'Создание...' : 'Создать'}
        </button>
      </div>

      <div ref={parentRef} className={styles.listWrapper}>
        <div
          className={styles.virtualContainer}
          style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const task = allTasks[virtualRow.index];
            if (!task) return null;

            return (
              <div
                key={task.id}
                id={`task-${virtualRow.index}`}
                className={styles.row}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <span>
                  {task.displayId}. {task.title} — {task.description.slice(0, 50)}...
                </span>

                <div className={styles.buttons}>
                  <button onClick={() => navigate(`/tasks/${task.id}`)}>Просмотр</button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={remove.status === 'pending'}
                  >
                    {remove.status === 'pending' ? 'Удаление...' : 'Удалить'}
                  </button>
                  <button
                    onClick={() => handleEdit(task)}
                    disabled={update.status === 'pending'}
                  >
                    {update.status === 'pending' ? 'Сохранение...' : 'Редактировать'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
