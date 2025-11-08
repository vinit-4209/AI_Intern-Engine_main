"use client"

import { useState, useEffect } from "react"
import api from "../api/axios"
import SiteLayout from "../components/SiteLayout"
import UpdateProfileModal from "../components/UpdateProfileModal"

function StudentDashboard({ user, onLogout }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [studentInfo, setStudentInfo] = useState(null)
  const [applyingId, setApplyingId] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  useEffect(() => {
    fetchStudentInfo()
    fetchMatches()
  }, [])

  const fetchStudentInfo = async () => {
    try {
      const response = await api.get(`/students/${user.user_id}`)
      setStudentInfo(response.data)
    } catch (err) {
      console.error("Error fetching student info:", err)
    }
  }

  const fetchMatches = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/matches/student/${user.user_id}`)
      setMatches(response.data)
    } catch (err) {
      console.error("Error fetching matches:", err)
    } finally {
      setLoading(false)
    }
  }

  const generateMatches = async () => {
    setGenerating(true)
    try {
      await api.post(`/matches/generate/${user.user_id}`)
      alert("Matches generated successfully!")
      fetchMatches()
    } catch (err) {
      alert("Error generating matches: " + (err.response?.data?.detail || "Unknown error"))
    } finally {
      setGenerating(false)
    }
  }

  const applyToInternship = async (match) => {
    if (!match?.internship_id || applyingId === match.internship_id) {
      return
    }

    setApplyingId(match.internship_id)
    try {
      const response = await api.post("/applications", {
        student_id: user.user_id,
        internship_id: match.internship_id,
      })

      setMatches((prevMatches) =>
        prevMatches.map((currentMatch) =>
          currentMatch.id === match.id
            ? { ...currentMatch, application: response.data }
            : currentMatch,
        ),
      )

      alert("Application submitted successfully!")
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to submit application."
      alert(message)
    } finally {
      setApplyingId(null)
    }
  }

  const openEditProfile = () => {
    if (!studentInfo) {
      return
    }

    setIsEditingProfile(true)
  }

  const closeEditProfile = () => {
    setIsEditingProfile(false)
  }

  const handleProfileUpdated = (updatedStudent) => {
    setStudentInfo(updatedStudent)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-blue-600 bg-blue-50"
    if (score >= 40) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const formatApplicationStatus = (status) => {
    if (!status) return "Pending"

    const normalized = status.toLowerCase()
    const statusMap = {
      pending: "Pending",
      new: "Pending",
      shortlisted: "Shortlisted",
      contacted: "Contacted",
      hired: "Hired",
      rejected: "Not a Fit",
    }

    if (statusMap[normalized]) {
      return statusMap[normalized]
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1)
  }

  return (
    <SiteLayout user={user} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Profile Section */}
        {studentInfo && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
                <p className="text-gray-600">Review and update your details to improve recommendations.</p>
              </div>
              <button
                onClick={openEditProfile}
                className="self-start rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary"
              >
                Update Profile
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">{studentInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{studentInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{studentInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Qualification</p>
                <p className="font-medium text-gray-900">{studentInfo.qualification}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900">{studentInfo.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Social Category</p>
                <p className="font-medium text-gray-900">{studentInfo.social_category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rural Background</p>
                <p className="font-medium text-gray-900">{studentInfo.is_rural ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Aspirational District</p>
                <p className="font-medium text-gray-900">
                  {studentInfo.is_aspirational_district ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Past Participation</p>
                <p className="font-medium text-gray-900">{studentInfo.past_participation ? "Yes" : "No"}</p>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-sm text-gray-600">Skills</p>
                <p className="font-medium text-gray-900">
                  {studentInfo.skills || "No skills listed yet."}
                </p>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-sm text-gray-600">Preferred Sectors</p>
                <p className="font-medium text-gray-900">
                  {studentInfo.preferred_sectors || "No preferences recorded."}
                </p>
              </div>
              {studentInfo.resume_summary && (
                <div className="md:col-span-2 lg:col-span-3">
                  <p className="text-sm text-gray-600">Resume Summary</p>
                  <p className="font-medium text-gray-900 whitespace-pre-line">{studentInfo.resume_summary}</p>
                </div>
              )}
              {studentInfo.resume_filename && (
                <div>
                  <p className="text-sm text-gray-600">Uploaded Resume</p>
                  <p className="font-medium text-gray-900 truncate">{studentInfo.resume_filename}</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Matches Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Internship Matches</h2>
              <p className="text-gray-600">AI-powered recommendations based on your profile</p>
            </div>
            <button
              onClick={generateMatches}
              disabled={generating}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? "Generating..." : "Generate Matches"}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-gray-600 mt-4">Loading matches...</p>
            </div>
          ) : matches.length === 0 ? (
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
              <p className="text-gray-600 text-lg">No matches found</p>
              <p className="text-gray-500 text-sm mt-2">Click "Generate Matches" to find internships</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => {
                if (!match.internship) {
                  return null
                }

                return (
                  <div key={match.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{match.internship.title}</h3>
                        <p className="text-gray-600 mb-2">{match.internship.company_name}</p>
                        <p className="text-gray-700 mb-3">{match.internship.description}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-bold text-lg ${getScoreColor(match.match_score)}`}>
                      {match.match_score.toFixed(1)}%
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{match.internship.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sector</p>
                      <p className="font-medium text-gray-900">{match.internship.sector}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium text-gray-900">{match.internship.duration_months} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Stipend</p>
                      <p className="font-medium text-gray-900">₹{match.internship.stipend.toLocaleString()}/month</p>
                    </div>
                  </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Required Skills</p>
                      <p className="text-gray-900">{match.internship.required_skills}</p>
                    </div>

                  {/* Score Breakdown */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Match Score Breakdown</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Skills</p>
                        <p className="font-bold text-primary">{match.skill_score.toFixed(0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Location</p>
                        <p className="font-bold text-primary">{match.location_score.toFixed(0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Sector</p>
                        <p className="font-bold text-primary">{match.sector_score.toFixed(0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Qualification</p>
                        <p className="font-bold text-primary">{match.qualification_score.toFixed(0)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Diversity Bonus</p>
                        <p className="font-bold text-green-600">+{match.affirmative_bonus.toFixed(0)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      {match.application ? (
                        <>
                          <p className="text-lg font-medium text-green-700">Application Submitted</p>
                          <p className="text-sm text-gray-500">
                            Status:{" "}
                            <span className="font-bold text-gray-700">
                              {formatApplicationStatus(match.application.status)}
                            </span>
                            {match.application.created_at && (
                              <>
                                {" "}- Applied on {new Date(match.application.created_at).toLocaleDateString()}
                              </>
                            )}
                          </p>
                          {match.application.updated_at && match.application.updated_at !== match.application.created_at && (
                            <p className="text-xs text-gray-500">
                              Last update on {new Date(match.application.updated_at).toLocaleDateString()}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Interested? Submit your application directly to the company.
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => applyToInternship(match)}
                      disabled={Boolean(match.application) || applyingId === match.internship_id}
                      className="px-6 py-3 rounded-lg font-medium text-white bg-primary hover:bg-secondary transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {match.application
                        ? "Already Applied"
                        : applyingId === match.internship_id
                          ? "Submitting..."
                          : "Apply Now"}
                    </button>
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <UpdateProfileModal
        isOpen={isEditingProfile}
        studentId={user.user_id}
        studentInfo={studentInfo}
        onClose={closeEditProfile}
        onProfileUpdated={handleProfileUpdated}
      />
    </SiteLayout>
  )
}

export default StudentDashboard
