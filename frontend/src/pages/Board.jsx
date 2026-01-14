// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import {
//   ArrowLeft,
//   Plus,
//   MoreVertical,
//   Calendar,
//   MessageSquare,
//   Paperclip,
//   X,
//   Users,
//   BarChart3,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Trash2,
//   Edit2
// } from 'lucide-react'
// import Layout from '../components/Layout'
// import { projectService } from '../services/projectService'
// import { workspaceService } from '../services/workspaceService'

// export default function Board({ darkMode = true, setDarkMode }) {
//   const { workspaceId, projectId } = useParams()
//   const navigate = useNavigate()

//   // State for actual project data
//   const [project, setProject] = useState(null)
//   const [columns, setColumns] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [members, setMembers] = useState([])

//   // Stats
//   const [stats, setStats] = useState({
//     totalTasks: 0,
//     completedTasks: 0,
//     inProgressTasks: 0,
//     overdueTasks: 0
//   })

//   // CRUD States
//   const [draggedTask, setDraggedTask] = useState(null)
//   const [sourceColumnId, setSourceColumnId] = useState(null)
//   const [openMenuTaskId, setOpenMenuTaskId] = useState(null)

//   // Modal States
//   const [showAddTask, setShowAddTask] = useState(false)
//   const [showEditTask, setShowEditTask] = useState(false)
//   const [showMembers, setShowMembers] = useState(false)
//   const [selectedColumn, setSelectedColumn] = useState(null)
//   const [selectedTask, setSelectedTask] = useState(null)

//   // Form States
//   const [newTaskData, setNewTaskData] = useState({
//     title: '',
//     description: '',
//     priority: 'medium',
//     due_date: ''
//   })

//   const [editTaskData, setEditTaskData] = useState({
//     title: '',
//     description: '',
//     priority: 'medium',
//     due_date: '',
//     status: ''
//   })

//   const [newMemberEmail, setNewMemberEmail] = useState('')

//   // Toast Notification States
//   const [toasts, setToasts] = useState([])
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
//   const [taskToDelete, setTaskToDelete] = useState(null)

//   const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
//   const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
//   const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
//   const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
//   const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-gray-100'

//   // Toast Notification Functions
//   const showToast = (message, type = 'info', duration = 3000) => {
//     const id = Date.now()
//     setToasts(prev => [...prev, { id, message, type, duration }])
    
//     // Auto remove after duration
//     setTimeout(() => {
//       setToasts(prev => prev.filter(toast => toast.id !== id))
//     }, duration)
    
//     return id
//   }

//   const removeToast = (id) => {
//     setToasts(prev => prev.filter(toast => toast.id !== id))
//   }

//   // Toast Component
//   const Toast = ({ toast }) => {
//     const bgColor = {
//       success: 'bg-green-500',
//       error: 'bg-red-500',
//       warning: 'bg-yellow-500',
//       info: 'bg-blue-500'
//     }[toast.type]

//     const icon = {
//       success: '✅',
//       error: '❌',
//       warning: '⚠️',
//       info: 'ℹ️'
//     }[toast.type]

//     return (
//       <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-64 animate-slideIn`}>
//         <span>{icon}</span>
//         <span className="flex-1">{toast.message}</span>
//         <button 
//           onClick={() => removeToast(toast.id)}
//           className="text-white hover:text-gray-200 ml-2"
//         >
//           ✕
//         </button>
//       </div>
//     )
//   }

//   // Confirmation Dialog Component
//   const ConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
//     if (!isOpen) return null

//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
//         <div className={`${cardBg} rounded-2xl p-6 w-full max-w-md`}>
//           <h3 className={`text-xl font-bold ${textPrimary} mb-2`}>{title}</h3>
//           <p className={`${textSecondary} mb-6`}>{message}</p>
//           <div className="flex gap-3">
//             <button
//               onClick={onCancel}
//               className={`flex-1 px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} transition`}
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Fetch actual project data
//   useEffect(() => {
//     if (workspaceId && projectId) {
//       fetchProjectData()
//     }
//   }, [workspaceId, projectId])

//   // Sync edit form when selectedTask changes
//   useEffect(() => {
//     if (selectedTask && showEditTask) {
//       // Format date for input field (YYYY-MM-DD)
//       const dueDate = selectedTask.due_date 
//         ? selectedTask.due_date.split('T')[0]
//         : ''
      
//       setEditTaskData({
//         title: selectedTask.title || '',
//         description: selectedTask.description || '',
//         priority: selectedTask.priority || 'medium',
//         due_date: dueDate,
//         status: selectedTask.status || 'todo'
//       })
//     }
//   }, [selectedTask, showEditTask])

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (openMenuTaskId && !e.target.closest('.task-menu-container')) {
//         setOpenMenuTaskId(null)
//       }
//     }

//     document.addEventListener('click', handleClickOutside)
//     return () => document.removeEventListener('click', handleClickOutside)
//   }, [openMenuTaskId])

//   const fetchProjectData = async () => {
//     try {
//       setLoading(true)

//       // 1. Fetch project details
//       const projectResponse = await projectService.getById(workspaceId, projectId)
//       setProject(projectResponse.data || projectResponse)

//       // 2. Fetch project columns
//       let columnsData = []
//       try {
//         const columnsResponse = await projectService.getColumns(workspaceId, projectId)
//         columnsData = columnsResponse.data || columnsResponse || []

//         if (columnsData.length === 0) {
//           columnsData = await createDefaultColumns()
//         }
//       } catch (error) {
//         console.error('Error fetching columns:', error)
//         columnsData = await createDefaultColumns()
//       }

//       // 3. Fetch tasks for each column
//       const columnsWithTasks = []
//       for (const column of columnsData) {
//         try {
//           const tasksResponse = await projectService.getTasks(workspaceId, projectId, column.id)
//           columnsWithTasks.push({
//             ...column,
//             tasks: tasksResponse.data || tasksResponse || []
//           })
//         } catch (taskError) {
//           console.error(`Error fetching tasks for column ${column.id}:`, taskError)
//           columnsWithTasks.push({
//             ...column,
//             tasks: []
//           })
//         }
//       }

//       setColumns(columnsWithTasks)
//       calculateStats(columnsWithTasks)

//       // 4. Fetch project members
//       try {
//         const membersResponse = await workspaceService.getProjectMembers(workspaceId, projectId)
//         setMembers(membersResponse.data || membersResponse || [])
//       } catch (error) {
//         console.error('Error fetching members:', error)
//         setMembers([])
//       }

//     } catch (error) {
//       console.error('Error fetching project data:', error)
//       showToast('Failed to load project. Please try again.', 'error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const createDefaultColumns = async () => {
//     const defaultColumns = [
//       { id: 'todo', name: 'To Do', color: '#3B82F6', position: 0 },
//       { id: 'in-progress', name: 'In Progress', color: '#8B5CF6', position: 1 },
//       { id: 'done', name: 'Done', color: '#10B981', position: 2 }
//     ]

//     try {
//       for (const column of defaultColumns) {
//         await projectService.createColumn(workspaceId, projectId, {
//           name: column.name,
//           color: column.color,
//           position: column.position
//         })
//       }
//     } catch (error) {
//       console.log('Could not create columns via API, using local defaults:', error)
//     }

//     return defaultColumns
//   }

//   const calculateStats = (cols) => {
//     const allTasks = cols.flatMap(col => col.tasks || [])
//     const now = new Date()

//     const completedTasks = cols.find(c => c.name === 'Done')?.tasks?.length || 0
//     const inProgressTasks = cols.find(c => c.name === 'In Progress')?.tasks?.length || 0

//     const overdueTasks = allTasks.filter(task => {
//       if (!task.due_date) return false
//       const dueDate = new Date(task.due_date)
//       const isOverdue = dueDate < now
//       const isNotCompleted = task.status !== 'done'
//       return isOverdue && isNotCompleted
//     }).length

//     const statsData = {
//       totalTasks: allTasks.length,
//       completedTasks,
//       inProgressTasks,
//       overdueTasks
//     }

//     setStats(statsData)
//   }

//   // DnD Handlers
//   const handleDragStart = (task, columnId) => {
//     setDraggedTask(task)
//     setSourceColumnId(columnId)
//   }

//   const handleDragEnd = async (targetColumnId) => {
//     if (!draggedTask || !sourceColumnId || sourceColumnId === targetColumnId) {
//       return
//     }

//     try {
//       const targetColumn = columns.find(col => col.id === targetColumnId)
//       if (!targetColumn) {
//         return
//       }

//       let newStatus = draggedTask.status
//       if (targetColumn.name === 'Done') newStatus = 'done'
//       else if (targetColumn.name === 'In Progress') newStatus = 'in-progress'
//       else if (targetColumn.name === 'To Do') newStatus = 'todo'
//       else if (targetColumn.name === 'Review') newStatus = 'review'

//       // Optimistically update UI
//       const newColumns = columns.map(col => {
//         if (col.id === sourceColumnId) {
//           return {
//             ...col,
//             tasks: col.tasks.filter(t => t.id !== draggedTask.id)
//           }
//         }
//         if (col.id === targetColumnId) {
//           return {
//             ...col,
//             tasks: [...col.tasks, {
//               ...draggedTask,
//               status: newStatus,
//               column: targetColumnId
//             }]
//           }
//         }
//         return col
//       })

//       setColumns(newColumns)
//       calculateStats(newColumns)

//       // Update task in backend
//       try {
//         await projectService.updateTask(
//           workspaceId,
//           projectId,
//           sourceColumnId,
//           draggedTask.id,
//           {
//             status: newStatus,
//             column: targetColumnId
//           }
//         )
//         showToast('Task moved successfully!', 'success')
//       } catch (updateError) {
//         console.error('Failed to update task:', updateError)
//         try {
//           await projectService.moveTask(
//             workspaceId,
//             projectId,
//             sourceColumnId,
//             draggedTask.id,
//             targetColumnId
//           )
//           showToast('Task moved successfully!', 'success')
//         } catch (moveError) {
//           console.error('Move failed:', moveError)
//           showToast('Failed to move task. Please try again.', 'error')
//           fetchProjectData()
//         }
//       }

//     } catch (error) {
//       console.error('Error in drag operation:', error)
//       showToast('Failed to move task. Please try again.', 'error')
//       fetchProjectData()
//     } finally {
//       setDraggedTask(null)
//       setSourceColumnId(null)
//     }
//   }

//   // CRUD Handlers
//   const handleAddTask = async () => {
//     if (!newTaskData.title.trim() || !selectedColumn) {
//       showToast('Task title is required', 'error')
//       return
//     }

//     try {
//       let status = 'todo'
//       if (selectedColumn.name === 'In Progress') status = 'in-progress'
//       else if (selectedColumn.name === 'Done') status = 'done'
//       else if (selectedColumn.name === 'Review') status = 'review'

//       const taskData = {
//         title: newTaskData.title,
//         description: newTaskData.description || '',
//         priority: newTaskData.priority,
//         due_date: newTaskData.due_date || null,
//         status: status,
//         project: projectId,           
//         column: selectedColumn.id     
//       }

//       const response = await projectService.createTask(
//         workspaceId,
//         projectId,
//         selectedColumn.id,
//         taskData
//       )

//       const newTask = response.data || response

//       const updatedColumns = columns.map(col =>
//         col.id === selectedColumn.id
//           ? { ...col, tasks: [...col.tasks, newTask] }
//           : col
//       )

//       setColumns(updatedColumns)
//       calculateStats(updatedColumns)

//       setNewTaskData({ title: '', description: '', priority: 'medium', due_date: '' })
//       setShowAddTask(false)
//       setSelectedColumn(null)

//       showToast('Task created successfully!', 'success')

//     } catch (error) {
//       console.error('Error creating task:', error)
      
//       if (error.response?.status === 400) {
//         const errorData = error.response.data
//         if (errorData.project) {
//           showToast(`Project error: ${errorData.project.join(', ')}`, 'error')
//         } else if (errorData.column) {
//           showToast(`Column error: ${errorData.column.join(', ')}`, 'error')
//         } else if (errorData.detail) {
//           showToast(`Error: ${errorData.detail}`, 'error')
//         } else {
//           showToast('Failed to create task. Please check the form data.', 'error')
//         }
//       } else {
//         showToast(error.response?.data?.message || error.message || 'Failed to create task', 'error')
//       }
//     }
//   }

//   const handleUpdateTask = async () => {
//     if (!selectedTask || !editTaskData.title.trim()) {
//       showToast('Task title is required', 'error')
//       return
//     }

//     try {
//       const statusColumnMap = {
//         'todo': 'To Do',
//         'in-progress': 'In Progress',
//         'done': 'Done',
//         'review': 'Review'
//       }

//       const targetColumnName = statusColumnMap[editTaskData.status] || 'To Do'
//       const targetColumn = columns.find(col => col.name === targetColumnName)

//       if (!targetColumn) {
//         showToast('Cannot find column for this status', 'error')
//         return
//       }

//       const response = await projectService.updateTask(
//         workspaceId,
//         projectId,
//         selectedTask.column || selectedTask.column?.id,
//         selectedTask.id,
//         editTaskData
//       )

//       const updatedTask = response.data || response

//       if (editTaskData.status !== selectedTask.status) {
//         const updatedColumns = columns.map(col => {
//           if (col.id === (selectedTask.column || selectedTask.column?.id)) {
//             return {
//               ...col,
//               tasks: col.tasks.filter(task => task.id !== selectedTask.id)
//             }
//           }
//           if (col.id === targetColumn.id) {
//             return {
//               ...col,
//               tasks: [...col.tasks, updatedTask]
//             }
//           }
//           return col
//         })
        
//         setColumns(updatedColumns)
//         calculateStats(updatedColumns)
//       } else {
//         const updatedColumns = columns.map(col => ({
//           ...col,
//           tasks: col.tasks.map(task =>
//             task.id === selectedTask.id ? updatedTask : task
//           )
//         }))
        
//         setColumns(updatedColumns)
//         calculateStats(updatedColumns)
//       }

//       setShowEditTask(false)
//       setSelectedTask(null)
//       showToast('Task updated successfully!', 'success')

//     } catch (error) {
//       console.error('Error updating task:', error)
//       showToast(error.response?.data?.message || error.message || 'Failed to update task', 'error')
//     }
//   }

//   const handleDeleteTask = async () => {
//     if (!taskToDelete) return

//     try {
//       await projectService.deleteTask(
//         workspaceId,
//         projectId,
//         taskToDelete.column || taskToDelete.column?.id,
//         taskToDelete.id
//       )

//       const updatedColumns = columns.map(col => ({
//         ...col,
//         tasks: col.tasks.filter(task => task.id !== taskToDelete.id)
//       }))

//       setColumns(updatedColumns)
//       calculateStats(updatedColumns)

//       setShowDeleteConfirm(false)
//       setTaskToDelete(null)
//       setShowEditTask(false)
//       setSelectedTask(null)

//       showToast('Task deleted successfully!', 'success')

//     } catch (error) {
//       console.error('Error deleting task:', error)
//       showToast(error.response?.data?.message || error.message || 'Failed to delete task', 'error')
//     }
//   }

//   const confirmDeleteTask = (task) => {
//     setTaskToDelete(task)
//     setShowDeleteConfirm(true)
//   }

//   // Member Management
//   const handleAddMember = async () => {
//     if (!newMemberEmail.trim()) {
//       showToast('Please enter an email address', 'error')
//       return
//     }

//     try {
//       const response = await projectService.addMember(
//         workspaceId,
//         projectId,
//         { email: newMemberEmail }
//       )

//       const newMember = response.data || response
//       setMembers([...members, newMember])
//       setNewMemberEmail('')
//       showToast('Member added successfully', 'success')

//     } catch (error) {
//       console.error('Error adding member:', error)
//       showToast(error.response?.data?.message || error.message || 'Failed to add member', 'error')
//     }
//   }

//   const handleRemoveMember = async (memberId, memberName) => {
//     setTaskToDelete({ id: memberId, type: 'member', name: memberName })
//     setShowDeleteConfirm(true)
//   }

//   const handleConfirmDelete = async () => {
//     if (!taskToDelete) return

//     if (taskToDelete.type === 'member') {
//       try {
//         await projectService.removeMember(
//           workspaceId,
//           projectId,
//           taskToDelete.id
//         )

//         setMembers(members.filter(member => member.id !== taskToDelete.id))
//         showToast(`${taskToDelete.name} removed from project`, 'success')
//       } catch (error) {
//         console.error('Error removing member:', error)
//         showToast(error.response?.data?.message || error.message || 'Failed to remove member', 'error')
//       }
//     } else {
//       await handleDeleteTask()
//     }

//     setShowDeleteConfirm(false)
//     setTaskToDelete(null)
//   }

//   // Task Card Component - FIXED EDIT ISSUE
//   const TaskCard = ({ task, columnId }) => {
//     const priorityColors = {
//       high: 'border-l-red-500',
//       medium: 'border-l-yellow-500',
//       low: 'border-l-green-500',
//     }

//     const priorityBadges = {
//       high: 'bg-red-500/20 text-red-400',
//       medium: 'bg-yellow-500/20 text-yellow-400',
//       low: 'bg-green-500/20 text-green-400',
//     }

//     return (
//       <div
//         draggable
//         onDragStart={() => handleDragStart(task, columnId)}
//         className={`${cardBg} border ${borderColor} ${priorityColors[task.priority] || priorityColors.medium} border-l-4 rounded-xl p-3 mb-3 cursor-move group hover:shadow-lg transition-shadow`}
//       >
//         <div className="flex items-start justify-between mb-2">
//           <span className={`text-xs px-2 py-1 rounded ${priorityBadges[task.priority] || priorityBadges.medium}`}>
//             {task.priority || 'medium'}
//           </span>

//           <div className="relative task-menu-container">
//             <button
//               onClick={(e) => {
//                 e.stopPropagation()
//                 setOpenMenuTaskId(openMenuTaskId === task.id ? null : task.id)
//               }}
//               className={`p-1 rounded opacity-0 group-hover:opacity-100 transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//             >
//               <MoreVertical size={14} className={textSecondary} />
//             </button>

//             {openMenuTaskId === task.id && (
//               <div
//                 className={`absolute right-0 top-full mt-1 w-32 rounded-lg shadow-lg z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} border ${borderColor}`}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     e.preventDefault()
//                     // Close menu first
//                     setOpenMenuTaskId(null)
//                     // Set selected task and open modal with slight delay
//                     setTimeout(() => {
//                       setSelectedTask(task)
//                       // Format date for input field
//                       const dueDate = task.due_date 
//                         ? task.due_date.split('T')[0]
//                         : ''
                      
//                       setEditTaskData({
//                         title: task.title,
//                         description: task.description || '',
//                         priority: task.priority || 'medium',
//                         due_date: dueDate,
//                         status: task.status || 'todo'
//                       })
//                       setShowEditTask(true)
//                     }, 10)
//                   }}
//                   className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-t-lg flex items-center gap-2"
//                 >
//                   <Edit2 size={12} /> Edit
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     e.preventDefault()
//                     setOpenMenuTaskId(null)
//                     setTimeout(() => {
//                       confirmDeleteTask(task)
//                     }, 10)
//                   }}
//                   className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
//                 >
//                   <Trash2 size={12} /> Delete
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <h4 className={`font-semibold ${textPrimary} mb-2`}>
//           {task.title}
//         </h4>

//         {task.description && (
//           <p className={`text-xs ${textSecondary} mb-3 line-clamp-2`}>
//             {task.description}
//           </p>
//         )}

//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 text-xs">
//             {(task.comments_count || 0) > 0 && (
//               <span className={`flex items-center gap-1 ${textSecondary}`}>
//                 <MessageSquare size={12} />
//                 {task.comments_count}
//               </span>
//             )}
//             {(task.attachments_count || 0) > 0 && (
//               <span className={`flex items-center gap-1 ${textSecondary}`}>
//                 <Paperclip size={12} />
//                 {task.attachments_count}
//               </span>
//             )}
//             {task.due_date && (
//               <span className={`flex items-center gap-1 ${textSecondary}`}>
//                 <Calendar size={12} />
//                 {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//               </span>
//             )}
//           </div>

//           {task.assignee && (
//             <div
//               className={`w-6 h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center text-xs`}
//               title={task.assignee.full_name || task.assignee.email}
//             >
//               {(task.assignee.full_name?.charAt(0) || '👤').toUpperCase()}
//             </div>
//           )}
//         </div>
//       </div>
//     )
//   }

//   // Column Component
//   const Column = ({ column }) => (
//     <div
//       className="w-72 md:w-80 flex-shrink-0"
//       onDragOver={(e) => {
//         e.preventDefault()
//         e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
//       }}
//       onDragLeave={(e) => {
//         e.currentTarget.style.backgroundColor = 'transparent'
//       }}
//       onDrop={(e) => {
//         e.preventDefault()
//         e.currentTarget.style.backgroundColor = 'transparent'
//         handleDragEnd(column.id)
//       }}
//     >
//       <div className={`${cardBg} border ${borderColor} rounded-xl p-4 mb-4`}>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div
//               className="w-3 h-3 rounded-full"
//               style={{ backgroundColor: column.color || '#3B82F6' }}
//             />
//             <h3 className={`font-semibold ${textPrimary}`}>
//               {column.name}
//             </h3>
//             <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${textSecondary}`}>
//               {column.tasks?.length || 0}
//             </span>
//           </div>
//           <button
//             onClick={() => {
//               setSelectedColumn(column)
//               setShowAddTask(true)
//             }}
//             className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//           >
//             <Plus size={16} className={textSecondary} />
//           </button>
//         </div>
//       </div>

//       <div className="space-y-3 min-h-[100px]">
//         {column.tasks && column.tasks.length > 0 ? (
//           column.tasks.map((task) => (
//             <TaskCard key={task.id} task={task} columnId={column.id} />
//           ))
//         ) : (
//           <div className={`text-center py-8 ${textSecondary} text-xs border-2 border-dashed ${borderColor} rounded-xl`}>
//             Drop tasks here
//           </div>
//         )}
//       </div>

//       <button
//         onClick={() => {
//           setSelectedColumn(column)
//           setShowAddTask(true)
//         }}
//         className={`w-full py-3 rounded-xl border-2 border-dashed ${borderColor} ${textSecondary} hover:${textPrimary} hover:border-blue-500 transition flex items-center justify-center gap-2 mt-4`}
//       >
//         <Plus size={14} /> Add Task
//       </button>
//     </div>
//   )

//   if (loading) {
//     return (
//       <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
//         <div className="flex items-center justify-center h-64">
//           <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
//         </div>
//       </Layout>
//     )
//   }

//   return (
//     <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
//       {/* Toast Notifications */}
//       <div className="fixed top-4 right-4 z-[100] space-y-2">
//         {toasts.map(toast => (
//           <Toast key={toast.id} toast={toast} />
//         ))}
//       </div>

//       {/* Confirmation Dialog */}
//       <ConfirmationDialog
//         isOpen={showDeleteConfirm}
//         title={taskToDelete?.type === 'member' ? 'Remove Member' : 'Delete Task'}
//         message={taskToDelete?.type === 'member' 
//           ? `Are you sure you want to remove ${taskToDelete.name} from this project?`
//           : 'Are you sure you want to delete this task? This action cannot be undone.'
//         }
//         onConfirm={handleConfirmDelete}
//         onCancel={() => {
//           setShowDeleteConfirm(false)
//           setTaskToDelete(null)
//         }}
//       />

//       {/* Header with ACTUAL project name */}
//       <div className={`${cardBg} border ${borderColor} rounded-xl p-4 md:p-6 mb-6`}>
//         <div className="flex flex-col gap-4">
//           <div className="flex items-start gap-4">
//             <button
//               onClick={() => navigate(`/workspaces/${workspaceId}/projects`)}
//               className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
//             >
//               <ArrowLeft size={20} className={textSecondary} />
//             </button>
//             <div className="flex-1">
//               <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
//                 <div>
//                   <h1 className={`text-xl md:text-2xl font-bold ${textPrimary} mb-1`}>
//                     {project?.name || 'Project Board'}
//                   </h1>
//                   <p className={`text-sm ${textSecondary}`}>
//                     {project?.description || 'Project management board'}
//                   </p>
//                 </div>

//                 {/* Members Button */}
//                 <button
//                   onClick={() => setShowMembers(true)}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}
//                 >
//                   <Users size={16} />
//                   <span className={textPrimary}>Members ({members.length})</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Dashboard Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${borderColor}`}>
//               <div className="flex items-center gap-2 mb-1">
//                 <BarChart3 size={16} className="text-blue-500" />
//                 <span className={`text-sm ${textSecondary}`}>Total Tasks</span>
//               </div>
//               <div className={`text-xl font-bold ${textPrimary}`}>{stats.totalTasks}</div>
//             </div>

//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${borderColor}`}>
//               <div className="flex items-center gap-2 mb-1">
//                 <CheckCircle size={16} className="text-green-500" />
//                 <span className={`text-sm ${textSecondary}`}>Completed</span>
//               </div>
//               <div className={`text-xl font-bold ${textPrimary}`}>{stats.completedTasks}</div>
//             </div>

//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${borderColor}`}>
//               <div className="flex items-center gap-2 mb-1">
//                 <Clock size={16} className="text-yellow-500" />
//                 <span className={`text-sm ${textSecondary}`}>In Progress</span>
//               </div>
//               <div className={`text-xl font-bold ${textPrimary}`}>{stats.inProgressTasks}</div>
//             </div>

//             <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${borderColor}`}>
//               <div className="flex items-center gap-2 mb-1">
//                 <AlertCircle size={16} className="text-red-500" />
//                 <span className={`text-sm ${textSecondary}`}>Overdue</span>
//               </div>
//               <div className={`text-xl font-bold ${textPrimary}`}>{stats.overdueTasks}</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Kanban Board */}
//       <div className="overflow-x-auto pb-6">
//         <div className="flex gap-6 min-w-max px-4">
//           {columns.length > 0 ? (
//             columns.map((column) => (
//               <Column key={column.id} column={column} />
//             ))
//           ) : (
//             <div className={`${cardBg} border ${borderColor} rounded-2xl p-12 text-center w-full`}>
//               <p className={`${textSecondary} mb-4`}>No columns found.</p>
//               <button
//                 onClick={fetchProjectData}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 Reload Board
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add Task Modal */}
//       {showAddTask && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className={`${cardBg} rounded-2xl p-6 w-full max-w-md`}>
//             <h3 className={`text-xl font-bold ${textPrimary} mb-4`}>
//               Add Task to {selectedColumn?.name}
//             </h3>
//             <input
//               type="text"
//               value={newTaskData.title}
//               onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
//               placeholder="Task title *"
//               className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3`}
//               required
//             />
//             <textarea
//               value={newTaskData.description}
//               onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
//               placeholder="Description (optional)"
//               className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3 h-24`}
//             />
//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <div>
//                 <label className={`block text-xs ${textSecondary} mb-1`}>Priority</label>
//                 <select
//                   value={newTaskData.priority}
//                   onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value })}
//                   className={`w-full px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                 </select>
//               </div>
//               <div>
//                 <label className={`block text-xs ${textSecondary} mb-1`}>Due Date</label>
//                 <input
//                   type="date"
//                   value={newTaskData.due_date}
//                   onChange={(e) => setNewTaskData({ ...newTaskData, due_date: e.target.value })}
//                   className={`w-full px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
//                 />
//               </div>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowAddTask(false)
//                   setSelectedColumn(null)
//                   setNewTaskData({ title: '', description: '', priority: 'medium', due_date: '' })
//                 }}
//                 className={`flex-1 px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} transition`}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddTask}
//                 className="flex-1 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition"
//               >
//                 Create Task
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Task Modal - FIXED: Uses key prop to force re-render */}
//       {showEditTask && selectedTask && (
//         <div key={`edit-modal-${selectedTask.id}`} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className={`${cardBg} rounded-2xl p-6 w-full max-w-md`}>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className={`text-xl font-bold ${textPrimary}`}>
//                 Edit Task
//               </h3>
//               <button
//                 onClick={() => {
//                   setShowEditTask(false)
//                   setTimeout(() => setSelectedTask(null), 100)
//                 }}
//                 className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//               >
//                 <X size={20} className={textSecondary} />
//               </button>
//             </div>

//             <input
//               type="text"
//               value={editTaskData.title}
//               onChange={(e) => setEditTaskData({...editTaskData, title: e.target.value})}
//               placeholder="Task title *"
//               className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3`}
//               required
//               key={`title-${selectedTask.id}`}
//             />
//             <textarea
//               value={editTaskData.description}
//               onChange={(e) => setEditTaskData({...editTaskData, description: e.target.value})}
//               placeholder="Description"
//               className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3 h-24`}
//               key={`desc-${selectedTask.id}`}
//             />

//             <div className="grid grid-cols-2 gap-3 mb-3">
//               <div>
//                 <label className={`block text-xs ${textSecondary} mb-1`}>Priority</label>
//                 <select
//                   value={editTaskData.priority}
//                   onChange={(e) => setEditTaskData({...editTaskData, priority: e.target.value})}
//                   className={`w-full px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
//                   key={`priority-${selectedTask.id}`}
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                 </select>
//               </div>
//               <div>
//                 <label className={`block text-xs ${textSecondary} mb-1`}>Status</label>
//                 <select
//                   value={editTaskData.status}
//                   onChange={(e) => setEditTaskData({...editTaskData, status: e.target.value})}
//                   className={`w-full px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
//                   key={`status-${selectedTask.id}`}
//                 >
//                   <option value="todo">To Do</option>
//                   <option value="in-progress">In Progress</option>
//                   <option value="done">Done</option>
//                   <option value="review">Review</option>
//                 </select>
//               </div>
//             </div>

//             <div className="mb-4">
//               <label className={`block text-xs ${textSecondary} mb-1`}>Due Date</label>
//               <input
//                 type="date"
//                 value={editTaskData.due_date}
//                 onChange={(e) => setEditTaskData({...editTaskData, due_date: e.target.value})}
//                 className={`w-full px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
//                 key={`due-${selectedTask.id}`}
//               />
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   confirmDeleteTask(selectedTask)
//                   setShowEditTask(false)
//                 }}
//                 className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition flex items-center gap-2"
//               >
//                 <Trash2 size={14} /> Delete
//               </button>
//               <div className="flex-1"></div>
//               <button
//                 onClick={() => {
//                   setShowEditTask(false)
//                   setTimeout(() => setSelectedTask(null), 100)
//                 }}
//                 className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} transition`}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdateTask}
//                 className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Members Management Modal */}
//       {showMembers && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className={`${cardBg} rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto`}>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className={`text-xl font-bold ${textPrimary}`}>Project Members</h3>
//               <button
//                 onClick={() => setShowMembers(false)}
//                 className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//               >
//                 <X size={20} className={textSecondary} />
//               </button>
//             </div>

//             {/* Add Member Form */}
//             <div className="mb-6">
//               <div className="flex gap-2 mb-4">
//                 <input
//                   type="email"
//                   value={newMemberEmail}
//                   onChange={(e) => setNewMemberEmail(e.target.value)}
//                   placeholder="Enter email to invite"
//                   className={`flex-1 px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
//                 />
//                 <button
//                   onClick={handleAddMember}
//                   className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition"
//                 >
//                   Invite
//                 </button>
//               </div>
//             </div>

//             {/* Members List */}
//             <div className="space-y-3">
//               <h4 className={`font-medium ${textPrimary} mb-2`}>
//                 Current Members ({members.length})
//               </h4>
//               {members.length > 0 ? (
//                 members.map(member => (
//                   <div
//                     key={member.id}
//                     className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${borderColor}`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
//                         {(member.full_name?.charAt(0) || member.email?.charAt(0) || '👤').toUpperCase()}
//                       </div>
//                       <div>
//                         <div className={`font-medium ${textPrimary}`}>
//                           {member.full_name || member.email}
//                         </div>
//                         <div className={`text-xs ${textSecondary}`}>
//                           {member.email}
//                           {member.role && ` • ${member.role}`}
//                         </div>
//                       </div>
//                     </div>

//                     {member.role !== 'Admin' && (
//                       <button
//                         onClick={() => handleRemoveMember(member.id, member.full_name || member.email)}
//                         className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
//                       >
//                         Remove
//                       </button>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <p className={`text-center py-4 ${textSecondary}`}>
//                   No members yet. Invite someone to collaborate!
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add CSS for animations */}
//       <style jsx>{`
//         @keyframes slideIn {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slideIn {
//           animation: slideIn 0.3s ease-out;
//         }
//       `}</style>
//     </Layout>
//   )
// }

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  MoreVertical,
  Calendar,
  MessageSquare,
  Paperclip,
  X,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Edit2,
  ListTodo // Added this icon
} from 'lucide-react'
import Layout from '../components/Layout'
import { projectService } from '../services/projectService'
import { workspaceService } from '../services/workspaceService'

export default function Board({ darkMode = true, setDarkMode }) {
  const { workspaceId, projectId } = useParams()
  const navigate = useNavigate()

  // State for actual project data
  const [project, setProject] = useState(null)
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState([])

  // Stats
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    toDoTasks: 0 // Changed from overdueTasks to toDoTasks
  })

  // CRUD States
  const [draggedTask, setDraggedTask] = useState(null)
  const [sourceColumnId, setSourceColumnId] = useState(null)
  const [openMenuTaskId, setOpenMenuTaskId] = useState(null)

  // Modal States
  const [showAddTask, setShowAddTask] = useState(false)
  const [showEditTask, setShowEditTask] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  // Form States
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  })

  const [editTaskData, setEditTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    status: ''
  })

  const [newMemberEmail, setNewMemberEmail] = useState('')

  // Toast Notification States
  const [toasts, setToasts] = useState([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white'
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900'
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600'
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200'
  const inputBg = darkMode ? 'bg-gray-700/50' : 'bg-gray-100'

  // Toast Notification Functions
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, duration }])
    
    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, duration)
    
    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Toast Component
  const Toast = ({ toast }) => {
    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    }[toast.type]

    const icon = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }[toast.type]

    return (
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 min-w-64 animate-slideIn`}>
        <span>{icon}</span>
        <span className="flex-1">{toast.message}</span>
        <button 
          onClick={() => removeToast(toast.id)}
          className="text-white hover:text-gray-200 ml-2"
        >
          ✕
        </button>
      </div>
    )
  }

  // Confirmation Dialog Component
  const ConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        <div className={`${cardBg} rounded-2xl p-6 w-full max-w-md`}>
          <h3 className={`text-xl font-bold ${textPrimary} mb-2`}>{title}</h3>
          <p className={`${textSecondary} mb-6`}>{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className={`flex-1 px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} transition`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Fetch actual project data
  useEffect(() => {
    if (workspaceId && projectId) {
      fetchProjectData()
    }
  }, [workspaceId, projectId])

  // Sync edit form when selectedTask changes
  useEffect(() => {
    if (selectedTask && showEditTask) {
      // Format date for input field (YYYY-MM-DD)
      const dueDate = selectedTask.due_date 
        ? selectedTask.due_date.split('T')[0]
        : ''
      
      setEditTaskData({
        title: selectedTask.title || '',
        description: selectedTask.description || '',
        priority: selectedTask.priority || 'medium',
        due_date: dueDate,
        status: selectedTask.status || 'todo'
      })
    }
  }, [selectedTask, showEditTask])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuTaskId && !e.target.closest('.task-menu-container')) {
        setOpenMenuTaskId(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openMenuTaskId])

  const fetchProjectData = async () => {
    try {
      setLoading(true)

      // 1. Fetch project details
      const projectResponse = await projectService.getById(workspaceId, projectId)
      setProject(projectResponse.data || projectResponse)

      // 2. Fetch project columns
      let columnsData = []
      try {
        const columnsResponse = await projectService.getColumns(workspaceId, projectId)
        columnsData = columnsResponse.data || columnsResponse || []

        if (columnsData.length === 0) {
          columnsData = await createDefaultColumns()
        }
      } catch (error) {
        console.error('Error fetching columns:', error)
        columnsData = await createDefaultColumns()
      }

      // 3. Fetch tasks for each column
      const columnsWithTasks = []
      for (const column of columnsData) {
        try {
          const tasksResponse = await projectService.getTasks(workspaceId, projectId, column.id)
          columnsWithTasks.push({
            ...column,
            tasks: tasksResponse.data || tasksResponse || []
          })
        } catch (taskError) {
          console.error(`Error fetching tasks for column ${column.id}:`, taskError)
          columnsWithTasks.push({
            ...column,
            tasks: []
          })
        }
      }

      setColumns(columnsWithTasks)
      calculateStats(columnsWithTasks)

      // 4. Fetch project members
      try {
        const membersResponse = await workspaceService.getProjectMembers(workspaceId, projectId)
        setMembers(membersResponse.data || membersResponse || [])
      } catch (error) {
        console.error('Error fetching members:', error)
        setMembers([])
      }

    } catch (error) {
      console.error('Error fetching project data:', error)
      showToast('Failed to load project. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const createDefaultColumns = async () => {
    const defaultColumns = [
      { id: 'todo', name: 'To Do', color: '#3B82F6', position: 0 },
      { id: 'in-progress', name: 'In Progress', color: '#8B5CF6', position: 1 },
      { id: 'done', name: 'Done', color: '#10B981', position: 2 }
    ]

    try {
      for (const column of defaultColumns) {
        await projectService.createColumn(workspaceId, projectId, {
          name: column.name,
          color: column.color,
          position: column.position
        })
      }
    } catch (error) {
      console.log('Could not create columns via API, using local defaults:', error)
    }

    return defaultColumns
  }

  const calculateStats = (cols) => {
    const allTasks = cols.flatMap(col => col.tasks || [])
    
    // Count tasks by status/column
    const completedTasks = cols.find(c => c.name === 'Done')?.tasks?.length || 0
    const inProgressTasks = cols.find(c => c.name === 'In Progress')?.tasks?.length || 0
    const toDoTasks = cols.find(c => c.name === 'To Do')?.tasks?.length || 0
    
    // You can also calculate overdue tasks separately if needed
    const now = new Date()
    const overdueTasks = allTasks.filter(task => {
      if (!task.due_date) return false
      const dueDate = new Date(task.due_date)
      const isOverdue = dueDate < now
      const isNotCompleted = task.status !== 'done'
      return isOverdue && isNotCompleted
    }).length

    const statsData = {
      totalTasks: allTasks.length,
      completedTasks,
      inProgressTasks,
      toDoTasks, // Changed from overdueTasks
      overdueTasks // Keep this if you want to use it elsewhere
    }

    setStats(statsData)
  }

  // DnD Handlers
  const handleDragStart = (task, columnId) => {
    setDraggedTask(task)
    setSourceColumnId(columnId)
  }

  const handleDragEnd = async (targetColumnId) => {
    if (!draggedTask || !sourceColumnId || sourceColumnId === targetColumnId) {
      return
    }

    try {
      const targetColumn = columns.find(col => col.id === targetColumnId)
      if (!targetColumn) {
        return
      }

      let newStatus = draggedTask.status
      if (targetColumn.name === 'Done') newStatus = 'done'
      else if (targetColumn.name === 'In Progress') newStatus = 'in-progress'
      else if (targetColumn.name === 'To Do') newStatus = 'todo'
      else if (targetColumn.name === 'Review') newStatus = 'review'

      // Optimistically update UI
      const newColumns = columns.map(col => {
        if (col.id === sourceColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter(t => t.id !== draggedTask.id)
          }
        }
        if (col.id === targetColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, {
              ...draggedTask,
              status: newStatus,
              column: targetColumnId
            }]
          }
        }
        return col
      })

      setColumns(newColumns)
      calculateStats(newColumns)

      // Update task in backend
      try {
        await projectService.updateTask(
          workspaceId,
          projectId,
          sourceColumnId,
          draggedTask.id,
          {
            status: newStatus,
            column: targetColumnId
          }
        )
        showToast('Task moved successfully!', 'success')
      } catch (updateError) {
        console.error('Failed to update task:', updateError)
        try {
          await projectService.moveTask(
            workspaceId,
            projectId,
            sourceColumnId,
            draggedTask.id,
            targetColumnId
          )
          showToast('Task moved successfully!', 'success')
        } catch (moveError) {
          console.error('Move failed:', moveError)
          showToast('Failed to move task. Please try again.', 'error')
          fetchProjectData()
        }
      }

    } catch (error) {
      console.error('Error in drag operation:', error)
      showToast('Failed to move task. Please try again.', 'error')
      fetchProjectData()
    } finally {
      setDraggedTask(null)
      setSourceColumnId(null)
    }
  }

  // CRUD Handlers
  const handleAddTask = async () => {
    if (!newTaskData.title.trim() || !selectedColumn) {
      showToast('Task title is required', 'error')
      return
    }

    try {
      let status = 'todo'
      if (selectedColumn.name === 'In Progress') status = 'in-progress'
      else if (selectedColumn.name === 'Done') status = 'done'
      else if (selectedColumn.name === 'Review') status = 'review'

      const taskData = {
        title: newTaskData.title,
        description: newTaskData.description || '',
        priority: newTaskData.priority,
        due_date: newTaskData.due_date || null,
        status: status,
        project: projectId,           
        column: selectedColumn.id     
      }

      const response = await projectService.createTask(
        workspaceId,
        projectId,
        selectedColumn.id,
        taskData
      )

      const newTask = response.data || response

      const updatedColumns = columns.map(col =>
        col.id === selectedColumn.id
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )

      setColumns(updatedColumns)
      calculateStats(updatedColumns)

      setNewTaskData({ title: '', description: '', priority: 'medium', due_date: '' })
      setShowAddTask(false)
      setSelectedColumn(null)

      showToast('Task created successfully!', 'success')

    } catch (error) {
      console.error('Error creating task:', error)
      
      if (error.response?.status === 400) {
        const errorData = error.response.data
        if (errorData.project) {
          showToast(`Project error: ${errorData.project.join(', ')}`, 'error')
        } else if (errorData.column) {
          showToast(`Column error: ${errorData.column.join(', ')}`, 'error')
        } else if (errorData.detail) {
          showToast(`Error: ${errorData.detail}`, 'error')
        } else {
          showToast('Failed to create task. Please check the form data.', 'error')
        }
      } else {
        showToast(error.response?.data?.message || error.message || 'Failed to create task', 'error')
      }
    }
  }

  const handleUpdateTask = async () => {
    if (!selectedTask || !editTaskData.title.trim()) {
      showToast('Task title is required', 'error')
      return
    }

    try {
      const statusColumnMap = {
        'todo': 'To Do',
        'in-progress': 'In Progress',
        'done': 'Done',
        'review': 'Review'
      }

      const targetColumnName = statusColumnMap[editTaskData.status] || 'To Do'
      const targetColumn = columns.find(col => col.name === targetColumnName)

      if (!targetColumn) {
        showToast('Cannot find column for this status', 'error')
        return
      }

      const response = await projectService.updateTask(
        workspaceId,
        projectId,
        selectedTask.column || selectedTask.column?.id,
        selectedTask.id,
        editTaskData
      )

      const updatedTask = response.data || response

      if (editTaskData.status !== selectedTask.status) {
        const updatedColumns = columns.map(col => {
          if (col.id === (selectedTask.column || selectedTask.column?.id)) {
            return {
              ...col,
              tasks: col.tasks.filter(task => task.id !== selectedTask.id)
            }
          }
          if (col.id === targetColumn.id) {
            return {
              ...col,
              tasks: [...col.tasks, updatedTask]
            }
          }
          return col
        })
        
        setColumns(updatedColumns)
        calculateStats(updatedColumns)
      } else {
        const updatedColumns = columns.map(col => ({
          ...col,
          tasks: col.tasks.map(task =>
            task.id === selectedTask.id ? updatedTask : task
          )
        }))
        
        setColumns(updatedColumns)
        calculateStats(updatedColumns)
      }

      setShowEditTask(false)
      setSelectedTask(null)
      showToast('Task updated successfully!', 'success')

    } catch (error) {
      console.error('Error updating task:', error)
      showToast(error.response?.data?.message || error.message || 'Failed to update task', 'error')
    }
  }

  const handleDeleteTask = async () => {
    if (!taskToDelete) return

    try {
      await projectService.deleteTask(
        workspaceId,
        projectId,
        taskToDelete.column || taskToDelete.column?.id,
        taskToDelete.id
      )

      const updatedColumns = columns.map(col => ({
        ...col,
        tasks: col.tasks.filter(task => task.id !== taskToDelete.id)
      }))

      setColumns(updatedColumns)
      calculateStats(updatedColumns)

      setShowDeleteConfirm(false)
      setTaskToDelete(null)
      setShowEditTask(false)
      setSelectedTask(null)

      showToast('Task deleted successfully!', 'success')

    } catch (error) {
      console.error('Error deleting task:', error)
      showToast(error.response?.data?.message || error.message || 'Failed to delete task', 'error')
    }
  }

  const confirmDeleteTask = (task) => {
    setTaskToDelete(task)
    setShowDeleteConfirm(true)
  }

  // Member Management
  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      showToast('Please enter an email address', 'error')
      return
    }

    try {
      const response = await projectService.addMember(
        workspaceId,
        projectId,
        { email: newMemberEmail }
      )

      const newMember = response.data || response
      setMembers([...members, newMember])
      setNewMemberEmail('')
      showToast('Member added successfully', 'success')

    } catch (error) {
      console.error('Error adding member:', error)
      showToast(error.response?.data?.message || error.message || 'Failed to add member', 'error')
    }
  }

  const handleRemoveMember = async (memberId, memberName) => {
    setTaskToDelete({ id: memberId, type: 'member', name: memberName })
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return

    if (taskToDelete.type === 'member') {
      try {
        await projectService.removeMember(
          workspaceId,
          projectId,
          taskToDelete.id
        )

        setMembers(members.filter(member => member.id !== taskToDelete.id))
        showToast(`${taskToDelete.name} removed from project`, 'success')
      } catch (error) {
        console.error('Error removing member:', error)
        showToast(error.response?.data?.message || error.message || 'Failed to remove member', 'error')
      }
    } else {
      await handleDeleteTask()
    }

    setShowDeleteConfirm(false)
    setTaskToDelete(null)
  }

  // Task Card Component - FIXED EDIT ISSUE
  const TaskCard = ({ task, columnId }) => {
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

    return (
      <div
        draggable
        onDragStart={() => handleDragStart(task, columnId)}
        className={`${cardBg} border ${borderColor} ${priorityColors[task.priority] || priorityColors.medium} border-l-4 rounded-xl p-3 mb-3 cursor-move group hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded ${priorityBadges[task.priority] || priorityBadges.medium}`}>
            {task.priority || 'medium'}
          </span>

          <div className="relative task-menu-container">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setOpenMenuTaskId(openMenuTaskId === task.id ? null : task.id)
              }}
              className={`p-1 rounded opacity-0 group-hover:opacity-100 transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <MoreVertical size={14} className={textSecondary} />
            </button>

            {openMenuTaskId === task.id && (
              <div
                className={`absolute right-0 top-full mt-1 w-32 rounded-lg shadow-lg z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'} border ${borderColor}`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    // Close menu first
                    setOpenMenuTaskId(null)
                    // Set selected task and open modal with slight delay
                    setTimeout(() => {
                      setSelectedTask(task)
                      // Format date for input field
                      const dueDate = task.due_date 
                        ? task.due_date.split('T')[0]
                        : ''
                      
                      setEditTaskData({
                        title: task.title,
                        description: task.description || '',
                        priority: task.priority || 'medium',
                        due_date: dueDate,
                        status: task.status || 'todo'
                      })
                      setShowEditTask(true)
                    }, 10)
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded-t-lg flex items-center gap-2"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setOpenMenuTaskId(null)
                    setTimeout(() => {
                      confirmDeleteTask(task)
                    }, 10)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <h4 className={`font-semibold ${textPrimary} mb-2`}>
          {task.title}
        </h4>

        {task.description && (
          <p className={`text-xs ${textSecondary} mb-3 line-clamp-2`}>
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            {(task.comments_count || 0) > 0 && (
              <span className={`flex items-center gap-1 ${textSecondary}`}>
                <MessageSquare size={12} />
                {task.comments_count}
              </span>
            )}
            {(task.attachments_count || 0) > 0 && (
              <span className={`flex items-center gap-1 ${textSecondary}`}>
                <Paperclip size={12} />
                {task.attachments_count}
              </span>
            )}
            {task.due_date && (
              <span className={`flex items-center gap-1 ${textSecondary}`}>
                <Calendar size={12} />
                {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>

          {task.assignee && (
            <div
              className={`w-6 h-6 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center text-xs`}
              title={task.assignee.full_name || task.assignee.email}
            >
              {(task.assignee.full_name?.charAt(0) || '👤').toUpperCase()}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Column Component
  const Column = ({ column }) => (
    <div
      className="w-72 md:w-80 flex-shrink-0"
      onDragOver={(e) => {
        e.preventDefault()
        e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
      }}
      onDragLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
      onDrop={(e) => {
        e.preventDefault()
        e.currentTarget.style.backgroundColor = 'transparent'
        handleDragEnd(column.id)
      }}
    >
      <div className={`${cardBg} border ${borderColor} rounded-xl p-4 mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color || '#3B82F6' }}
            />
            <h3 className={`font-semibold ${textPrimary}`}>
              {column.name}
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
            className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Plus size={16} className={textSecondary} />
          </button>
        </div>
      </div>

      <div className="space-y-3 min-h-[100px]">
        {column.tasks && column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} columnId={column.id} />
          ))
        ) : (
          <div className={`text-center py-8 ${textSecondary} text-xs border-2 border-dashed ${borderColor} rounded-xl`}>
            Drop tasks here
          </div>
        )}
      </div>

      <button
        onClick={() => {
          setSelectedColumn(column)
          setShowAddTask(true)
        }}
        className={`w-full py-3 rounded-xl border-2 border-dashed ${borderColor} ${textSecondary} hover:${textPrimary} hover:border-blue-500 transition flex items-center justify-center gap-2 mt-4`}
      >
        <Plus size={14} /> Add Task
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

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        title={taskToDelete?.type === 'member' ? 'Remove Member' : 'Delete Task'}
        message={taskToDelete?.type === 'member' 
          ? `Are you sure you want to remove ${taskToDelete.name} from this project?`
          : 'Are you sure you want to delete this task? This action cannot be undone.'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false)
          setTaskToDelete(null)
        }}
      />

      {/* Header with ACTUAL project name */}
      <div className={`${cardBg} border ${borderColor} rounded-xl p-4 md:p-6 mb-6`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate(`/workspaces/${workspaceId}/projects`)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition`}
            >
              <ArrowLeft size={20} className={textSecondary} />
            </button>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h1 className={`text-xl md:text-2xl font-bold ${textPrimary} mb-1`}>
                    {project?.name || 'Project Board'}
                  </h1>
                  <p className={`text-sm ${textSecondary}`}>
                    {project?.description || 'Project management board'}
                  </p>
                </div>

                {/* Members Button */}
                <button
                  onClick={() => setShowMembers(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition`}
                >
                  <Users size={16} />
                  <span className={textPrimary}>Members ({members.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Stats - UPDATED: Overdue changed to To Do */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${borderColor}`}>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={16} className="text-blue-500" />
                <span className={`text-sm ${textSecondary}`}>Total Tasks</span>
              </div>
              <div className={`text-xl font-bold ${textPrimary}`}>{stats.totalTasks}</div>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${borderColor}`}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={16} className="text-green-500" />
                <span className={`text-sm ${textSecondary}`}>Completed</span>
              </div>
              <div className={`text-xl font-bold ${textPrimary}`}>{stats.completedTasks}</div>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${borderColor}`}>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-yellow-500" />
                <span className={`text-sm ${textSecondary}`}>In Progress</span>
              </div>
              <div className={`text-xl font-bold ${textPrimary}`}>{stats.inProgressTasks}</div>
            </div>

            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${borderColor}`}>
              <div className="flex items-center gap-2 mb-1">
                <ListTodo size={16} className="text-purple-500" /> {/* Changed icon */}
                <span className={`text-sm ${textSecondary}`}>To Do</span> {/* Changed label */}
              </div>
              <div className={`text-xl font-bold ${textPrimary}`}>{stats.toDoTasks}</div> {/* Changed value */}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-6 min-w-max px-4">
          {columns.length > 0 ? (
            columns.map((column) => (
              <Column key={column.id} column={column} />
            ))
          ) : (
            <div className={`${cardBg} border ${borderColor} rounded-2xl p-12 text-center w-full`}>
              <p className={`${textSecondary} mb-4`}>No columns found.</p>
              <button
                onClick={fetchProjectData}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Reload Board
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-2xl p-6 w-full max-w-md`}>
            <h3 className={`text-xl font-bold ${textPrimary} mb-4`}>
              Add Task to {selectedColumn?.name}
            </h3>
            <input
              type="text"
              value={newTaskData.title}
              onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
              placeholder="Task title *"
              className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3`}
              required
            />
            <textarea
              value={newTaskData.description}
              onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
              placeholder="Description (optional)"
              className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3 h-24`}
            />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={`block text-xs ${textSecondary} mb-1`}>Priority</label>
                <select
                  value={newTaskData.priority}
                  onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs ${textSecondary} mb-1`}>Due Date</label>
                <input
                  type="date"
                  value={newTaskData.due_date}
                  onChange={(e) => setNewTaskData({ ...newTaskData, due_date: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddTask(false)
                  setSelectedColumn(null)
                  setNewTaskData({ title: '', description: '', priority: 'medium', due_date: '' })
                }}
                className={`flex-1 px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} transition`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal - FIXED: Uses key prop to force re-render */}
      {showEditTask && selectedTask && (
        <div key={`edit-modal-${selectedTask.id}`} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-2xl p-6 w-full max-w-md`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>
                Edit Task
              </h3>
              <button
                onClick={() => {
                  setShowEditTask(false)
                  setTimeout(() => setSelectedTask(null), 100)
                }}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={textSecondary} />
              </button>
            </div>

            <input
              type="text"
              value={editTaskData.title}
              onChange={(e) => setEditTaskData({...editTaskData, title: e.target.value})}
              placeholder="Task title *"
              className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3`}
              required
              key={`title-${selectedTask.id}`}
            />
            <textarea
              value={editTaskData.description}
              onChange={(e) => setEditTaskData({...editTaskData, description: e.target.value})}
              placeholder="Description"
              className={`w-full px-4 py-3 rounded-xl ${inputBg} border ${borderColor} ${textPrimary} mb-3 h-24`}
              key={`desc-${selectedTask.id}`}
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={`block text-xs ${textSecondary} mb-1`}>Priority</label>
                <select
                  value={editTaskData.priority}
                  onChange={(e) => setEditTaskData({...editTaskData, priority: e.target.value})}
                  className={`w-full px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
                  key={`priority-${selectedTask.id}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs ${textSecondary} mb-1`}>Status</label>
                <select
                  value={editTaskData.status}
                  onChange={(e) => setEditTaskData({...editTaskData, status: e.target.value})}
                  className={`w-full px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
                  key={`status-${selectedTask.id}`}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="review">Review</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-xs ${textSecondary} mb-1`}>Due Date</label>
              <input
                type="date"
                value={editTaskData.due_date}
                onChange={(e) => setEditTaskData({...editTaskData, due_date: e.target.value})}
                className={`w-full px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
                key={`due-${selectedTask.id}`}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  confirmDeleteTask(selectedTask)
                  setShowEditTask(false)
                }}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
              <div className="flex-1"></div>
              <button
                onClick={() => {
                  setShowEditTask(false)
                  setTimeout(() => setSelectedTask(null), 100)
                }}
                className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${textPrimary} transition`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTask}
                className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Management Modal */}
      {showMembers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${cardBg} rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${textPrimary}`}>Project Members</h3>
              <button
                onClick={() => setShowMembers(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={textSecondary} />
              </button>
            </div>

            {/* Add Member Form */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter email to invite"
                  className={`flex-1 px-4 py-2 rounded-xl ${inputBg} border ${borderColor} ${textPrimary}`}
                />
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition"
                >
                  Invite
                </button>
              </div>
            </div>

            {/* Members List */}
            <div className="space-y-3">
              <h4 className={`font-medium ${textPrimary} mb-2`}>
                Current Members ({members.length})
              </h4>
              {members.length > 0 ? (
                members.map(member => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${borderColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
                        {(member.full_name?.charAt(0) || member.email?.charAt(0) || '👤').toUpperCase()}
                      </div>
                      <div>
                        <div className={`font-medium ${textPrimary}`}>
                          {member.full_name || member.email}
                        </div>
                        <div className={`text-xs ${textSecondary}`}>
                          {member.email}
                          {member.role && ` • ${member.role}`}
                        </div>
                      </div>
                    </div>

                    {member.role !== 'Admin' && (
                      <button
                        onClick={() => handleRemoveMember(member.id, member.full_name || member.email)}
                        className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className={`text-center py-4 ${textSecondary}`}>
                  No members yet. Invite someone to collaborate!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </Layout>
  )
}