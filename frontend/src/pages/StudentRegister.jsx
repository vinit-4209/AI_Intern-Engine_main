"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import BackButton from "../components/BackButton"
import SiteLayout from "../components/SiteLayout"

function StudentRegister() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const initialFormData = {
    name: "",
    email: "",
    password: "",
    phone: "",
    qualification: "",
    skills: "",
    location: "",
    preferred_sectors: "",
    social_category: "General",
    is_rural: false,
    is_aspirational_district: false,
    past_participation: false,
  }
  const [formData, setFormData] = useState(initialFormData)
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeInputKey, setResumeInputKey] = useState(0)
  const [successMessage, setSuccessMessage] = useState("")
  const [resumeInsights, setResumeInsights] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null
    setResumeFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccessMessage("")
    setResumeInsights(null)

    const payload = new FormData()
    payload.append("name", formData.name)
    payload.append("email", formData.email)
    payload.append("password", formData.password)
    payload.append("phone", formData.phone)
    payload.append("qualification", formData.qualification)
    payload.append("skills", formData.skills)
    payload.append("location", formData.location)
    payload.append("preferred_sectors", formData.preferred_sectors)
    payload.append("social_category", formData.social_category)
    payload.append("is_rural", formData.is_rural ? "true" : "false")
    payload.append(
      "is_aspirational_district",
      formData.is_aspirational_district ? "true" : "false",
    )
    payload.append("past_participation", formData.past_participation ? "true" : "false")

    if (resumeFile) {
      payload.append("resume", resumeFile)
    }

    try {
      const response = await api.post("/students/register", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const resumeSummary = response.data?.resume_summary || ""
      const resumeSkills = response.data?.resume_skills
        ? response.data.resume_skills.split(",").map((skill) => skill.trim()).filter(Boolean)
        : []
      const sectors = response.data?.resume_sector_insights
        ? response.data.resume_sector_insights
            .split(",")
            .map((sector) => sector.trim())
            .filter(Boolean)
        : []

      const hasInsights =
        Boolean(resumeSummary) || resumeSkills.length > 0 || sectors.length > 0

      setSuccessMessage(
        hasInsights
          ? "Registration successful! Review the resume insights below and proceed to login."
          : "Registration successful! Proceed to login to explore internships.",
      )

      setResumeInsights(
        hasInsights
          ? {
              summary: resumeSummary,
              skills: resumeSkills,
              sectors,
            }
          : null,
      )
      setFormData(initialFormData)
      setResumeFile(null)
      setResumeInputKey((prev) => prev + 1)
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteLayout>
      <div className="px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <BackButton />

          <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
            <p className="text-gray-600 mb-8">Create your account to find internship opportunities</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">{successMessage}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="john@example.com"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Min 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualification *</label>
                  <select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Qualification</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="B.E">B.E</option>
                    <option value="BCA">BCA</option>
                    <option value="MBA">MBA</option>
                    <option value="MCA">MCA</option>
                    <option value="B.Com">B.Com</option>
                    <option value="BBA">BBA</option>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Mumbai, Maharashtra"
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume (PDF, DOCX or TXT)
                  <span className="ml-1 text-xs font-normal text-gray-500">Optional</span>
                </label>
                <input
                  key={resumeInputKey}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  We will extract skills from your resume to strengthen internship recommendations.
                </p>
                {resumeFile && (
                  <p className="text-sm text-gray-600 mt-2">Selected file: {resumeFile.name}</p>
                )}
              </div>

              {/* Skills and Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills * (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Python, JavaScript, React, Data Analysis"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Sectors * (comma-separated)
                </label>
                <input
                  type="text"
                  name="preferred_sectors"
                  value={formData.preferred_sectors}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="IT, Finance, Healthcare, Education"
                />
              </div>

              {/* Diversity Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Category *</label>
                <select
                  name="social_category"
                  value={formData.social_category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_rural"
                    checked={formData.is_rural}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">I am from a rural area</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="is_aspirational_district"
                    checked={formData.is_aspirational_district}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">I am from an aspirational district</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="past_participation"
                    checked={formData.past_participation}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">I have participated in PM Internship Scheme before</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {successMessage && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-5">
                <p className="text-green-800 text-sm md:text-base">{successMessage}</p>
                <button
                  type="button"
                  onClick={() => navigate("/student/login")}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition"
                >
                  Proceed to Login
                </button>
              </div>
            )}

            {resumeInsights && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-5">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Resume Insights</h3>
                {resumeInsights.summary && (
                  <p className="text-sm text-blue-800 mb-3">{resumeInsights.summary}</p>
                )}
                {resumeInsights.skills.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Detected Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {resumeInsights.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {resumeInsights.sectors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Suggested Sectors</h4>
                    <ul className="list-disc list-inside text-sm text-blue-800">
                      {resumeInsights.sectors.map((sector) => (
                        <li key={sector}>{sector}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/student/login")}
                className="text-primary hover:text-secondary font-medium"
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

export default StudentRegister
