

"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"

// Pages
import Home from "./pages/Home"
import StudentRegister from "./pages/StudentRegister"
import StudentLogin from "./pages/StudentLogin"
import StudentDashboard from "./pages/StudentDashboard"
import CompanyRegister from "./pages/CompanyRegister"
import CompanyLogin from "./pages/CompanyLogin"
import CompanyDashboard from "./pages/CompanyDashboard"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // Show loading screen while restoring session
  if (loading) {
    return <div className="flex h-screen items-center justify-center text-lg font-semibold">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />

        {/* Student Routes */}
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/login" element={<StudentLogin onLogin={handleLogin} />} />
        <Route
          path="/student/dashboard"
          element={
            user?.user_type === "student" ? (
              <StudentDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/student/login" replace />
            )
          }
        />

        {/* Company Routes */}
        <Route path="/company/register" element={<CompanyRegister />} />
        <Route path="/company/login" element={<CompanyLogin onLogin={handleLogin} />} />
        <Route
          path="/company/dashboard"
          element={
            user?.user_type === "company" ? (
              <CompanyDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/company/login" replace />
            )
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
        <Route
          path="/admin/dashboard"
          element={
            user?.user_type === "admin" ? (
              <AdminDashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
