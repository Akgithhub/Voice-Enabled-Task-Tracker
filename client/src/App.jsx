import { useState } from 'react'
import './App.css'
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import KanbanBoard from './components/KanbanBoard'
import ListView from './components/ListView'
import TaskModal from './components/TaskModal'
import VoiceModal from './components/VoiceModal'
import Navbar from './components/Navbar'



export default function App() {
  const [isTaskOpen, setTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [voiceOpen, setVoiceOpen] = useState(false)


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAdd={() => { setEditingTask(null); setTaskOpen(true) }} onOpenVoice={() => setVoiceOpen(true)} />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<KanbanBoard onEdit={(task) => { setEditingTask(task); setTaskOpen(true) }} />} />
          <Route path="/list" element={<ListView onEdit={(task) => { setEditingTask(task); setTaskOpen(true) }} />} />
        </Routes>
      </main>


      <TaskModal open={isTaskOpen} setOpen={setTaskOpen} task={editingTask} />
      <VoiceModal open={voiceOpen} setOpen={setVoiceOpen} onCreate={(t) => { setEditingTask(t); setTaskOpen(true); setVoiceOpen(false) }} />


    </div>
  )
}