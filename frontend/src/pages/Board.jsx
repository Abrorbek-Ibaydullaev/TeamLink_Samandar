import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, MoreVertical, Calendar, MessageSquare, Paperclip, Users, Filter, Search } from 'lucide-react'

export default function Board({ darkMode = true }) {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-gray-100'

  // Mock project data
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
        {
          id: 7,
          title: 'Requirements gathering',
          description: 'Collect client requirements',
          priority: 'high',
          assignees: ['👩‍💼', '👨‍💻'],
          comments: 6,
          attachments: 5,
          dueDate: '2024-01-05',
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
    <div className={`${cardBg} backdrop-blur-xl border ${borderColor} border-l-4 ${priorityColors[task.priority]} rounded-xl p-4 mb-3 hover:shadow-lg transition-all cursor-pointer group`}>
      {/* Priority Badge */}
      <div className="flex items-start justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded ${priorityBadges[task.priority]}`}>
          {task.priority}
        </span>
        <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} opacity-0 group-hover:opacity-100 transition`}>
          <MoreVertical size={16} className={textSecondary} />
        </button>
      </div>

      {/* Task Title */}
      <h4 className={`font-semibold ${textPrimary} mb-2 group-hover:text-blue-400 transition`}>
        {task.title}
      </h4>
      <p className={`text-sm ${textSecondary} mb-3 line-clamp-2`}>
        {task.description}
      </p>

      {/* Meta Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          {task.comments > 0 && (
            <span className={`flex items-center gap-1 ${textSecondary}`}>
              <MessageSquare size={14} />
              {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className={`flex items-center gap-1 ${textSecondary}`}>
              <Paperclip size={14} />
              {task.attachments}
            </span>
          )}
          {task.dueDate && (
            <span className={`flex items-center gap-1 ${textSecondary}`}>
              <Calendar size={14} />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {/* Assignees */}
        <div className="flex -space-x-2">
          {task.assignees.map((assignee, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-xs`}
            >
              {assignee}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const Column = ({ column }) => (
    <div className={`flex-shrink-0 w-80`}>
      {/* Column Header */}
      <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl p-4 mb-4 sticky top-0`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${column.color}`}>{column.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textSecondary}`}>
              {column.tasks.length}
            </span>
          </div>
          <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}>
            <Plus size={18} className={textSecondary} />
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-0">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Add Task Button */}
      <button className={`w-full py-3 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} border-2 border-dashed ${borderColor} ${textSecondary} hover:${textPrimary} hover:border-blue-500 transition flex items-center justify-center gap-2`}>
        <Plus size={18} />
        Add Task
      </button>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 mb-6 sticky top-0 z-10`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate('/projects')}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
            >
              <ArrowLeft size={20} className={textSecondary} />
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${textPrimary} mb-1`}>
                {project.name}
              </h1>
              <p className={`text-sm ${textSecondary}`}>{project.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Team Members */}
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

            {/* Actions */}
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}>
              <Filter size={20} className={textSecondary} />
            </button>
            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}>
              <MoreVertical size={20} className={textSecondary} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor} mt-4`}>
          <Search size={18} className={textSecondary} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className={`flex-1 bg-transparent border-none outline-none ${textPrimary}`}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-6 min-w-max">
          {columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}

          {/* Add Column */}
          <div className="flex-shrink-0 w-80">
            <button className={`w-full h-32 rounded-xl border-2 border-dashed ${borderColor} ${textSecondary} hover:${textPrimary} hover:border-blue-500 transition flex flex-col items-center justify-center gap-2`}>
              <Plus size={24} />
              <span className="font-medium">Add Column</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}