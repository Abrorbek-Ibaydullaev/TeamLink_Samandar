import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Users, FolderKanban, CheckCircle, Plus, Calendar, MessageSquare, ArrowRight } from 'lucide-react'
import Layout from '../components/Layout'
import { projectService } from '../services/projectService'

export default function Dashboard({ darkMode = true, setDarkMode }) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeTasks: 0,
    teamMembers: 0,
    projects: 0,
    completedTasks: 0,
    activeTasksChange: '+0%',
    teamMembersChange: '+0',
    projectsChange: '+0',
    completedChange: '+0%'
  })
  const [activeProjects, setActiveProjects] = useState([])
  const [user, setUser] = useState({
    name: '',
    email: ''
  })

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'

  useEffect(() => {
    fetchDashboardData()
    // Get user info
    const userEmail = localStorage.getItem('userEmail') || 'admin@gmail.com'
    const userName = localStorage.getItem('userName') || localStorage.getItem('userEmail')?.split('@')[0] || 'User'
    setUser({ name: userName, email: userEmail })
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching dashboard data...')
      
      // Test token first
      const token = localStorage.getItem('access_token')
      console.log('Token exists:', !!token)
      
      if (!token) {
        console.error('❌ No token found! User might not be logged in.')
        window.location.href = '/login'
        return
      }
      
      try {
        // Fetch dashboard stats
        console.log('📊 Fetching dashboard stats...')
        const statsData = await projectService.getDashboardStats()
        console.log('✅ Dashboard stats:', statsData)
        
        setStats({
          activeTasks: statsData.active_tasks || 0,
          teamMembers: statsData.team_members || 0,
          projects: statsData.projects || 0,
          completedTasks: statsData.completed_tasks || 0,
          activeTasksChange: statsData.active_tasks_change || '+0%',
          teamMembersChange: statsData.team_members_change || '+0',
          projectsChange: statsData.projects_change || '+0',
          completedChange: statsData.completed_change || '+0%'
        })
        
        // Fetch active projects
        console.log('📋 Fetching active projects...')
        const projectsData = await projectService.getActiveProjects()
        console.log('✅ Active projects:', projectsData)
        setActiveProjects(Array.isArray(projectsData) ? projectsData : [])
        
      } catch (apiError) {
        console.error('❌ API Error:', apiError)
        console.error('Error response:', apiError.response?.data)
        console.error('Error status:', apiError.response?.status)
        
        // Fallback to zero data if API fails
        setStats({
          activeTasks: 0,
          teamMembers: 0,
          projects: 0,
          completedTasks: 0,
          activeTasksChange: '+0%',
          teamMembersChange: '+0',
          projectsChange: '+0',
          completedChange: '+0%'
        })
        setActiveProjects([])
      }
      
    } catch (error) {
      console.error('❌ Error in fetchDashboardData:', error)
    } finally {
      setLoading(false)
    }
  }


  const fetchFallbackData = async () => {
    try {
      // Fetch user's workspaces
      const workspaces = await projectService.getAllWorkspaces?.() || []
      
      let totalTasks = 0
      let totalCompleted = 0
      let totalMembers = 0
      const projectsList = []
      
      // For each workspace, fetch projects and tasks
      for (const workspace of workspaces) {
        try {
          const projects = await projectService.getAll?.(workspace.id) || []
          
          for (const project of projects) {
            projectsList.push(project)
            
            // Fetch tasks for this project
            const tasks = await projectService.getAllProjectTasks?.(workspace.id, project.id) || []
            totalTasks += tasks.length
            totalCompleted += tasks.filter(task => task.status === 'done').length
            
            // Fetch members for this project
            const members = await projectService.getMembers?.(workspace.id, project.id) || []
            totalMembers += members.length
          }
        } catch (error) {
          console.error(`Error fetching data for workspace ${workspace.id}:`, error)
        }
      }
      
      setStats(prev => ({
        ...prev,
        activeTasks: totalTasks - totalCompleted,
        teamMembers: totalMembers,
        projects: projectsList.length,
        completedTasks: totalCompleted
      }))
      
      setActiveProjects(projectsList.slice(0, 5)) // Show first 5 projects
      
    } catch (error) {
      console.error('Error in fallback data fetching:', error)
    }
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
      {/* Hero Welcome Section */}
      <div className={`${cardBg} border ${borderColor} rounded-2xl p-8 mb-8`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>
              TeamLink <span className={`text-lg ${textSecondary}`}>Collaboration Hub</span>
            </h1>
            <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>
              Welcome back, {user.name}! 🎉
            </h2>
            <p className={`${textSecondary}`}>{user.email}</p>
            <p className={`${textSecondary} mt-2`}>Here's what's happening with your projects today</p>
          </div>
          <Link
            to="/workspaces"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Go to Workspaces
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Tasks */}
        <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <TrendingUp size={24} className="text-blue-400" />
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${stats.activeTasksChange?.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {stats.activeTasksChange}
            </span>
          </div>
          <h3 className={`text-3xl font-bold ${textPrimary} mb-1`}>{stats.activeTasks}</h3>
          <p className={`${textSecondary} text-sm`}>Active Tasks</p>
        </div>

        {/* Team Members */}
        <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <Users size={24} className="text-purple-400" />
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${stats.teamMembersChange?.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {stats.teamMembersChange}
            </span>
          </div>
          <h3 className={`text-3xl font-bold ${textPrimary} mb-1`}>{stats.teamMembers}</h3>
          <p className={`${textSecondary} text-sm`}>Team Members</p>
        </div>

        {/* Projects */}
        <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <FolderKanban size={24} className="text-green-400" />
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${stats.projectsChange?.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {stats.projectsChange}
            </span>
          </div>
          <h3 className={`text-3xl font-bold ${textPrimary} mb-1`}>{stats.projects}</h3>
          <p className={`${textSecondary} text-sm`}>Projects</p>
        </div>

        {/* Completed */}
        <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-yellow-500/10">
              <CheckCircle size={24} className="text-yellow-400" />
            </div>
            <span className={`text-sm px-2 py-1 rounded-full ${stats.completedChange?.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {stats.completedChange}
            </span>
          </div>
          <h3 className={`text-3xl font-bold ${textPrimary} mb-1`}>{stats.completedTasks}</h3>
          <p className={`${textSecondary} text-sm`}>Completed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Projects Section */}
        <div className="lg:col-span-2">
          <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Active Projects</h3>
              <Link to="/workspaces" className={`flex items-center gap-1 text-sm ${textSecondary} hover:${textPrimary}`}>
                View All Projects <ArrowRight size={16} />
              </Link>
            </div>
            
            <p className={`${textSecondary} mb-4`}>Track your project progress</p>
            
            {activeProjects.length > 0 ? (
              <div className="space-y-4">
                {activeProjects.map(project => (
                  <div key={project.id} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} border ${borderColor}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${textPrimary} mb-1`}>{project.name}</h4>
                        <p className={`text-sm ${textSecondary}`}>
                          {project.description || 'No description'}
                        </p>
                      </div>
                      <Link 
                        to={`/workspaces/${project.workspace}/projects/${project.id}`}
                        className="px-3 py-1 text-sm bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                      >
                        Open
                      </Link>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <span className={`${textSecondary}`}>
                        📅 Created: {new Date(project.created_at).toLocaleDateString()}
                      </span>
                      <span className={`${textSecondary}`}>
                        👥 {project.members_count || 0} members
                      </span>
                      <span className={`${textSecondary}`}>
                        ✅ {project.tasks_count || 0} tasks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700/30 flex items-center justify-center">
                  <FolderKanban size={24} className={textSecondary} />
                </div>
                <p className={`${textSecondary} mb-4`}>No active projects yet.</p>
                <Link 
                  to="/workspaces" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Plus size={16} />
                  Create your first project
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div>
          <div className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
            <h3 className={`text-xl font-bold ${textPrimary} mb-6`}>Quick Actions</h3>
            
            <div className="space-y-3">
              <Link 
                to="/create-project" 
                className={`flex items-center gap-3 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} border ${borderColor} hover:border-blue-500 transition`}
              >
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Plus size={20} className="text-blue-400" />
                </div>
                <div>
                  <h4 className={`font-medium ${textPrimary}`}>New Project</h4>
                  <p className={`text-sm ${textSecondary}`}>Start something new</p>
                </div>
              </Link>

              <button className={`w-full flex items-center gap-3 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} border ${borderColor} hover:border-purple-500 transition`}>
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Calendar size={20} className="text-purple-400" />
                </div>
                <div className="text-left">
                  <h4 className={`font-medium ${textPrimary}`}>Schedule Meeting</h4>
                  <p className={`text-sm ${textSecondary}`}>Plan with your team</p>
                </div>
              </button>

              <button className={`w-full flex items-center gap-3 p-4 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} border ${borderColor} hover:border-green-500 transition`}>
                <div className="p-2 rounded-lg bg-green-500/10">
                  <MessageSquare size={20} className="text-green-400" />
                </div>
                <div className="text-left">
                  <h4 className={`font-medium ${textPrimary}`}>Team Chat</h4>
                  <p className={`text-sm ${textSecondary}`}>3 new messages</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}