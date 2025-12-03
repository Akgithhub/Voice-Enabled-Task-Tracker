import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import { v4 as uuidv4 } from "uuid";

export const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  // static function
  // const fetchTasks = async () => {
  //     setLoading(true)
  //     try {
  //         const res = await api.get('/tasks')
  //         setTasks(res?.data || [])
  //     } catch (err) {
  //         console.warn('GET /tasks failed', err.message)
  //         setTasks([
  //             { id: '1', title: 'Setup project', description: 'Init repo', priority: 'Medium', status: 'To Do', dueDate: '2025-12-10' },
  //             { id: '2', title: 'Auth module', description: '', priority: 'High', status: 'In Progress', dueDate: '2025-12-05' },
  //             { id: '3', title: 'Review PR', description: '', priority: 'Low', status: 'Review', dueDate: '2025-12-06' },
  //         ])
  //     } finally {
  //         setLoading(false)
  //     }
  // }
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks/getTasks");

      //   console.log("📦 FETCHED TASKS:", res.data);

      const list = res?.data?.tasks || [];
    //   console.log("📦 FETCHED TASKS:", list);

      const normalized = list.map((t) => {
        const s = t.status?.toLowerCase();

        // Normalize all possible backend values → Frontend-friendly values
        const statusMap = {
          todo: "To Do",
          "to-do": "To Do",
          to_do: "To Do",

          inprogress: "In Progress",
          "in-progress": "In Progress",
          in_progress: "In Progress",

          review: "Review",
          inreview: "Review",
          "in-review": "Review",

          done: "Done",
          completed: "Done",
        };

        return {
          id: t._id,
          title: t.title,
          description: t.description,
          priority: t.priority?.toLowerCase(),
          status: statusMap[s] || "To Do",
          dueDate: t.dueDate?.slice(0, 10),
        };
      });

      setTasks(normalized);
    } catch (err) {
      console.warn("GET /tasks/getTasks failed", err.message);
      setTasks([
        {
          id: "1",
          title: "Setup project",
          priority: "Medium",
          status: "To Do",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // const createTask = async (payload) => {
  //     try {
  //         const tempId = uuidv4()
  //         const optimistic = { id: tempId, ...payload }
  //         setTasks((t) => [optimistic, ...t])

  //         const res = await api.post('/tasks', payload)

  //         if (res?.data) {
  //             setTasks((t) =>
  //                 t.map((tk) => (tk.id === tempId ? res.data : tk))
  //             )
  //             return res.data
  //         }

  //         return optimistic
  //     } catch (err) {
  //         console.warn('POST /tasks failed', err.message)
  //         return null
  //     }
  // }
  const createTask = async (payload) => {
    try {
      const tempId = uuidv4();

      // Optimistic UI update
      const optimistic = { id: tempId, ...payload };
      setTasks((t) => [optimistic, ...t]);

      // Correct backend route
      const res = await api.post("/tasks/ct", payload);

      // If backend returns real task, replace optimistic one
      if (res?.data) {
        setTasks((t) => t.map((tk) => (tk.id === tempId ? res.data : tk)));
        return res.data;
      }

      return optimistic;
    } catch (err) {
      console.warn("POST /tasks/ct failed:", err.message);
      return null;
    }
  };

  const updateTask = async (id, patch) => {
    try {
      setTasks((t) => t.map((tk) => (tk.id === id ? { ...tk, ...patch } : tk)));
      await api.put(`/tasks/${id}`, patch);
    } catch (err) {
      console.warn("PUT /tasks/:id failed", err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      setTasks((t) => t.filter((tk) => tk.id !== id));
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.warn("DELETE /tasks/:id failed", err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{ tasks, loading, fetchTasks, createTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};
