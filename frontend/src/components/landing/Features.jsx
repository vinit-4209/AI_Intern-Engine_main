export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced AI technology that revolutionizes how students find internships and how companies discover talent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="feature-card bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <span className="text-2xl text-white" aria-hidden="true">
                🧠
              </span>
              <span className="sr-only">Smart Profile Matching</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Profile Matching</h3>
            <p className="text-gray-600">
              AI analyzes student resumes, skills, and preferences to suggest the most relevant internship opportunities
              with precision.
            </p>
          </div>

          <div className="feature-card bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-xl">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
              <span className="text-2xl text-white" aria-hidden="true">
                📊
              </span>
              <span className="sr-only">Employer Dashboard</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Employer Dashboard</h3>
            <p className="text-gray-600">
              Comprehensive dashboard for recruiters to view and manage ranked candidate lists with detailed insights
              and analytics.
            </p>
          </div>

          <div className="feature-card bg-gradient-to-br from-purple-50 to-violet-100 p-8 rounded-xl">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
              <span className="text-2xl text-white" aria-hidden="true">
                🔍
              </span>
              <span className="sr-only">Explainable Results</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Explainable Results</h3>
            <p className="text-gray-600">
              Transparent, data-driven reasoning behind each recommendation ensures trust and fairness in the matching
              process.
            </p>
          </div>

          <div className="feature-card bg-gradient-to-br from-orange-50 to-red-100 p-8 rounded-xl">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6">
              <span className="text-2xl text-white" aria-hidden="true">
                📈
              </span>
              <span className="sr-only">Feedback-Driven Learning</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Feedback-Driven Learning</h3>
            <p className="text-gray-600">
              Continuous improvement through feedback mechanisms that enhance recommendation accuracy over time.
            </p>
          </div>

          <div className="feature-card bg-gradient-to-br from-teal-50 to-cyan-100 p-8 rounded-xl">
            <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-6">
              <span className="text-2xl text-white" aria-hidden="true">
                👥
              </span>
              <span className="sr-only">Dual User Interface</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Dual User Interface</h3>
            <p className="text-gray-600">
              Seamless experience for both students seeking internships and recruiters looking for top talent.
            </p>
          </div>

          <div className="feature-card bg-gradient-to-br from-pink-50 to-rose-100 p-8 rounded-xl">
            <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-6">
              <span className="text-2xl text-white" aria-hidden="true">
                ⚡
              </span>
              <span className="sr-only">Intelligent Engine</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Intelligent Engine</h3>
            <p className="text-gray-600">
              Advanced recommendation algorithms that understand context, preferences, and career goals for optimal
              matching.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
