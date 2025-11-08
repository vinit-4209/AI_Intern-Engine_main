"use client"

import { useNavigate } from "react-router-dom"

export default function Hero({ handleGetStarted }) {
  return (
    <section className="gradient-bg min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pt-10">
      <div className="max-w-7xl mx-auto w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Smart Internship Matching
          <span className="block text-yellow-300">Powered by AI</span>
        </h1>

        <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
          Connect students with perfect internship opportunities through intelligent matching, transparent
          recommendations, and data-driven insights.
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleGetStarted}
            className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Free
          </button>
        </div>

        {/* Floating AI Icons */}
        <div className="relative mt-16 flex justify-center">
          <div className="floating">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl" aria-hidden="true">🤖</span>
              <span className="sr-only">AI</span>
            </div>
          </div>

          <div className="floating absolute left-1/4 top-8" style={{ animationDelay: "1s" }}>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl" aria-hidden="true">💼</span>
              <span className="sr-only">Briefcase</span>
            </div>
          </div>

          <div className="floating absolute right-1/4 top-8" style={{ animationDelay: "2s" }}>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl" aria-hidden="true">🎯</span>
              <span className="sr-only">Target</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
