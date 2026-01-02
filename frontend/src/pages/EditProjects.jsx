import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Loader } from 'lucide-react'
import Layout from '../components/Layout'
import { projectService } from '../services/projectService'

export default function EditProject({ darkMode = true, setDarkMode }) {
  const navigate = useNavigate()
  const { workspaceId, projectId } = useParams()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📊',
    color: '#3B82F6'
  })

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-900/50' : 'bg-gray-50'

  const icons = ['📊', '🎯', '🚀', '💡', '🎨', '📱', '💻', '🔧', '📈', '🎪', '🌟', '⚡']
  const colors = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#10B981', 
    '#F59E0B', '#EF4444', '#06B6D4', '#6366F1'
  ]

  useEffect(() => {
    console.log('🔍 EditProject mounted with params:', { workspaceId, projectId })
    if (workspaceId && projectId) {
      fetchProject()
    }
  }, [workspaceId, projectId])

  const fetchProject = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('📤 Fetching project from API...')
      const response = await projectService.getById(workspaceId, projectId)
      console.log('✅ Raw API response:', response)
      
      const project = response.data?.data || response.data || response
      console.log('✅ Parsed project data:', project)
      
      const newFormData = {
        name: project.name || '',
        description: project.description || '',
        icon: project.icon || '📊',
        color: project.color || '#3B82F6'
      }
      
      console.log('✅ Setting form data to:', newFormData)
      setFormData(newFormData)
    } catch (err) {
      console.error('❌ Error fetching project:', err)
      console.error('❌ Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      setError(err.response?.data?.message || err.message || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('📝 Form submitted with data:', formData)
    
    if (!formData.name.trim()) {
      setError('Project name is required')
      return
    }

    try {
      setSaving(true)
      setError('')

      console.log('📤 Sending update request:', {
        workspaceId,
        projectId,
        data: formData
      })
      
      const response = await projectService.update(workspaceId, projectId, formData)
      console.log('✅ Update successful:', response)
      
      // Navigate back to projects list
      navigate(`/workspaces/${workspaceId}/projects`)
    } catch (err) {
      console.error('❌ Error updating project:', err)
      console.error('❌ Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error ||
                      err.response?.data?.detail ||
                      err.message ||
                      'Failed to update project'
      setError(errorMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field, value) => {
    console.log(`📝 Field "${field}" changed to:`, value)
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      console.log('📝 Updated form data:', updated)
      return updated
    })
    setError('')
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
      <div className="max-w-2xl mx-auto">
        {/* Debug Info - Remove this after testing */}
        <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-300 text-sm font-mono">
          <div className="font-bold mb-2">🐛 Debug Info:</div>
          <div>Workspace ID: {workspaceId}</div>
          <div>Project ID: {projectId}</div>
          <div>Current Name: "{formData.name}"</div>
          <div>Current Description: "{formData.description}"</div>
          <div>Icon: {formData.icon}</div>
          <div>Color: {formData.color}</div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/workspaces/${workspaceId}/projects`)}
            className={`flex items-center gap-2 ${textSecondary} hover:${textPrimary} transition mb-4`}
          >
            <ArrowLeft size={20} />
            Back to Projects
          </button>
          <h1 className={`text-3xl font-bold ${textPrimary}`}>
            Edit Project
          </h1>
          <p className={`${textSecondary} mt-2`}>
            Update your project details
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 space-y-6`}>
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <div className="font-semibold mb-1">Error:</div>
                <div>{error}</div>
              </div>
            )}

            {/* Project Name */}
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  console.log('🎯 Name input onChange fired:', e.target.value)
                  handleChange('name', e.target.value)
                }}
                onFocus={() => console.log('🎯 Name input focused')}
                className={`w-full ${inputBg} ${textPrimary} border ${borderColor} rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                placeholder="Enter project name"
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                Current value length: {formData.name.length} characters
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  console.log('🎯 Description textarea onChange fired:', e.target.value)
                  handleChange('description', e.target.value)
                }}
                onFocus={() => console.log('🎯 Description textarea focused')}
                className={`w-full ${inputBg} ${textPrimary} border ${borderColor} rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none`}
                placeholder="Enter project description"
                rows={4}
              />
              <div className="text-xs text-gray-500 mt-1">
                Current value length: {formData.description.length} characters
              </div>
            </div>

            {/* Icon Selection */}
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-3`}>
                Project Icon
              </label>
              <div className="grid grid-cols-6 gap-3">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleChange('icon', icon)}
                    className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition ${
                      formData.icon === icon
                        ? 'bg-blue-500/20 ring-2 ring-blue-500'
                        : `${inputBg} hover:bg-gray-700/50`
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-3`}>
                Project Color
              </label>
              <div className="grid grid-cols-8 gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleChange('color', color)}
                    className={`aspect-square rounded-xl transition ${
                      formData.color === color
                        ? 'ring-2 ring-offset-2 ring-offset-gray-800 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ 
                      backgroundColor: color,
                      ringColor: color
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className={`block text-sm font-medium ${textPrimary} mb-3`}>
                Preview
              </label>
              <div className={`${inputBg} border ${borderColor} rounded-xl p-6`}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${formData.color}20` }}
                  >
                    {formData.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold ${textPrimary}`}>
                      {formData.name || 'Project Name'}
                    </h3>
                    <p className={`${textSecondary} text-sm mt-1`}>
                      {formData.description || 'Project description'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/workspaces/${workspaceId}/projects`)}
                className={`flex-1 px-6 py-3 rounded-xl border ${borderColor} ${textPrimary} hover:bg-gray-700/30 transition`}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !formData.name.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}