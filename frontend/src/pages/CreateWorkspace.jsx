import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import Layout from '../components/Layout'
import { workspaceService } from '../services/workspaceService'

export default function CreateWorkspace({ darkMode = true, setDarkMode }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-gray-100'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.name.trim()) {
      setError('Workspace name is required')
      setLoading(false)
      return
    }

    try {
      const response = await workspaceService.create(formData)
      
      // DRF returns the workspace object directly
      const workspace = response
      
      if (workspace && workspace.id) {
        navigate(`/workspaces/${workspace.id}/projects`)
      } else {
        throw new Error('No workspace ID in response')
      }
    } catch (err) {
      console.error('Error creating workspace:', err)
      
      let errorMsg = 'Failed to create workspace. '
      
      if (err.response?.data) {
        const data = err.response.data
        if (data.name) {
          errorMsg += `Name: ${Array.isArray(data.name) ? data.name.join(', ') : data.name}`
        } else if (data.error) {
          errorMsg += data.error
        } else if (data.detail) {
          errorMsg += data.detail
        } else {
          errorMsg += JSON.stringify(data)
        }
      } else if (err.message) {
        errorMsg += err.message
      }
      
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/workspaces')}
            className={`flex items-center gap-2 ${textSecondary} hover:${textPrimary} transition mb-4 text-sm md:text-base`}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
            Create New Workspace
          </h1>
          <p className={`${textSecondary} text-sm md:text-base`}>
            Set up a workspace to organize your projects and team
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 md:p-8`}>
            {/* Workspace Name */}
            <div className="mb-6">
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                Workspace Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Acme Inc"
                className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} outline-none focus:border-blue-500 transition`}
                required
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What is this workspace for?"
                rows="4"
                className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} outline-none focus:border-blue-500 transition resize-none`}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Workspace
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/workspaces')}
                disabled={loading}
                className={`px-6 py-3 rounded-xl ${inputBg} ${textSecondary} hover:${textPrimary} transition font-medium disabled:opacity-50`}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}