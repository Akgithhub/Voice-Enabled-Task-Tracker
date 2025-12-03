import React from 'react'
import { useTasks } from '../context/TaskContext'
import TaskCard from './TaskCard'


const STATUSES = ['To Do', 'In Progress', 'Review', 'Done']


export default function KanbanBoard({ onEdit }) {
    const { tasks, updateTask } = useTasks()


    const onDragStart = (e, id) => {
        e.dataTransfer.setData('text/plain', id)
    }


    const onDrop = (e, newStatus) => {
        const id = e.dataTransfer.getData('text/plain')
        updateTask(id, { status: newStatus })
    }


    const allowDrop = (e) => e.preventDefault()


    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {STATUSES.map((status) => (
                <div key={status} className="bg-white p-3 rounded shadow h-[60vh] overflow-auto">
                    <h3 className="font-semibold mb-2">{status}</h3>
                    <div onDragOver={allowDrop} onDrop={(e) => onDrop(e, status)}>
                        {tasks.filter(t => t.status === status).map(task => (
                            <div key={task.id} draggable onDragStart={(e) => onDragStart(e, task.id)}>
                                <TaskCard task={task} onClick={() => onEdit(task)} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}