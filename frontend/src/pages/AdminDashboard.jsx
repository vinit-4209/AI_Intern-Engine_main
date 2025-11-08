"use client"

import { useState, useEffect } from "react"
import api from "../api/axios"
import SiteLayout from "../components/SiteLayout"

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState(null)
  const [students, setStudents] = useState([])
  const [companies, setCompanies] = useState([])
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStats()
    fetchStudents()
    fetchCompanies()
    fetchInternships()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats")
      setStats(response.data)
    } catch (err) {
      console.error("Error fetching stats:", err)
    }
  }

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await api.get("/students")
      setStudents(response.data)
    } catch (err) {
      console.error("Error fetching students:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const response = await api.get("/companies")
      setCompanies(response.data)
    } catch (err) {
      console.error("Error fetching companies:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchInternships = async () => {
    setLoading(true)
    try {
      const response = await api.get("/internships")
      setInternships(response.data)
    } catch (err) {
      console.error("Error fetching internships:", err)
    } finally {
      setLoading(false)
    }
  }

  const deleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student? This will also delete all their matches."))
      return

    try {
      await api.delete(`/admin/students/${studentId}`)
      alert("Student deleted successfully!")
      fetchStudents()
      fetchStats()
    } catch (err) {
      alert("Error deleting student: " + (err.response?.data?.detail || "Unknown error"))
    }
  }

  const deleteCompany = async (companyId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this company? This will also delete all their internships and matches.",
      )
    )
      return

    try {
      await api.delete(`/admin/companies/${companyId}`)
      alert("Company deleted successfully!")
      fetchCompanies()
      fetchInternships()
      fetchStats()
    } catch (err) {
      alert("Error deleting company: " + (err.response?.data?.detail || "Unknown error"))
    }
  }

  const deleteInternship = async (internshipId) => {
    if (!window.confirm("Are you sure you want to delete this internship? This will also delete all its matches."))
      return

    try {
      await api.delete(`/internships/${internshipId}`)
      alert("Internship deleted successfully!")
      fetchInternships()
      fetchStats()
    } catch (err) {
      alert("Error deleting internship: " + (err.response?.data?.detail || "Unknown error"))
    }
  }

  return (
    <SiteLayout user={user} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl shadow-lg p-8 mb-8 mt-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-purple-100">Complete system management and analytics</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total_students}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Companies</p>
                  <p className="text-3xl font-bold text-green-600">{stats.total_companies}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Internships</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.total_internships}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Matches</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.total_matches}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === "overview"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("students")}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === "students"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab("companies")}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === "companies"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Companies
              </button>
              <button
                onClick={() => setActiveTab("internships")}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === "internships"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Internships
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">System Overview</h2>
                <p className="text-gray-600 mb-6">
                  Welcome to the admin dashboard. Use the tabs above to manage students, companies, and internships.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        View and manage all registered students
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Monitor company registrations and postings
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete inappropriate or outdated content
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Track system statistics and analytics
                      </li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">System Features</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>AI-powered matching algorithm</li>
                      <li>Affirmative action support</li>
                      <li>Real-time database updates</li>
                      <li>Secure authentication system</li>
                      <li>Comprehensive analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === "students" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Students</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : students.length === 0 ? (
                  <p className="text-gray-600 text-center py-12">No students registered yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Qualification
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm text-gray-900">{student.name}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{student.email}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{student.qualification}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{student.location}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{student.social_category}</td>
                            <td className="px-4 py-4 text-sm">
                              <button
                                onClick={() => deleteStudent(student.id)}
                                className="text-red-600 hover:text-red-700 font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Companies Tab */}
            {activeTab === "companies" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Companies</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : companies.length === 0 ? (
                  <p className="text-gray-600 text-center py-12">No companies registered yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Company Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {companies.map((company) => (
                          <tr key={company.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm text-gray-900 font-medium">{company.name}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{company.email}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{company.industry}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{company.location}</td>
                            <td className="px-4 py-4 text-sm">
                              <button
                                onClick={() => deleteCompany(company.id)}
                                className="text-red-600 hover:text-red-700 font-medium"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Internships Tab */}
            {activeTab === "internships" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Internships</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : internships.length === 0 ? (
                  <p className="text-gray-600 text-center py-12">No internships posted yet</p>
                ) : (
                  <div className="space-y-4">
                    {internships.map((internship) => (
                      <div key={internship.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{internship.title}</h3>
                            <p className="text-gray-600">{internship.company_name}</p>
                          </div>
                          <button
                            onClick={() => deleteInternship(internship.id)}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="text-gray-700 mb-4">{internship.description}</p>
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Location</p>
                            <p className="font-medium text-gray-900">{internship.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Sector</p>
                            <p className="font-medium text-gray-900">{internship.sector}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Duration</p>
                            <p className="font-medium text-gray-900">{internship.duration_months} months</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Stipend</p>
                            <p className="font-medium text-gray-900">₹{internship.stipend.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}

export default AdminDashboard
