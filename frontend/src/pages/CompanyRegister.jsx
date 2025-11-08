"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import BackButton from "../components/BackButton"
import SiteLayout from "../components/SiteLayout"

function CompanyRegister() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    industry: "",
    location: "",
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
      await api.post("/companies/register", formData)
      alert("Registration successful! Please login.")
      navigate("/company/login")
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteLayout>
      <div className="px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <BackButton />

          <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Registration</h1>
            <p className="text-gray-600 mb-8">Register your company to post internship opportunities</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Tech Solutions Pvt Ltd"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Email *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  <option value="">Select Industry</option>
                  <option value="IT">Information Technology</option>
                  <option value="Finance">Finance & Banking</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Media">Media & Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Mumbai, Maharashtra"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/company/login")}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}

export default CompanyRegister
