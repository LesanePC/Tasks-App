import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTaskById } from '@/entities/task/api/taskApi';
import { useEffect, useState } from 'react';
export const TaskDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!id)
            return;
        const loadTask = async () => {
            setLoading(true);
            const foundTask = await fetchTaskById(id);
            setTask(foundTask);
            setLoading(false);
        };
        loadTask();
    }, [id]);
    if (loading)
        return _jsx("div", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    if (!task)
        return _jsx("div", { children: "\u0417\u0430\u0434\u0430\u0447\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430" });
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsxs("h1", { children: ["\u0417\u0430\u0434\u0430\u0447\u0430 #", task.id] }), _jsx("h2", { children: task.title }), _jsx("p", { children: task.description }), _jsx("button", { onClick: () => navigate(-1), style: { marginTop: '20px' }, children: "\u041D\u0430\u0437\u0430\u0434" })] }));
};
