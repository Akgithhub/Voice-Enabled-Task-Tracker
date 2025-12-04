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
  // static function
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
    // console.log("createTask called:", payload);

    const tempId = uuidv4();

    // Optimistic update
    const optimistic = {
      id: tempId,
      title: payload.title,
      description: payload.description || "",
      priority: payload.priority?.toLowerCase(),
      status: payload.status
        ? payload.status[0].toUpperCase() + payload.status.slice(1).toLowerCase()
        : "To Do",
      dueDate: payload.dueDate?.slice(0, 10),
    };

    // console.log("Optimistic task inserted:", optimistic);
    setTasks((t) => [optimistic, ...t]);

    try {
      // console.log("Sending POST /tasks/ct");
      const res = await api.post("/tasks/ct", payload);
      await fetchTasks();

      // FIX → extract the actual task
      const raw = res?.data?.task;
      if (!raw) {
        console.log("No backend task returned, keeping optimistic.");
        return optimistic;
      }

      // Normalize backend task
      const normalized = {
        id: raw._id,
        title: raw.title,
        description: raw.description || "",
        priority: raw.priority?.toLowerCase(),
        status: raw.status
          ? raw.status[0].toUpperCase() + raw.status.slice(1).toLowerCase()
          : "To Do",
        dueDate: raw.dueDate?.slice(0, 10),
      };

      // console.log("Normalized backend task:", normalized);

      // Replace optimistic task
      setTasks((t) => t.map((tk) => (tk.id === tempId ? normalized : tk)));

      return normalized;
    } catch (err) {
      console.log("POST /tasks/ct failed:", err.message);
      // console.log("Rolling back optimistic task.");
      setTasks((t) => t.filter((tk) => tk.id !== tempId));
      return null;
    }
  };


  //static function
  // const updateTask = async (id, patch) => {
  //   try {
  //     setTasks((t) => t.map((tk) => (tk.id === id ? { ...tk, ...patch } : tk)));
  //     await api.put(`/tasks/${id}`, patch);
  //   } catch (err) {
  //     console.warn("PUT /tasks/:id failed", err.message);
  //   }
  // };
  const updateTask = async (id, patch) => {
    // console.log("updateTask called", { id, patch });

    // Keep a snapshot for rollback
    const prevTasks = [...tasks];
    // console.log("Previous tasks snapshot length:", prevTasks.length);

    try {
      // console.log(`Optimistic UI update for task ${id}`);
      setTasks((t) =>
        t.map((tk) => {
          if (tk.id === id) {
            // console.log("Updating task locally:", {
            //   before: tk,
            //   after: { ...tk, ...patch },
            // });
          }
          return tk.id === id ? { ...tk, ...patch } : tk;
        })
      );

      // Correct API endpoint
      // console.log(`Sending PUT → /tasks/udt/${id}`, patch);
      const res = await api.put(`/tasks/udt/${id}`, patch);

      if (res.data) {
        // console.log('Task Updated Successfully');

      }

    } catch (err) {
      console.warn("PUT /tasks/udt/:id failed:", err.message);

      // console.log("Rolling back to previous task list...");
      setTasks(prevTasks);
    }
  };


  //static function
  // const deleteTask = async (id) => {
  //   try {
  //     setTasks((t) => t.filter((tk) => tk.id !== id));
  //     await api.delete(`/tasks/${id}`);
  //   } catch (err) {
  //     console.warn("DELETE /tasks/:id failed", err.message);
  //   }
  // };
  const deleteTask = async (id) => {
    // console.log("deleteTask called:", { id });

    const prevTasks = [...tasks];
    // console.log("Previous tasks count:", prevTasks.length);

    try {
      // console.log(`Attempting optimistic delete for task: ${id}`);
      setTasks((t) => t.filter((tk) => tk.id !== id));

      // console.log(`Sending DELETE request to /tasks/delt/${id}`);
      const res = await api.delete(`/tasks/delt/${id}`);
      if (res.data) {
        // console.log('Delete successful');

      }
    } catch (err) {
      console.warn("DELETE /tasks/delt/:id failed:", err.message);

      console.log("Restoring previous task list due to failure.");
      setTasks(prevTasks);
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
