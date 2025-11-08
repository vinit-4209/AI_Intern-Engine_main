"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import BackButton from "../components/BackButton"
import SiteLayout from "../components/SiteLayout"

function CompanyLogin({ onLogin }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isResetMode, setIsResetMode] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [resetData, setResetData] = useState({
    email: "",
    newPassword: "",
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
    setSuccess("")

    try {
      const response = await api.post("/companies/login", formData)
      onLogin(response.data)
      navigate("/company/dashboard")
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResetChange = (e) => {
    setResetData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await api.post("/companies/reset-password", {
        email: resetData.email,
        new_password: resetData.newPassword,
      })
      setSuccess("Password updated. Please login with the new password.")
      setFormData((prev) => ({ ...prev, email: resetData.email, password: "" }))
      setResetData({ email: "", newPassword: "" })
      setIsResetMode(false)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset password")
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Login</h1>
            <p className="text-gray-600 mb-8">Access your dashboard to manage internships</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">{success}</div>
            )}

            {isResetMode ? (
              <form onSubmit={handleReset} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={resetData.email}
                    onChange={handleResetChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="hr@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={resetData.newPassword}
                    onChange={handleResetChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="hr@company.com"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            )}

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsResetMode((prev) => !prev)
                  setError("")
                  setSuccess("")
                }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {isResetMode ? "Back to login" : "Forgot password?"}
              </button>
            </div>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/company/register")}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}

export default CompanyLogin
