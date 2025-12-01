import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, Calendar, Users, Tag } from 'lucide-react'
import Layout from '../components/Layout'

export default function CreateProject({ darkMode = true, setDarkMode }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    color: 'from-blue-500 to-purple-500',
  })
  const [members, setMembers] = useState([])
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-gray-100'

  const colorOptions = [
    { name: 'Blue Purple', value: 'from-blue-500 to-purple-500' },
    { name: 'Purple Pink', value: 'from-purple-500 to-pink-500' },
    { name: 'Green Emerald', value: 'from-green-500 to-emerald-500' },
    { name: 'Orange Red', value: 'from-orange-500 to-red-500' },
    { name: 'Cyan Blue', value: 'from-cyan-500 to-blue-500' },
    { name: 'Pink Rose', value: 'from-pink-500 to-rose-500' },
  ]

  const teamMembers = [
    { id: 1, name: 'Sarah Johnson', role: 'Designer', avatar: '👩‍🎨' },
    { id: 2, name: 'Mike Chen', role: 'Developer', avatar: '👨‍💻' },
    { id: 3, name: 'Emma Davis', role: 'Manager', avatar: '👩‍💼' },
    { id: 4, name: 'James Wilson', role: 'Developer', avatar: '👨‍💻' },
    { id: 5, name: 'Lisa Anderson', role: 'Designer', avatar: '👩‍🎨' },
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleMember = (memberId) => {
    setMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    )
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      navigate('/projects')
    }, 1500)
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

                {/* Due Date & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 md:mb-6">
                  <div>
                    <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                      <Calendar size={16} className="inline mr-1" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} outline-none focus:border-blue-500 transition text-sm md:text-base`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textPrimary} mb-2`}>
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} outline-none focus:border-blue-500 transition cursor-pointer text-sm md:text-base`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Color Theme */}
                <div>
                  <label className={`block text-sm font-medium ${textPrimary} mb-3`}>
                    Project Color Theme
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`relative p-3 md:p-4 rounded-xl border-2 transition ${
                          formData.color === color.value
                            ? 'border-blue-500'
                            : `border-transparent ${darkMode ? 'hover:border-gray-600' : 'hover:border-gray-300'}`
                        }`}
                      >
                        <div className={`h-10 md:h-12 rounded-lg bg-gradient-to-r ${color.value}`}></div>
                        <p className={`text-xs ${textSecondary} mt-2 text-center`}>{color.name}</p>
                        {formData.color === color.value && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6`}>
                <h2 className={`text-lg md:text-xl font-semibold ${textPrimary} mb-2 flex items-center gap-2`}>
                  <Tag size={20} />
                  Tags
                </h2>
                <p className={`text-xs md:text-sm ${textSecondary} mb-4`}>
                  Add tags to help organize and categorize this project
                </p>

                {/* Add Tag Input */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Type a tag and press Enter"
                    className={`flex-1 px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} outline-none focus:border-blue-500 transition text-sm md:text-base`}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition flex-shrink-0"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {/* Tags List */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${darkMode ? 'bg-blue-500/20' : 'bg-blue-50'} text-blue-400 text-sm`}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-400 transition"
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

                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <label
                      key={member.id}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        members.includes(member.id)
                          ? `${darkMode ? 'bg-blue-500/20' : 'bg-blue-50'} border-blue-500`
                          : `${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} border-transparent`
                      } border-2 cursor-pointer hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} transition`}
                    >
                      <input
                        type="checkbox"
                        checked={members.includes(member.id)}
                        onChange={() => toggleMember(member.id)}
                        className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xl md:text-2xl flex-shrink-0">{member.avatar}</span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium ${textPrimary} truncate`}>{member.name}</p>
                          <p className={`text-xs ${textSecondary} truncate`}>{member.role}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6 hidden sm:block`}>
                <h2 className={`text-lg md:text-xl font-semibold ${textPrimary} mb-4`}>Preview</h2>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${formData.color} opacity-20 rounded-full blur-2xl`}></div>
                  <div className="relative">
                    <h3 className={`font-semibold ${textPrimary} mb-2 text-sm md:text-base`}>
                      {formData.name || 'Project Name'}
                    </h3>
                    <p className={`text-xs md:text-sm ${textSecondary} mb-3 line-clamp-2`}>
                      {formData.description || 'Project description will appear here'}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-1 rounded ${
                        formData.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        formData.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {formData.priority} priority
                      </span>
                    </div>
                    {members.length > 0 && (
                      <div className="flex -space-x-2">
                        {members.slice(0, 4).map((memberId) => {
                          const member = teamMembers.find((m) => m.id === memberId)
                          return (
                            <div
                              key={memberId}
                              className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-sm`}
                            >
                              {member.avatar}
                            </div>
                          )
                        })}
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
                  className={`w-full py-3 rounded-xl ${inputBg} ${textSecondary} hover:${textPrimary} transition font-medium text-sm md:text-base`}
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