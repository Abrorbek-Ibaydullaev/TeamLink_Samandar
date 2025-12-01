import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Grid, List, Clock, Users, CheckSquare, MoreVertical, Star } from 'lucide-react'
import Layout from '../components/Layout'

export default function Projects({ darkMode = true, setDarkMode }) {
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

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
      members: ['👩‍🎨', '👨‍💻', '👩‍💼', '👨‍🎨', '👩‍💻'],
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
      className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-blue-500/50 transition-all group relative overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br ${project.color} opacity-10 rounded-full blur-3xl`}></div>

      <div className="relative">
        <div className="flex items-start justify-between gap-2 mb-3 md:mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-semibold ${textPrimary} group-hover:text-blue-400 transition text-sm md:text-base truncate`}>
                {project.name}
              </h3>
              {project.starred && <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
            </div>
            <p className={`text-xs md:text-sm ${textSecondary} line-clamp-2`}>{project.description}</p>
          </div>
          <button
            onClick={(e) => e.preventDefault()}
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition opacity-0 group-hover:opacity-100 flex-shrink-0`}
          >
            <MoreVertical size={16} className={textSecondary} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm">
          <span className={`flex items-center gap-1 ${textSecondary}`}>
            <CheckSquare size={14} />
            <span className="whitespace-nowrap">{project.tasks.completed}/{project.tasks.total}</span>
          </span>
          <span className={`flex items-center gap-1 ${textSecondary}`}>
            <Users size={14} />
            <span className="whitespace-nowrap">{project.members.length}</span>
          </span>
          <span className={`flex items-center gap-1 ${textSecondary}`}>
            <Clock size={14} />
            <span className="whitespace-nowrap">{project.dueDate}</span>
          </span>
        </div>

        <div className="mb-3 md:mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs md:text-sm ${textSecondary}`}>Progress</span>
            <span className={`text-xs md:text-sm font-semibold ${textPrimary}`}>{project.progress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${project.color} transition-all`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.members.slice(0, 4).map((member, idx) => (
              <div
                key={idx}
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-xs md:text-sm`}
              >
                {member}
              </div>
            ))}
            {project.members.length > 4 && (
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-xs ${textSecondary}`}>
                +{project.members.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )

  const ProjectListItem = ({ project }) => (
    <Link
      to={`/board/${project.id}`}
      className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl p-4 md:p-5 hover:border-blue-500/50 transition-all group flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-6`}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0`}>
        <span className="text-2xl">{project.members[0]}</span>
      </div>

      <div className="flex-1 min-w-0 w-full sm:w-auto">
        <div className="flex items-center gap-2 mb-1">
          <h3 className={`font-semibold ${textPrimary} group-hover:text-blue-400 transition truncate text-sm md:text-base`}>
            {project.name}
          </h3>
          {project.starred && <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
        </div>
        <p className={`text-xs md:text-sm ${textSecondary} truncate`}>{project.description}</p>
      </div>

      <div className="flex sm:hidden w-full justify-between text-xs">
        <div className="text-center">
          <p className={`font-semibold ${textPrimary}`}>{project.tasks.completed}/{project.tasks.total}</p>
          <p className={textSecondary}>Tasks</p>
        </div>
        <div className="text-center">
          <p className={`font-semibold ${textPrimary}`}>{project.members.length}</p>
          <p className={textSecondary}>Team</p>
        </div>
        <div className="text-center">
          <p className={`font-semibold ${textPrimary}`}>{project.progress}%</p>
          <p className={textSecondary}>Done</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-4 md:gap-6 text-xs md:text-sm">
        <div className="text-center">
          <p className={`font-semibold ${textPrimary}`}>{project.tasks.completed}/{project.tasks.total}</p>
          <p className={`text-xs ${textSecondary}`}>Tasks</p>
        </div>
        <div className="text-center">
          <p className={`font-semibold ${textPrimary}`}>{project.members.length}</p>
          <p className={`text-xs ${textSecondary}`}>Members</p>
        </div>
        <div className="text-center min-w-[4rem]">
          <p className={`font-semibold ${textPrimary}`}>{project.progress}%</p>
          <p className={`text-xs ${textSecondary}`}>Complete</p>
        </div>
      </div>

      <div className="hidden lg:block w-24 md:w-32">
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
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>Projects</h1>
            <p className={`${textSecondary} text-sm md:text-base`}>
              Manage and track all your projects in one place
            </p>
          </div>
          <Link
            to="/create-project"
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg md:rounded-xl hover:opacity-90 transition font-medium text-sm md:text-base"
          >
            <Plus size={20} />
            New Project
          </Link>
        </div>

        {/* Filters & Search */}
        <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6`}>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor} flex-1`}>
              <Search size={18} className={textSecondary} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className={`flex-1 bg-transparent border-none outline-none ${textPrimary} text-sm md:text-base placeholder:text-gray-500`}
              />
            </div>

            {/* Filter & View Toggle */}
            <div className="flex gap-2 md:gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`flex-1 md:flex-none px-3 md:px-4 py-2 md:py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} outline-none cursor-pointer text-sm md:text-base`}
              >
                <option value="all">All Projects</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>

              <div className={`flex items-center gap-1 md:gap-2 p-1 rounded-xl ${inputBg}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-blue-500 text-white' : textSecondary}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-blue-500 text-white' : textSecondary}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length === 0 ? (
          <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-8 md:p-12 text-center`}>
            <div className="text-5xl md:text-6xl mb-4">📁</div>
            <h3 className={`text-lg md:text-xl font-semibold ${textPrimary} mb-2`}>No projects found</h3>
            <p className={`${textSecondary} mb-6 text-sm md:text-base`}>
              {searchQuery ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
            <Link
              to="/create-project"
              className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg md:rounded-xl hover:opacity-90 transition font-medium text-sm md:text-base"
            >
              <Plus size={20} />
              Create Project
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredProjects.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}