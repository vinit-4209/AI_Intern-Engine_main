"use client"

import { useNavigate } from "react-router-dom"

function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-primary hover:text-secondary transition mb-6"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Go Back
    </button>
  )
}

export default BackButton
