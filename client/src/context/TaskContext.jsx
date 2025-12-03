import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'
import { v4 as uuidv4 } from 'uuid'

const TaskContext = createContext()
export const useTasks = () => useContext(TaskContext)

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)


    const fetchTasks = async () => {
        setLoading(true)
        try {
            const res = await api.get('/tasks')
            // If backend not available, fallback to empty
            setTasks(res?.data || [])
        } catch (err) {
            console.warn('GET /tasks failed, loading sample tasks', err.message)
            // sample data
            setTasks([
                { id: '1', title: 'Setup project', description: 'Init repo', priority: 'Medium', status: 'To Do', dueDate: '2025-12-10' },
                { id: '2', title: 'Auth module', description: '', priority: 'High', status: 'In Progress', dueDate: '2025-12-05' },
                { id: '3', title: 'Review PR', description: '', priority: 'Low', status: 'Review', dueDate: '2025-12-06' },
            ])
        } finally {
            setLoading(false)
        }
    }

    const createTask = async (payload) => {
        try {
            // optimistic id if backend fails
            const tempId = uuidv4()
            const newTask = { id: payload.id || tempId, ...payload }
            setTasks((t) => [newTask, ...t])
            await api.post('/tasks', newTask)
            return newTask
        } catch (err) {
            console.warn('POST /tasks failed', err.message)
            return null
        }
    }

    const updateTask = async (id, patch) => {
        try {
            setTasks((t) => t.map((tk) => (tk.id === id ? { ...tk, ...patch } : tk)))
            await api.put(`/tasks/${id}`, patch)
        } catch (err) {
            console.warn('PUT /tasks/:id failed', err.message)
        }
    }

    const deleteTask = async (id) => {
        try {
            setTasks((t) => t.filter((tk) => tk.id !== id))
            await api.delete(`/tasks/${id}`)
        } catch (err) {
            console.warn('DELETE /tasks/:id failed', err.message)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])
    return (
        <TaskContext.Provider value={{ tasks, loading, fetchTasks, createTask, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    )
}