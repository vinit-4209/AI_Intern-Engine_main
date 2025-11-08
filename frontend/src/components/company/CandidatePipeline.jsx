"use client"

import { useMemo, useState } from "react"
import { formatDateTime } from "../../utils/formatDate"

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "contacted", label: "Interview" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Not a Fit" },
]

const STATUS_STYLES = {
  new: "bg-gray-100 text-gray-700",
  shortlisted: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  hired: "bg-green-100 text-green-700",
  rejected: "bg-rose-100 text-rose-700",
}

const FILTER_DEFAULTS = {
  search: "",
  skill: "",
  qualification: "all",
  experience: "all",
  status: "all",
  sort: "match-desc",
}

function CandidatePipeline({
  candidates,
  loading,
  error,
  onRefresh,
  onStatusChange,
  statusUpdating,
  onFeedbackOpen,
}) {
  const [filters, setFilters] = useState(FILTER_DEFAULTS)

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => setFilters(FILTER_DEFAULTS)

  const uniqueQualifications = useMemo(() => {
    const values = new Set()
    candidates.forEach((candidate) => {
      if (candidate.student?.qualification) {
        values.add(candidate.student.qualification)
      }
    })
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [candidates])

  const uniqueSkills = useMemo(() => {
    const map = new Map()
    candidates.forEach((candidate) => {
      const combined = `${candidate.student?.skills || ""},${candidate.student?.resume_skills || ""}`
      combined
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .forEach((skill) => {
          const key = skill.toLowerCase()
          if (!map.has(key)) {
            map.set(key, skill)
          }
        })
    })
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b))
  }, [candidates])

  const filteredCandidates = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase()
    const skillTerm = filters.skill.trim().toLowerCase()

    const filtered = candidates.filter((candidate) => {
      const student = candidate.student
      if (!student) return false

      if (filters.status !== "all" && candidate.status !== filters.status) {
        return false
      }

      if (filters.qualification !== "all" && student.qualification !== filters.qualification) {
        return false
      }

      if (filters.experience !== "all" && candidate.experience_level !== filters.experience) {
        return false
      }

      if (skillTerm) {
        const skillBank = `${student.skills || ""} ${student.resume_skills || ""}`.toLowerCase()
        if (!skillBank.includes(skillTerm)) {
          return false
        }
      }

      if (searchTerm) {
        const searchBank = `${student.name || ""} ${student.email || ""} ${student.phone || ""} ${
          student.location || ""
        } ${candidate.internship?.title || ""}`.toLowerCase()
        if (!searchBank.includes(searchTerm)) {
          return false
        }
      }

      return true
    })

    const sorted = [...filtered]
    const sortKey = filters.sort

    if (sortKey === "match-asc") {
      sorted.sort((a, b) => a.match_score - b.match_score)
    } else if (sortKey === "name-asc") {
      sorted.sort((a, b) => (a.student?.name || "").localeCompare(b.student?.name || ""))
    } else if (sortKey === "updated-desc") {
      sorted.sort((a, b) => {
        const aDate = new Date(a.status_updated_at || a.generated_at || 0).getTime()
        const bDate = new Date(b.status_updated_at || b.generated_at || 0).getTime()
        return bDate - aDate
      })
    } else if (sortKey === "updated-asc") {
      sorted.sort((a, b) => {
        const aDate = new Date(a.status_updated_at || a.generated_at || 0).getTime()
        const bDate = new Date(b.status_updated_at || b.generated_at || 0).getTime()
        return aDate - bDate
      })
    } else {
      sorted.sort((a, b) => b.match_score - a.match_score)
    }

    return sorted
  }, [candidates, filters])

  const pipelineStats = useMemo(() => {
    const base = {
      total: candidates.length,
      new: 0,
      shortlisted: 0,
      contacted: 0,
      hired: 0,
      rejected: 0,
    }

    candidates.forEach((candidate) => {
      const status = candidate.status || "new"
      if (base[status] === undefined) {
        base[status] = 0
      }
      base[status] += 1
    })

    return base
  }, [candidates])

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Recommended Candidates</h2>
          <p className="text-gray-600">
            Review and manage candidates ranked by our recommendation engine for your internships.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={resetFilters}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:w-auto"
          >
            Reset Filters
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Refreshing..." : "Refresh Recommendations"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-6">
        {["total", "new", "shortlisted", "contacted", "hired", "rejected"].map((key) => {
          const label =
            STATUS_OPTIONS.find((option) => option.value === key)?.label ||
            (key === "total" ? "Total Candidates" : key)

          return (
            <div key={key} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {key === "total" ? "Total Candidates" : label}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{pipelineStats[key] ?? 0}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-6">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">Search candidates</label>
          <input
            type="text"
            value={filters.search}
            onChange={(event) => handleFilterChange("search", event.target.value)}
            placeholder="Search by name, email, location, or internship"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">Filter by skill</label>
          <input
            type="text"
            list="company-dashboard-skill-options"
            value={filters.skill}
            onChange={(event) => handleFilterChange("skill", event.target.value)}
            placeholder="e.g. React, Data Analysis"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <datalist id="company-dashboard-skill-options">
            {uniqueSkills.map((skill) => (
              <option key={skill} value={skill} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Qualification</label>
          <select
            value={filters.qualification}
            onChange={(event) => handleFilterChange("qualification", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="all">All</option>
            {uniqueQualifications.map((qualification) => (
              <option key={qualification} value={qualification}>
                {qualification}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Experience</label>
          <select
            value={filters.experience}
            onChange={(event) => handleFilterChange("experience", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="all">All</option>
            <option value="fresher">Fresher</option>
            <option value="experienced">Experienced</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
          <select
            value={filters.status}
            onChange={(event) => handleFilterChange("status", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="all">All</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Sort by</label>
          <select
            value={filters.sort}
            onChange={(event) => handleFilterChange("sort", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="match-desc">Match score (high to low)</option>
            <option value="match-asc">Match score (low to high)</option>
            <option value="name-asc">Candidate name (A to Z)</option>
            <option value="updated-desc">Recently updated</option>
            <option value="updated-asc">Oldest updates</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        {error && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-600">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
            <p>Loading candidate recommendations...</p>
          </div>
        ) : filteredCandidates.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 py-12 text-center">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p className="text-lg font-medium text-gray-700">No candidates match the current filters</p>
            <p className="text-sm text-gray-500">Try adjusting your filters or refreshing recommendations.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCandidates.map((candidate) => {
              const student = candidate.student
              const matchScore = typeof candidate.match_score === "number" ? candidate.match_score : 0
              const internship = candidate.internship || {}
              const application = candidate.application
              const primarySkills = (student?.skills || "")
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
                .slice(0, 6)
              const supplementarySkills = (student?.resume_skills || "")
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
                .slice(0, 6)
              const combinedSkills = [...primarySkills, ...supplementarySkills].filter(Boolean)
              const statusLabel = STATUS_OPTIONS.find((option) => option.value === candidate.status)?.label || "New"
              const statusClass = STATUS_STYLES[candidate.status] || STATUS_STYLES.new
              const applicationStatusLabel = application
                ? STATUS_OPTIONS.find((option) => option.value === application.status)?.label || application.status
                : null

              return (
                <div
                  key={candidate.match_id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-sky-500/10 opacity-0 blur-sm transition duration-300 group-hover:opacity-100" />
                  <div className="relative flex flex-col gap-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-start md:gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-lg font-bold text-emerald-600 shadow-inner">
                          {matchScore.toFixed(1)}%
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold text-gray-900">{student?.name}</h3>
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-purple-700">
                              {candidate.experience_level === "experienced" ? "Experienced" : "Fresher"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{student?.email}</p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                            {student?.phone && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5l7 7-7 7m11-14h4a2 2 0 012 2v12a2 2 0 01-2 2h-4" />
                                </svg>
                                {student.phone}
                              </span>
                            )}
                            {student?.location && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21c4.97-4.666 8-8.333 8-11a8 8 0 10-16 0c0 2.667 3.03 6.334 8 11z" />
                                </svg>
                                {student.location}
                              </span>
                            )}
                            {student?.qualification && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-indigo-700">
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
                                </svg>
                                {student.qualification}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-right">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize shadow-sm ${statusClass}`}>
                          {statusLabel}
                        </span>
                        <p className="text-xs text-gray-500">Last updated: {formatDateTime(candidate.status_updated_at)}</p>
                        {application && (
                          <div className="text-xs text-gray-500">
                            <p>
                              Application stage:{" "}
                              <span className="font-semibold text-gray-700">{applicationStatusLabel}</span>
                            </p>
                            <p>Updated on: {formatDateTime(application.updated_at || application.created_at)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                      <div className="rounded-2xl bg-gray-50/80 p-5">
                        <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">Internship match</p>
                        <p className="mt-2 text-lg font-semibold text-gray-900">{internship.title}</p>
                        <p className="text-sm text-gray-500">{internship.company_name}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          {internship.sector && (
                            <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-blue-700">{internship.sector}</span>
                          )}
                          {internship.location && (
                            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">{internship.location}</span>
                          )}
                          {internship.duration_months && (
                            <span className="inline-flex rounded-full bg-orange-50 px-2 py-1 text-orange-600">
                              {internship.duration_months} months
                            </span>
                          )}
                          {internship.stipend && (
                            <span className="inline-flex rounded-full bg-teal-50 px-2 py-1 text-teal-700">
                              ₹{internship.stipend.toLocaleString()}/month
                            </span>
                          )}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600 sm:grid-cols-4">
                          <div>
                            <p className="font-semibold text-gray-700">Skills</p>
                            <p>{Math.round(candidate.skill_score ?? 0)}%</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Location</p>
                            <p>{Math.round(candidate.location_score ?? 0)}%</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Qualification</p>
                            <p>{Math.round(candidate.qualification_score ?? 0)}%</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700">Sector</p>
                            <p>{Math.round(candidate.sector_score ?? 0)}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-dashed border-gray-200 p-5">
                        <p className="text-sm font-semibold uppercase tracking-wide text-gray-600">Key strengths</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {combinedSkills.length > 0 ? (
                            combinedSkills.map((skill) => (
                              <span key={skill} className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">No skills captured</span>
                          )}
                        </div>
                        {student?.resume_summary && (
                          <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                            {student.resume_summary}
                          </p>
                        )}
                        {candidate.feedback && (
                          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-xs text-amber-700">
                            Recruiter note: {candidate.feedback}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                      <div className="rounded-2xl bg-white/70 p-4 shadow-inner ring-1 ring-gray-100">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">AI insight</p>
                        <p className="mt-2 text-sm text-gray-600">
                          This candidate aligns strongly with the role based on {Math.round(candidate.skill_score ?? 0)}% skill fit
                          and {Math.round(candidate.location_score ?? 0)}% location match. Consider moving them to interview to maintain momentum.
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 md:w-64">
                        <select
                          value={candidate.status || "new"}
                          onChange={(event) => onStatusChange(candidate.match_id, event.target.value)}
                          disabled={statusUpdating === candidate.match_id}
                          className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => onFeedbackOpen(candidate)}
                          className="rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-green-500 hover:text-green-600"
                        >
                          {candidate.feedback ? "Edit feedback" : "Add feedback"}
                        </button>
                        {!candidate.feedback && (
                          <p className="text-xs text-gray-400">No recruiter feedback yet.</p>
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
  )
}

export default CandidatePipeline

