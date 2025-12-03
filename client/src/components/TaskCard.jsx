import React from 'react'


export default function TaskCard({ task, onClick }) {
    return (
        <div onClick={onClick} className="p-2 mb-2 border rounded hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-semibold">{task.title}</div>
                    <div className="text-xs text-gray-600">{task.description}</div>
                </div>
                <div className="text-xs text-right">
                    <div>{task.priority}</div>
                    <div className="text-gray-500">{task.dueDate}</div>
                </div>
            </div>
        </div>
    )
}