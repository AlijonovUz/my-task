"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Circle } from "lucide-react"
import TaskForm from "./task-form"
import TaskList from "./task-list"
import { apiGetTodos, apiCreateTodo, apiUpdateTodo, apiDeleteTodo } from "@/utils/apiClient"

interface Task {
  id: number
  title: string
  completed: boolean
}

interface DashboardProps {
  token: string
  onLogout: () => void
}

interface DecodedToken {
  exp: number;
  username: string;
}

function decodeJWT<T>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    const decodedStr = atob(payload);
    return JSON.parse(decodedStr) as T;
  } catch {
    return null;
  }
}

export default function Dashboard({ token, onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [username, setUsername] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);
  const fetchedRef = useRef(false);

  // useEffect
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUsername(storedUser);
  }, []);

  useEffect(() => {
    if (!token) return;

    const decoded = decodeJWT<DecodedToken>(token);
    if (!decoded) {
      onLogout();
      return;
    }

    const intervalId = setInterval(() => {
      const checkDecoded = decodeJWT<DecodedToken>(token);
      if (!checkDecoded || checkDecoded.exp < Date.now() / 1000) {
        clearInterval(intervalId);
        onLogout();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [token, onLogout]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchTodos = async () => {
      const result = await apiGetTodos(token);
      if (result.success) setTasks(result.todos);
    };

    fetchTodos();
  }, [token]);

  // handle
  const handleError = async (text: string) => {
    setMessage({ text, type: "error" });

    setTimeout(async () => {
      setMessage(null);
      const result = await apiGetTodos(token);
      if (result.success) setTasks(result.todos);
    }, 4000);
  };

  const handleAddTask = async (title: string) => {
    const result = await apiCreateTodo(title, token);
    if (result.success) {
      setTasks(prev => [...prev, result.todo]);
      setShowForm(false);
      setMessage({ text: "Task successfully added!", type: "success" });
      setTimeout(() => setMessage(null), 4000);
    } else {
      handleError(result.error ?? "Something went wrong");
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleToggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    const result = await apiUpdateTodo(id, { completed: !task.completed }, token)
    if (result.success) {
      setTasks(prev => prev.map(t => (t.id === id ? result.todo : t)))
      setMessage({ text: "Task successfully updated!", type: "success" });
      setTimeout(() => setMessage(null), 4000);
    } else {
      handleError(result.error ?? "Something went wrong");
      setTimeout(() => setMessage(null), 4000);
    }
  }

  const handleDeleteTask = async (id: number) => {
    const result = await apiDeleteTodo(id, token)
    if (result.success) {
      setTasks(prev => prev.filter(t => t.id !== id))
      setMessage({ text: "Task successfully deleted!", type: "success" });
      setTimeout(() => setMessage(null), 4000);
    } else {
      handleError(result.error ?? "Something went wrong");
      setTimeout(() => setMessage(null), 4000);
    }
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {message && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg z-50 animate-slideIn
      ${message.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
        >
          {message.text}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">My Tasks</h1>
            <p className="text-slate-400 mt-1">Welcome back, {username}!</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold text-white mt-1">{tasks.length}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-400 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-400 mt-1">{completedCount}</p>
          </div>
        </div>

        {/* Add Task Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full mb-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add New Task
          </button>
        )}

        {/* Add Task Form */}
        {showForm && <TaskForm onAdd={handleAddTask} onCancel={() => setShowForm(false)} />}

        {/* Task List */}
        {tasks.length > 0 ? (
          <TaskList tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
        ) : (
          <div className="text-center py-12">
            <Circle size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 text-lg">No tasks yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}