import React, { useMemo, useState } from 'react'
import { useTasks } from '../context/TaskContext'


export default function ListView({ onEdit }) {
    const { tasks } = useTasks()
    const [q, setQ] = useState('')
    const [filter, setFilter] = useState('')


    const filtered = useMemo(() => tasks.filter(t => (
        (!q || t.title.toLowerCase().includes(q.toLowerCase())) &&
        (!filter || t.status === filter)
    )), [tasks, q, filter])


    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="flex gap-2 mb-4">
                <input placeholder="Search title" value={q} onChange={(e) => setQ(e.target.value)} className="p-2 border" />
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border">
                    <option value="">All Status</option>
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>Done</option>
                </select>
            </div>


            <table className="w-full text-left">
                <thead>
                    <tr className="text-sm text-gray-600">
                        <th className="p-2">Title</th>
                        <th className="p-2">Priority</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Due Date</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(t => (
                        <tr key={t.id} className="border-t">
                            <td className="p-2">{t.title}</td>
                            <td className="p-2">{t.priority}</td>
                            <td className="p-2">{t.status}</td>
                            <td className="p-2">{t.dueDate || '-'}</td>
                            <td className="p-2"><button onClick={() => onEdit(t)} className="px-2 py-1 border rounded">Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}