import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Grid, List, Clock, Users, CheckSquare, MoreVertical, Star, Archive } from 'lucide-react'

export default function Projects({ darkMode = true }) {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'active', 'archived'

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-gray-100'

  const allProjects = [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design',
      progress: 75,
      tasks: { total: 12, completed: 9 },
      members: [
'👩‍🎨', '👨‍💻', '👩‍💼', '👨‍🎨', '👩‍💻'],
      color: 'from-purple-500 to-pink-500',
      dueDate: '2 days',
      status: 'active',
      starred: true,
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'iOS and Android app for customer engagement',
      progress: 45,
      tasks: { total: 8, completed: 4 },
      members: ['👨‍💻', '👩‍💻', '👨‍🎨'],
      color: 'from-blue-500 to-cyan-500',
      dueDate: '1 week',
      status: 'active',
      starred: false,
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      description: 'Q4 marketing strategy and content creation',
      progress: 90,
      tasks: { total: 6, completed: 5 },
      members: ['👩‍💼', '👨‍💼', '👩‍🎨', '👨‍🎨'],
      color: 'from-green-500 to-emerald-500',
      dueDate: 'Today',
      status: 'active',
      starred: true,
    },
    {
      id: 4,
      name: 'API Integration',
      description: 'Third-party API integration for payment processing',
      progress: 30,
      tasks: { total: 10, completed: 3 },
      members: ['👨‍💻', '👩‍💻'],
      color: 'from-orange-500 to-red-500',
      dueDate: '2 weeks',
      status: 'active',
      starred: false,
    },
    {
      id: 5,
      name: 'Database Migration',
      description: 'Migrate from MySQL to PostgreSQL',
      progress: 100,
      tasks: { total: 5, completed: 5 },
      members: ['👨‍💻', '👩‍💻', '👨‍💼'],
      color: 'from-gray-500 to-gray-600',
      dueDate: 'Completed',
      status: 'archived',
      starred: false,
    },
    {
      id: 6,
      name: 'Brand Guidelines',
      description: 'Create comprehensive brand style guide',
      progress: 60,
      tasks: { total: 7, completed: 4 },
      members: ['👩‍🎨', '👨‍🎨', '👩‍💼'],
      color: 'from-pink-500 to-rose-500',
      dueDate: '5 days',
      status: 'active',
      starred: false,
    },
  ]

  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const ProjectCard = ({ project }) => (
    <Link
      to={`/board/${project.id}`}
      className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 hover:border-blue-500/50 transition-all group relative overflow-hidden`}
    >
      {/* Gradient Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${project.color} opacity-10 rounded-full blur-3xl`}></div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-semibold ${textPrimary} group-hover:text-blue-400 transition`}>
                {project.name}
              </h3>
              {project.starred && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
            </div>
            <p className={`text-sm ${textSecondary} line-clamp-2`}>{project.description}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              // Handle menu
            }}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition opacity-0 group-hover:opacity-100`}
          >
            <MoreVertical size={18} className={textSecondary} />
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <span className={`flex items-center gap-1 ${textSecondary}`}>
            <CheckSquare size={16} />
            {project.tasks.completed}/{project.tasks.total}
          </span>
          <span className={`flex items-center gap-1 ${textSecondary}`}>
            <Users size={16} />
            {project.members.length}
          </span>
          <span className={`flex items-center gap-1 ${textSecondary}`}>
            <Clock size={16} />
            {project.dueDate}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${textSecondary}`}>Progress</span>
            <span className={`text-sm font-semibold ${textPrimary}`}>{project.progress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${project.color} transition-all`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Members */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members.slice(0, 4).map((member, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-sm`}
              >
                {member}
              </div>
            ))}
            {project.members.length > 4 && (
              <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-xs ${textSecondary}`}>
                +{project.members.length - 4}
              </div>
            )}
          </div>
          {project.status === 'archived' && (
            <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${textSecondary}`}>
              Archived
            </span>
          )}
        </div>
      </div>
    </Link>
  )

  const ProjectListItem = ({ project }) => (
    <Link
      to={`/board/${project.id}`}
      className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl p-5 hover:border-blue-500/50 transition-all group flex items-center gap-6`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0`}>
        <span className="text-2xl">{project.members[0]}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`font-semibold ${textPrimary} group-hover:text-blue-400 transition truncate`}>
            {project.name}
          </h3>
          {project.starred && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
        </div>
        <p className={`text-sm ${textSecondary} truncate`}>{project.description}</p>
      </div>

      {/* Stats */}
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className={`font-semibold ${textPrimary}`}>{project.tasks.completed}/{project.tasks.total}</p>
          <p className={`text-xs ${textSecondary}`}>Tasks</p>
        </div>
        <div className="text-center">
          <p className={`font-semibold ${textPrimary}`}>{project.members.length}</p>
          <p className={`text-xs ${textSecondary}`}>Members</p>
        </div>
        <div className="text-center min-w-[5rem]">
          <p className={`font-semibold ${textPrimary}`}>{project.progress}%</p>
          <p className={`text-xs ${textSecondary}`}>Complete</p>
        </div>
      </div>

      {/* Progress */}
      <div className="hidden lg:block w-32">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${project.color}`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
    </Link>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>Projects</h1>
          <p className={`${textSecondary}`}>
            Manage and track all your projects in one place
          </p>
        </div>
        <Link
          to="/create-project"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition font-medium"
        >
          <Plus size={20} />
          New Project
        </Link>
      </div>

      {/* Filters & Search */}
      <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-6 mb-6`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor} flex-1`}>
            <Search size={20} className={textSecondary} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className={`flex-1 bg-transparent border-none outline-none ${textPrimary}`}
            />
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} outline-none cursor-pointer`}
          >
            <option value="all">All Projects</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          {/* View Toggle */}
          <div className={`flex items-center gap-2 p-1 rounded-xl ${inputBg}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-blue-500 text-white' : textSecondary}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-500 text-white' : textSecondary}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-12 text-center`}>
          <div className="text-6xl mb-4">📁</div>
          <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>No projects found</h3>
          <p className={`${textSecondary} mb-6`}>
            {searchQuery ? 'Try a different search term' : 'Create your first project to get started'}
          </p>
          <Link
            to="/create-project"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition font-medium"
          >
            <Plus size={20} />
            Create Project
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}