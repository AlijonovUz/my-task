"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { apiLogin } from "@/utils/apiClient"

interface LoginProps {
  onLoginSuccess: (accessToken: string) => void
  onSwitchToRegister: () => void
}

export default function Login({ onLoginSuccess, onSwitchToRegister }: LoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await apiLogin(username, password)
      if (result.success) {
        localStorage.setItem("username", username)
        onLoginSuccess(result.token!)
      } else {
        setError(result.error || "Login failed")
      }
    } catch {
      setError("Server connection error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg shadow-xl p-8 border border-slate-700">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 text-white"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md text-white font-semibold">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-slate-400 mt-4">
            Don't have an account?{" "}
            <button onClick={onSwitchToRegister} className="text-blue-400 hover:text-blue-300 font-semibold">
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}