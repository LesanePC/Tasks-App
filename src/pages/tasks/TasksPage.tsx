import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { InfiniteData } from '@tanstack/react-query';

import { useTasks, type TaskPage } from '@/entities/task/api/useTasks';
import { useTaskActions } from '@/entities/task/api/useTaskActions';
import type { Task } from '@/entities/task/api/mock';

import styles from './TasksPage.module.scss';

export const TasksPage = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks();
  const { create, update, remove } = useTaskActions();
  const navigate = useNavigate();

  const parentRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const infiniteData = data as InfiniteData<TaskPage> | undefined;

  const allTasks: Task[] = infiniteData?.pages.flatMap(page => page.items) || [];

  const rowVirtualizer = useVirtualizer({
  count: allTasks.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 56,
  overscan: 5,
});


  // infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    if (!parentRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { root: parentRef.current, threshold: 1 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreate = () => {
    if (!newTitle) return;
    create.mutate({ title: newTitle, description: newDescription });
    setNewTitle('');
    setNewDescription('');
  };

  const handleEdit = (task: Task) => {
    update.mutate({ id: task.id, data: { title: task.title + ' (обновлено)' } });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить задачу?')) {
      remove.mutate(id);
    }
  };

  return (
    <div className={styles.page}>
      <h1>Список задач</h1>

      {/* Form */}
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
        <button
          onClick={handleCreate}
          disabled={create.status === 'pending'}
        >
          {create.status === 'pending' ? 'Создание...' : 'Создать'}
        </button>
      </div>

      {/* List */}
      <div ref={parentRef} className={styles.listWrapper}>
        <div
          className={styles.virtualContainer}
          key={allTasks.length}
          style={{ height: rowVirtualizer.getTotalSize() }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const task = allTasks[virtualRow.index];
            if (!task) return null;

            return (
              <div
                key={task.id}
                className={styles.row}
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <span>
                  {task.id}. {task.title} — {task.description.slice(0, 50)}...
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
          <div ref={loadMoreRef} style={{ height: 1 }} />
        </div>
      </div>
    </div>
  );
};
