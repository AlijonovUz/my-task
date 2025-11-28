"use client"

import { CheckCircle2, Circle, Trash2 } from "lucide-react"
import type { Task } from "@/utils/fake-api"

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors group"
        >
          <button
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 text-slate-400 hover:text-blue-400 transition-colors"
          >
            {task.completed ? <CheckCircle2 size={24} className="text-green-400" /> : <Circle size={24} />}
          </button>

          <span className={`flex-1 text-lg ${task.completed ? "text-slate-500 line-through" : "text-white"}`}>
            {task.title}
          </span>

          <button
            onClick={() => onDelete(task.id)}
            className="flex-shrink-0 text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  )
}
