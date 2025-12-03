import React from 'react'
import { Link, useLocation } from 'react-router-dom'


export default function Navbar({ onAdd, onOpenVoice }) {
    const loc = useLocation()
    return (
        <nav className="bg-white shadow p-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="font-bold">Voice Task Tracker</div>
                <Link className={`px-2 ${loc.pathname === '/' ? 'font-semibold' : ''}`} to="/">Kanban</Link>
                <Link className={`px-2 ${loc.pathname === '/list' ? 'font-semibold' : ''}`} to="/list">List</Link>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={onAdd} className="px-3 py-1 bg-blue-600 text-white rounded">Add Task</button>
                <button onClick={onOpenVoice} title="Voice create" className="px-3 py-1 border rounded flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z"></path><path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 0 0 2 0v-3.08A7 7 0 0 0 19 11z"></path></svg>
                    Mic
                </button>
            </div>
        </nav>
    )
}