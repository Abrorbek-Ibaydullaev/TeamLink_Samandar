import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, MoreVertical, Calendar, MessageSquare, Paperclip, Users, Filter, Search, X } from 'lucide-react'
import Layout from '../components/Layout'
import { projectService } from '../services/projectService'
import axios from '../api/axios'

export default function Board({ darkMode = true, setDarkMode }) {
  const { workspaceId, projectId } = useParams()
  const navigate = useNavigate()
  
  const [project, setProject] = useState(null)
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  // Modal states
  const [showAddColumn, setShowAddColumn] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [newColumnName, setNewColumnName] = useState('')
  const [newColumnColor, setNewColumnColor] = useState('#3B82F6')
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  })

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-gray-100'

  useEffect(() => {
    fetchProjectData()
  }, [workspaceId, projectId])

  const fetchProjectData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch project details
      const projectResponse = await projectService.getById(workspaceId, projectId)
      const projectData = projectResponse.data?.data || projectResponse.data || projectResponse
      setProject(projectData)

      // Fetch columns
      const columnsResponse = await axios.get(`/workspaces/${workspaceId}/projects/${projectId}/columns/`)
      
      let columnsList = []
      if (columnsResponse.data?.data) {
        columnsList = columnsResponse.data.data
      } else if (columnsResponse.data?.results) {
        columnsList = columnsResponse.data.results
      } else if (Array.isArray(columnsResponse.data)) {
        columnsList = columnsResponse.data
      }

      // Fetch tasks for each column
      const columnsWithTasks = await Promise.all(
        columnsList.map(async (column) => {
          try {
            const tasksResponse = await axios.get(`/workspaces/${workspaceId}/projects/${projectId}/columns/${column.id}/tasks/`)
            let tasksList = []
            
            if (tasksResponse.data?.data) {
              tasksList = tasksResponse.data.data
            } else if (tasksResponse.data?.results) {
              tasksList = tasksResponse.data.results
            } else if (Array.isArray(tasksResponse.data)) {
              tasksList = tasksResponse.data
            }

            return { ...column, tasks: tasksList }
          } catch (err) {
            return { ...column, tasks: [] }
          }
        })
      )

      setColumns(columnsWithTasks)
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load project'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return

    try {
      const responseData = await projectService.createColumn(workspaceId, projectId, {
        name: newColumnName,
        color: newColumnColor,
        position: columns.length
      })

      const newColumn = responseData?.data?.data || responseData?.data || responseData
      setColumns([...columns, { ...newColumn, tasks: [] }])
      setNewColumnName('')
      setNewColumnColor('#3B82F6')
      setShowAddColumn(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create column')
    }
  }

  const handleAddTask = async () => {
    if (!newTaskData.title.trim() || !selectedColumn) return

    try {

      const responseData = await projectService.createTask(workspaceId, projectId, selectedColumn.id, {
        title: newTaskData.title,
        description: newTaskData.description,
        priority: newTaskData.priority,
        due_date: newTaskData.due_date || null,
        position: selectedColumn.tasks?.length || 0
      })

      const newTask = responseData?.data?.data || responseData?.data || responseData

      // Update columns state
      setColumns(columns.map(col => 
        col.id === selectedColumn.id 
          ? { ...col, tasks: [...(col.tasks || []), newTask] }
          : col
      ))

      // Reset form
      setNewTaskData({ title: '', description: '', priority: 'medium', due_date: '' })
      setShowAddTask(false)
      setSelectedColumn(null)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task')
    }
  }

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

  const getColumnColor = (index) => {
    const colors = ['text-gray-400', 'text-blue-400', 'text-purple-400', 'text-green-400', 'text-orange-400', 'text-pink-400']
    return colors[index % colors.length]
  }

  const TaskCard = ({ task }) => (
    <div className={`${cardBg} backdrop-blur-xl border ${borderColor} border-l-4 ${priorityColors[task.priority] || priorityColors.medium} rounded-xl p-3 md:p-4 mb-3 hover:shadow-lg transition-all cursor-pointer group`}>
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <span className={`text-xs px-2 py-1 rounded ${priorityBadges[task.priority] || priorityBadges.medium}`}>
          {task.priority || 'medium'}
        </span>
        <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} opacity-0 group-hover:opacity-100 transition`}>
          <MoreVertical size={14} className={textSecondary} />
        </button>
      </div>

      <h4 className={`font-semibold ${textPrimary} mb-2 group-hover:text-blue-400 transition text-sm md:text-base`}>
        {task.title}
      </h4>
      {task.description && (
        <p className={`text-xs md:text-sm ${textSecondary} mb-3 line-clamp-2`}>
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 text-xs">
          {task.comment_count > 0 && (
            <span className={`flex items-center gap-1 ${textSecondary}`}>
              <MessageSquare size={12} />
              {task.comment_count}
            </span>
          )}
          {task.attachment_count > 0 && (
            <span className={`flex items-center gap-1 ${textSecondary}`}>
              <Paperclip size={12} />
              {task.attachment_count}
            </span>
          )}
          {task.due_date && (
            <span className={`flex items-center gap-1 ${textSecondary} hidden sm:flex`}>
              <Calendar size={12} />
              {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>

        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-1 md:-space-x-2">
            {task.assignees.slice(0, 3).map((assignee, idx) => (
              <div
                key={idx}
                className={`w-5 h-5 md:w-6 md:h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-xs`}
                title={assignee.full_name || assignee.email}
              >
                {assignee.avatar || assignee.full_name?.charAt(0).toUpperCase() || '👤'}
              </div>
            ))}
            {task.assignees.length > 3 && (
              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-xs ${textSecondary}`}>
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  const Column = ({ column, index }) => (
    <div className={`flex-shrink-0 w-72 md:w-80`}>
      <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl p-3 md:p-4 mb-4 sticky top-0`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${getColumnColor(index)} text-sm md:text-base`}>
              {column.name || column.title}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textSecondary}`}>
              {column.tasks?.length || 0}
            </span>
          </div>
          <button 
            onClick={() => {
              setSelectedColumn(column)
              setShowAddTask(true)
            }}
            className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
          >
            <Plus size={16} className={textSecondary} />
          </button>
        </div>
      </div>

      <div className="space-y-0">
        {column.tasks && column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className={`text-center py-8 ${textSecondary} text-xs`}>
            No tasks yet
          </div>
        )}
      </div>

      <button 
        onClick={() => {
          setSelectedColumn(column)
          setShowAddTask(true)
        }}
        className={`w-full py-2 md:py-3 rounded-xl ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'} border-2 border-dashed ${borderColor} ${textSecondary} hover:${textPrimary} hover:border-blue-500 transition flex items-center justify-center gap-2 text-sm`}
      >
        <Plus size={16} />
        Add Task
      </button>
    </div>
  )

  if (loading) {
    return (
      <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <p className="font-semibold mb-2">Error loading project:</p>
          <p>{error}</p>
          <button onClick={fetchProjectData} className="mt-3 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition text-sm">
            Try Again
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div>
        {/* Header */}
        <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6 sticky top-0 z-10`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 md:gap-4">
              <button onClick={() => navigate(`/workspaces/${workspaceId}/projects`)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition flex-shrink-0`}>
                <ArrowLeft size={20} className={textSecondary} />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className={`text-xl md:text-2xl font-bold ${textPrimary} mb-1 truncate`}>
                  {project?.name}
                </h1>
                <p className={`text-xs md:text-sm ${textSecondary} truncate`}>
                  {project?.description || 'No description'}
                </p>
              </div>
              <button onClick={() => setShowMobileMenu(!showMobileMenu)} className={`md:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}>
                <MoreVertical size={20} className={textSecondary} />
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex-1 flex items-center gap-3">
                <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl ${inputBg} border ${borderColor}`}>
                  <Search size={18} className={textSecondary} />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tasks..." className={`flex-1 bg-transparent border-none outline-none ${textPrimary}`} />
                </div>
                <button className={`p-3 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}>
                  <Filter size={20} className={textSecondary} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-3 md:gap-6 min-w-max">
            {columns.length > 0 ? (
              <>
                {columns.map((column, index) => (
                  <Column key={column.id} column={column} index={index} />
                ))}
                <div className="flex-shrink-0 w-72 md:w-80">
                  <button onClick={() => setShowAddColumn(true)} className={`w-full h-32 rounded-xl border-2 border-dashed ${borderColor} ${textSecondary} hover:${textPrimary} hover:border-blue-500 transition flex flex-col items-center justify-center gap-2`}>
                    <Plus size={20} />
                    <span className="font-medium text-sm">Add Column</span>
                  </button>
                </div>
              </>
            ) : (
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-12 text-center w-full`}>
                <p className={`${textSecondary} mb-4`}>No columns yet. Create your first column to get started!</p>
                <button onClick={() => setShowAddColumn(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition inline-flex items-center gap-2">
                  <Plus size={20} />
                  Create Column
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Add Column Modal */}
        {showAddColumn && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} rounded-2xl p-6 w-full max-w-md`}>
              <h3 className={`text-xl font-bold ${textPrimary} mb-4`}>Add New Column</h3>
              <input type="text" value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} placeholder="Column name" className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3`} />
              <input type="color" value={newColumnColor} onChange={(e) => setNewColumnColor(e.target.value)} className="w-full h-12 rounded-xl mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setShowAddColumn(false)} className={`flex-1 px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textPrimary}`}>Cancel</button>
                <button onClick={handleAddColumn} className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">Create</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} rounded-2xl p-6 w-full max-w-md`}>
              <h3 className={`text-xl font-bold ${textPrimary} mb-4`}>Add Task to {selectedColumn?.name}</h3>
              <input type="text" value={newTaskData.title} onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})} placeholder="Task title" className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3`} />
              <textarea value={newTaskData.description} onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})} placeholder="Description" className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3 h-24`} />
              <select value={newTaskData.priority} onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value})} className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3`}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input type="date" value={newTaskData.due_date} onChange={(e) => setNewTaskData({...newTaskData, due_date: e.target.value})} className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-4`} />
              <div className="flex gap-3">
                <button onClick={() => { setShowAddTask(false); setSelectedColumn(null); }} className={`flex-1 px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textPrimary}`}>Cancel</button>
                <button onClick={handleAddTask} className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">Create Task</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}