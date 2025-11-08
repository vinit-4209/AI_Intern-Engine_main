"use client"

import { useEffect, useMemo, useState } from "react"

import api from "../api/axios"
import SiteLayout from "../components/SiteLayout"
import CandidatePipeline from "../components/company/CandidatePipeline"
import FeedbackModal from "../components/company/FeedbackModal"
import InternshipManager from "../components/company/InternshipManager"

function CompanyDashboard({ user, onLogout }) {
  const [internships, setInternships] = useState([])
  const [internshipLoading, setInternshipLoading] = useState(false)

  const [candidateMatches, setCandidateMatches] = useState([])
  const [candidateLoading, setCandidateLoading] = useState(false)
  const [candidateError, setCandidateError] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(null)

  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    matchId: null,
    candidateName: "",
    value: "",
  })

  const userId = user?.user_id

  useEffect(() => {
    if (!userId) return
    fetchInternships()
    fetchCandidateMatches()
  }, [userId])

  const fetchInternships = async () => {
    if (!userId) return
    setInternshipLoading(true)
    try {
      const response = await api.get(`/internships/company/${userId}`)
      setInternships(response.data)
    } catch (error) {
      console.error("Error fetching internships:", error)
    } finally {
      setInternshipLoading(false)
    }
  }

  const fetchCandidateMatches = async () => {
    if (!userId) return
    setCandidateLoading(true)
    setCandidateError(null)
    try {
      const response = await api.get(`/company/${userId}/candidates`)
      const enriched = response.data.map((item) => ({
        ...item,
        experience_level:
          item.student?.experience_level || (item.student?.past_participation ? "experienced" : "fresher"),
      }))
      setCandidateMatches(enriched)
    } catch (error) {
      console.error("Error fetching candidate matches:", error)
      setCandidateError("Unable to load AI-recommended candidates right now. Please try again later.")
    } finally {
      setCandidateLoading(false)
    }
  }

  const handleCreateInternship = async (payload) => {
    if (!userId) return
    await api.post(`/internships?company_id=${userId}`, payload)
    await fetchInternships()
  }

  const handleDeleteInternship = async (internshipId) => {
    await api.delete(`/internships/${internshipId}`)
    await fetchInternships()
  }

  const handleStatusChange = async (matchId, status) => {
    setStatusUpdating(matchId)
    try {
      const response = await api.patch(`/matches/${matchId}/status`, { status })
      setCandidateMatches((previous) =>
        previous.map((candidate) =>
          candidate.match_id === matchId
            ? {
                ...candidate,
                status: response.data.status,
                status_updated_at: response.data.status_updated_at,
                feedback: response.data.feedback,
                application: response.data.application || candidate.application,
              }
            : candidate
        )
      )
    } catch (error) {
      alert("Unable to update candidate status: " + (error.response?.data?.detail || "Unknown error"))
    } finally {
      setStatusUpdating(null)
    }
  }

  const openFeedbackModal = (candidate) => {
    setFeedbackModal({
      open: true,
      matchId: candidate.match_id,
      candidateName: candidate.student?.name || "Candidate",
      value: candidate.feedback || "",
    })
  }

  const closeFeedbackModal = () => {
    setFeedbackModal({ open: false, matchId: null, candidateName: "", value: "" })
  }

  const handleFeedbackChange = (value) => {
    setFeedbackModal((prev) => ({ ...prev, value }))
  }

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault()
    if (!feedbackModal.matchId) return

    try {
      const response = await api.patch(`/matches/${feedbackModal.matchId}/status`, {
        feedback: feedbackModal.value,
      })
      setCandidateMatches((previous) =>
        previous.map((candidate) =>
          candidate.match_id === feedbackModal.matchId
            ? {
                ...candidate,
                feedback: response.data.feedback,
                status: response.data.status || candidate.status,
                status_updated_at: response.data.status_updated_at,
                application: response.data.application || candidate.application,
              }
            : candidate
        )
      )
      closeFeedbackModal()
    } catch (error) {
      alert("Unable to save feedback: " + (error.response?.data?.detail || "Unknown error"))
    }
  }

  const feedbackModalProps = useMemo(
    () => ({
      open: feedbackModal.open,
      candidateName: feedbackModal.candidateName,
      value: feedbackModal.value,
    }),
    [feedbackModal]
  )

  return (
    <SiteLayout user={user} onLogout={onLogout}>
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <InternshipManager
          internships={internships}
          loading={internshipLoading}
          onCreate={handleCreateInternship}
          onDelete={handleDeleteInternship}
        />

        <CandidatePipeline
          candidates={candidateMatches}
          loading={candidateLoading}
          error={candidateError}
          onRefresh={fetchCandidateMatches}
          onStatusChange={handleStatusChange}
          statusUpdating={statusUpdating}
          onFeedbackOpen={openFeedbackModal}
        />

      </div>

      <FeedbackModal
        {...feedbackModalProps}
        onChange={handleFeedbackChange}
        onClose={closeFeedbackModal}
        onSubmit={handleFeedbackSubmit}
      />
    </SiteLayout>
  )
}

export default CompanyDashboard

