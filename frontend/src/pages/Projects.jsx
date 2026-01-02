import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Folder, ArrowLeft, Users, Tag, MoreVertical, Edit2, Archive, Trash2 } from 'lucide-react'
import Layout from '../components/Layout'
import { projectService } from '../services/projectService'
import { workspaceService } from '../services/workspaceService'

export default function Projects({ darkMode = true, setDarkMode }) {
  const navigate = useNavigate()
  const { workspaceId } = useParams()
  const [workspace, setWorkspace] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeMenu, setActiveMenu] = useState(null)
  const [archiving, setArchiving] = useState(null)

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceAndProjects()
    } else {
      setError('No workspace ID provided')
      setLoading(false)
    }
  }, [workspaceId])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null)
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [activeMenu])

  const fetchWorkspaceAndProjects = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('📤 Fetching workspace:', workspaceId)
      
      // Fetch workspace details
      const workspaceResponse = await workspaceService.getById(workspaceId)
      console.log('✅ Workspace response:', workspaceResponse)
      
      const workspaceData = workspaceResponse.data?.data || workspaceResponse.data || workspaceResponse
      setWorkspace(workspaceData)
      console.log('✅ Workspace set:', workspaceData)

      // Fetch projects
      console.log('📤 Fetching projects for workspace:', workspaceId)
      const projectsResponse = await projectService.getAll(workspaceId)
      console.log('✅ Projects response:', projectsResponse)
      
      // Handle different response structures
      let projectsList = []
      
      if (projectsResponse.data?.results) {
        projectsList = projectsResponse.data.results
      } else if (projectsResponse.data && Array.isArray(projectsResponse.data)) {
        projectsList = projectsResponse.data
      } else if (projectsResponse.results) {
        projectsList = projectsResponse.results
      } else if (Array.isArray(projectsResponse)) {
        projectsList = projectsResponse
      } else {
        console.warn('⚠️ Unexpected projects response format:', projectsResponse)
        projectsList = []
      }
      
      console.log('✅ Parsed projects:', projectsList)
      setProjects(projectsList)
    } catch (err) {
      console.error('❌ Error fetching data:', err)
      console.error('❌ Error response:', err.response?.data)
      console.error('❌ Error status:', err.response?.status)
      
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error ||
                      err.response?.data?.detail ||
                      err.message ||
                      'Failed to load projects'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleArchiveProject = async (projectId, e) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to archive this project?')) {
      return
    }

    try {
      setArchiving(projectId)
      await projectService.archive(workspaceId, projectId)
      
      // Remove from list or refetch
      setProjects(projects.filter(p => p.id !== projectId))
      setActiveMenu(null)
      
      // Show success message (you can add a toast notification here)
      console.log('✅ Project archived successfully')
    } catch (err) {
      console.error('❌ Error archiving project:', err)
      alert(err.response?.data?.message || 'Failed to archive project')
    } finally {
      setArchiving(null)
    }
  }

  const handleEditProject = (projectId, e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/workspaces/${workspaceId}/projects/${projectId}/update`)  
    setActiveMenu(null)
}

  const toggleMenu = (projectId, e) => {
    e.stopPropagation()
    setActiveMenu(activeMenu === projectId ? null : projectId)
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
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/workspaces')}
            className={`flex items-center gap-2 ${textSecondary} hover:${textPrimary} transition mb-4 text-sm md:text-base`}
          >
            <ArrowLeft size={20} />
            Back to Workspaces
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
                {workspace?.name || 'Projects'}
              </h1>
              <p className={`${textSecondary} text-sm md:text-base`}>
                {workspace?.description || 'Manage projects in this workspace'}
              </p>
            </div>
            {workspace && (
              <button
                onClick={() => navigate(`/workspaces/${workspaceId}/projects/create`)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:opacity-90 transition flex items-center gap-2 text-sm md:text-base"
              >
                <Plus size={20} />
                New Project
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <p className="font-semibold mb-2">Error loading projects:</p>
            <p>{error}</p>
            <button 
              onClick={fetchWorkspaceAndProjects}
              className="mt-3 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 && !error ? (
          <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-12 text-center`}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Folder size={40} className="text-blue-400" />
            </div>
            <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>
              No projects yet
            </h3>
            <p className={`${textSecondary} mb-6 max-w-md mx-auto`}>
              Create your first project to start organizing tasks
            </p>
            <button
              onClick={() => navigate(`/workspaces/${workspaceId}/projects/create`)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={(e) => {
                    if (e.defaultPrevented) return
                    navigate(`/workspaces/${workspaceId}/projects/${project.id}`)
                  }}
                className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 hover:border-blue-500 transition cursor-pointer group relative overflow-hidden ${
                  archiving === project.id ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {/* Color Accent */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-20 rounded-full blur-3xl"
                  style={{ backgroundColor: project.color || '#3B82F6' }}
                ></div>

                {/* Project Header */}
                <div className="relative">
                  <div className="flex items-start gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${project.color || '#3B82F6'}20` }}
                    >
                      {project.icon || '📊'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold ${textPrimary} mb-1 group-hover:text-blue-400 transition truncate`}>
                        {project.name}
                      </h3>
                      <p className={`text-sm ${textSecondary} line-clamp-2`}>
                        {project.description || 'No description'}
                      </p>
                    </div>
                    
                    {/* Menu Button */}
                    <div className="relative">
                      <button
                        onClick={(e) => toggleMenu(project.id, e)}
                        className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition opacity-0 group-hover:opacity-100`}
                      >
                        <MoreVertical size={18} className={textSecondary} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenu === project.id && (
                        <div 
                          className={`absolute right-0 top-full mt-2 w-48 ${cardBg} border ${borderColor} rounded-xl shadow-xl py-2 z-10`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleEditProject(project.id, e)}
                            className={`w-full px-4 py-2 text-left flex items-center gap-3 ${textPrimary} hover:bg-blue-500/10 transition text-sm`}
                          >
                            <Edit2 size={16} />
                            Edit Project
                          </button>
                          <button
                            onClick={(e) => handleArchiveProject(project.id, e)}
                            className={`w-full px-4 py-2 text-left flex items-center gap-3 text-orange-400 hover:bg-orange-500/10 transition text-sm`}
                          >
                            <Archive size={16} />
                            Archive Project
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <Folder size={16} className={textSecondary} />
                      <span className={`text-sm ${textSecondary}`}>
                        {project.column_count || 0} columns
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className={textSecondary} />
                      <span className={`text-sm ${textSecondary}`}>
                        {project.member_count || 0} members
                      </span>
                    </div>
                  </div>

                  {/* Labels Preview */}
                  {project.labels && project.labels.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <Tag size={14} className={textSecondary} />
                      <div className="flex gap-1">
                        {project.labels.slice(0, 3).map((label, idx) => (
                          <span
                            key={idx}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: label.color }}
                          />
                        ))}
                        {project.labels.length > 3 && (
                          <span className={`text-xs ${textSecondary}`}>
                            +{project.labels.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}