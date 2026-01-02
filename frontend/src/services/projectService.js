import api from '../api/axios'

export const projectService = {
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

  createColumn: async (workspaceId, projectId, data) => {
    const payload = {
      ...data,
      project: projectId
    }
    const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/columns/`, payload)
    return response.data
  },

  createTask: async (workspaceId, projectId, columnId, data) => {
    const payload = {
      ...data,
      project: projectId,
      column: columnId
    }
    const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/`, payload)
    return response.data
  },

  updateTask: async (workspaceId, projectId, columnId, taskId, data) => {
    const payload = {
      ...data,
      project: projectId,
      column: columnId
    }
    const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/`, payload)
    return response.data
  },

  deleteTask: async (workspaceId, projectId, columnId, taskId) => {
    await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/columns/${columnId}/tasks/${taskId}/`)
  },

  addMember: async (projectId, userId) => {
    const response = await api.post(`/projects/${projectId}/add_member/`, {
      user_id: userId
    })
    return response.data
  },

  getMembers: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/members/`)
    return response.data
  },

  update: async (workspaceId, projectId, projectData) => {
    const response = await api.put(`/workspaces/${workspaceId}/projects/${projectId}/`, projectData)
    return response.data
  },

  patch: async (workspaceId, projectId, projectData) => {
    const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/`, projectData)
    return response.data
  },

  archive: async (workspaceId, projectId) => {
    const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/archive/`)
    return response.data
  },

  restore: async (workspaceId, projectId) => {
    const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/restore/`)
    return response.data
  },

  delete: async (workspaceId, projectId) => {
    const response = await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/`)
    return response.data
  },

  getArchived: async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/projects/?archived=true`)
    return response.data
  }
}