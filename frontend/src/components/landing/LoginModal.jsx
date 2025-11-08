"use client"

import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

export default function LoginModal({ open, onClose }) {
  const navigate = useNavigate()
  const dialogRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const stop = (e) => e.stopPropagation()

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="login-title"
    >
      <div ref={dialogRef} onClick={stop} className="relative bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h3 id="login-title" className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h3>
          <p className="text-gray-600">Choose your account type to continue</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => {
              navigate("/student/login")
              onClose?.()
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            {/* <span className="mr-2" aria-hidden="true">
              
            </span> */}
            Login as Student
          </button>
          <button
            onClick={() => {
              navigate("/company/login")
              onClose?.()
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            {/* <span className="mr-2" aria-hidden="true">
              
            </span> */}
            Login as Employer
          </button>
        </div>

        {/* <div className="mt-6 text-center">
          <p className="text-gray-600">
            {"Don't have an account? "}
            <button
              onClick={() => {
                navigate("/student/register")
                onClose?.()
              }}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Sign up here
            </button>
          </p>
        </div> */}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close login modal"
        >
          <span className="text-2xl" aria-hidden="true">
            &times;
          </span>
        </button>
      </div>
    </div>
  )
}
