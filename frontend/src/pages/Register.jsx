import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register({ darkMode = true }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { register } = useAuth()

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50'
  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-gray-100'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setError('')
  //   setLoading(true)

  //   // Validation
  //   if (!formData.username || !formData.email || !formData.password || !formData.password2) {
  //     setError('Please fill in all required fields')
  //     setLoading(false)
  //     return
  //   }

  //   if (formData.password !== formData.password2) {
  //     setError('Passwords do not match')
  //     setLoading(false)
  //     return
  //   }

  //   if (formData.password.length < 8) {
  //     setError('Password must be at least 8 characters long')
  //     setLoading(false)
  //     return
  //   }

  //   try {
  //     await register(formData)
  //     navigate('/dashboard')
  //   } catch (err) {
  //     const errorMsg = err.response?.data?.message || 
  //                     err.response?.data?.error ||
  //                     'Registration failed. Please try again.'
  //     setError(errorMsg)
  //     console.error('Register error:', err)
  //   } finally {
  //     setLoading(false)
  //   }
  // }
const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  // Frontend validation
  if (!formData.username || !formData.email || !formData.password || !formData.password2) {
    setError('Please fill in all required fields')
    setLoading(false)
    return
  }

  if (formData.password !== formData.password2) {
    setError('Passwords do not match')
    setLoading(false)
    return
  }

  if (formData.password.length < 8) {
    setError('Password must be at least 8 characters long')
    setLoading(false)
    return
  }

  try {
    // Map to Django's expected field names
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      password_confirm: formData.password2,  // Django expects password_confirm
      full_name: `${formData.first_name} ${formData.last_name}`.trim()  // Combine to full_name
    }
    
    await register(userData)
    navigate('/dashboard')
  } catch (err) {
    console.error('Register error:', err)
    
    if (err.response?.data) {
      const errorData = err.response.data
      
      if (typeof errorData === 'object') {
        const errorMessages = Object.entries(errorData)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(', ')}`
            }
            return `${field}: ${messages}`
          })
          .join('\n')
        setError(errorMessages)
      } else if (errorData.message) {
        setError(errorData.message)
      } else if (errorData.error) {
        setError(errorData.error)
      } else {
        setError('Registration failed. Please try again.')
      }
    } else {
      setError('Registration failed. Please check your connection.')
    }
  } finally {
    setLoading(false)
  }
}

  return (
    <div className={`${bgClass} min-h-screen flex items-center justify-center p-4`}>
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-8 md:p-12 w-full max-w-md relative z-10 shadow-2xl`}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className={`${textSecondary}`}>Join TeamLink today</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
              Username *
            </label>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor} focus-within:border-blue-500 transition`}>
              <User size={20} className={textSecondary} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className={`flex-1 bg-transparent border-none outline-none ${textPrimary} placeholder:text-gray-500`}
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
              Email Address *
            </label>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor} focus-within:border-blue-500 transition`}>
              <Mail size={20} className={textSecondary} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`flex-1 bg-transparent border-none outline-none ${textPrimary} placeholder:text-gray-500`}
                disabled={loading}
              />
            </div>
          </div>

          {/* First Name */}
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
              First Name
            </label>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor} focus-within:border-blue-500 transition`}>
              <User size={20} className={textSecondary} />
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                className={`flex-1 bg-transparent border-none outline-none ${textPrimary} placeholder:text-gray-500`}
                disabled={loading}
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
              Last Name
            </label>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor} focus-within:border-blue-500 transition`}>
              <User size={20} className={textSecondary} />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className={`flex-1 bg-transparent border-none outline-none ${textPrimary} placeholder:text-gray-500`}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
              Password *
            </label>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor} focus-within:border-blue-500 transition`}>
              <Lock size={20} className={textSecondary} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`flex-1 bg-transparent border-none outline-none ${textPrimary} placeholder:text-gray-500`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`${textSecondary} hover:${textPrimary} transition`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
              Confirm Password *
            </label>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor} focus-within:border-blue-500 transition`}>
              <Lock size={20} className={textSecondary} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                placeholder="••••••••"
                className={`flex-1 bg-transparent border-none outline-none ${textPrimary} placeholder:text-gray-500`}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <p className={`text-center mt-8 ${textSecondary}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}