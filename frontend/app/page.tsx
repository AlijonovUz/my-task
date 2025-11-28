"use client"

import { useEffect, useState } from "react"
import Login from "@/components/auth/login"
import Register from "@/components/auth/register"
import Dashboard from "@/components/dashboard/dashboard"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"login" | "register" | "dashboard">("login")
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken")
    if (storedToken) {
      setToken(storedToken)
      setCurrentPage("dashboard")
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const handleLoginSuccess = (accessToken: string) => {
    setToken(accessToken)
    localStorage.setItem("accessToken", accessToken)
    setCurrentPage("dashboard")
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    setCurrentPage("login")
  }

  if (currentPage === "dashboard" && token) {
    return <Dashboard token={token} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {currentPage === "login" ? (
        <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setCurrentPage("register")} />
      ) : (
        <Register onRegisterSuccess={() => setCurrentPage("login")} onSwitchToLogin={() => setCurrentPage("login")} />
      )}
    </div>
  )
}
