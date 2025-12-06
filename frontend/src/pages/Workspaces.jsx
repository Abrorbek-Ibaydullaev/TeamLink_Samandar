import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Briefcase, Users, ArrowRight } from 'lucide-react'
import Layout from '../components/Layout'
import { workspaceService } from '../services/workspaceService'

export default function Workspaces({ darkMode = true, setDarkMode }) {
  const navigate = useNavigate()
  const [workspaces, setWorkspaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await workspaceService.getAll()
      console.log('✅ Workspaces response:', response)
      
      // Handle different response structures from DRF
      let workspaceList = []
      
      if (response.results) {
        // Paginated response: { results: [...], count: 10 }
        workspaceList = response.results
      } else if (Array.isArray(response)) {
        // Direct array: [...]
        workspaceList = response
      } else if (response.data) {
        // Nested data: { data: [...] }
        workspaceList = Array.isArray(response.data) ? response.data : (response.data.results || [])
      } else {
        workspaceList = []
      }
      
      console.log('✅ Parsed workspaces:', workspaceList)
      setWorkspaces(workspaceList)
    } catch (err) {
      console.error('❌ Error fetching workspaces:', err)
      
      const errorMsg = err.response?.data?.detail || 
                      err.response?.data?.error ||
                      err.message ||
                      'Failed to load workspaces'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
              Your Workspaces
            </h1>
            <p className={`${textSecondary} text-sm md:text-base`}>
              Organize projects by teams or clients
            </p>
          </div>
          <button
            onClick={() => navigate('/workspaces/create')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:opacity-90 transition flex items-center gap-2 text-sm md:text-base"
          >
            <Plus size={20} />
            New Workspace
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <p className="font-semibold mb-2">Error loading workspaces:</p>
            <p>{error}</p>
            <button 
              onClick={fetchWorkspaces}
              className="mt-3 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Workspaces Grid */}
        {workspaces.length === 0 && !error ? (
          <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-12 text-center`}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Briefcase size={40} className="text-blue-400" />
            </div>
            <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>
              No workspaces yet
            </h3>
            <p className={`${textSecondary} mb-6 max-w-md mx-auto`}>
              Create your first workspace to start organizing projects
            </p>
            <button
              onClick={() => navigate('/workspaces/create')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                onClick={() => navigate(`/workspaces/${workspace.id}/projects`)}
                className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 hover:border-blue-500 transition cursor-pointer group`}
              >
                {/* Workspace Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Briefcase size={28} className="text-white" />
                </div>

                {/* Workspace Info */}
                <h3 className={`text-lg font-semibold ${textPrimary} mb-2 group-hover:text-blue-400 transition`}>
                  {workspace.name}
                </h3>
                <p className={`text-sm ${textSecondary} mb-4 line-clamp-2`}>
                  {workspace.description || 'No description'}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <Users size={16} className={textSecondary} />
                    <span className={`text-sm ${textSecondary}`}>
                      {workspace.member_count || 0} members
                    </span>
                  </div>
                  <ArrowRight size={18} className="text-blue-400 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}