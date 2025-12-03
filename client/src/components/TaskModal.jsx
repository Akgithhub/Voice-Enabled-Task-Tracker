import React, { useEffect, useState } from 'react'
import { useTasks } from '../context/TaskContext'


export default function TaskModal({ open, setOpen, task }) {
    const { createTask, updateTask, deleteTask } = useTasks()
    const [form, setForm] = useState({ title: '', description: '', status: 'To Do', priority: 'Medium', dueDate: '' })


    useEffect(() => {
        if (task) setForm(task)
        else setForm({ title: '', description: '', status: 'To Do', priority: 'Medium', dueDate: '' })
    }, [task])


    if (!open) return null


    const onSave = async () => {
        if (task) {
            await updateTask(task.id, form)
        } else {
            await createTask(form)
        }
        setOpen(false)
    }


    const onDelete = async () => {
        if (task) await deleteTask(task.id)
        setOpen(false)
    }


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-4 rounded w-full max-w-lg">
                <h3 className="font-semibold mb-2">{task ? 'Edit Task' : 'Create Task'}</h3>
                <div className="space-y-2">
                    <input className="w-full p-2 border" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    <textarea className="w-full p-2 border" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    <div className="flex gap-2">
                        <select className="p-2 border" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            <option>To Do</option>
                            <option>In Progress</option>
                            <option>Review</option>
                            <option>Done</option>
                        </select>
                        <select className="p-2 border" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                        <input type="date" className="p-2 border" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                    </div>
                    <div className="flex gap-2 justify-end mt-2">
                        {task && <button onClick={onDelete} className="px-3 py-1 border rounded">Delete</button>}
                        <button onClick={() => setOpen(false)} className="px-3 py-1 border rounded">Cancel</button>
                        <button onClick={onSave} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}