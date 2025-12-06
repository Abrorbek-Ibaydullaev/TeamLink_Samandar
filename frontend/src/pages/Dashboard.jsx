import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckSquare, Users, TrendingUp, Clock, Plus, MoreVertical, Calendar, MessageSquare, ArrowRight } from 'lucide-react'
import Layout from '../components/Layout'
import axios from '../api/axios'

export default function Dashboard({ darkMode = true, setDarkMode }) {
  const [user, setUser] = useState(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Fetch dashboard data from backend
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/projects/dashboard/')
        setDashboardData(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message)
        // Continue with empty state, don't fail completely
        setDashboardData(null)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'

  // Get user name from localStorage, fallback to 'User'
  const userName = user?.full_name || user?.email?.split('@')[0] || 'User'

  // Use API data if available, otherwise use fallback
  const stats = dashboardData ? [
    { label: 'Active Tasks', value: dashboardData.stats?.active_tasks || '0', change: '+12%', icon: CheckSquare, color: 'text-blue-400', bgColor: 'from-blue-500/20 to-blue-600/20' },
    { label: 'Team Members', value: dashboardData.stats?.team_members || '0', change: '+2', icon: Users, color: 'text-purple-400', bgColor: 'from-purple-500/20 to-purple-600/20' },
    { label: 'Projects', value: dashboardData.stats?.projects || '0', change: '+3', icon: TrendingUp, color: 'text-green-400', bgColor: 'from-green-500/20 to-green-600/20' },
    { label: 'Completed', value: dashboardData.stats?.completed_tasks || '0', change: '+18%', icon: Clock, color: 'text-orange-400', bgColor: 'from-orange-500/20 to-orange-600/20' },
  ] : [
    { label: 'Active Tasks', value: '0', change: '+12%', icon: CheckSquare, color: 'text-blue-400', bgColor: 'from-blue-500/20 to-blue-600/20' },
    { label: 'Team Members', value: '0', change: '+2', icon: Users, color: 'text-purple-400', bgColor: 'from-purple-500/20 to-purple-600/20' },
    { label: 'Projects', value: '0', change: '+3', icon: TrendingUp, color: 'text-green-400', bgColor: 'from-green-500/20 to-green-600/20' },
    { label: 'Completed', value: '0', change: '+18%', icon: Clock, color: 'text-orange-400', bgColor: 'from-orange-500/20 to-orange-600/20' },
  ]

  const projects = dashboardData?.active_projects || []
  const recentTasks = dashboardData?.active_tasks || []
  const teamActivity = dashboardData?.recent_activity || []

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  }

  const statusColors = {
    'in-progress': 'bg-blue-500/20 text-blue-400',
    'review': 'bg-purple-500/20 text-purple-400',
    'todo': 'bg-gray-500/20 text-gray-400',
    'done': 'bg-green-500/20 text-green-400',
  }

  const getProjectProgress = (project) => {
    // Calculate progress based on tasks in project
    if (project.tasks_count === 0) return 0
    const completedTasks = (project.tasks || []).filter(t => t.status === 'done').length
    return Math.round((completedTasks / project.tasks_count) * 100)
  }

  const getRandomColor = (index) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-red-500 to-orange-500',
      'from-indigo-500 to-purple-500',
    ]
    return colors[index % colors.length]
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = date - now
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    if (diffDays <= 7) return `${diffDays} days left`
    return date.toLocaleDateString()
  }

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div>
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
            Welcome back, {userName}! 👋
          </h1>
          {user?.email && (
            <p className={`${textSecondary} text-xs md:text-sm mb-2`}>
              {user.email}
            </p>
          )}
          <p className={`${textSecondary} text-sm md:text-base`}>
            Here's what's happening with your projects today
          </p>
        </div>

        {/* Stats Grid - Mobile Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6 hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center mb-3 md:mb-4`}>
                  <Icon className={stat.color} size={20} />
                </div>
                <p className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-1`}>{stat.value}</p>
                <p className={`text-xs md:text-sm ${textSecondary} mb-1 md:mb-2`}>{stat.label}</p>
                <span className="text-green-400 text-xs md:text-sm font-medium">{stat.change}</span>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Projects Column */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Active Projects */}
            <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
                <div>
                  <h2 className={`text-lg md:text-xl font-bold ${textPrimary} mb-1`}>Active Projects</h2>
                  <p className={`text-xs md:text-sm ${textSecondary}`}>Track your project progress</p>
                </div>
                <Link
                  to="/create-project"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg md:rounded-xl hover:opacity-90 transition text-sm font-medium w-full sm:w-auto"
                >
                  <Plus size={18} />
                  <span className="sm:inline">New Project</span>
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className={`text-center py-8 ${textSecondary}`}>
                  <p className="text-sm">No active projects yet. Create one to get started!</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {projects.map((project, idx) => {
                    const progress = getProjectProgress(project)
                    const color = getRandomColor(idx)
                    return (
                      <Link
                        key={project.id}
                        to={`/board/${project.id}`}
                        className={`block p-4 md:p-5 rounded-lg md:rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} border ${borderColor} hover:border-blue-500/50 transition-all group`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 md:mb-4">
                          <div className="flex-1">
                            <h3 className={`font-semibold ${textPrimary} mb-2 group-hover:text-blue-400 transition text-sm md:text-base`}>
                              {project.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
                              <span className={`flex items-center gap-1 ${textSecondary}`}>
                                <CheckSquare size={14} />
                                {project.tasks_count || 0} tasks
                              </span>
                              <span className={`flex items-center gap-1 ${textSecondary}`}>
                                <Users size={14} />
                                {project.members_count || 0} members
                              </span>
                              <span className={`flex items-center gap-1 ${textSecondary}`}>
                                <Clock size={14} />
                                {formatDate(project.end_date) || 'No deadline'}
                              </span>
                            </div>
                          </div>
                          <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} transition opacity-0 sm:group-hover:opacity-100 self-end sm:self-start`}>
                            <MoreVertical size={18} className={textSecondary} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${color} transition-all`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs md:text-sm font-semibold ${textPrimary} min-w-[3rem] text-right`}>
                            {progress}%
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}

              <Link
                to="/projects"
                className={`block text-center mt-4 py-2 md:py-3 rounded-lg md:rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} ${textSecondary} hover:${textPrimary} transition text-sm font-medium group`}
              >
                View All Projects 
                <ArrowRight size={16} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Recent Tasks - Hidden on small mobile, visible on tablet+ */}
            {recentTasks.length > 0 && (
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6 hidden sm:block`}>
                <h2 className={`text-lg md:text-xl font-bold ${textPrimary} mb-4 md:mb-6`}>Your Active Tasks</h2>
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 md:p-4 rounded-lg md:rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} transition cursor-pointer group`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${textPrimary} mb-1 group-hover:text-blue-400 transition text-sm md:text-base truncate`}>
                            {task.title}
                          </p>
                          <p className={`text-xs md:text-sm ${textSecondary} truncate`}>{task.project}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {task.priority && (
                          <span className={`text-xs px-2 py-1 rounded-lg border ${priorityColors[task.priority] || priorityColors.medium}`}>
                            {task.priority}
                          </span>
                        )}
                        {task.status && (
                          <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[task.status] || statusColors.todo}`}>
                            {task.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Quick Actions */}
            <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6`}>
              <h3 className={`font-semibold ${textPrimary} mb-4 text-sm md:text-base`}>Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/create-project"
                  className={`flex items-center gap-3 p-3 rounded-lg md:rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} transition`}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Plus className="text-blue-400" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${textPrimary} truncate`}>New Project</p>
                    <p className={`text-xs ${textSecondary} truncate`}>Start something new</p>
                  </div>
                </Link>

                <button className={`w-full flex items-center gap-3 p-3 rounded-lg md:rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} transition`}>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-purple-400" size={20} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className={`text-sm font-medium ${textPrimary} truncate`}>Schedule Meeting</p>
                    <p className={`text-xs ${textSecondary} truncate`}>Plan with your team</p>
                  </div>
                </button>

                <button className={`w-full flex items-center gap-3 p-3 rounded-lg md:rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} transition`}>
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="text-green-400" size={20} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className={`text-sm font-medium ${textPrimary} truncate`}>Team Chat</p>
                    <p className={`text-xs ${textSecondary} truncate`}>3 new messages</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Team Activity */}
            {teamActivity.length > 0 && (
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6`}>
                <h3 className={`font-semibold ${textPrimary} mb-4 text-sm md:text-base`}>Recent Activity</h3>
                <div className="space-y-4">
                  {teamActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs md:text-sm ${textPrimary}`}>
                          <span className="font-medium">{activity.user}</span>
                          {' '}{activity.action}{' '}
                          <span className="text-blue-400 truncate inline-block max-w-[150px] align-bottom">{activity.item}</span>
                        </p>
                        <p className={`text-xs ${textSecondary} mt-1`}>
                          {activity.created_at ? new Date(activity.created_at).toLocaleString() : 'Recently'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upgrade Card - Hidden on mobile */}
            <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 hidden md:block`}>
              <div className="text-4xl mb-3">🚀</div>
              <h3 className={`font-semibold ${textPrimary} mb-2 text-sm md:text-base`}>Upgrade to Pro</h3>
              <p className={`text-xs md:text-sm ${textSecondary} mb-4`}>
                Unlock unlimited projects, advanced analytics, and priority support
              </p>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
