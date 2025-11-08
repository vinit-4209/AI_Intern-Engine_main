export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-gray-50 min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Simple steps to connect talent with opportunity
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="text-center bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-white font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Create Profile
            </h3>
            <p className="text-gray-600">
              Students upload resumes and set preferences. Employers post internship requirements and company details.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-white font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI Analysis</h3>
            <p className="text-gray-600">
              Our intelligent system analyzes skills, experience, and preferences to find perfect matches with detailed
              explanations.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-white font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Connect &amp; Grow</h3>
            <p className="text-gray-600">
              Get matched with ideal opportunities or candidates. Provide feedback to improve future recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
