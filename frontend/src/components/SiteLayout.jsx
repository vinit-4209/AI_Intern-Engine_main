"use client"

import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "./landing/Header"
import Footer from "./landing/Footer"
import LoginModal from "./landing/LoginModal"

function SiteLayout({ children, user, onLogout, contentClassName = "" }) {
  const [loginOpen, setLoginOpen] = useState(false)
  const navigate = useNavigate()

  const openLogin = useCallback(() => setLoginOpen(true), [])
  const closeLogin = useCallback(() => setLoginOpen(false), [])

  // Handle "Get Started / Start Matching" button
  const handleGetStarted = useCallback(() => {
    if (user) {
      const dashboardPath = (() => {
        switch (user.user_type) {
          case "student":
            return "/student/dashboard"
          case "company":
            return "/company/dashboard"
          case "admin":
            return "/admin/dashboard"
          default:
            return null
        }
      })()

      if (dashboardPath) {
        navigate(dashboardPath)
      } else {
        setLoginOpen(true)
      }
    } else {
      setLoginOpen(true)
    }
  }, [user, navigate])

  const renderedChildren = useMemo(() => {
    if (typeof children === "function") {
      return children({ openLogin, handleGetStarted })
    }
    return children
  }, [children, openLogin, handleGetStarted])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onOpenLogin={openLogin} user={user} onLogout={onLogout} />
      {/* <main className={`flex-1 pt-20 ${contentClassName}`.trim()}> */}
      <main className={`flex-1 pt-16 ${contentClassName}`.trim()}>

        {renderedChildren}
      </main>
      <Footer />
      <LoginModal open={loginOpen} onClose={closeLogin} />
    </div>
  )
}

export default SiteLayout
