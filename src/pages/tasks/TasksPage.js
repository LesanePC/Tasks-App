import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useQueryClient } from '@tanstack/react-query';
import { useTasks } from '@/entities/task/api/useTasks';
import { useTaskActions } from '@/entities/task/api/useTaskActions';
import styles from './TasksPage.module.scss';
export const TasksPage = () => {
    const queryClient = useQueryClient();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks();
    const { create, update, remove } = useTaskActions();
    const navigate = useNavigate();
    const parentRef = useRef(null);
    // Локальные временные задачи, чтобы новые появлялись сверху
    const [localTasks, setLocalTasks] = useState([]);
    // Собираем все серверные задачи и добавляем displayId
    const infiniteData = data;
    const serverTasks = infiniteData?.pages.flatMap(p => p.items.map(t => ({ ...t, displayId: t.displayId ?? t.id }))) || [];
    // Все задачи для рендеринга: сначала локальные, потом серверные
    const allTasks = [...localTasks, ...serverTasks].sort((a, b) => b.displayId - a.displayId);
    // Виртуализатор
    const rowVirtualizer = useVirtualizer({
        count: allTasks.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 60,
        overscan: 5,
    });
    // Автоподгрузка при скролле вниз
    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage)
            return;
        const virtualItems = rowVirtualizer.getVirtualItems();
        const lastItem = virtualItems[virtualItems.length - 1];
        if (!lastItem)
            return;
        const el = document.getElementById(`task-${lastItem.index}`);
        if (!el)
            return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting)
                fetchNextPage();
        }, { root: parentRef.current, rootMargin: '200px' });
        observer.observe(el);
        return () => observer.disconnect();
    }, [rowVirtualizer.getVirtualItems(), hasNextPage, isFetchingNextPage, fetchNextPage]);
    // Создание новой задачи
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const handleCreate = () => {
        if (!newTitle)
            return;
        // Вычисляем следующий displayId
        const nextDisplayId = allTasks.length > 0 ? Math.max(...allTasks.map(t => t.displayId)) + 1 : 1;
        // Временный id для UI
        const tempId = Date.now();
        const tempTask = {
            id: tempId,
            displayId: nextDisplayId,
            title: newTitle,
            description: newDescription,
        };
        // Добавляем временно в локальный state, чтобы сразу сверху
        setLocalTasks(prev => [tempTask, ...prev]);
        // Отправляем на сервер
        create.mutate({ title: newTitle, description: newDescription }, {
            onSuccess: serverTask => {
                setLocalTasks(prev => prev.map(t => t.id === tempId ? { ...serverTask, displayId: nextDisplayId } : t));
                // Обновляем queryClient
                queryClient.setQueryData(['tasks'], oldData => {
                    if (!oldData)
                        return oldData;
                    const newPages = oldData.pages.map(page => ({
                        ...page,
                        items: page.items.map(t => t.id === tempId ? { ...serverTask, displayId: nextDisplayId } : t),
                    }));
                    return { ...oldData, pages: newPages };
                });
            },
        });
        setNewTitle('');
        setNewDescription('');
    };
    const handleEdit = (task) => {
        update.mutate({ taskId: String(task.id), data: { title: task.title + ' (обновлено)' } });
    };
    const handleDelete = (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить задачу?'))
            return;
        remove.mutate(String(id), {
            onSuccess: () => {
                // Удаляем из локального state
                setLocalTasks(prev => prev.filter(t => t.id !== id));
                queryClient.setQueryData(['tasks'], oldData => {
                    if (!oldData)
                        return oldData;
                    const newPages = oldData.pages.map(page => ({
                        ...page,
                        items: page.items.filter(task => task.id !== id),
                    }));
                    return { ...oldData, pages: newPages };
                });
            },
        });
    };
    return (_jsxs("div", { className: styles.page, children: [_jsx("h1", { children: "\u0421\u043F\u0438\u0441\u043E\u043A \u0437\u0430\u0434\u0430\u0447" }), _jsxs("div", { className: styles.form, children: [_jsx("input", { placeholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438", value: newTitle, onChange: e => setNewTitle(e.target.value) }), _jsx("input", { placeholder: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435", value: newDescription, onChange: e => setNewDescription(e.target.value) }), _jsx("button", { onClick: handleCreate, disabled: create.status === 'pending', children: create.status === 'pending' ? 'Создание...' : 'Создать' })] }), _jsx("div", { ref: parentRef, className: styles.listWrapper, children: _jsx("div", { className: styles.virtualContainer, style: { height: rowVirtualizer.getTotalSize(), position: 'relative' }, children: rowVirtualizer.getVirtualItems().map(virtualRow => {
                        const task = allTasks[virtualRow.index];
                        if (!task)
                            return null;
                        return (_jsxs("div", { id: `task-${virtualRow.index}`, className: styles.row, style: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${virtualRow.start}px)`,
                            }, children: [_jsxs("span", { children: [task.displayId, ". ", task.title, " \u2014 ", task.description.slice(0, 50), "..."] }), _jsxs("div", { className: styles.buttons, children: [_jsx("button", { onClick: () => navigate(`/tasks/${task.id}`), children: "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440" }), _jsx("button", { onClick: () => handleDelete(task.id), disabled: remove.status === 'pending', children: remove.status === 'pending' ? 'Удаление...' : 'Удалить' }), _jsx("button", { onClick: () => handleEdit(task), disabled: update.status === 'pending', children: update.status === 'pending' ? 'Сохранение...' : 'Редактировать' })] })] }, task.id));
                    }) }) })] }));
};
