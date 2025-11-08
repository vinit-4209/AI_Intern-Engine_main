export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">IM</span>
              </div>
              <span className="text-xl font-bold">InternMatch AI</span>
            </div>
            <p className="text-gray-400">Intelligent internship matching powered by advanced AI technology.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Find Internships
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Build Profile
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Career Resources
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Post Internships
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Find Talent
                </a>
              </li>
             
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 InternMatch AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
