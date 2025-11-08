"use client"

import { useState } from "react"

const DEFAULT_FORM = {
  title: "",
  description: "",
  required_skills: "",
  location: "",
  sector: "",
  duration_months: "",
  stipend: "",
  capacity: "",
  qualification_required: "",
}

function InternshipManager({ internships, loading, onCreate, onDelete }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(DEFAULT_FORM)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await onCreate({
        ...formData,
        duration_months: Number.parseInt(formData.duration_months, 10),
        stipend: Number.parseFloat(formData.stipend),
        capacity: Number.parseInt(formData.capacity, 10),
      })

      alert("Internship posted successfully!")
      setShowForm(false)
      setFormData(DEFAULT_FORM)
    } catch (error) {
      const message = error?.response?.data?.detail || error?.message || "Unknown error"
      alert(`Error posting internship: ${message}`)
    }
  }

  const handleDelete = async (internshipId) => {
    if (!window.confirm("Are you sure you want to delete this internship?")) return

    try {
      await onDelete(internshipId)
      alert("Internship deleted successfully!")
    } catch (error) {
      const message = error?.response?.data?.detail || error?.message || "Unknown error"
      alert(`Error deleting internship: ${message}`)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
          <p className="text-gray-600">Manage your internship postings</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
        >
          {showForm ? "Cancel" : "Post New Internship"}
        </button>
      </div>

      {showForm && (
        <div className="mt-8 rounded-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Post New Internship</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Internship Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Software Development Intern"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector *</label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                >
                  <option value="">Select Sector</option>
                  <option value="IT">Information Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Media">Media</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="Describe the internship role, responsibilities, and learning opportunities..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills *</label>
                <input
                  type="text"
                  name="required_skills"
                  value={formData.required_skills}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="e.g. React, Node.js, SQL"
                />
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
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (months) *</label>
                <input
                  type="number"
                  name="duration_months"
                  min="1"
                  value={formData.duration_months}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Stipend *</label>
                <input
                  type="number"
                  name="stipend"
                  min="0"
                  value={formData.stipend}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Positions *</label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualification Required *</label>
              <input
                type="text"
                name="qualification_required"
                value={formData.qualification_required}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="Bachelor's degree in Computer Science or related field"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Post Internship
            </button>
          </form>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Posted Internships</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-gray-600 mt-4">Loading internships...</p>
          </div>
        ) : internships.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 text-lg">No internships posted yet</p>
            <p className="text-gray-500 text-sm mt-2">Click "Post New Internship" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {internships.map((internship) => (
              <div key={internship.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{internship.title}</h3>
                    <p className="text-gray-600 mb-3">{internship.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(internship.id)}
                    className="ml-4 text-red-600 hover:text-red-700 transition"
                    title="Delete internship"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{internship.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sector</p>
                    <p className="font-medium text-gray-900">{internship.sector}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{internship.duration_months} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Stipend</p>
                    <p className="font-medium text-gray-900">₹{internship.stipend.toLocaleString()}/month</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Positions</p>
                    <p className="font-medium text-gray-900">{internship.capacity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Qualification</p>
                    <p className="font-medium text-gray-900">{internship.qualification_required}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Required Skills</p>
                  <p className="text-gray-900">{internship.required_skills}</p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">Posted on {new Date(internship.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InternshipManager

