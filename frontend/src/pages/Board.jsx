import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, MoreVertical, Calendar, MessageSquare, Paperclip, Users, Filter, Search, X } from 'lucide-react'
import Layout from '../components/Layout'

export default function Board({ darkMode = true, setDarkMode }) {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-gray-100'

  const project = {
    id: projectId,
    name: 'Website Redesign',
    description: 'Complete overhaul of company website',
    members: ['👩‍🎨', '👨‍💻', '👩‍💼', '👨‍🎨'],
  }

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'text-gray-400',
      tasks: [
        {
          id: 1,
          title: 'Create wireframes',
          description: 'Design initial wireframes for homepage',
          priority: 'medium',
          assignees: ['👩‍🎨'],
          comments: 3,
          attachments: 2,
          dueDate: '2024-01-15',
        },
        {
          id: 2,
          title: 'Research competitors',
          description: 'Analyze competitor websites',
          priority: 'low',
          assignees: ['👨‍💻', '👩‍💼'],
          comments: 1,
          attachments: 0,
          dueDate: '2024-01-20',
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'text-blue-400',
      tasks: [
        {
          id: 3,
          title: 'Design homepage mockup',
          description: 'Create high-fidelity mockup',
          priority: 'high',
          assignees: ['👩‍🎨', '👨‍🎨'],
          comments: 5,
          attachments: 4,
          dueDate: '2024-01-12',
        },
        {
          id: 4,
          title: 'Setup development environment',
          description: 'Configure React and Tailwind',
          priority: 'high',
          assignees: ['👨‍💻'],
          comments: 2,
          attachments: 1,
          dueDate: '2024-01-10',
        },
      ],
    },
    {
      id: 'review',
      title: 'Review',
      color: 'text-purple-400',
      tasks: [
        {
          id: 5,
          title: 'Color palette selection',
          description: 'Finalize brand colors',
          priority: 'medium',
          assignees: ['👩‍💼', '👩‍🎨'],
          comments: 8,
          attachments: 3,
          dueDate: '2024-01-08',
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      color: 'text-green-400',
      tasks: [
        {
          id: 6,
          title: 'Project kickoff meeting',
          description: 'Initial team meeting',
          priority: 'high',
          assignees: ['👩‍💼'],
          comments: 12,
          attachments: 2,
          dueDate: '2024-01-01',
        },
      ],
    },
  ]

  const priorityColors = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500',
  }

  const priorityBadges = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-green-500/20 text-green-400',
  }

  const TaskCard = ({ task }) => (
    <div className={`${cardBg} backdrop-blur-xl border ${borderColor} border-l-4 ${priorityColors[task.priority]} rounded-xl p-3 md:p-4 mb-3 hover:shadow-lg transition-all cursor-pointer group`}>
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <span className={`text-xs px-2 py-1 rounded ${priorityBadges[task.priority]}`}>
          {task.priority}
        </span>
        <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} opacity-0 group-hover:opacity-100 transition`}>
          <MoreVertical size={14} className={textSecondary} />
        </button>
      </div>

      <h4 className={`font-semibold ${textPrimary} mb-2 group-hover:text-blue-400 transition text-sm md:text-base`}>
        {task.title}
      </h4>
      <p className={`text-xs md:text-sm ${textSecondary} mb-3 line-clamp-2`}>
        {task.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 text-xs">
          {task.comments > 0 && (
            <span className={`flex items-center gap-1 ${textSecondary}`}>
              <MessageSquare size={12} md:size={14} />
              {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className={`flex items-center gap-1 ${textSecondary}`}>
              <Paperclip size={12} md:size={14} />
              {task.attachments}
            </span>
          )}
          {task.dueDate && (
            <span className={`flex items-center gap-1 ${textSecondary} hidden sm:flex`}>
              <Calendar size={12} md:size={14} />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        <div className="flex -space-x-1 md:-space-x-2">
          {task.assignees.map((assignee, idx) => (
            <div
              key={idx}
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-xs`}
            >
              {assignee}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const Column = ({ column }) => (
    <div className={`flex-shrink-0 w-72 md:w-80`}>
      <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl p-3 md:p-4 mb-4 sticky top-0`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${column.color} text-sm md:text-base`}>{column.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textSecondary}`}>
              {column.tasks.length}
            </span>
          </div>
          <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}>
            <Plus size={16} className={textSecondary} />
          </button>
        </div>
      </div>

      <div className="space-y-0">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <button className={`w-full py-2 md:py-3 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} border-2 border-dashed ${borderColor} ${textSecondary} hover:${textPrimary} hover:border-blue-500 transition flex items-center justify-center gap-2 text-sm`}>
        <Plus size={16} />
        Add Task
      </button>
    </div>
  )

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div>
        {/* Header */}
        <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 sticky top-0 z-10`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 md:gap-4">
              <button
                onClick={() => navigate('/projects')}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition flex-shrink-0`}
              >
                <ArrowLeft size={20} className={textSecondary} />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className={`text-xl md:text-2xl font-bold ${textPrimary} mb-1 truncate`}>
                  {project.name}
                </h1>
                <p className={`text-xs md:text-sm ${textSecondary} truncate`}>{project.description}</p>
              </div>

              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`md:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
              >
                <MoreVertical size={20} className={textSecondary} />
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex -space-x-2">
                {project.members.map((member, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center cursor-pointer hover:scale-110 transition`}
                  >
                    {member}
                  </div>
                ))}
                <button className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center ${textSecondary} hover:${textPrimary} hover:scale-110 transition`}>
                  <Plus size={18} />
                </button>
              </div>

              <div className="flex-1 flex items-center gap-3">
                <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor}`}>
                  <Search size={18} className={textSecondary} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className={`flex-1 bg-transparent border-none outline-none ${textPrimary}`}
                  />
                </div>

                <button className={`p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}>
                  <Filter size={20} className={textSecondary} />
                </button>
              </div>
            </div>

            {/* Mobile Search (when menu open) */}
            {showMobileMenu && (
              <div className="md:hidden space-y-3">
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor}`}>
                  <Search size={18} className={textSecondary} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className={`flex-1 bg-transparent border-none outline-none ${textPrimary} text-sm`}
                  />
                </div>
                <div className="flex -space-x-2">
                  {project.members.map((member, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center`}
                    >
                      {member}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kanban Board - Horizontal Scroll on Mobile */}
        <div className="overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-3 md:gap-6 min-w-max">
            {columns.map((column) => (
              <Column key={column.id} column={column} />
            ))}

            {/* Add Column */}
            <div className="flex-shrink-0 w-72 md:w-80">
              <button className={`w-full h-32 rounded-xl border-2 border-dashed ${borderColor} ${textSecondary} hover:${textPrimary} hover:border-blue-500 transition flex flex-col items-center justify-center gap-2`}>
                <Plus size={20} md:size={24} />
                <span className="font-medium text-sm">Add Column</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Hint */}
        <div className="md:hidden mt-4 text-center">
          <p className={`text-xs ${textSecondary}`}>
            👆 Swipe left/right to view all columns
          </p>
        </div>
      </div>
    </Layout>
  )
}