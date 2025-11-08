"use client"

import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import SiteLayout from "../components/SiteLayout"
import Hero from "../components/landing/Hero"
import Features from "../components/landing/Features"
import HowItWorks from "../components/landing/HowItWorks"
import CTA from "../components/landing/CTA"

function Home({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const targetId = location.state?.scrollTo
    if (!targetId) return

    const timeout = window.setTimeout(() => {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      navigate(".", { replace: true, state: {} })
    }, 100)

    return () => window.clearTimeout(timeout)
  }, [location, navigate])

  return (
    <SiteLayout user={user} onLogout={onLogout}>
      {({ handleGetStarted }) => (
        <div className="bg-gray-50">
          {/* Hero Section */}
          <Hero handleGetStarted={handleGetStarted} />

          {/* Features Section */}
          <Features />

          {/* How It Works Section */}
          <HowItWorks />

          {/* Optional About anchor target */}
          <section id="about" className="py-2" aria-hidden="true" />

          {/* CTA Section */}
          <CTA handleGetStarted={handleGetStarted} />
        </div>
      )}
    </SiteLayout>
  )
}

export default Home
