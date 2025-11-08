"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import BackButton from "../components/BackButton"
import SiteLayout from "../components/SiteLayout"

function AdminLogin({ onLogin }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/admin/login", null, {
        params: {
          username: formData.username,
          password: formData.password,
        },
      })
      onLogin({ ...response.data, name: "Admin" })
      navigate("/admin/dashboard")
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteLayout>
      <div className="px-4 pb-12">
        <div className="max-w-md mx-auto">
          <BackButton />

          <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Admin Login</h1>
            <p className="text-gray-600 mb-8 text-center">Secure access to system management</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Enter admin password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login as Admin"}
              </button>
            </form>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Default Credentials:</strong>
                <br />
                Username: admin
                <br />
                Password: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}

export default AdminLogin
