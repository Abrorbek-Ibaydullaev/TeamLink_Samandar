import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, FolderKanban, Plus, Bell, Search, Sun, Moon, User, LogOut } from 'lucide-react'

export default function Layout({ children, darkMode, setDarkMode }) {
  const location = useLocation()
  const navigate = useNavigate()

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50'
  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    navigate('/')
  }

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/create-project', icon: Plus, label: 'New Project' },
  ]

  return (
    <div className={`${bgClass} ${textPrimary} min-h-screen transition-colors duration-300`}>
      {/* Modern Header */}
      <header className={`${cardBg} backdrop-blur-xl border-b ${borderColor} sticky top-0 z-50`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  TeamLink
                </h1>
                <p className={`text-xs ${textSecondary}`}>Collaboration Hub</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? `${darkMode ? 'bg-blue-500/20' : 'bg-blue-50'} text-blue-400`
                        : `${textSecondary} hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium hidden md:inline">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <Search size={18} className={textSecondary} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`bg-transparent border-none outline-none w-40 ${textPrimary} placeholder:text-gray-500`}
                />
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} ${textSecondary} hover:${textPrimary} transition`}
              >
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Notifications */}
              <button className={`p-2 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} ${textSecondary} hover:${textPrimary} transition relative`}>
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile with Dropdown */}
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  A
                </button>
                
                {/* Dropdown Menu */}
                <div className={`absolute right-0 mt-2 w-48 ${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all`}>
                  <div className="p-3 border-b border-gray-700">
                    <p className={`font-medium ${textPrimary}`}>Abrorbek</p>
                    <p className={`text-sm ${textSecondary}`}>{localStorage.getItem('userEmail') || 'user@email.com'}</p>
                  </div>
                  <div className="p-2">
                    <Link to="/profile" className={`flex items-center gap-2 px-3 py-2 rounded-lg ${textSecondary} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition`}>
                      <User size={16} />
                      <span className="text-sm">Profile</span>
                    </Link>
                    <button onClick={handleLogout} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg ${textSecondary} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition`}>
                      <LogOut size={16} />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className={`${cardBg} backdrop-blur-xl border-t ${borderColor} mt-20`}>
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${textSecondary}`}>
              © 2024 TeamLink. Made with ❤️ by Abrorbek
            </p>
            <div className="flex gap-6">
              <a href="#" className={`text-sm ${textSecondary} hover:${textPrimary} transition`}>Privacy</a>
              <a href="#" className={`text-sm ${textSecondary} hover:${textPrimary} transition`}>Terms</a>
              <a href="#" className={`text-sm ${textSecondary} hover:${textPrimary} transition`}>Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}