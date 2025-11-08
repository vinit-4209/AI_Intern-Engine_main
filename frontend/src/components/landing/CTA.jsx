"use client"

export default function CTA({ handleGetStarted }) {
  return (
    <section className="py-20 gradient-bg">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your Internship Experience?
        </h2>
        <p className="text-xl text-purple-100 mb-8">
          Join thousands of students and employers who trust InternMatch AI for intelligent career connections.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGetStarted}
            className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
          >
            Start Matching Today
          </button>
        </div>
      </div>
    </section>
  )
}
