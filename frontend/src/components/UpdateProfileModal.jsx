"use client"

import { useEffect, useMemo, useState } from "react"
import api from "../api/axios"

const defaultProfileState = {
  name: "",
  phone: "",
  qualification: "",
  skills: "",
  location: "",
  preferred_sectors: "",
  social_category: "",
  is_rural: false,
  is_aspirational_district: false,
  past_participation: false,
}

function UpdateProfileModal({ isOpen, studentId, studentInfo, onClose, onProfileUpdated }) {
  const [profileForm, setProfileForm] = useState(defaultProfileState)
  const [profileFile, setProfileFile] = useState(null)
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(0)

  const mergedProfile = useMemo(() => ({ ...defaultProfileState, ...studentInfo }), [studentInfo])

  useEffect(() => {
    if (!isOpen || !studentInfo) return

    setProfileForm({
      name: mergedProfile.name || "",
      phone: mergedProfile.phone || "",
      qualification: mergedProfile.qualification || "",
      skills: mergedProfile.skills || "",
      location: mergedProfile.location || "",
      preferred_sectors: mergedProfile.preferred_sectors || "",
      social_category: mergedProfile.social_category || "",
      is_rural: Boolean(mergedProfile.is_rural),
      is_aspirational_district: Boolean(mergedProfile.is_aspirational_district),
      past_participation: Boolean(mergedProfile.past_participation),
    })
    setProfileFile(null)
    setFileInputKey((key) => key + 1)
  }, [isOpen, mergedProfile, studentInfo])

  if (!isOpen || !studentInfo) return null

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfileForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0] || null
    setProfileFile(file)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setUpdatingProfile(true)

    try {
      const formData = new FormData()
      Object.entries(profileForm).forEach(([key, value]) =>
        formData.append(key, typeof value === "boolean" ? String(value) : value)
      )
      if (profileFile) formData.append("resume", profileFile)

      const response = await api.put(`/students/${studentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      onProfileUpdated?.(response.data)
      alert("Profile updated successfully!")
      onClose()
    } catch (err) {
      const message = err.response?.data?.detail || "Failed to update profile."
      alert(message)
    } finally {
      setUpdatingProfile(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 sm:px-4">
      {/* Added responsive scrollable container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Update Profile</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close update profile form"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <form className="px-4 sm:px-6 py-5" onSubmit={handleProfileSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Full Name</span>
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Phone</span>
              <input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Qualification</span>
              <input
                type="text"
                name="qualification"
                value={profileForm.qualification}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Location</span>
              <input
                type="text"
                name="location"
                value={profileForm.location}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>

            <label className="sm:col-span-2 block">
              <span className="text-sm font-medium text-gray-700">Skills</span>
              <textarea
                name="skills"
                value={profileForm.skills}
                onChange={handleProfileChange}
                rows={3}
                placeholder="e.g. Python, Data Analysis, Communication"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>

            <label className="sm:col-span-2 block">
              <span className="text-sm font-medium text-gray-700">Preferred Sectors</span>
              <textarea
                name="preferred_sectors"
                value={profileForm.preferred_sectors}
                onChange={handleProfileChange}
                rows={2}
                placeholder="e.g. Information Technology, Finance"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Social Category</span>
              <input
                type="text"
                name="social_category"
                value={profileForm.social_category}
                onChange={handleProfileChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm sm:text-base focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="is_rural"
                checked={profileForm.is_rural}
                onChange={handleProfileChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Rural Background
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="is_aspirational_district"
                checked={profileForm.is_aspirational_district}
                onChange={handleProfileChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Aspirational District
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="past_participation"
                checked={profileForm.past_participation}
                onChange={handleProfileChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Participated Previously
            </label>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700">
              Upload Resume (PDF, DOCX, TXT)
            </label>
            <input
              key={fileInputKey}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleResumeChange}
              className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-secondary"
            />
            {profileFile ? (
              <p className="mt-1 text-xs text-gray-500">Selected file: {profileFile.name}</p>
            ) : (
              studentInfo?.resume_filename && (
                <p className="mt-1 text-xs text-gray-500">
                  Current file: {studentInfo.resume_filename}
                </p>
              )
            )}
          </div>

          <div className="sticky bottom-0 mt-6 flex items-center justify-end gap-3 bg-white pb-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatingProfile}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {updatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfileModal
