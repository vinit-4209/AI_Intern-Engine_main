"use client"

import { useState, useEffect, useMemo } from "react"
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

  const APPLICATION_STAGES = useMemo(
    () => [
      {
        value: "pending",
        label: "Pending",
        description: "Your application has been submitted and is awaiting review.",
      },
      {
        value: "shortlisted",
        label: "Shortlisted",
        description: "The company liked your profile and moved you forward.",
      },
      {
        value: "contacted",
        label: "Interview",
        description: "Interview discussions are in progress with the company.",
      },
      {
        value: "hired",
        label: "Hired",
        description: "Congratulations! You have been selected for the role.",
      },
      {
        value: "rejected",
        label: "Not a Fit",
        description: "The application was closed for this opportunity.",
      },
    ],
    [],
  )

  const stageOrder = useMemo(() => {
    return APPLICATION_STAGES.reduce((map, stage, index) => {
      map[stage.value] = index
      return map
    }, {})
  }, [APPLICATION_STAGES])

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

  const normalizeApplicationStatus = (status) => {
    if (!status) return "pending"
    const normalized = status.toLowerCase()
    if (normalized === "new") return "pending"
    return normalized
  }

  const formatApplicationStatus = (status) => {
    const normalized = normalizeApplicationStatus(status)
    const stage = APPLICATION_STAGES.find((item) => item.value === normalized)
    if (stage) {
      return stage.label
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1)
  }

  const getStageState = (stageValue, currentStatus) => {
    const normalized = normalizeApplicationStatus(currentStatus)
    const currentIndex = stageOrder[normalized] ?? 0
    const stageIndex = stageOrder[stageValue] ?? 0

    if (stageIndex < currentIndex) return "completed"
    if (stageIndex === currentIndex) return "current"
    return "upcoming"
  }

  const calculateProgress = (status) => {
    const normalized = normalizeApplicationStatus(status)
    const currentIndex = stageOrder[normalized] ?? 0
    const totalStages = APPLICATION_STAGES.length - 1
    if (totalStages <= 0) return 0

    return Math.min(100, Math.max(0, (currentIndex / totalStages) * 100))
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

                const recruiterEmail = match.internship.contact_email || match.internship.company_email

                const scoreColor = getScoreColor(match.match_score)

                return (
                  <div key={match.id} className="group relative">
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/30 via-secondary/20 to-emerald-200 opacity-0 blur transition duration-500 group-hover:opacity-100" />
                    <div className="relative rounded-2xl border border-transparent bg-white/90 p-6 shadow-sm ring-1 ring-gray-100 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-gray-900">{match.internship.title}</h3>
                          <p className="text-base text-gray-600">{match.internship.company_name}</p>
                          <p className="mt-3 text-gray-700">{match.internship.description}</p>
                        </div>
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold shadow-inner ${scoreColor} bg-white`}
                        >
                          {match.match_score.toFixed(1)}%
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl bg-gray-50/80 p-5">
                          <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">Role snapshot</p>
                          <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-gray-500">Location</p>
                              <p className="font-medium text-gray-900">{match.internship.location || "Not specified"}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-gray-500">Sector</p>
                              <p className="font-medium text-gray-900">{match.internship.sector || "Not specified"}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-gray-500">Duration</p>
                              <p className="font-medium text-gray-900">{match.internship.duration_months} months</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-wide text-gray-500">Stipend</p>
                              <p className="font-medium text-gray-900">₹{match.internship.stipend.toLocaleString()}/month</p>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-dashed border-gray-200 p-5">
                          <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">Required skills</p>
                          <p className="mt-2 text-gray-900">{match.internship.required_skills}</p>
                          <div className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                            {match.internship.expectations || "Stay prepared with the listed skills and highlight relevant projects during interviews."}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 rounded-2xl bg-gradient-to-r from-gray-50 via-white to-gray-50 p-5 ring-1 ring-gray-100">
                        <p className="text-sm font-semibold text-gray-800">Match Score Breakdown</p>
                        <div className="mt-3 grid grid-cols-2 gap-4 text-center md:grid-cols-5">
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

                      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          {match.application ? (
                            <div>
                              <p className="text-lg font-semibold text-green-600">Application Submitted</p>
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-semibold text-gray-800">Current stage:</span>{" "}
                                <span className="text-gray-900">{formatApplicationStatus(match.application.status)}</span>
                                {match.application.created_at && (
                                  <span className="block text-xs text-gray-500">
                                    Applied on {new Date(match.application.created_at).toLocaleDateString()}
                                  </span>
                                )}
                                {match.application.updated_at && match.application.updated_at !== match.application.created_at && (
                                  <span className="block text-xs text-gray-500">
                                    Last update on {new Date(match.application.updated_at).toLocaleDateString()}
                                  </span>
                                )}
                              </div>

                              <div className="mt-6">
                                <div className="relative">
                                  <div className="h-2 w-full rounded-full bg-gray-200" />
                                  <div
                                    className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-primary via-secondary to-emerald-500 transition-all duration-500"
                                    style={{ width: `${calculateProgress(match.application.status)}%` }}
                                  />
                                  <div className="absolute top-1/2 left-0 right-0 flex -translate-y-1/2 justify-between">
                                    {APPLICATION_STAGES.map((stage, index) => {
                                      const state = getStageState(stage.value, match.application.status)
                                      const baseCircle =
                                        state === "completed"
                                          ? "border-transparent bg-gradient-to-r from-primary to-secondary text-white shadow"
                                          : state === "current"
                                            ? "border-primary bg-white text-primary shadow"
                                            : "border-gray-300 bg-white text-gray-400"

                                      return (
                                        <div key={stage.value} className="flex flex-col items-center">
                                          <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition ${baseCircle}`}
                                          >
                                            {state === "completed" ? (
                                              <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                              >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                              </svg>
                                            ) : (
                                              index + 1
                                            )}
                                          </div>
                                          <p className="mt-2 text-xs font-medium text-gray-700">{stage.label}</p>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                                <div className="mt-10 grid gap-3 text-xs text-gray-500 md:grid-cols-5">
                                  {APPLICATION_STAGES.map((stage) => (
                                    <p key={stage.value} className="text-center md:text-left">
                                      {stage.description}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600">
                              Interested? Submit your application directly to the company.
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-3 md:w-48">
                          <button
                            onClick={() => applyToInternship(match)}
                            disabled={Boolean(match.application) || applyingId === match.internship_id}
                            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {match.application
                              ? "Already Applied"
                              : applyingId === match.internship_id
                                ? "Submitting..."
                                : "Apply Now"}
                          </button>
                          {recruiterEmail ? (
                            <a
                              href={`mailto:${recruiterEmail}`}
                              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
                            >
                              Connect with Recruiter
                            </a>
                          ) : (
                            <span className="inline-flex items-center justify-center rounded-xl border border-dashed border-gray-200 px-6 py-3 text-sm font-semibold text-gray-400">
                              Recruiter contact unavailable
                            </span>
                          )}
                        </div>
                      </div>
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
