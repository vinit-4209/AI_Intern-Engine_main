"use client"

import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X } from "lucide-react" // make sure lucide-react is installed

export default function Header({ onOpenLogin, user, onLogout }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const smoothScroll = useCallback(
    (id) => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      } else {
        navigate("/", { state: { scrollTo: id } })
      }
      setMenuOpen(false) // close menu after clicking
    },
    [navigate],
  )

  const handleLoginClick = useCallback(() => {
    setMenuOpen(false)
    if (onOpenLogin) onOpenLogin()
    else navigate("/student/login")
  }, [navigate, onOpenLogin])

  const handleLogoutClick = useCallback(() => {
    setMenuOpen(false)
    if (onLogout) onLogout()
  }, [onLogout])

  const handleAdminClick = useCallback(() => {
    setMenuOpen(false)
    navigate("/admin/login")
  }, [navigate])

  const displayName = useMemo(() => {
    if (!user) return ""
    return user.name || user.company_name || user.email || user.username || "Account"
  }, [user])

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigate("/")
                setMenuOpen(false)
              }}
              className="flex items-center focus:outline-none"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">IM</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-800">InternMatch AI</span>
            </button>
            <button
              onClick={handleAdminClick}
              className="flex items-center rounded-full border border-purple-600 px-3 py-1 text-xs font-semibold text-purple-600 transition-colors hover:bg-purple-50 sm:text-sm"
            >
              Admin Portal
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => smoothScroll("features")}
              className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => smoothScroll("how-it-works")}
              className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => smoothScroll("about")}
              className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              About
            </button>
            {/* <button
              onClick={handleAdminClick}
              className="flex items-center gap-2 rounded-full border border-purple-600 px-3 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-50"
            >
              Admin Portal
            </button> */}
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Welcome, <span className="font-semibold text-gray-900">{displayName}</span>
                </span>
                <button
                  onClick={handleLogoutClick}
                  className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-700 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="flex flex-col px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => smoothScroll("features")}
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left"
            >
              Features
            </button>
            <button
              onClick={() => smoothScroll("how-it-works")}
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left"
            >
              How It Works
            </button>
            <button
              onClick={() => smoothScroll("about")}
              className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left"
            >
              About
            </button>

            {/* <button
              onClick={handleAdminClick}
              className="text-purple-600 hover:bg-purple-50 border border-purple-200 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left"
            >
              Admin Portal
            </button> */}

            <div className="border-t border-gray-200 pt-2">
              {user ? (
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold text-gray-900">{displayName}</span>
                  </span>
                  <button
                    onClick={handleLogoutClick}
                    className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
