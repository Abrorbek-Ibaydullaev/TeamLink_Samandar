import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Users } from 'lucide-react'
import Layout from '../components/Layout'
import { projectService } from '../services/projectService'
import { workspaceService } from '../services/workspaceService'

export default function CreateProject({ darkMode = true, setDarkMode }) {
  const navigate = useNavigate()
  const { workspaceId } = useParams()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workspaceMembers, setWorkspaceMembers] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })
  const [members, setMembers] = useState([])

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-gray-100'

  useEffect(() => {
    const fetchWorkspaceMembers = async () => {
      if (!workspaceId) {
        setError('Workspace ID is required')
        return
      }

      try {
        const response = await workspaceService.getMembers(workspaceId)
        const membersList = response.data || response
        setWorkspaceMembers(Array.isArray(membersList) ? membersList : [])
      } catch (err) {
        console.error('Error fetching members:', err)
        setError('Failed to load workspace members')
      }
    }

    fetchWorkspaceMembers()
  }, [workspaceId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ 
      ...formData, 
      [name]: value
    })
  }

  const toggleMember = (userId) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.name.trim()) {
      setError('Project name is required')
      setLoading(false)
      return
    }

    if (!workspaceId) {
      setError('Workspace ID is required')
      setLoading(false)
      return
    }

    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        workspace: workspaceId,
      }

      console.log('Creating project:', projectData)
      const projectResponse = await projectService.create(workspaceId, projectData)
      const projectId = projectResponse.id

      console.log('✅ Project created:', projectId)

      if (members.length > 0) {
        console.log('Adding members:', members)
        for (const userId of members) {
          try {
            await projectService.addMember(projectId, userId)
          } catch (memberError) {
            console.error('Error adding member:', userId, memberError)
          }
        }
      }

      navigate(`/workspaces/${workspaceId}/projects/${projectId}`)
    } catch (err) {
      console.error('Error creating project:', err)
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error ||
                      err.response?.data?.detail ||
                      'Failed to create project. Please try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div>
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 ${textSecondary} hover:${textPrimary} transition mb-4 text-sm md:text-base`}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>Create New Project</h1>
          <p className={`${textSecondary} text-sm md:text-base`}>
            Set up your project details and invite team members
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6`}>
                <h2 className={`text-lg md:text-xl font-semibold ${textPrimary} mb-4 md:mb-6`}>Project Details</h2>

                <div className="mb-4 md:mb-6">
                  <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Website Redesign"
                    className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} outline-none focus:border-blue-500 transition text-sm md:text-base`}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-6">
                  <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What is this project about?"
                    rows="4"
                    className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} outline-none focus:border-blue-500 transition resize-none text-sm md:text-base`}
                    disabled={loading}
                  />
                </div>

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
                        Create Project
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl ${inputBg} ${textSecondary} hover:${textPrimary} transition font-medium disabled:opacity-50`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6`}>
                <h2 className={`text-lg md:text-xl font-semibold ${textPrimary} mb-2 flex items-center gap-2`}>
                  <Users size={20} />
                  Team Members
                </h2>
                <p className={`text-xs md:text-sm ${textSecondary} mb-4`}>
                  Add members to this project
                </p>

                {workspaceMembers.length === 0 ? (
                  <p className={`text-sm ${textSecondary} text-center py-4`}>
                    No members available
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {workspaceMembers.map((member) => {
                      const memberId = member.user?.id || member.id
                      return (
                        <label
                          key={memberId}
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            members.includes(memberId)
                              ? `${darkMode ? 'bg-blue-500/20' : 'bg-blue-50'} border border-blue-500`
                              : `${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} border border-transparent`
                          } cursor-pointer hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} transition`}
                        >
                          <input
                            type="checkbox"
                            checked={members.includes(memberId)}
                            onChange={() => toggleMember(memberId)}
                            className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
                            disabled={loading}
                          />
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center text-sm font-semibold flex-shrink-0`}>
                              {(member.user?.first_name || member.user?.email || 'U')[0].toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-medium ${textPrimary} truncate`}>
                                {member.user?.first_name && member.user?.last_name
                                  ? `${member.user.first_name} ${member.user.last_name}`
                                  : member.user?.email}
                              </p>
                              <p className={`text-xs ${textSecondary} truncate capitalize`}>
                                {member.role}
                              </p>
                            </div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}
