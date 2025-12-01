import React from 'react'
import { Link } from 'react-router-dom'
import { CheckSquare, Users, TrendingUp, Clock, Plus, MoreVertical, Calendar, MessageSquare, ArrowRight } from 'lucide-react'
import Layout from '../components/Layout'

export default function Dashboard({ darkMode = true, setDarkMode }) {
  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'

  const stats = [
    { label: 'Active Tasks', value: '26', change: '+12%', icon: CheckSquare, color: 'text-blue-400', bgColor: 'from-blue-500/20 to-blue-600/20' },
    { label: 'Team Members', value: '12', change: '+2', icon: Users, color: 'text-purple-400', bgColor: 'from-purple-500/20 to-purple-600/20' },
    { label: 'Projects', value: '8', change: '+3', icon: TrendingUp, color: 'text-green-400', bgColor: 'from-green-500/20 to-green-600/20' },
    { label: 'Hours Logged', value: '342', change: '+18%', icon: Clock, color: 'text-orange-400', bgColor: 'from-orange-500/20 to-orange-600/20' },
  ]

  const projects = [
    { id: 1, name: 'Website Redesign', progress: 75, tasks: 12, members: 5, color: 'from-purple-500 to-pink-500', dueDate: '2 days left' },
    { id: 2, name: 'Mobile App Development', progress: 45, tasks: 8, members: 3, color: 'from-blue-500 to-cyan-500', dueDate: '1 week left' },
    { id: 3, name: 'Marketing Campaign', progress: 90, tasks: 6, members: 4, color: 'from-green-500 to-emerald-500', dueDate: 'Due today' },
  ]

  const recentTasks = [
    { id: 1, title: 'Design homepage mockup', project: 'Website Redesign', priority: 'high', status: 'in-progress', assignee: '👩‍🎨' },
    { id: 2, title: 'Review code changes', project: 'Mobile App', priority: 'medium', status: 'review', assignee: '👨‍💻' },
    { id: 3, title: 'Update documentation', project: 'Website Redesign', priority: 'low', status: 'todo', assignee: '👩‍💼' },
    { id: 4, title: 'Bug fixes for login page', project: 'Mobile App', priority: 'high', status: 'in-progress', assignee: '👨‍💻' },
  ]

  const teamActivity = [
    { id: 1, user: '👩‍🎨 Sarah', action: 'completed', item: 'Homepage Design', time: '5 min ago' },
    { id: 2, user: '👨‍💻 Mike', action: 'commented on', item: 'API Integration', time: '23 min ago' },
    { id: 3, user: '👩‍💼 Emma', action: 'created', item: 'Marketing Task', time: '1 hour ago' },
    { id: 4, user: '👨‍💻 James', action: 'updated', item: 'Mobile App', time: '2 hours ago' },
  ]

  const priorityColors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  }

  const statusColors = {
    'in-progress': 'bg-blue-500/20 text-blue-400',
    'review': 'bg-purple-500/20 text-purple-400',
    'todo': 'bg-gray-500/20 text-gray-400',
  }

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div>
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className={`text-2xl md:text-3xl font-bold ${textPrimary} mb-2`}>
            Welcome back, Abrorbek! 👋
          </h1>
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

              <div className="space-y-3 md:space-y-4">
                {projects.map((project) => (
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
                            {project.tasks} tasks
                          </span>
                          <span className={`flex items-center gap-1 ${textSecondary}`}>
                            <Users size={14} />
                            {project.members} members
                          </span>
                          <span className={`flex items-center gap-1 ${textSecondary}`}>
                            <Clock size={14} />
                            {project.dueDate}
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
                          className={`h-full bg-gradient-to-r ${project.color} transition-all`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs md:text-sm font-semibold ${textPrimary} min-w-[3rem] text-right`}>
                        {project.progress}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                to="/projects"
                className={`block text-center mt-4 py-2 md:py-3 rounded-lg md:rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} ${textSecondary} hover:${textPrimary} transition text-sm font-medium group`}
              >
                View All Projects 
                <ArrowRight size={16} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Recent Tasks - Hidden on small mobile, visible on tablet+ */}
            <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6 hidden sm:block`}>
              <h2 className={`text-lg md:text-xl font-bold ${textPrimary} mb-4 md:mb-6`}>Recent Tasks</h2>
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
                      <div className="text-xl md:text-2xl flex-shrink-0">{task.assignee}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-lg border ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-lg ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
            <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6`}>
              <h3 className={`font-semibold ${textPrimary} mb-4 text-sm md:text-base`}>Team Activity</h3>
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
                      <p className={`text-xs ${textSecondary} mt-1`}>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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