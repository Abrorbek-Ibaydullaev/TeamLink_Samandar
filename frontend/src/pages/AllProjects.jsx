import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Folder, Users, Tag, ArrowRight, Layers } from 'lucide-react'
import Layout from '../components/Layout'
import { workspaceService } from '../services/workspaceService'
import { projectService } from '../services/projectService'

export default function AllProjects({ darkMode = true, setDarkMode }) {
  const navigate = useNavigate()
  const [workspacesWithProjects, setWorkspacesWithProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'

  useEffect(() => {
    fetchAllProjects()
  }, [])

  const fetchAllProjects = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Fetch all workspaces
      const workspacesResponse = await workspaceService.getAll()
      console.log('✅ Workspaces response:', workspacesResponse)
      
      let workspacesList = []
      if (workspacesResponse.data?.results) {
        workspacesList = workspacesResponse.data.results
      } else if (Array.isArray(workspacesResponse.data)) {
        workspacesList = workspacesResponse.data
      } else if (workspacesResponse.results) {
        workspacesList = workspacesResponse.results
      } else if (Array.isArray(workspacesResponse)) {
        workspacesList = workspacesResponse
      }

      // Fetch projects for each workspace
      const workspacesWithProjectsData = await Promise.all(
        workspacesList.map(async (workspace) => {
          try {
            const projectsResponse = await projectService.getAll(workspace.id)
            let projectsList = []
            
            if (projectsResponse.data?.results) {
              projectsList = projectsResponse.data.results
            } else if (projectsResponse.data && Array.isArray(projectsResponse.data)) {
              projectsList = projectsResponse.data
            } else if (projectsResponse.results) {
              projectsList = projectsResponse.results
            } else if (Array.isArray(projectsResponse)) {
              projectsList = projectsResponse
            }

            return {
              ...workspace,
              projects: projectsList,
              projectCount: projectsList.length
            }
          } catch (err) {
            console.error(`Error fetching projects for workspace ${workspace.id}:`, err)
            return {
              ...workspace,
              projects: [],
              projectCount: 0
            }
          }
        })
      )

      setWorkspacesWithProjects(workspacesWithProjectsData)
    } catch (err) {
      console.error('❌ Error fetching projects:', err)
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error ||
                      err.message ||
                      'Failed to load projects'
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

  const totalProjects = workspacesWithProjects.reduce((sum, ws) => sum + ws.projectCount, 0)

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div>
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
            All Projects 🚀
          </h1>
          <p className={`${textSecondary} text-sm md:text-base`}>
            {totalProjects} project{totalProjects !== 1 ? 's' : ''} across {workspacesWithProjects.length} workspace{workspacesWithProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <p className="font-semibold mb-2">Error loading projects:</p>
            <p>{error}</p>
            <button 
              onClick={fetchAllProjects}
              className="mt-3 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Workspaces with Projects */}
        {workspacesWithProjects.length === 0 && !error ? (
          <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-12 text-center`}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Folder size={40} className="text-blue-400" />
            </div>
            <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>
              No workspaces yet
            </h3>
            <p className={`${textSecondary} mb-6 max-w-md mx-auto`}>
              Create a workspace to start organizing your projects
            </p>
            <button
              onClick={() => navigate('/workspaces')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition inline-flex items-center gap-2"
            >
              Go to Workspaces
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {workspacesWithProjects.map((workspace) => (
              <div
                key={workspace.id}
                className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 relative overflow-hidden`}
              >
                {/* Gradient Background Accent */}
                <div 
                  className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl"
                  style={{ backgroundColor: workspace.color || '#3B82F6' }}
                ></div>

                {/* Workspace Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg"
                      style={{ 
                        backgroundColor: `${workspace.color || '#3B82F6'}20`,
                        boxShadow: `0 0 20px ${workspace.color || '#3B82F6'}30`
                      }}
                    >
                      {workspace.icon || '📁'}
                    </div>
                    <div>
                      <h2 className={`text-xl md:text-2xl font-bold ${textPrimary} mb-1`}>
                        {workspace.name}
                      </h2>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${textSecondary} flex items-center gap-1`}>
                          <Layers size={14} />
                          {workspace.projectCount} project{workspace.projectCount !== 1 ? 's' : ''}
                        </span>
                        {workspace.member_count > 0 && (
                          <span className={`text-sm ${textSecondary} flex items-center gap-1`}>
                            <Users size={14} />
                            {workspace.member_count} member{workspace.member_count !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/workspaces/${workspace.id}/projects`)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition flex items-center gap-2 text-sm font-medium"
                  >
                    View All
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Projects Grid */}
                {workspace.projectCount === 0 ? (
                  <div className={`text-center py-12 ${textSecondary} text-sm relative`}>
                    <Folder size={32} className="mx-auto mb-3 opacity-50" />
                    <p>No projects in this workspace yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
                    {workspace.projects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => navigate(`/workspaces/${workspace.id}/projects/${project.id}`)}
                        className={`${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} backdrop-blur-xl border ${borderColor} rounded-xl p-5 hover:border-blue-500 transition-all cursor-pointer group relative overflow-hidden hover:scale-105 duration-300`}
                      >
                        {/* Project Color Accent */}
                        <div 
                          className="absolute top-0 right-0 w-24 h-24 opacity-20 rounded-full blur-2xl"
                          style={{ backgroundColor: project.color || '#3B82F6' }}
                        ></div>

                        {/* Project Header */}
                        <div className="relative">
                          <div className="flex items-start gap-3 mb-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                              style={{ backgroundColor: `${project.color || '#3B82F6'}20` }}
                            >
                              {project.icon || '📊'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-base font-semibold ${textPrimary} mb-1 group-hover:text-blue-400 transition truncate`}>
                                {project.name}
                              </h3>
                              <p className={`text-xs ${textSecondary} line-clamp-2`}>
                                {project.description || 'No description'}
                              </p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className={`flex items-center gap-3 mt-3 pt-3 border-t ${borderColor}`}>
                            <div className="flex items-center gap-1.5">
                              <Folder size={14} className={textSecondary} />
                              <span className={`text-xs ${textSecondary}`}>
                                {project.column_count || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users size={14} className={textSecondary} />
                              <span className={`text-xs ${textSecondary}`}>
                                {project.member_count || 0}
                              </span>
                            </div>
                            {project.labels && project.labels.length > 0 && (
                              <div className="flex items-center gap-1.5 ml-auto">
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}