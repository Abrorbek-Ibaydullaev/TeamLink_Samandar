// import api from '../api/axios'

// export const projectService = {
//   getAll: async (workspaceId) => {
//     const response = await api.get(`/workspaces/${workspaceId}/projects/`)
//     return response.data
//   },

//   getById: async (workspaceId, projectId) => {
//     const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/`)
//     return response.data
//   },

//   create: async (workspaceId, data) => {
//     const response = await api.post(`/workspaces/${workspaceId}/projects/`, data)
//     return response.data
//   },

//   createColumn: async (workspaceId, projectId, data) => {
//     const payload = {
//       ...data,
//       project: projectId
//     }
//     const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/columns/`, payload)
//     return response.data
//   },

//   createTask: async (workspaceId, projectId, columnId, data) => {
//     const payload = {
//       ...data,
//       project: projectId,
//       column: columnId
//     }
//     const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/`, payload)
//     return response.data
//   },

//   updateTask: async (workspaceId, projectId, columnId, taskId, data) => {
//     const payload = {
//       ...data,
//       project: projectId,
//       column: columnId
//     }
//     const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/`, payload)
//     return response.data
//   },

//   deleteTask: async (workspaceId, projectId, columnId, taskId) => {
//     await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/`)
//   },

//   addMember: async (projectId, userId) => {
//     const response = await api.post(`/projects/${projectId}/add_member/`, {
//       user_id: userId
//     })
//     return response.data
//   },

//   getMembers: async (projectId) => {
//     const response = await api.get(`/projects/${projectId}/members/`)
//     return response.data
//   },

//   update: async (workspaceId, projectId, projectData) => {
//     const response = await api.put(`/workspaces/${workspaceId}/projects/${projectId}/`, projectData)
//     return response.data
//   },

//   patch: async (workspaceId, projectId, projectData) => {
//     const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/`, projectData)
//     return response.data
//   },

//   archive: async (workspaceId, projectId) => {
//     const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/archive/`)
//     return response.data
//   },

//   restore: async (workspaceId, projectId) => {
//     const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/restore/`)
//     return response.data
//   },

//   delete: async (workspaceId, projectId) => {
//     const response = await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/`)
//     return response.data
//   },

//   getArchived: async (workspaceId) => {
//     const response = await api.get(`/workspaces/${workspaceId}/projects/?archived=true`)
//     return response.data
//   }
// }



  import api from '../api/axios'

  export const projectService = {
      // Project CRUD
      getAll: async (workspaceId) => {
          const response = await api.get(`/workspaces/${workspaceId}/projects/`)
          return response.data
      },

      getById: async (workspaceId, projectId) => {
          const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/`)
          return response.data
      },

      create: async (workspaceId, data) => {
          const response = await api.post(`/workspaces/${workspaceId}/projects/`, data)
          return response.data
      },

      update: async (workspaceId, projectId, data) => {
          const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/`, data)
          return response.data
      },

      delete: async (workspaceId, projectId) => {
          await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/`)
      },

      // Columns
      getColumns: async (workspaceId, projectId) => {
          const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/columns/`)
          return response.data
      },

      createColumn: async (workspaceId, projectId, data) => {
          const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/columns/`, data)
          return response.data
      },

      updateColumn: async (workspaceId, projectId, columnId, data) => {
          const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/`, data)
          return response.data
      },

      deleteColumn: async (workspaceId, projectId, columnId) => {
          await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/`)
      },

      // Tasks - CORRECTED ENDPOINTS
      getTasks: async (workspaceId, projectId, columnId = null) => {
          if (columnId) {
              // Get tasks for specific column
              const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/`)
              return response.data
          } else {
              // Get all tasks for project (fallback)
              const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks/`)
              return response.data
          }
      },

      createTask: async (workspaceId, projectId, columnId, data) => {
          // Tasks must be created under a column
          const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/`, data)
          return response.data
      },

      updateTask: async (workspaceId, projectId, columnId, taskId, data) => {
          // Update task in its current column
          const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/`, data)
          return response.data
      },

      deleteTask: async (workspaceId, projectId, columnId, taskId) => {
          await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/`)
      },

      // Move task between columns
      moveTask: async (workspaceId, projectId, columnId, taskId, newColumnId, position = null) => {
          const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/move/`, {
              column_id: newColumnId,
              position: position
          })
          return response.data
      },

      // Project Members
      getMembers: async (workspaceId, projectId) => {
          const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/members/`)
          return response.data
      },

      addMember: async (workspaceId, projectId, data) => {
          const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/members/`, data)
          return response.data
      },

      removeMember: async (workspaceId, projectId, memberId) => {
          await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/members/${memberId}/`)
      },

      // Direct project tasks endpoint (if exists)
      getAllProjectTasks: async (workspaceId, projectId) => {
          try {
              const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks/`)
              return response.data
          } catch (error) {
              // If endpoint doesn't exist, return empty array
              return { data: [] }
          }
      }
  }