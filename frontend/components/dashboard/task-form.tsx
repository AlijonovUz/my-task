"use client"

import type React from "react"

import { useState } from "react"

interface TaskFormProps {
  onAdd: (title: string) => void
  onCancel: () => void
}

export default function TaskForm({ onAdd, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title)
      setTitle("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-colors"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
