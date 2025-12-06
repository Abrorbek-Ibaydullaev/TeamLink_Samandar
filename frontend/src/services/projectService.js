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

    update: async (workspaceId, projectId, data) => {
        const response = await api.patch(`/workspaces/${workspaceId}/projects/${projectId}/`, data)
        return response.data
    },

    delete: async (workspaceId, projectId) => {
        await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/`)
    },
}