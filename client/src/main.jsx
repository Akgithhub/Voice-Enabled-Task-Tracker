import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { TaskProvider } from './context/TaskContext'
import { createRoot } from 'react-dom/client'
import './index.css'


createRoot(document.getElementById('root')).render(
  <>
    <TaskProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TaskProvider>
  </>
)
