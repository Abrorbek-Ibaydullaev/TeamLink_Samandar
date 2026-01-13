import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, MoreVertical, Calendar, MessageSquare, Paperclip, Users, Filter, Search, X } from 'lucide-react'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  const [activeId, setActiveId] = useState(null)
  
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

  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [editTaskData, setEditTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    due_date: '',
    assignee_id: null
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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

      const projectResponse = await projectService.getById(workspaceId, projectId)
      const projectData = projectResponse.data?.data || projectResponse.data || projectResponse
      setProject(projectData)

      const columnsResponse = await axios.get(`/workspaces/${workspaceId}/projects/${projectId}/columns/`)
      
      let columnsList = []
      if (columnsResponse.data?.data) {
        columnsList = columnsResponse.data.data
      } else if (columnsResponse.data?.results) {
        columnsList = columnsResponse.data.results
      } else if (Array.isArray(columnsResponse.data)) {
        columnsList = columnsResponse.data
      }

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
      // determine initial status from the column name when applicable
      const normalize = (s) => (s || '').toString().toLowerCase().replace(/[-_\s]/g, '')
      const colName = normalize(selectedColumn.name || selectedColumn.title)
      let initialStatus = null
      if (['todo'].includes(colName)) initialStatus = 'todo'
      if (['inprogress', 'in-progress', 'in progress'].includes(colName)) initialStatus = 'in-progress'
      if (['done', 'completed'].includes(colName)) initialStatus = 'done'

      const payload = {
        title: newTaskData.title,
        description: newTaskData.description,
        priority: newTaskData.priority,
        due_date: newTaskData.due_date || null,
        position: selectedColumn.tasks?.length || 0
      }
      if (initialStatus) payload.status = initialStatus

      const responseData = await projectService.createTask(workspaceId, projectId, selectedColumn.id, payload)

      const newTask = responseData?.data?.data || responseData?.data || responseData

      setColumns(columns.map(col => 
        col.id === selectedColumn.id 
          ? { ...col, tasks: [...(col.tasks || []), newTask] }
          : col
      ))

      setNewTaskData({ title: '', description: '', priority: 'medium', due_date: '' })
      setShowAddTask(false)
      setSelectedColumn(null)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task')
    }
  }

  const handleUpdateTask = async () => {
    if (!selectedTask) return
    if (!editTaskData.title || !editTaskData.title.trim()) {
      alert('Title is required')
      return
    }

    if (!selectedTask.id) {
      console.error('handleUpdateTask called but selectedTask.id is missing', selectedTask)
      alert('No task selected to update')
      return
    }

    const columnId = (selectedTask.column && typeof selectedTask.column === 'object')
      ? selectedTask.column.id
      : selectedTask.column
    // Map status to column if a matching column name exists (move between columns)
    const normalize = (s) => (s || '').toString().toLowerCase().replace(/[-_\s]/g, '')
    const statusToNames = {
      'todo': ['todo', 'todo', 'todo'],
      'in-progress': ['inprogress', 'in-progress', 'in progress'],
      'done': ['done', 'completed']
    }

    let targetColumnId = columnId
    try {
      const normalizedStatus = normalize(editTaskData.status)
      for (const [statusKey, nameVariants] of Object.entries(statusToNames)) {
        if (normalizedStatus === normalize(statusKey)) {
          const found = columns.find(c => nameVariants.some(v => normalize(c.name) === normalize(v)))
          if (found) {
            targetColumnId = found.id
          }
          break
        }
      }
    } catch (e) {
      console.debug('Status-to-column mapping failed', e)
    }

    console.debug('Updating task', { workspaceId, projectId, columnId, taskId: selectedTask.id, payload: editTaskData })

    try {
      const responseData = await projectService.updateTask(
        workspaceId,
        projectId,
        columnId,
        selectedTask.id,
        editTaskData
      )

      const updatedTask = responseData?.data?.data || responseData?.data || responseData

      setColumns(columns.map(col => ({
        ...col,
        tasks: (col.tasks || []).map(task => (
          task.id === selectedTask.id ? updatedTask : task
        ))
      })))

      setShowTaskDetail(false)
      setSelectedTask(null)
    } catch (err) {
      console.error('Failed to update task', err.response?.data || err.message || err)
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Failed to update task'
      alert(msg)
    }
  }

  const handleDeleteTask = async () => {
    if (!selectedTask || !window.confirm('Are you sure you want to delete this task?')) return

    try {
      await projectService.deleteTask(
        workspaceId, 
        projectId, 
        selectedTask.column, 
        selectedTask.id
      )

      setColumns(columns.map(col => ({
        ...col,
        tasks: col.tasks.filter(task => task.id !== selectedTask.id)
      })))

      setShowTaskDetail(false)
      setSelectedTask(null)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task')
    }
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    if (activeId === overId) return

    // Parse IDs: format is "task-{taskId}" or "column-{columnId}"
    const isActiveTask = activeId.startsWith('task-')

    if (!isActiveTask) return // Only allow dragging tasks

    const taskId = parseInt(activeId.replace('task-', ''))
    
    // Find the task and its current column
    let taskToMove = null
    let sourceColumnId = null
    
    for (const column of columns) {
      const task = column.tasks.find(t => t.id === taskId)
      if (task) {
        taskToMove = task
        sourceColumnId = column.id
        break
      }
    }

    if (!taskToMove) return

    // Determine target column and position
    let targetColumnId = null
    const isOverTask = overId.startsWith('task-')

    if (isOverTask) {
      // Drop over another task - find which column contains it
      const overTaskId = parseInt(overId.replace('task-', ''))
      for (const column of columns) {
        if (column.tasks.some(t => t.id === overTaskId)) {
          targetColumnId = column.id
          break
        }
      }
    } else if (overId.startsWith('column-')) {
      // Drop directly over a column
      targetColumnId = parseInt(overId.replace('column-', ''))
    }

    if (!targetColumnId) return

    // Get target column info to determine new status
    const targetColumn = columns.find(c => c.id === targetColumnId)
    if (!targetColumn) return

    // Determine new status based on target column name
    const normalize = (s) => (s || '').toString().toLowerCase().replace(/[-_\s]/g, '')
    const colName = normalize(targetColumn.name || targetColumn.title)
    let newStatus = taskToMove.status
    
    if (['todo'].includes(colName)) newStatus = 'todo'
    else if (['inprogress', 'in-progress', 'in progress'].includes(colName)) newStatus = 'in-progress'
    else if (['done', 'completed'].includes(colName)) newStatus = 'done'

    // Optimistically update UI - move task to new column with new status
    const newColumns = columns.map(col => ({
      ...col,
      tasks: col.tasks.filter(t => t.id !== taskId)
    }))

    // Add task to target column with updated status
    const targetColIndex = newColumns.findIndex(c => c.id === targetColumnId)
    if (targetColIndex !== -1) {
      newColumns[targetColIndex].tasks.push({ ...taskToMove, status: newStatus })
    }

    setColumns(newColumns)

    // Update on backend
    try {
      await projectService.updateTask(
        workspaceId,
        projectId,
        sourceColumnId,
        taskId,
        { status: newStatus }
      )
    } catch (err) {
      console.error('Failed to update task status:', err)
      // Revert on error by reloading
      await fetchProjectData()
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

  const TaskCard = ({ task }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: `task-${task.id}` })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }

    const handleCardClick = (e) => {
      // Prevent opening edit modal if drag is in progress
      if (isDragging) return
      
      setSelectedTask(task)
      setEditTaskData({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        due_date: task.due_date || '',
        assignee_id: task.assignee?.id || null
      })
      setShowTaskDetail(true)
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleCardClick}
        className={`${cardBg} backdrop-blur-xl border ${borderColor} border-l-4 ${priorityColors[task.priority] || priorityColors.medium} rounded-xl p-3 md:p-4 mb-3 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing group`}
      >
        <div className="flex items-start justify-between mb-2 md:mb-3">
          <span className={`text-xs px-2 py-1 rounded ${priorityBadges[task.priority] || priorityBadges.medium}`}>
            {task.priority || 'medium'}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation()
            }}
            className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} opacity-0 group-hover:opacity-100 transition`}
          >
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
            {task.comments_count > 0 && (
              <span className={`flex items-center gap-1 ${textSecondary}`}>
                <MessageSquare size={12} />
                {task.comments_count}
              </span>
            )}
            {task.attachments_count > 0 && (
              <span className={`flex items-center gap-1 ${textSecondary}`}>
                <Paperclip size={12} />
                {task.attachments_count}
              </span>
            )}
            {task.due_date && (
              <span className={`flex items-center gap-1 ${textSecondary} hidden sm:flex`}>
                <Calendar size={12} />
                {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>

          {task.assignee && (
            <div 
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} border-2 ${darkMode ? 'border-gray-800' : 'border-white'} flex items-center justify-center text-xs`}
              title={task.assignee.full_name || task.assignee.email}
            >
              {task.assignee.avatar || task.assignee.full_name?.charAt(0).toUpperCase() || '👤'}
            </div>
          )}
        </div>
      </div>
    )
  }

  const Column = ({ column, index }) => {
    const {
      setNodeRef,
      isOver,
    } = useSortable({ 
      id: `column-${column.id}`,
      disabled: true // Disable sorting for columns themselves
    })

    const taskIds = (() => {
      try {
        const normalize = (s) => (s || '').toString().toLowerCase().replace(/[-_\s]/g, '')
        const name = normalize(column.name || column.title)
        const statusMap = {
          'todo': ['todo'],
          'inprogress': ['inprogress', 'in-progress', 'in progress'],
          'done': ['done', 'completed']
        }
        const matched = Object.entries(statusMap).find(([, variants]) => variants.some(v => normalize(v) === name))
        if (matched) {
          const statusKey = matched[0] === 'inprogress' ? 'in-progress' : matched[0]
          const allTasks = (columns || []).flatMap(c => c.tasks || [])
          return allTasks.filter(t => (t.status || 'todo') === statusKey).map(t => `task-${t.id}`)
        }
      } catch (e) {
        // fallthrough
      }
      return (column.tasks || []).map(t => `task-${t.id}`)
    })()

    return (
      <div 
        ref={setNodeRef}
        className={`flex-shrink-0 w-72 md:w-80 transition-colors ${isOver ? 'bg-blue-500/5 rounded-xl' : ''}`}
      >
        <div className={`${cardBg} backdrop-blur-xl border ${borderColor} rounded-xl p-3 md:p-4 mb-4 sticky top-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold ${getColumnColor(index)} text-sm md:text-base`}>
                {column.name || column.title}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textSecondary}`}>
                {/* show count for tasks that belong to this column by status when column matches a workflow status */}
                {(() => {
                  try {
                    const normalize = (s) => (s || '').toString().toLowerCase().replace(/[-_\s]/g, '')
                    const name = normalize(column.name || column.title)
                    const statusMap = {
                      'todo': ['todo'],
                      'inprogress': ['inprogress', 'in-progress', 'in progress'],
                      'done': ['done', 'completed']
                    }
                    const matched = Object.entries(statusMap).find(([, variants]) => variants.some(v => normalize(v) === name))
                    if (matched) {
                      const statusKey = matched[0] === 'inprogress' ? 'in-progress' : matched[0]
                      const allTasks = (columns || []).flatMap(c => c.tasks || [])
                      return allTasks.filter(t => (t.status || 'todo') === statusKey).length
                    }
                  } catch (e) {
                    return column.tasks?.length || 0
                  }
                  return column.tasks?.length || 0
                })()}
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

        <SortableContext items={taskIds} strategy={horizontalListSortingStrategy}>
          <div className="space-y-0">
            {(() => {
              // If this column corresponds to a workflow status (todo, in-progress, done)
              // show tasks filtered by task.status across all columns. Otherwise show column.tasks.
              try {
                const normalize = (s) => (s || '').toString().toLowerCase().replace(/[-_\s]/g, '')
                const name = normalize(column.name || column.title)
                const statusMap = {
                  'todo': ['todo'],
                  'inprogress': ['inprogress', 'in-progress', 'in progress'],
                  'done': ['done', 'completed']
                }
                const matched = Object.entries(statusMap).find(([, variants]) => variants.some(v => normalize(v) === name))
                if (matched) {
                  const statusKey = matched[0] === 'inprogress' ? 'in-progress' : matched[0]
                  const allTasks = (columns || []).flatMap(c => c.tasks || [])
                  const tasksToShow = allTasks.filter(t => (t.status || 'todo') === statusKey)
                  if (tasksToShow.length > 0) {
                    return tasksToShow.map(task => <TaskCard key={task.id} task={task} />)
                  }
                  return (
                    <div className={`text-center py-8 ${textSecondary} text-xs`}>
                      No tasks yet
                    </div>
                  )
                }
              } catch (e) {
                // fallthrough to default
              }

              return column.tasks && column.tasks.length > 0 ? (
                column.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <div className={`text-center py-8 ${textSecondary} text-xs`}>
                  No tasks yet
                </div>
              )
            })()}
          </div>
        </SortableContext>

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
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

          <DragOverlay>
            {activeId ? (
              <div className={`${cardBg} backdrop-blur-xl border ${borderColor} border-l-4 border-l-blue-500 rounded-xl p-3 md:p-4 w-72 md:w-80 shadow-2xl`}>
                <p className={`${textPrimary} font-semibold`}>Moving task...</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

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

        {/* NEW: Task Detail/Edit Modal */}
        {showTaskDetail && selectedTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBg} rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${textPrimary}`}>Task Details</h3>
                <button 
                  onClick={() => {
                    setShowTaskDetail(false)
                    setSelectedTask(null)
                  }}
                  className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
                >
                  <X size={20} className={textSecondary} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Title</label>
                  <input
                    type="text"
                    value={editTaskData.title}
                    onChange={(e) => setEditTaskData({...editTaskData, title: e.target.value})}
                    placeholder="Task title"
                    className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Description</label>
                  <textarea
                    value={editTaskData.description}
                    onChange={(e) => setEditTaskData({...editTaskData, description: e.target.value})}
                    placeholder="Task description"
                    className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} h-32`}
                  />
                </div>

                {/* Priority and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Priority</label>
                    <select
                      value={editTaskData.priority}
                      onChange={(e) => setEditTaskData({...editTaskData, priority: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Status</label>
                    <select
                      value={editTaskData.status}
                      onChange={(e) => setEditTaskData({...editTaskData, status: e.target.value})}
                      className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className={`block text-sm font-medium ${textSecondary} mb-2`}>Due Date</label>
                  <input
                    type="date"
                    value={editTaskData.due_date}
                    onChange={(e) => setEditTaskData({...editTaskData, due_date: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
                  />
                </div>

                {/* Metadata */}
                <div className={`p-4 rounded-xl ${inputBg} border ${borderColor}`}>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className={`${textSecondary}`}>Created by:</span>
                      <p className={`${textPrimary} font-medium mt-1`}>
                        {selectedTask.created_by?.full_name || selectedTask.created_by?.email || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <span className={`${textSecondary}`}>Created at:</span>
                      <p className={`${textPrimary} font-medium mt-1`}>
                        {new Date(selectedTask.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleDeleteTask}
                    className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                  >
                    Delete Task
                  </button>
                  <div className="flex-1"></div>
                  <button
                    onClick={() => {
                      setShowTaskDetail(false)
                      setSelectedTask(null)
                    }}
                    className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textPrimary}`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateTask}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}