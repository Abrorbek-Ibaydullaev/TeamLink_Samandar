import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, X, Calendar, Users, Tag } from 'lucide-react'
import Layout from '../components/Layout'
import { projectService } from '../services/projectService'  // ADD THIS
import { workspaceService } from '../services/workspaceService'  // ADD THIS
import { useAuth } from '../context/AuthContext'  // ADD THIS

export default function CreateProject({ darkMode = true, setDarkMode }) {
  const navigate = useNavigate()
  const { workspaceId } = useParams()  // Get workspace ID from URL
  const { user } = useAuth()  // Get current user
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [workspaceMembers, setWorkspaceMembers] = useState([])  // Changed from teamMembers
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',  // Changed to hex color
    icon: '📊',  // Default icon
    is_public: false,
  })
  const [members, setMembers] = useState([])  // Member IDs to add
  const [labels, setLabels] = useState([])  // Changed from tags
  const [newLabel, setNewLabel] = useState('')

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-gray-100'

  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Indigo', value: '#6366F1' },
  ]

  const iconOptions = ['📊', '🎯', '💼', '🚀', '⭐', '🔥', '💡', '🎨', '📱', '⚡']

  // Fetch workspace members on mount
  useEffect(() => {
    const fetchWorkspaceMembers = async () => {
      if (!workspaceId) {
        setError('Workspace ID is required')
        return
      }

      try {
        const response = await workspaceService.getMembers(workspaceId)
        setWorkspaceMembers(response.data.results || response.data)
      } catch (err) {
        console.error('Error fetching members:', err)
        setError('Failed to load workspace members')
      }
    }

    fetchWorkspaceMembers()
  }, [workspaceId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  const toggleMember = (userId) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  const addLabel = () => {
    if (newLabel.trim() && !labels.some(l => l.name === newLabel.trim())) {
      labels.push({
        name: newLabel.trim(),
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)].value,
        description: ''
      })
      setLabels([...labels])
      setNewLabel('')
    }
  }

  const removeLabel = (labelToRemove) => {
    setLabels(labels.filter((label) => label.name !== labelToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
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
      // Create project
      const projectData = {
        name: formData.name,
        description: formData.description,
        color: formData.color,
        icon: formData.icon,
        is_public: formData.is_public,
      }

      console.log('Creating project:', projectData)
      const projectResponse = await projectService.create(workspaceId, projectData)
      const projectId = projectResponse.data.id

      console.log('✅ Project created:', projectId)

      // Add members if selected
      if (members.length > 0) {
        console.log('Adding members:', members)
        for (const userId of members) {
          try {
            await projectService.addMember(projectId, userId, 'member')
          } catch (memberError) {
            console.error('Error adding member:', userId, memberError)
          }
        }
      }

      // Create labels if any
      if (labels.length > 0) {
        console.log('Creating labels:', labels)
        for (const label of labels) {
          try {
            await projectService.createLabel(projectId, label)
          } catch (labelError) {
            console.error('Error creating label:', label.name, labelError)
          }
        }
      }

      // Success! Navigate to the project
      navigate(`/workspaces/${workspaceId}/projects/${projectId}`)
    } catch (err) {
      console.error('Error creating project:', err)
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error ||
                      'Failed to create project. Please try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div>
        {/* Header */}
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Project Details */}
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6`}>
                <h2 className={`text-lg md:text-xl font-semibold ${textPrimary} mb-4 md:mb-6`}>Project Details</h2>

                {/* Project Name */}
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
                  />
                </div>

                {/* Description */}
                <div className="mb-4 md:mb-6">
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
                  />
                </div>

                {/* Icon Selection */}
                <div className="mb-4 md:mb-6">
                  <label className={`block text-sm font-medium ${textPrimary} mb-3`}>
                    Project Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`w-12 h-12 rounded-xl border-2 transition text-2xl ${
                          formData.icon === icon
                            ? 'border-blue-500 bg-blue-500/10'
                            : `border-transparent ${inputBg}`
                        } hover:border-blue-400`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Theme */}
                <div className="mb-4 md:mb-6">
                  <label className={`block text-sm font-medium ${textPrimary} mb-3`}>
                    Project Color
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`relative w-full aspect-square rounded-xl border-2 transition ${
                          formData.color === color.value
                            ? 'border-blue-500 scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {formData.color === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy Setting */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_public"
                      checked={formData.is_public}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <div>
                      <p className={`text-sm font-medium ${textPrimary}`}>Public Project</p>
                      <p className={`text-xs ${textSecondary}`}>
                        Anyone in the workspace can view this project
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Labels */}
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6`}>
                <h2 className={`text-lg md:text-xl font-semibold ${textPrimary} mb-2 flex items-center gap-2`}>
                  <Tag size={20} />
                  Labels
                </h2>
                <p className={`text-xs md:text-sm ${textSecondary} mb-4`}>
                  Add labels to help organize tasks in this project
                </p>

                {/* Add Label Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLabel())}
                    placeholder="Type a label and press Enter"
                    className={`flex-1 px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} outline-none focus:border-blue-500 transition text-sm md:text-base`}
                  />
                  <button
                    type="button"
                    onClick={addLabel}
                    className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition flex-shrink-0"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Labels List */}
                {labels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {labels.map((label, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-white text-sm`}
                        style={{ backgroundColor: label.color }}
                      >
                        {label.name}
                        <button
                          type="button"
                          onClick={() => removeLabel(label.name)}
                          className="hover:text-red-200 transition"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 md:space-y-6">
              {/* Team Members */}
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6`}>
                <h2 className={`text-lg md:text-xl font-semibold ${textPrimary} mb-2 flex items-center gap-2`}>
                  <Users size={20} />
                  Team Members
                </h2>
                <p className={`text-xs md:text-sm ${textSecondary} mb-4`}>
                  Select team members for this project
                </p>

                {workspaceMembers.length === 0 ? (
                  <p className={`text-sm ${textSecondary} text-center py-4`}>
                    Loading members...
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {workspaceMembers.map((member) => (
                      <label
                        key={member.user?.id || member.id}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          members.includes(member.user?.id || member.id)
                            ? `${darkMode ? 'bg-blue-500/20' : 'bg-blue-50'} border-blue-500`
                            : `${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} border-transparent`
                        } border-2 cursor-pointer hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} transition`}
                      >
                        <input
                          type="checkbox"
                          checked={members.includes(member.user?.id || member.id)}
                          onChange={() => toggleMember(member.user?.id || member.id)}
                          className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center text-sm font-semibold`}>
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
                    ))}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6 hidden sm:block`}>
                <h2 className={`text-lg md:text-xl font-semibold ${textPrimary} mb-4`}>Preview</h2>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} relative overflow-hidden`}>
                  <div 
                    className="absolute top-0 right-0 w-24 h-24 opacity-20 rounded-full blur-2xl"
                    style={{ backgroundColor: formData.color }}
                  ></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${formData.color}20` }}
                      >
                        {formData.icon}
                      </div>
                      <h3 className={`font-semibold ${textPrimary} text-sm md:text-base`}>
                        {formData.name || 'Project Name'}
                      </h3>
                    </div>
                    <p className={`text-xs md:text-sm ${textSecondary} mb-3 line-clamp-2`}>
                      {formData.description || 'Project description will appear here'}
                    </p>
                    {members.length > 0 && (
                      <div className="flex -space-x-2">
                        {members.slice(0, 4).map((memberId) => {
                          const member = workspaceMembers.find((m) => (m.user?.id || m.id) === memberId)
                          return (
                            <div
                              key={memberId}
                              className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-xs font-semibold`}
                            >
                              {(member?.user?.first_name || member?.user?.email || 'U')[0].toUpperCase()}
                            </div>
                          )
                        })}
                        {members.length > 4 && (
                          <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-xs font-semibold`}>
                            +{members.length - 4}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-3 sticky top-24">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
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
                  className={`w-full py-3 rounded-xl ${inputBg} ${textSecondary} hover:${textPrimary} transition font-medium text-sm md:text-base disabled:opacity-50`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}